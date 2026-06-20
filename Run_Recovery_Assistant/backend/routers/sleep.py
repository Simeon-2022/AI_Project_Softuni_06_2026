from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.supabase_service import save_sleep_log, get_sleep_logs_by_user

router = APIRouter()


class SleepEntry(BaseModel):
    user_id: str
    hours: float = Field(..., ge=0, le=24)
    quality: int = Field(..., ge=1, le=5)
    log_date: str  # ISO format YYYY-MM-DD
    notes: Optional[str] = None


@router.post("/")
def log_sleep(entry: SleepEntry):
    try:
        return save_sleep_log(entry.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
def get_sleep_history(user_id: str, limit: int = 7):
    try:
        return get_sleep_logs_by_user(user_id, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
