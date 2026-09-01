import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Header
from app.models.schemas import UserRegister, UserLogin, TokenResponse
from app.database.connection import get_database
from app.security.passwords import hash_password, verify_password
from app.security.tokens import create_access_token, decode_access_token

router = APIRouter(prefix="", tags=["Authentication"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token or expired session")
    return payload

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserRegister):
    db = await get_database()
    users_col = db["users"]

    # Check if existing email or username
    existing_email = await users_col.find_one({"email": user_in.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    existing_username = await users_col.find_one({"username": user_in.username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username is already taken")

    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(user_in.password)
    now_str = datetime.now(timezone.utc).isoformat()

    user_doc = {
        "_id": user_id,
        "user_id": user_id,
        "name": user_in.name,
        "email": user_in.email,
        "username": user_in.username,
        "hashed_password": hashed_pwd,
        "created_date": now_str,
        "has_baseline": False
    }

    await users_col.insert_one(user_doc)

    # Initial login history entry
    history_col = db["login_history"]
    await history_col.insert_one({
        "history_id": str(uuid.uuid4()),
        "user_id": user_id,
        "username": user_in.username,
        "timestamp": now_str,
        "device": "Chrome / Windows",
        "browser": "Chrome 122",
        "location": "Chennai, IN",
        "confidence": 98.7,
        "status": "TRUSTED"
    })

    token = create_access_token({"sub": user_id, "username": user_in.username})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        username=user_in.username,
        user_id=user_id
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = await get_database()
    users_col = db["users"]

    query = {"$or": [{"email": credentials.username_or_email}, {"username": credentials.username_or_email}]}
    user = await users_col.find_one(query)

    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    user_id = user["user_id"]
    username = user["username"]
    now_str = datetime.now(timezone.utc).isoformat()

    # Record login history
    history_col = db["login_history"]
    await history_col.insert_one({
        "history_id": str(uuid.uuid4()),
        "user_id": user_id,
        "username": username,
        "timestamp": now_str,
        "device": "Chrome / Windows",
        "browser": "Chrome 122",
        "location": "Chennai, IN",
        "confidence": 98.4,
        "status": "TRUSTED"
    })

    token = create_access_token({"sub": user_id, "username": username})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        username=username,
        user_id=user_id
    )

@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    users_col = db["users"]
    user = await users_col.find_one({"user_id": current_user["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user["user_id"],
        "name": user["name"],
        "email": user["email"],
        "username": user["username"],
        "has_baseline": user.get("has_baseline", False),
        "created_date": user.get("created_date")
    }
