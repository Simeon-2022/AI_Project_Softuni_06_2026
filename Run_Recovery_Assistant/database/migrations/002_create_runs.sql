-- Migration 002: runs table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    distance_km     NUMERIC(6, 2) NOT NULL CHECK (distance_km > 0),
    duration_minutes NUMERIC(6, 2) NOT NULL CHECK (duration_minutes > 0),
    pace_min_per_km NUMERIC(5, 2),
    heart_rate_avg  INTEGER CHECK (heart_rate_avg BETWEEN 40 AND 220),
    rpe             INTEGER NOT NULL CHECK (rpe BETWEEN 1 AND 10),
    run_date        DATE NOT NULL DEFAULT CURRENT_DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_runs_user_id  ON public.runs (user_id);
CREATE INDEX IF NOT EXISTS idx_runs_run_date ON public.runs (run_date DESC);
