from pydantic import BaseModel, EmailStr
from typing import Optional


class UserProfile(BaseModel):
    id: str
    email: EmailStr
    display_name: Optional[str] = None
    weekly_target_km: Optional[float] = None
    experience_level: Optional[str] = None  # beginner / intermediate / advanced
