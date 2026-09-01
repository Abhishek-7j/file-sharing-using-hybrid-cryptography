from fastapi import APIRouter, Depends
from app.database.connection import get_database
from app.routes.auth import get_current_user

router = APIRouter(prefix="", tags=["Login History"])

DEFAULT_LOGIN_HISTORY = [
    {
        "history_id": "hist-1",
        "date": "Today, 10:45 AM",
        "device": "Chrome / Windows 11",
        "location": "Chennai, TN",
        "confidence": "98.7%",
        "status": "Trusted"
    },
    {
        "history_id": "hist-2",
        "date": "Yesterday, 04:12 PM",
        "device": "Chrome / Windows 11",
        "location": "Chennai, TN",
        "confidence": "97.9%",
        "status": "Trusted"
    },
    {
        "history_id": "hist-3",
        "date": "Aug 30, 09:30 AM",
        "device": "Chrome / Windows 11",
        "location": "Chennai, TN",
        "confidence": "93.2%",
        "status": "Monitoring"
    },
    {
        "history_id": "hist-4",
        "date": "Aug 28, 02:18 PM",
        "device": "Firefox / MacOS",
        "location": "Bengaluru, KA",
        "confidence": "98.1%",
        "status": "Trusted"
    },
    {
        "history_id": "hist-5",
        "date": "Aug 25, 11:05 AM",
        "device": "Edge / Windows 11",
        "location": "Chennai, TN",
        "confidence": "68.4%",
        "status": "Suspicious"
    }
]

@router.get("/login-history")
async def get_login_history(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    history_col = db["login_history"]

    user_id = current_user["sub"]
    cursor = history_col.find({"user_id": user_id}).sort("timestamp", -1)
    history = cursor.to_list(50) if hasattr(cursor, "to_list") else [h for h in cursor]

    if not history:
        return DEFAULT_LOGIN_HISTORY

    formatted = []
    for item in history:
        formatted.append({
            "history_id": item.get("history_id", item.get("_id")),
            "date": item.get("timestamp", "Recent"),
            "device": item.get("device", "Chrome / Windows"),
            "location": item.get("location", "Chennai, IN"),
            "confidence": f"{item.get('confidence', 98.0)}%",
            "status": item.get("status", "Trusted")
        })
    return formatted
