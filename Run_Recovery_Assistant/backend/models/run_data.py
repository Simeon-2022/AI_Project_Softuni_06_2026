from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class RunData(BaseModel):
    user_id: str
    distance_km: float = Field(..., gt=0, description="Distance in kilometers")
    duration_minutes: float = Field(..., gt=0, description="Duration in minutes")
    heart_rate_avg: Optional[int] = Field(None, ge=40, le=220)
    rpe: int = Field(..., ge=1, le=10, description="Rate of Perceived Exertion 1-10")
    run_date: date = Field(default_factory=date.today)
    notes: Optional[str] = None


class RunDataResponse(RunData):
    id: str
    pace_min_per_km: float
    created_at: str
