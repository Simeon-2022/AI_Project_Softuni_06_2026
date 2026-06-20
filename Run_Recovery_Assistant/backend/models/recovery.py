from pydantic import BaseModel, Field
from typing import Optional, List


class RecoveryRequest(BaseModel):
    user_id: str
    distance_km: float
    duration_minutes: float
    rpe: int = Field(..., ge=1, le=10)
    soreness_areas: List[str] = Field(
        default_factory=list,
        description="Body areas with soreness, e.g. ['quads', 'calves']",
    )
    sleep_hours: float = Field(..., ge=0, le=24)
    heart_rate_avg: Optional[int] = None
    days_since_last_run: Optional[int] = None


class RecoveryResponse(BaseModel):
    recovery_score: int = Field(..., ge=0, le=100)
    summary: str
    recommendations: List[str]
    injury_risk_level: str  # low / medium / high
    estimated_rest_days: int
