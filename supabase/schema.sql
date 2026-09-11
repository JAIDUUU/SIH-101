-- ==============================================================================
-- SKILL SUTRA - MoSPI Official Statistical Intelligence Platform
-- SUPABASE POSTGRESQL SCHEMA & INITIAL SEED SCRIPT
-- ==============================================================================
-- How to apply:
-- 1. Open your Supabase Project Dashboard
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

-- ==============================================================================
-- 12. INDIA-WIDE OFFICIAL STATISTICAL SYSTEM MASTER DATA TABLES
-- ==============================================================================

-- A. Statistical Organizations Table (Central, State DES, UTs)
CREATE TABLE IF NOT EXISTS public.master_statistical_organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_code TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('Central Government', 'State Government', 'Union Territory')),
    state_or_ut TEXT,
    headquarters TEXT NOT NULL,
    cadres TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. Statistical Designations Table (JSO, SSO, AD, DD, JD, DIR, etc.)
CREATE TABLE IF NOT EXISTS public.master_statistical_designations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_code TEXT NOT NULL,
    cadre_group TEXT NOT NULL,
    level INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. Statistical Domains Table (All 20 Required Domains)
CREATE TABLE IF NOT EXISTS public.master_statistical_domains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    core_surveys TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. Technical Competencies Table (14 Computing & Tool Competencies)
CREATE TABLE IF NOT EXISTS public.master_technical_competencies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    associated_tools TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. Training Organizations Table (NSSTA, iGOT, ISI, etc.)
CREATE TABLE IF NOT EXISTS public.master_training_organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_code TEXT NOT NULL,
    academy_type TEXT NOT NULL,
    location TEXT NOT NULL,
    portal_url TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.master_statistical_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_statistical_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_statistical_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_technical_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_training_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all master_statistical_organizations" ON public.master_statistical_organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all master_statistical_designations" ON public.master_statistical_designations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all master_statistical_domains" ON public.master_statistical_domains FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all master_technical_competencies" ON public.master_technical_competencies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all master_training_organizations" ON public.master_training_organizations FOR ALL USING (true) WITH CHECK (true);

-- Seed Central Statistical Organizations
INSERT INTO public.master_statistical_organizations (id, name, short_code, tier, headquarters, cadres)
VALUES
('mospi-nso', 'Ministry of Statistics and Programme Implementation (MoSPI) / NSO', 'MoSPI / NSO', 'Central Government', 'New Delhi (Khurshid Lal Bhawan & Sankhyiki Bhawan)', ARRAY['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)']),
('min-agri-des', 'Ministry of Agriculture & Farmers Welfare — Directorate of Economics & Statistics', 'MoA&FW / DES', 'Central Government', 'Krishi Bhawan, New Delhi', ARRAY['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)', 'Departmental Statistical Cadre']),
('min-commerce-oea', 'Ministry of Commerce & Industry — Office of Economic Adviser & DGCI&S', 'MoC&I / OEA & DGCI&S', 'Central Government', 'Udyog Bhawan, New Delhi', ARRAY['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)']),
('min-labour-bureau', 'Ministry of Labour & Employment — Labour Bureau', 'MoL&E / Labour Bureau', 'Central Government', 'Chandigarh & Shimla', ARRAY['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)', 'Labour Bureau Cadre']),
('min-health-stats', 'Ministry of Health & Family Welfare — Statistics & HMIS Division', 'MoHFW / Stats & HMIS', 'Central Government', 'Nirman Bhawan, New Delhi', ARRAY['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)']),
('min-finance-dea', 'Ministry of Finance — Department of Economic Affairs & Department of Revenue', 'MoF / DEA & DoR', 'Central Government', 'North Block, New Delhi', ARRAY['Indian Statistical Service (ISS)', 'Indian Economic Service (IES)', 'Subordinate Statistical Service (SSS)']),
('rbi-dsim', 'Reserve Bank of India — Department of Statistics and Information Management', 'RBI / DSIM', 'Central Government', 'Central Office, Mumbai', ARRAY['RBI Statistical Cadre', 'Research Officers (DSIM)']),
('niti-aayog-dmeo', 'NITI Aayog — Development Monitoring and Evaluation Office', 'NITI / DMEO', 'Central Government', 'NITI Bhawan, New Delhi', ARRAY['Indian Statistical Service (ISS)', 'Lateral Statistical Experts'])
ON CONFLICT (id) DO NOTHING;

