-- ====================================================================
-- CareerShield — Supabase Production Database Schema & RLS Setup
-- Copy and execute this entire SQL script inside Supabase SQL Editor
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table (Stores Job Seekers & Super Admins)
CREATE TABLE IF NOT EXISTS public.users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    hashed_password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Ensure phone_number column exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50);

-- 3. Resumes Table (Parsed Data, 11-Aspect ATS Scores & Recommendations)
CREATE TABLE IF NOT EXISTS public.resumes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    parsed_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    ats_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    quality_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    grammar_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    predicted_roles JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_resume UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

-- 4. Job Analyses Table (Fake Job ML Audit History)
CREATE TABLE IF NOT EXISTS public.job_analyses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL DEFAULT 'Job Posting',
    prediction VARCHAR(50) NOT NULL,
    risk_score DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    flagged_reasons JSONB DEFAULT '[]'::jsonb,
    company_verification JSONB DEFAULT '{}'::jsonb,
    salary_anomaly JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_analyses_user_id ON public.job_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_job_analyses_prediction ON public.job_analyses(prediction);

-- 5. Activity Logs Table (Security & System Audit Stream)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Success',
    device_info VARCHAR(255) DEFAULT 'Web Browser',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);

-- 6. Retention Settings Table (Automated Data Cleanup Thresholds)
CREATE TABLE IF NOT EXISTS public.retention_settings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    resume_retention_days INT NOT NULL DEFAULT 40,
    fake_job_retention_days INT NOT NULL DEFAULT 90,
    activity_log_retention_days INT NOT NULL DEFAULT 180,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow backend service access on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow backend service access on resumes" ON public.resumes FOR ALL USING (true);
CREATE POLICY "Allow backend service access on job_analyses" ON public.job_analyses FOR ALL USING (true);
CREATE POLICY "Allow backend service access on activity_logs" ON public.activity_logs FOR ALL USING (true);
CREATE POLICY "Allow backend service access on retention_settings" ON public.retention_settings FOR ALL USING (true);

-- Seed Default Admin & User
INSERT INTO public.users (full_name, email, phone_number, hashed_password, role, is_active, is_suspended)
VALUES (
    'Super Admin',
    'admin@careershield.com',
    '(555) 000-0000',
    'pbkdf2:sha256:100000$56fa4eb5fc03bfdca6b42bfae6ff81ee$fa9c0953bf6aeeb9ca0edbbbaebf9551ee68cf498bc56c152cd38b1f59223788',
    'super_admin',
    true,
    false
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.users (full_name, email, phone_number, hashed_password, role, is_active, is_suspended)
VALUES (
    'Alex Morgan',
    'user@careershield.com',
    '(555) 234-5678',
    'pbkdf2:sha256:100000$7c8b2111d4d8c7c945143a39e93bfdf2$b7bf48ef9c7929d288fa6c9a4192b0c3639433e5066aa66a2f763dbedae5d0c7',
    'user',
    true,
    false
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.retention_settings (resume_retention_days, fake_job_retention_days, activity_log_retention_days)
SELECT 40, 90, 180
WHERE NOT EXISTS (SELECT 1 FROM public.retention_settings);
