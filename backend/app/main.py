import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.behavior import router as behavior_router
from app.routes.security import router as security_router
from app.routes.history import router as history_router

app = FastAPI(
    title="Identity DNA - Continuous Behavioral Authentication API",
    description="Backend API powering real-time behavioral biometric authentication, continuous monitoring, and anomaly detection.",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(behavior_router)
app.include_router(security_router)
app.include_router(history_router)

@app.get("/")
async def root():
    return {
        "app": "Identity DNA",
        "subtitle": "Continuous Behavioral Authentication System",
        "tagline": "Your Behavior. Your Identity. Your Security.",
        "status": "SYSTEM PROTECTED",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Identity DNA Backend"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
