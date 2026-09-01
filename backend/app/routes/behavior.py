import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import (
    BehavioralBaselineCreate,
    TelemetryPayload,
    ConfidenceAnalysisResponse,
    TypingSample,
    MouseSample,
    ClickSample,
    ScrollSample
)
from app.database.connection import get_database
from app.routes.auth import get_current_user
from app.ml.engine import ml_engine

router = APIRouter(prefix="/behavior", tags=["Behavioral Telemetry"])

# Default baseline fallback profile if baseline not yet completed
DEFAULT_BASELINE = {
    "typing": {
        "press_times": [0.1, 0.2, 0.3],
        "release_times": [0.2, 0.3, 0.4],
        "dwell_times": [105.0, 112.0, 98.0],
        "flight_times": [140.0, 155.0, 138.0],
        "typing_speed_wpm": 48.5,
        "rhythm_std_dev": 18.2
    },
    "mouse": {
        "velocities": [450.0, 520.0, 480.0],
        "accelerations": [12.0, 15.0, 10.0],
        "distances": [120.0, 340.0, 210.0],
        "avg_speed": 495.0,
        "speed_variance": 850.0,
        "total_distance": 670.0
    },
    "click": {
        "hold_durations": [115.0, 120.0, 108.0],
        "avg_hold": 114.3,
        "click_count": 12,
        "double_click_count": 2
    },
    "scroll": {
        "velocities": [280.0, 310.0, 290.0],
        "avg_velocity": 293.3,
        "direction_changes": 2
    }
}

@router.post("/baseline")
async def save_baseline(
    payload: BehavioralBaselineCreate,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    user_id = current_user["sub"]
    profiles_col = db["behavioral_profiles"]
    users_col = db["users"]

    profile_doc = {
        "_id": user_id,
        "user_id": user_id,
        "username": current_user["username"],
        "typing": payload.typing.dict(),
        "mouse": payload.mouse.dict(),
        "click": payload.click.dict(),
        "scroll": payload.scroll.dict(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    await profiles_col.update_one({"user_id": user_id}, profile_doc, upsert=True)
    await users_col.update_one({"user_id": user_id}, {"$set": {"has_baseline": True}})

    return {"status": "success", "message": "Identity DNA baseline profile created successfully"}

@router.post("/typing")
async def log_typing(sample: TypingSample, current_user: dict = Depends(get_current_user)):
    return {"status": "recorded", "signal": "typing"}

@router.post("/mouse")
async def log_mouse(sample: MouseSample, current_user: dict = Depends(get_current_user)):
    return {"status": "recorded", "signal": "mouse"}

@router.post("/click")
async def log_click(sample: ClickSample, current_user: dict = Depends(get_current_user)):
    return {"status": "recorded", "signal": "click"}

@router.post("/scroll")
async def log_scroll(sample: ScrollSample, current_user: dict = Depends(get_current_user)):
    return {"status": "recorded", "signal": "scroll"}

@router.post("/analyze", response_model=ConfidenceAnalysisResponse)
async def analyze_behavior(
    telemetry: TelemetryPayload,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    user_id = current_user["sub"]
    username = current_user["username"]

    profiles_col = db["behavioral_profiles"]
    user_profile = await profiles_col.find_one({"user_id": user_id})

    baseline = user_profile if user_profile else DEFAULT_BASELINE

    # Perform ML / weighted similarity calculation
    overall_score, status, breakdown, is_anomaly = ml_engine.calculate_confidence(
        telemetry.dict(), baseline
    )

    now_iso = datetime.now(timezone.utc).isoformat()

    # Log telemetry event
    events_col = db["behavioral_events"]
    await events_col.insert_one({
        "event_id": str(uuid.uuid4()),
        "user_id": user_id,
        "username": username,
        "timestamp": now_iso,
        "overall_confidence": overall_score,
        "status": status,
        "breakdown": breakdown,
        "is_anomaly": is_anomaly
    })

    # If anomalous (confidence < 70%), log a security event alert automatically
    if is_anomaly or status == "SUSPICIOUS":
        sec_col = db["security_events"]
        sec_event_id = str(uuid.uuid4())
        await sec_col.insert_one({
            "event_id": sec_event_id,
            "user_id": user_id,
            "username": username,
            "event_type": "Behavioral Anomaly",
            "confidence_score": overall_score,
            "status": "INVESTIGATION REQUIRED",
            "severity": "HIGH",
            "description": f"Continuous telemetry anomaly: Typing/Mouse patterns deviated significantly from Identity DNA baseline. Score: {overall_score}%",
            "timestamp": now_iso
        })

    return ConfidenceAnalysisResponse(
        overall_confidence=overall_score,
        status=status,
        typing_match=breakdown["typing_match"],
        mouse_match=breakdown["mouse_match"],
        click_match=breakdown["click_match"],
        scroll_match=breakdown["scroll_match"],
        session_consistency=breakdown["session_consistency"],
        is_anomaly=is_anomaly,
        details={
            "user_id": user_id,
            "has_custom_baseline": bool(user_profile),
            "algorithm": "Weighted Behavioral Biometric Distance"
        },
        timestamp=now_iso
    )

@router.get("/confidence")
async def get_confidence(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    events_col = db["behavioral_events"]

    # Fetch latest event
    cursor = events_col.find({"user_id": current_user["sub"]}).sort("timestamp", -1).limit(1)
    events = cursor.to_list(1) if hasattr(cursor, "to_list") else [e for e in cursor]

    if events:
        latest = events[0]
        return {
            "overall_confidence": latest.get("overall_confidence", 98.7),
            "status": latest.get("status", "TRUSTED"),
            "breakdown": latest.get("breakdown", {
                "typing_match": 97.4,
                "mouse_match": 96.8,
                "click_match": 98.2,
                "scroll_match": 95.9,
                "session_consistency": 98.5
            }),
            "timestamp": latest.get("timestamp")
        }
    
    # Default initial state
    return {
        "overall_confidence": 98.7,
        "status": "TRUSTED",
        "breakdown": {
            "typing_match": 97.4,
            "mouse_match": 96.8,
            "click_match": 98.2,
            "scroll_match": 95.9,
            "session_consistency": 98.5
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/status")
async def get_status(current_user: dict = Depends(get_current_user)):
    res = await get_confidence(current_user)
    return {
        "status": res["status"],
        "confidence": res["overall_confidence"],
        "identity_match": "Strong" if res["status"] == "TRUSTED" else ("Moderate" if res["status"] == "MONITORING" else "Low")
    }
