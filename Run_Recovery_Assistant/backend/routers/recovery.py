from fastapi import APIRouter, HTTPException
from models.recovery import RecoveryRequest, RecoveryResponse
from services.openai_service import get_recovery_advice
from services.supabase_service import get_runs_by_user
from services.analysis_service import calculate_injury_risk, calculate_recovery_score

router = APIRouter()


@router.post("/", response_model=RecoveryResponse)
async def get_recovery(request: RecoveryRequest):
    try:
        recent_runs = get_runs_by_user(request.user_id, limit=5)
        injury_risk = calculate_injury_risk(request.rpe, request.distance_km, recent_runs)
        recovery_score = calculate_recovery_score(request.rpe, request.sleep_hours, injury_risk)

        soreness_text = (
            ", ".join(request.soreness_areas) if request.soreness_areas else "none reported"
        )
        prompt = (
            f"A vegan runner just completed a {request.distance_km}km run in "
            f"{request.duration_minutes} minutes with RPE {request.rpe}/10. "
            f"Soreness areas: {soreness_text}. Sleep last night: {request.sleep_hours} hours. "
            f"Injury risk assessed as: {injury_risk}. "
            f"Provide 3-5 specific vegan-friendly post-run recovery recommendations as bullet points."
        )

        advice = await get_recovery_advice(prompt)
        recommendations = [
            line.lstrip("•-* ").strip()
            for line in advice.split("\n")
            if line.strip() and not line.strip().startswith("#")
        ]
        rest_days = {"low": 1, "medium": 2, "high": 3}[injury_risk]

        return RecoveryResponse(
            recovery_score=recovery_score,
            summary=advice,
            recommendations=recommendations[:5],
            injury_risk_level=injury_risk,
            estimated_rest_days=rest_days,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
