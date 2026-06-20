-- Migration 001: users table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    display_name        TEXT,
    weekly_target_km    NUMERIC(5, 2),
    experience_level    TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
