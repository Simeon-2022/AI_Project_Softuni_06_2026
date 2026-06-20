from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.openai_service import get_nutrition_advice

router = APIRouter()


class NutritionRequest(BaseModel):
    distance_km: float
    duration_minutes: float
    rpe: int
    time_of_day: str = "morning"  # morning / afternoon / evening


class NutritionResponse(BaseModel):
    raw_advice: str


@router.post("/", response_model=NutritionResponse)
async def get_nutrition(request: NutritionRequest):
    try:
        prompt = (
            f"A vegan runner completed a {request.distance_km}km run "
            f"({request.duration_minutes} min) in the {request.time_of_day} with RPE {request.rpe}/10. "
            f"Provide a structured vegan nutrition plan with: "
            f"1) A pre-run snack suggestion, "
            f"2) Post-run recovery meal, "
            f"3) Hydration tips, "
            f"4) Optional vegan supplements. "
            f"Keep each section brief and practical."
        )
        advice = await get_nutrition_advice(prompt)
        return NutritionResponse(raw_advice=advice)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
