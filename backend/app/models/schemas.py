from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserRegister(BaseModel):
    name: str = Field(..., example="Arjun Kumar")
    email: str = Field(..., example="arjun@cybersec.org")
    username: str = Field(..., example="arjun_cyber")
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    user_id: str

class TypingSample(BaseModel):
    press_times: List[float] = Field(default_factory=list)
    release_times: List[float] = Field(default_factory=list)
    dwell_times: List[float] = Field(default_factory=list) # hold time per key
    flight_times: List[float] = Field(default_factory=list) # interval between keys
    typing_speed_wpm: float = 0.0
    rhythm_std_dev: float = 0.0

class MouseSample(BaseModel):
    velocities: List[float] = Field(default_factory=list)
    accelerations: List[float] = Field(default_factory=list)
    distances: List[float] = Field(default_factory=list)
    directions: List[float] = Field(default_factory=list)
    avg_speed: float = 0.0
    speed_variance: float = 0.0
    total_distance: float = 0.0

class ClickSample(BaseModel):
    hold_durations: List[float] = Field(default_factory=list)
    inter_click_intervals: List[float] = Field(default_factory=list)
    avg_hold: float = 0.0
    click_count: int = 0
    double_click_count: int = 0

class ScrollSample(BaseModel):
    velocities: List[float] = Field(default_factory=list)
    burst_lengths: List[float] = Field(default_factory=list)
    direction_changes: int = 0
    avg_velocity: float = 0.0
    scroll_distance: float = 0.0

class BehavioralBaselineCreate(BaseModel):
    typing: TypingSample
    mouse: MouseSample
    click: ClickSample
    scroll: ScrollSample

class TelemetryPayload(BaseModel):
    typing: Optional[TypingSample] = None
    mouse: Optional[MouseSample] = None
    click: Optional[ClickSample] = None
    scroll: Optional[ScrollSample] = None
    session_id: Optional[str] = None

class ConfidenceAnalysisResponse(BaseModel):
    overall_confidence: float
    status: str # TRUSTED, MONITORING, SUSPICIOUS
    typing_match: float
    mouse_match: float
    click_match: float
    scroll_match: float
    session_consistency: float
    is_anomaly: bool
    details: Dict[str, Any]
    timestamp: str

class SecurityEventSchema(BaseModel):
    event_id: str
    user_id: str
    username: str
    event_type: str
    confidence_score: float
    status: str
    severity: str # LOW, MEDIUM, HIGH, CRITICAL
    description: str
    timestamp: str
    details: Optional[Dict[str, Any]] = None

class LoginHistorySchema(BaseModel):
    history_id: str
    user_id: str
    username: str
    timestamp: str
    device: str
    browser: str
    location: str
    confidence: float
    status: str
