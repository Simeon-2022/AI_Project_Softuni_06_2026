-- Migration 003: sleep_logs table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    hours       NUMERIC(4, 2) NOT NULL CHECK (hours BETWEEN 0 AND 24),
    quality     INTEGER NOT NULL CHECK (quality BETWEEN 1 AND 5),
    log_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id  ON public.sleep_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_log_date ON public.sleep_logs (log_date DESC);
