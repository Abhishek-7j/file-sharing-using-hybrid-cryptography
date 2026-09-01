import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from app.database.connection import get_database
from app.routes.auth import get_current_user
from app.models.schemas import SecurityEventSchema

router = APIRouter(prefix="/security", tags=["Security Events"])

DEFAULT_SECURITY_EVENTS = [
    {
        "event_id": "sec-001",
        "user_id": "demo-user",
        "username": "arjun_cyber",
        "event_type": "Typing Rhythm Anomaly",
        "confidence_score": 64.3,
        "status": "INVESTIGATION REQUIRED",
        "severity": "HIGH",
        "description": "Typing pattern significantly differs from the registered Identity DNA baseline.",
        "timestamp": "10:42 AM Today"
    },
    {
        "event_id": "sec-002",
        "user_id": "demo-user",
        "username": "arjun_cyber",
        "event_type": "Unusual Mouse Velocity",
        "confidence_score": 72.1,
        "status": "MONITORING",
        "severity": "MEDIUM",
        "description": "Mouse movement speed and acceleration trajectory showed sharp variance spikes.",
        "timestamp": "08:15 AM Today"
    },
    {
        "event_id": "sec-003",
        "user_id": "demo-user",
        "username": "arjun_cyber",
        "event_type": "Multiple Signal Mismatch",
        "confidence_score": 68.9,
        "status": "RESOLVED",
        "severity": "HIGH",
        "description": "Simultaneous scroll impulse and click timing mismatch detected during session.",
        "timestamp": "Yesterday 11:30 PM"
    }
]

@router.get("/events")
async def get_security_events(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    sec_col = db["security_events"]

    user_id = current_user["sub"]
    cursor = sec_col.find({"user_id": user_id}).sort("timestamp", -1)
    events = cursor.to_list(50) if hasattr(cursor, "to_list") else [e for e in cursor]

    if not events:
        # Provide demo sample events if collection empty
        return DEFAULT_SECURITY_EVENTS

    return events

@router.post("/events")
async def create_security_event(
    event_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    sec_col = db["security_events"]

    event_id = str(uuid.uuid4())
    now_str = datetime.now(timezone.utc).isoformat()

    doc = {
        "event_id": event_id,
        "user_id": current_user["sub"],
        "username": current_user["username"],
        "event_type": event_data.get("event_type", "Behavioral Anomaly"),
        "confidence_score": float(event_data.get("confidence_score", 65.0)),
        "status": event_data.get("status", "INVESTIGATION REQUIRED"),
        "severity": event_data.get("severity", "HIGH"),
        "description": event_data.get("description", "Behavioral pattern deviation detected"),
        "timestamp": now_str,
        "details": event_data.get("details", {})
    }

    await sec_col.insert_one(doc)
    return doc

@router.post("/events/{event_id}/resolve")
async def resolve_security_event(
    event_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    sec_col = db["security_events"]

    await sec_col.update_one(
        {"event_id": event_id, "user_id": current_user["sub"]},
        {"$set": {"status": "RESOLVED"}}
    )
    return {"status": "success", "message": f"Security event {event_id} marked as RESOLVED"}
