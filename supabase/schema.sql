-- ==============================================================================
-- SKILL SUTRA - MoSPI Official Statistical Intelligence Platform
-- SUPABASE POSTGRESQL SCHEMA & INITIAL SEED SCRIPT
-- Project ID: pqynnzeyphgwpwctvcjw
-- ==============================================================================
-- How to apply:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/pqynnzeyphgwpwctvcjw
-- 2. Go to "SQL Editor" in the left navigation sidebar.
-- 3. Click "New query", paste the entire content of this script, and click "Run".
-- ==============================================================================

-- 1. USERS & AUTH TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('officer', 'trainer', 'admin')),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. OFFICERS REGISTRATION TABLE
CREATE TABLE IF NOT EXISTS public.officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    officer_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    employee_id TEXT,
    cadre TEXT,
    designation TEXT,
    station TEXT,
    readiness_score INT DEFAULT 68,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TRAINERS DIRECTORY TABLE (NSSTA Faculty & Subject Matter Experts)
CREATE TABLE IF NOT EXISTS public.trainers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    specialization TEXT NOT NULL,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. OFFICIAL COURSES TABLE (Sourced from nssta.gov.in & mospi.gov.in)
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    duration TEXT,
    difficulty TEXT CHECK (difficulty IN ('Foundational', 'Intermediate', 'Advanced')),
    match_percentage INT DEFAULT 90,
    recommendation_reason TEXT,
    portal_url TEXT,
    official_circular_ref TEXT,
    cadre_eligibility TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. AUDIT LOGINS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT,
    logged_in_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SKILL ASSESSMENTS & QUIZ SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    quiz_title TEXT NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    percentage INT NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable read & write access for the application via the Supabase Publishable Key
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;

-- Allow public / anon read & insert & update permissions for the Skill Sutra platform
DROP POLICY IF EXISTS "Allow public read users" ON public.users;
DROP POLICY IF EXISTS "Allow public insert users" ON public.users;
DROP POLICY IF EXISTS "Allow public all users" ON public.users;
CREATE POLICY "Allow public all users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read officers" ON public.officers;
DROP POLICY IF EXISTS "Allow public insert officers" ON public.officers;
DROP POLICY IF EXISTS "Allow public update officers" ON public.officers;
DROP POLICY IF EXISTS "Allow public all officers" ON public.officers;
CREATE POLICY "Allow public all officers" ON public.officers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read trainers" ON public.trainers;
DROP POLICY IF EXISTS "Allow public insert trainers" ON public.trainers;
DROP POLICY IF EXISTS "Allow public all trainers" ON public.trainers;
CREATE POLICY "Allow public all trainers" ON public.trainers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public insert courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public update courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public all courses" ON public.courses;
CREATE POLICY "Allow public all courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert audit_logins" ON public.audit_logins;
DROP POLICY IF EXISTS "Allow public read audit_logins" ON public.audit_logins;
DROP POLICY IF EXISTS "Allow public all audit_logins" ON public.audit_logins;
CREATE POLICY "Allow public all audit_logins" ON public.audit_logins FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert assessments" ON public.skill_assessments;
DROP POLICY IF EXISTS "Allow public read assessments" ON public.skill_assessments;
DROP POLICY IF EXISTS "Allow public all assessments" ON public.skill_assessments;
CREATE POLICY "Allow public all assessments" ON public.skill_assessments FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA (Official MoSPI & NSSTA Master Data)
-- ==============================================================================

