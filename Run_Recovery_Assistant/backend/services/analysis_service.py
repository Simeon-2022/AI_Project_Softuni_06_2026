from typing import List
from collections import defaultdict
from datetime import datetime


def calculate_pace(distance_km: float, duration_minutes: float) -> float:
    """Returns pace in min/km, rounded to 2 decimal places."""
    if distance_km <= 0:
        return 0.0
    return round(duration_minutes / distance_km, 2)


def calculate_training_load(runs: List[dict]) -> dict:
    """
    Calculates weekly training load based on recent runs.
    Returns a dict of week labels -> total km for the last 4 weeks.
    """
    weekly_totals: dict = defaultdict(float)
    today = datetime.today()

    for run in runs:
        run_date_raw = run.get("run_date", str(today.date()))
        run_date = datetime.fromisoformat(str(run_date_raw))
        weeks_ago = (today - run_date).days // 7
        if weeks_ago < 4:
            week_label = f"Week -{weeks_ago}" if weeks_ago > 0 else "This week"
            weekly_totals[week_label] += run.get("distance_km", 0)

    return {k: round(v, 1) for k, v in weekly_totals.items()}


def calculate_injury_risk(rpe: int, distance_km: float, recent_runs: List[dict]) -> str:
    """
    Heuristic injury risk assessment.
    Returns: 'low', 'medium', or 'high'
    """
    risk_score = 0

    if rpe >= 8:
        risk_score += 2
    elif rpe >= 6:
        risk_score += 1

    # Distance spike: more than 30% above recent average
    if recent_runs:
        recent_avg = sum(r.get("distance_km", 0) for r in recent_runs[:3]) / min(3, len(recent_runs))
        if recent_avg > 0 and distance_km > recent_avg * 1.3:
            risk_score += 2

    # High cumulative weekly volume
    weekly_km = sum(r.get("distance_km", 0) for r in recent_runs[:5])
    if weekly_km > 60:
        risk_score += 2
    elif weekly_km > 40:
        risk_score += 1

    if risk_score >= 4:
        return "high"
    elif risk_score >= 2:
        return "medium"
    return "low"


def calculate_recovery_score(rpe: int, sleep_hours: float, injury_risk: str) -> int:
    """Returns a recovery readiness score from 0 to 100."""
    score = 100

    if rpe > 5:
        score -= (rpe - 5) * 5

    if sleep_hours < 6:
        score -= 20
    elif sleep_hours < 7:
        score -= 10

    if injury_risk == "high":
        score -= 20
    elif injury_risk == "medium":
        score -= 10

    return max(0, min(100, score))