-- Seed Key Official Designations
INSERT INTO public.master_statistical_designations (id, title, short_code, cadre_group, level)
VALUES
('desig-jso', 'Junior Statistical Officer (JSO)', 'JSO', 'Group B (Non-Gazetted)', 6),
('desig-sso', 'Senior Statistical Officer (SSO)', 'SSO', 'Group B (Gazetted)', 7),
('desig-so', 'Statistical Officer (SO)', 'SO', 'Group B (Gazetted)', 7),
('desig-si-1', 'Statistical Investigator (Grade I)', 'SI-I', 'Group B (Gazetted)', 7),
('desig-si-2', 'Statistical Investigator (Grade II)', 'SI-II', 'Group B (Non-Gazetted)', 6),
('desig-sa', 'Statistical Assistant (SA)', 'SA', 'Group C', 5),
('desig-ro', 'Research Officer (Statistics)', 'RO', 'Group B (Gazetted)', 8),
('desig-sro', 'Senior Research Officer (SRO)', 'SRO', 'Group A (Gazetted)', 10),
('desig-ad', 'Assistant Director (AD)', 'AD', 'Group A (Gazetted)', 10),
('desig-dd', 'Deputy Director (DD)', 'DD', 'Group A (Gazetted)', 11),
('desig-jd', 'Joint Director (JD)', 'JD', 'Group A (Gazetted)', 12),
('desig-dir', 'Director (DIR)', 'DIR', 'Group A (Gazetted)', 13),
('desig-ddg', 'Deputy Director General (DDG)', 'DDG', 'Group A (Gazetted)', 14),
('desig-adg', 'Additional Director General (ADG)', 'ADG', 'Group A (Gazetted)', 15),
('desig-dg', 'Director General (DG / Chief Statistician of India)', 'DG / CSI', 'Group A (Gazetted)', 17)
ON CONFLICT (id) DO NOTHING;

