import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional, List

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
)


def save_run(run_data: dict) -> dict:
    result = supabase.table("runs").insert(run_data).execute()
    return result.data[0]


def get_runs_by_user(user_id: str, limit: int = 10) -> List[dict]:
    result = (
        supabase.table("runs")
        .select("*")
        .eq("user_id", user_id)
        .order("run_date", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def save_sleep_log(sleep_data: dict) -> dict:
    result = supabase.table("sleep_logs").insert(sleep_data).execute()
    return result.data[0]


def get_sleep_logs_by_user(user_id: str, limit: int = 7) -> List[dict]:
    result = (
        supabase.table("sleep_logs")
        .select("*")
        .eq("user_id", user_id)
        .order("log_date", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def get_user_profile(user_id: str) -> Optional[dict]:
    result = (
        supabase.table("users")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )
    return result.data
