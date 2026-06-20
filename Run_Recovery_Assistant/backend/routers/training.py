from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.supabase_service import save_run, get_runs_by_user
from services.analysis_service import calculate_pace, calculate_training_load

router = APIRouter()


class RunEntry(BaseModel):
    user_id: str
    distance_km: float
    duration_minutes: float
    heart_rate_avg: Optional[int] = None
    rpe: int
    run_date: str  # ISO format YYYY-MM-DD
    notes: Optional[str] = None


@router.post("/runs")
def log_run(entry: RunEntry):
    try:
        pace = calculate_pace(entry.distance_km, entry.duration_minutes)
        run_dict = entry.model_dump()
        run_dict["pace_min_per_km"] = pace
        saved = save_run(run_dict)
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/runs/{user_id}")
def get_runs(user_id: str, limit: int = 10):
    try:
        return get_runs_by_user(user_id, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/load/{user_id}")
def get_training_load(user_id: str):
    try:
        runs = get_runs_by_user(user_id, limit=30)
        load = calculate_training_load(runs)
        return {"weekly_load": load}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