-- Seed All 20 Statistical Domains
INSERT INTO public.master_statistical_domains (id, name, category, description, core_surveys)
VALUES
('dom-national-accounts', 'National Accounts', 'Macro & Economic', 'GDP, GVA, Supply and Use Tables (SUT), SNA 2008/2025 guidelines.', ARRAY['SNA 2008', 'Input-Output Tables', 'GSDP Guidelines']),
('dom-economic-stats', 'Economic Statistics', 'Macro & Economic', 'Index of Industrial Production (IIP), Core Industries, macroeconomic aggregates.', ARRAY['IIP Base 2011-12', 'Index of Core Industries', 'Business Register']),
('dom-social-stats', 'Social Statistics', 'Social & Demographic', 'Gender Statistics, Time Use Survey, Disability, Social Indicators.', ARRAY['Time Use Survey (TUS)', 'Women and Men in India', 'Social Indicators Report']),
('dom-price-stats', 'Price Statistics', 'Macro & Economic', 'Consumer Price Index (CPI Rural/Urban/Combined), WPI, CPI-IW.', ARRAY['CPI Base 2012', 'WPI Base 2011-12', 'CPI-IW Base 2016']),
('dom-labour-stats', 'Labour Statistics', 'Social & Demographic', 'Periodic Labour Force Survey (PLFS), Employment rates, wage stats.', ARRAY['PLFS Annual & Quarterly', 'Quarterly Employment Survey', 'Wage Survey']),
('dom-industrial-stats', 'Industrial Statistics', 'Macro & Economic', 'Annual Survey of Industries (ASI), factory sector capital and output.', ARRAY['Annual Survey of Industries (ASI)', 'NIC 2008', 'NPC-MS Product Code']),
('dom-agricultural-stats', 'Agricultural Statistics', 'Macro & Economic', 'General Crop Estimation Survey (GCES), Agriculture Census, TRS.', ARRAY['GCES Manual', 'Agriculture Census', 'Input Survey']),
('dom-household-surveys', 'Household Surveys', 'Field & Methodological', 'Socio-economic sample surveys (HCES, Health, Education).', ARRAY['Household Consumption Expenditure Survey (HCES)', 'NSS Rounds']),
('dom-enterprise-surveys', 'Enterprise Surveys', 'Macro & Economic', 'Annual Survey of Unincorporated Sector Enterprises (ASUSE).', ARRAY['ASUSE Survey Manual', 'Economic Census Framing']),
('dom-census-population', 'Census/Population', 'Social & Demographic', 'Decennial census methodology, Sample Registration System (SRS) vital rates.', ARRAY['Census Enumeration Protocol', 'SRS Bulletins', 'Population Projections']),
('dom-health-stats', 'Health', 'Social & Demographic', 'NFHS, HMIS data, morbidity and health accounts.', ARRAY['NFHS-5/NFHS-6', 'HMIS MoHFW', 'National Health Accounts']),
('dom-education-stats', 'Education', 'Social & Demographic', 'UDISE+ school data, AISHE higher education metrics.', ARRAY['UDISE+ Data System', 'AISHE Reports', 'NSS Education Surveys']),
('dom-environment-stats', 'Environment', 'Social & Demographic', 'Framework for Development of Environment Statistics (FDES), EnviStats India.', ARRAY['FDES 2013', 'UN-SEEA Guidelines', 'EnviStats India']),
('dom-sdg-stats', 'SDG', 'Social & Demographic', 'Sustainable Development Goals National Indicator Framework (NIF) monitoring.', ARRAY['MoSPI SDG-NIF Baseline', 'NITI Aayog SDG India Index']),
('dom-sampling-methodology', 'Sampling', 'Field & Methodological', 'Stratified multi-stage sampling designs, PPS, circular systematic sampling.', ARRAY['NSS Sampling Design Manuals', 'Urban Frame Survey Guidelines']),
('dom-survey-design', 'Survey Design', 'Field & Methodological', 'Questionnaire formulation, cognitive testing, CAPI digital validation.', ARRAY['CAPI Validation Specifications', 'Pilot Testing Framework']),
('dom-data-quality', 'Data Quality', 'Field & Methodological', 'Non-sampling error analysis, imputation, outlier detection, data auditing.', ARRAY['MoSPI Data Quality Framework', 'UN Fundamental Principles']),
('dom-data-collection', 'Data Collection', 'Field & Methodological', 'CAPI field enumeration, tablet-based validation, geotagging.', ARRAY['CAPI Field App', 'UFS Digital Block Mapping']),
('dom-data-processing', 'Data Processing', 'Technology & Data Management', 'Microdata scrubbing, multiplier weight calibration, anonymization.', ARRAY['National Data Archive Standards', 'Microdata Anonymization Protocol']),
('dom-data-dissemination', 'Data Dissemination', 'Technology & Data Management', 'National Data Warehouse, microdata portals, open government data APIs.', ARRAY['National Data Warehouse', 'data.gov.in (OGD)', 'NADA Microdata'])
ON CONFLICT (id) DO NOTHING;