-- Seed Official Courses from NSSTA and MoSPI
INSERT INTO public.courses (id, title, provider, duration, difficulty, match_percentage, recommendation_reason, portal_url, official_circular_ref, cadre_eligibility, tags)
VALUES
(
    'nssta-trg-2025-01',
    'Induction & Refresher in Multi-Stage Stratified Sampling & NSSO Survey Design',
    'nssta.gov.in (NSSTA)',
    '2 Weeks (Residential / Hybrid at NSSTA Greater Noida)',
    'Intermediate',
    96,
    'Official NSSTA Calendar Programme aligned with PLFS & HCES sampling rounds.',
    'https://nssta.gov.in/training-calendar/sampling-design-2025',
    'NSSTA/TRG/CAL-2025/304',
    'SSS Statistical Officers, ISS Officers, FOD Field Supervisors',
    ARRAY['Survey Sampling', 'PLFS', 'HCES', 'NSSTA Portal']
),
(
    'mospi-nas-gva-402',
    'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income Accounting',
    'mospi.gov.in (MoSPI)',
    '10 Days (MoSPI Central Training Facility, New Delhi)',
    'Advanced',
    92,
    'Core methodology module notified under MoSPI National Accounts Division (NAD) guidelines.',
    'https://www.mospi.gov.in/training-programmes/national-accounts',
    'MoSPI F.No. 12015/01/2025-ISS',
    'National Accounts Division (NAD) Officers & DES State Economists',
    ARRAY['National Accounts', 'SUT', 'Macro Statistics', 'MoSPI Portal']
),
(
    'mospi-cpi-base-2025',
    'Consumer Price Index (CPI) Compilation & Price Imputation Models',
    'mospi.gov.in (MoSPI)',
    '18 Hours (Self-paced + 2 Virtual Workshops)',
    'Foundational',
    89,
    'Aligned with Price Statistics Division (PSD) quarterly index calculation and market quotation monitoring.',
    'https://www.mospi.gov.in/cpi-methodology-manual',
    'PSD/CPI-REVISION/TRG-88',
    'Price Data Collectors, FOD Regional Supervisors, PSD Cadre',
    ARRAY['Price Statistics', 'Macro Indicators', 'CPI Compilation']
),
(
    'nssta-ds-python-603',
    'Data Science in Official Statistics: Python & R for Large-Scale Survey Microdata',
    'nssta.gov.in (NSSTA)',
    '3 Weeks (NSSTA Advanced Analytics Lab + Online Sandbox)',
    'Intermediate',
    95,
    'Addresses primary technical competency gap identified in Cadre Readiness Matrix.',
    'https://nssta.gov.in/specialized-programmes/data-science-stats',
    'NSSTA/ANALYTICS/2025-11',
    'All Statistical Cadres, ISS Officers, Data Processing Division',
    ARRAY['Python', 'R Programming', 'Microdata', 'NSSTA Analytics']
)
ON CONFLICT (id) DO NOTHING;

-- 7. EMPLOYEES DIRECTORY TABLE
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    cadre TEXT,
    designation TEXT,
    station TEXT,
    department TEXT,
    readiness_score INT DEFAULT 68,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SKILLS MASTER & COMPETENCIES TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name TEXT NOT NULL,
    domain TEXT NOT NULL,
    benchmark_score INT DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ASSESSMENT SCORES TABLE
CREATE TABLE IF NOT EXISTS public.assessment_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_email TEXT NOT NULL,
    domain TEXT NOT NULL,
    score INT NOT NULL,
    benchmark INT DEFAULT 80,
    verification_status TEXT DEFAULT 'VERIFIED',
    recorded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. QUIZ RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    quiz_title TEXT NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    percentage INT NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. LEARNING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    course_id TEXT NOT NULL,
    course_title TEXT NOT NULL,
    progress_percentage INT DEFAULT 0,
    status TEXT DEFAULT 'in-progress' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS FOR NEW TABLES
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all assessment_scores" ON public.assessment_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all quiz_results" ON public.quiz_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all learning_progress" ON public.learning_progress FOR ALL USING (true) WITH CHECK (true);

-- Seed Default Trainers
INSERT INTO public.trainers (id, name, email, department, specialization, status)
VALUES
(
    'TR-NSSTA-101',
    'Dr. S. Rao',
    'dr.srao@nssta.gov.in',
    'National Statistical Systems Training Academy (NSSTA)',
    'Sampling Design & Multi-Stage Stratification',
    'Active'
),
(
    'TR-NSSTA-102',
    'Prof. K. Venkatraman',
    'k.venkat@nssta.gov.in',
    'National Accounts & Econometric Modeling Division',
    'Supply-Use Tables & Macro Imputations',
    'Active'
)
ON CONFLICT (id) DO NOTHING;

