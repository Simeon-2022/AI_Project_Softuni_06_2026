-- Migration 004: Row Level Security policies
-- Run this in the Supabase SQL Editor AFTER migrations 001–003

-- ── Enable RLS ────────────────────────────────────────────────────────────────
ALTER TABLE public.users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;

-- ── users: each user can only see and modify their own profile row ─────────────
CREATE POLICY "users: own row only"
    ON public.users
    FOR ALL
    USING (auth.uid() = id);

-- ── runs: each user can only CRUD their own runs ──────────────────────────────
CREATE POLICY "runs: own rows only"
    ON public.runs
    FOR ALL
    USING (auth.uid() = user_id);

-- ── sleep_logs: each user can only CRUD their own logs ───────────────────────
CREATE POLICY "sleep_logs: own rows only"
    ON public.sleep_logs
    FOR ALL
    USING (auth.uid() = user_id);