-- Seed 14 Technical Competencies
INSERT INTO public.master_technical_competencies (id, name, category, description, associated_tools)
VALUES
('comp-python', 'Python', 'Programming & Computing', 'Pandas, NumPy, SciPy, Statsmodels, data automation.', ARRAY['Pandas', 'NumPy', 'Jupyter', 'Statsmodels']),
('comp-r', 'R', 'Programming & Computing', 'Survey package, Tidyverse data pipelines, R Shiny dashboards.', ARRAY['Tidyverse', 'survey package', 'ggplot2', 'R Shiny']),
('comp-sql', 'SQL', 'Data Infrastructure & Cloud', 'Relational database querying, joins, indexing, PostgreSQL.', ARRAY['PostgreSQL', 'MySQL', 'DBeaver', 'Query Optimization']),
('comp-stata', 'Stata', 'Specialized Statistical Software', 'Microdata econometric processing, svyset, regression models.', ARRAY['Stata MP', 'Do-files', 'svy commands']),
('comp-spss', 'SPSS', 'Specialized Statistical Software', 'Descriptive & inferential statistics, cross-tabs, ANOVA.', ARRAY['IBM SPSS Statistics', 'SPSS Syntax', 'Cross-Tabs']),
('comp-sas', 'SAS', 'Specialized Statistical Software', 'Base SAS programming, SAS Macro facility, enterprise data.', ARRAY['Base SAS', 'SAS Macros', 'PROC SQL']),
('comp-excel', 'Excel', 'Programming & Computing', 'Power Query, complex Pivot Tables, statistical functions, VBA.', ARRAY['Power Query', 'Pivot Tables', 'XLOOKUP', 'VBA']),
('comp-data-viz', 'Data Visualization', 'Programming & Computing', 'Power BI, Tableau, D3.js interactive storytelling, QGIS mapping.', ARRAY['Power BI', 'Tableau', 'D3.js', 'QGIS']),
('comp-apis', 'APIs', 'Data Infrastructure & Cloud', 'REST API consumption, microdata endpoints, JSON/XML schemas.', ARRAY['REST APIs', 'Postman', 'FastAPI', 'cURL']),
('comp-open-data', 'Open Data', 'Security & Governance', 'data.gov.in, CKAN, National Data Archive curation.', ARRAY['data.gov.in', 'CKAN', 'Dublin Core', 'NADA Portal']),
('comp-ai-ml', 'AI/ML', 'Advanced AI & Modern Data Stack', 'Machine Learning algorithms, predictive imputation, outlier detection.', ARRAY['Scikit-learn', 'TensorFlow', 'PyTorch']),
('comp-gen-ai', 'Generative AI', 'Advanced AI & Modern Data Stack', 'LLMs, prompt engineering, RAG document intelligence on manuals.', ARRAY['Gemini API', 'RAG Architectures', 'LangChain']),
('comp-cloud', 'Cloud Computing', 'Data Infrastructure & Cloud', 'NIC MeghRaj government cloud, VMs, containerization.', ARRAY['NIC MeghRaj', 'Docker', 'Google Cloud', 'AWS']),
('comp-cybersecurity', 'Cybersecurity', 'Security & Governance', 'DPDP Act 2023 compliance, statistical data anonymization, RBAC.', ARRAY['DPDP Act Compliance', 'Data Anonymization', 'RBAC', 'Encryption'])
ON CONFLICT (id) DO NOTHING;

-- Seed Training Organizations
INSERT INTO public.master_training_organizations (id, name, short_code, academy_type, location, portal_url, description)
VALUES
('train-nssta', 'National Statistical Systems Training Academy (NSSTA)', 'NSSTA', 'Central Apex Academy', 'Greater Noida, Uttar Pradesh', 'https://nssta.gov.in', 'Apex national training institution under MoSPI for official statistics capacity building.'),
('train-igot', 'iGOT Karmayogi (Mission Karmayogi Bharat)', 'iGOT Karmayogi', 'National Civil Service Platform', 'DoPT, Government of India, New Delhi', 'https://portal.igotkarmayogi.gov.in', 'National digital capacity building platform for civil servants with SADHANA Saptah programmes.'),
('train-isi', 'Indian Statistical Institute (ISI)', 'ISI', 'Statistical Research Institute', 'Kolkata, Delhi, Bengaluru', 'https://www.isical.ac.in', 'Institution of National Importance fostering advanced statistical research and training.'),
('train-istm', 'Institute of Secretariat Training and Management (ISTM)', 'ISTM', 'Civil Service Institute', 'Old JNU Campus, New Delhi', 'https://www.istm.gov.in', 'Central training institute under DoPT for administrative and service rules.'),
('train-nic', 'National Informatics Centre Training Division (NIC)', 'NIC Training', 'Civil Service Institute', 'CGO Complex, New Delhi', 'https://www.nic.in', 'Training official cadres on government cloud (MeghRaj), CAPI, and cybersecurity.'),
('train-iipa', 'Indian Institute of Public Administration (IIPA)', 'IIPA', 'Civil Service Institute', 'IP Estate, Ring Road, New Delhi', 'https://www.iipa.org.in', 'Premier training institute in public policy and governance leadership.'),
('train-ati', 'State Administrative Training Institutes (ATIs)', 'State ATIs', 'State Training Institute', 'State Capitals (YASHADA Pune, ATI West Bengal, etc.)', 'https://dopt.gov.in/state-atis', 'State academies providing foundation and refresher training to State DES and District offices.')
ON CONFLICT (id) DO NOTHING;


