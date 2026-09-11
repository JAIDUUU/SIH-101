import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { db, UserRecord } from './db.ts';
import { CompetencyEngine } from './competencyEngine.ts';
import { SkillDecayEngine } from './decayEngine.ts';
import { RecommendationEngine } from './recommendationEngine.ts';
import { AIService } from './aiService.ts';
import { GroqService } from './groqService.ts';
import { SupabaseSync } from './supabaseSync.ts';
import { OfficialCoursesService, OFFICIAL_GOV_COURSES } from './officialCoursesService.ts';
import { getSupabase, testSupabaseConnection } from './supabaseClient.ts';
import { SunbirdRCAdapter, ESankhyikiRAGAdapter } from './externalAdapters.ts';

const router = Router();
const recommendationEngine = new RecommendationEngine();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Skill Sutra API',
    timestamp: new Date().toISOString(),
    engine: 'FastAPI/Express Full-Stack Architecture'
  });
});

// ==========================================
// MASTER DATA (India-wide Official Statistical System)
// ==========================================
router.get('/master-data', (req, res) => {
  res.json({
    success: true,
    data: db.masterData,
  });
});

router.get('/master-data/organizations', (req, res) => {
  const { tier, stateOrUt } = req.query;
  let orgs = [...db.masterData.centralOrganizations, ...db.masterData.stateOrganizations];
  if (tier) {
    orgs = orgs.filter((o) => o.tier.toLowerCase() === String(tier).toLowerCase());
  }
  if (stateOrUt) {
    orgs = orgs.filter((o) => o.stateOrUt?.toLowerCase() === String(stateOrUt).toLowerCase());
  }
  res.json({ success: true, count: orgs.length, organizations: orgs });
});

router.get('/master-data/designations', (req, res) => {
  res.json({ success: true, count: db.masterData.designations.length, designations: db.masterData.designations });
});

router.get('/master-data/domains', (req, res) => {
  res.json({ success: true, count: db.masterData.domains.length, domains: db.masterData.domains });
});

router.get('/master-data/competencies', (req, res) => {
  res.json({ success: true, count: db.masterData.technicalCompetencies.length, competencies: db.masterData.technicalCompetencies });
});

router.get('/master-data/training-organizations', (req, res) => {
  res.json({ success: true, count: db.masterData.trainingOrganizations.length, trainingOrganizations: db.masterData.trainingOrganizations });
});

// Supabase Connection Status
router.get('/supabase/status', async (req, res) => {
  const result = await testSupabaseConnection();
  res.json({
    ...result,
    timestamp: new Date().toISOString(),
  });
});

// Supabase Auto-Seed Master Data
router.post('/supabase/seed', async (req, res) => {
  const supabase = getSupabase();
  const report: { courses?: string; trainers?: string; users?: string } = {};

  try {
    // 1. Seed courses (all NSSTA, MoSPI, and iGOT Karmayogi SADHANA courses)
    const coursePayloads = db.courses.map((c) => ({
      id: c.id,
      title: c.title,
      provider: c.provider,
      duration: c.duration,
      difficulty: c.difficulty,
      match_percentage: c.matchPercentage,
      recommendation_reason: c.recommendationReason,
      portal_url: c.portalUrl,
      official_circular_ref: c.officialCircularRef,
      cadre_eligibility: c.cadreEligibility,
      tags: c.tags,
    }));
    const { error: courseErr } = await supabase.from('courses').upsert(coursePayloads, { onConflict: 'id' });
    report.courses = courseErr ? `Notice: ${courseErr.message}` : `Synced ${coursePayloads.length} official courses`;

    // 2. Seed trainers
    const trainerPayloads = db.trainers.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      department: t.department,
      specialization: t.specialization,
      status: t.status,
    }));
    const { error: trainerErr } = await supabase.from('trainers').upsert(trainerPayloads, { onConflict: 'id' });
    report.trainers = trainerErr ? `Notice: ${trainerErr.message}` : `Synced ${trainerPayloads.length} trainers`;

    // 3. Seed users
    const userPayloads = db.users.map((u) => ({
      email: u.email,
      role: u.role,
      name: u.name,
    }));
    const { error: userErr } = await supabase.from('users').upsert(userPayloads, { onConflict: 'email' });
    report.users = userErr ? `Notice: ${userErr.message}` : `Synced ${userPayloads.length} users`;

    res.json({
      success: true,
      report,
      message: 'Supabase sync completed. Please run supabase/schema.sql in Supabase SQL Editor if tables do not exist yet.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 1. /api/auth
// ==========================================
router.post('/auth/login', (req, res) => {
  const { email, password, role = 'officer' } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  const rawPassword = (password || '').trim();

  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Please enter your Official Email or Employee ID.' });
  }

  if (!rawPassword) {
    return res.status(400).json({ error: 'Please enter your password.' });
  }

  // Find user by email or by employeeId in officer profile
  const matchedUser = db.users.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail ||
      (role === 'officer' && db.officer.employeeId?.toLowerCase() === normalizedEmail)
  );

  // User must be registered
  if (!matchedUser) {
    return res.status(401).json({
      error: `No registered account found for "${email}". If you are a new officer, please click the "New Officer Registration" tab to create your account first, or use an official cadre account.`
    });
  }

  // Validate password
  if (matchedUser.password && matchedUser.password !== rawPassword) {
    return res.status(401).json({
      error: 'Invalid password. Please enter the correct password for this account.'
    });
  }

  // Check role authorization
  if (matchedUser.role !== role) {
    return res.status(403).json({
      error: `Access Denied: This account is registered under the "${matchedUser.role.toUpperCase()}" role. Please switch to the ${matchedUser.role.toUpperCase()} tab to log in.`
    });
  }

  const user = matchedUser;

  // Track profile setup state for officers
  let officerIsSetup = true;
  if (role === 'officer') {
    if (normalizedEmail === 'rajesh.kumar@mospi.gov.in') {
      officerIsSetup = true;
      db.officer.isProfileSetup = true;
    } else {
      if (db.officer.email !== normalizedEmail) {
        db.officer.id = `OFF-${Date.now().toString().slice(-6)}`;
        db.officer.name = user.name;
        db.officer.email = normalizedEmail;
        db.officer.isProfileSetup = false;
        db.officer.readinessScore = 0;
        db.officer.domainScores = {
          'Statistical': 0,
          'Technical': 0,
          'Digital Governance': 0,
          'Behavioural & Managerial': 0,
        };
        db.officer.atRiskSkills = [];
        db.officer.completedCoursesCount = 0;
        db.officer.assessmentsCompleted = 0;
        db.officer.verifiedCredentialsCount = 0;
        db.officer.activeCourses = [];
        db.officer.competencies = [];
      }
      officerIsSetup = db.officer.isProfileSetup;
    }
  }

  // Record session in Supabase if table exists
  try {
    const supabase = getSupabase();
    supabase.from('audit_logins').insert([
      {
        email: normalizedEmail || user.email,
        role: user.role,
        name: user.name,
        logged_in_at: new Date().toISOString()
      }
    ]).then(({ error }) => {
      if (error) console.info('Supabase audit insert info:', error.message);
    });
  } catch (err) {
    // Graceful fallback
  }

  res.json({
    accessToken: `bearer-token-mospi-${Date.now()}`,
    tokenType: 'bearer',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isProfileSetup: role === 'officer' ? db.officer.isProfileSetup : true
    },
    message: 'Session authenticated. Role verified.'
  });
});

// Officer Self-Registration (Requirement 1)
router.post('/auth/register-officer', (req, res) => {
  const { fullName, email, employeeId, cadre, designation, station, password } = req.body;
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and official email are mandatory for officer registration.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: `An account already exists with official email ${email}. Please proceed to login.` });
  }

  const newOfficerId = `OFF-MOSPI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newUser: UserRecord = {
    id: `usr-off-${Date.now()}`,
    email: normalizedEmail,
    role: 'officer',
    name: fullName,
    password: password || 'SecurePass2026'
  };

  db.users.push(newUser);

  // Initialize fresh officer profile state
  db.officer.id = newOfficerId;
  db.officer.name = fullName;
  db.officer.email = normalizedEmail;
  db.officer.employeeId = employeeId || `EMP-${Date.now().toString().slice(-6)}`;
  db.officer.cadre = cadre || 'Subordinate Statistical Service (SSS)';
  db.officer.designation = designation || 'Statistical Officer';
  db.officer.station = station || 'Field Operations Division (FOD)';
  db.officer.experienceYears = 1;
  db.officer.isProfileSetup = false;
  db.officer.readinessScore = 0;
  db.officer.domainScores = {
    'Statistical': 0,
    'Technical': 0,
    'Digital Governance': 0,
    'Behavioural & Managerial': 0,
  };
  db.officer.atRiskSkills = [];
  db.officer.completedCoursesCount = 0;
  db.officer.assessmentsCompleted = 0;
  db.officer.verifiedCredentialsCount = 0;
  db.officer.activeCourses = [];
  db.officer.competencies = [];

  // Persist new officer to Supabase
  try {
    const supabase = getSupabase();
    supabase.from('officers').insert([
      {
        officer_id: newOfficerId,
        full_name: fullName,
        email: normalizedEmail,
        employee_id: employeeId || '',
        cadre: cadre || '',
        designation: designation || '',
        station: station || '',
        created_at: new Date().toISOString()
      }
    ]).then(({ error }) => {
      if (error) console.info('Supabase officers insert info:', error.message);
    });
  } catch (err) {
    // Graceful fallback
  }

  res.json({
    success: true,
    message: 'Officer account created and registered successfully.',
    accessToken: `bearer-token-officer-${Date.now()}`,
    user: newUser,
    officer: db.officer
  });
});

router.get('/auth/igot-sso-callback', (req, res) => {
  res.json({
    status: 'AUTHENTICATED',
    provider: 'iGOT Karmayogi Central Government SSO',
    accredited: true,
    protocol: 'OIDC / SAML 2.0 Ready'
  });
});

// ==========================================
// 2. /api/profiles
// ==========================================
router.get('/profiles/me', (req, res) => {
  res.json({
    officer: db.officer,
    competencies: db.officer.competencies,
    activeCourses: db.officer.activeCourses,
    passport: {
      passportId: db.officer.passportId,
      issuedDate: db.officer.passportIssuedDate,
      verifiedCredentials: db.officer.verifiedCredentialsCount
    }
  });
});

router.post('/profiles/update', (req, res) => {
  const {
    fullName,
    designation,
    cadre,
    department,
    station,
    experienceYears,
    selfAssessedSkills,
    governanceLevel,
    organization,
    statisticalDomain,
    selectedSkills,
    trainingOrg,
    responsibilities,
    previousTraining,
    education,
  } = req.body;

  if (fullName) db.officer.name = fullName;
  if (designation) db.officer.designation = designation;
  if (cadre) db.officer.cadre = cadre;
  if (department) db.officer.department = department;
  if (station) db.officer.station = station;
  if (experienceYears) db.officer.experienceYears = experienceYears;
  if (governanceLevel) db.officer.governanceLevel = governanceLevel;
  if (organization) db.officer.organization = organization;
  if (statisticalDomain) db.officer.statisticalDomain = statisticalDomain;
  if (selectedSkills) db.officer.selectedSkills = selectedSkills;
  if (trainingOrg) db.officer.trainingOrg = trainingOrg;
  if (responsibilities) db.officer.responsibilities = responsibilities;
  if (previousTraining) db.officer.previousTraining = previousTraining;
  if (education) db.officer.education = education;

  // Run Competency Engine
  const updatedComps = CompetencyEngine.evaluate({
    designation: db.officer.designation,
    department: db.officer.department,
    experienceYears: db.officer.experienceYears,
    cadre: db.officer.cadre,
    organization: db.officer.organization,
    governanceLevel: db.officer.governanceLevel,
    statisticalDomain: db.officer.statisticalDomain,
    selectedSkills: db.officer.selectedSkills,
    responsibilities: db.officer.responsibilities,
    previousTraining: db.officer.previousTraining,
    selfAssessedSkills,
  });

  db.officer.competencies = updatedComps;
  db.officer.atRiskSkills = updatedComps
    .filter((c) => c.decayRisk?.isAtRisk)
    .map((c) => c.name)
    .slice(0, 3);
  if (db.officer.atRiskSkills.length === 0) {
    db.officer.atRiskSkills = [...updatedComps]
      .sort((a, b) => (b.targetScore - b.currentScore) - (a.targetScore - a.currentScore))
      .slice(0, 2)
      .map((c) => c.name);
  }

  // Recalculate domain scores
  const domainTotals: Record<string, { sum: number; count: number }> = {};
  updatedComps.forEach((c) => {
    if (!domainTotals[c.domain]) domainTotals[c.domain] = { sum: 0, count: 0 };
    domainTotals[c.domain].sum += c.currentScore;
    domainTotals[c.domain].count += 1;
  });

  Object.entries(domainTotals).forEach(([dom, { sum, count }]) => {
    (db.officer.domainScores as any)[dom] = Math.round(sum / count);
  });

  const totalScore = updatedComps.reduce((acc, c) => acc + c.currentScore, 0);
  db.officer.readinessScore = Math.round(totalScore / updatedComps.length);
  db.officer.isProfileSetup = true;

  // Persist updated profile to Supabase (officers & employees)
  SupabaseSync.syncEmployee(db.officer).catch(() => {});

  // Record audit event
  db.skillEvents.push({
    id: `evt-prof-${Date.now()}`,
    userId: 'usr-1',
    eventType: 'PROFILE_UPDATED',
    title: `Officer Profile & Competency Matrix Recalibrated (${db.officer.designation})`,
    timestamp: new Date().toISOString(),
  });

  res.json({
    status: 'SUCCESS',
    officer: db.officer,
  });
});

// ==========================================
// 3. /api/competencies & /api/skills
// ==========================================
router.get('/competencies', (req, res) => {
  res.json(db.officer.competencies);
});

router.post('/competencies/ai-assess', async (req, res) => {
  const {
    competencyName,
    competencyDomain,
    selfAssessedScore,
    quizPerformance,
    evidenceNotes,
    targetBenchmark,
  } = req.body;

  const result = await GroqService.evaluateCompetencyWithGroq({
    officer: {
      name: db.officer.name,
      designation: db.officer.designation,
      department: db.officer.department,
      cadre: db.officer.cadre,
      experienceYears: db.officer.experienceYears,
      responsibilities: db.officer.responsibilities,
      previousTraining: db.officer.previousTraining,
    },
    competencyName: competencyName || 'Sampling Methodology & Design',
    competencyDomain: competencyDomain || 'Statistical',
    selfAssessedScore,
    quizPerformance,
    evidenceNotes,
    targetBenchmark: targetBenchmark || 85,
  });

  res.json(result);
});

router.get('/skills/decay', (req, res) => {
  const projections = db.officer.competencies.map((c) => {
    return SkillDecayEngine.calculate(c.name, c.currentScore);
  });

  res.json({
    featureLabel: 'ESTIMATED SKILL RETENTION & RETIRED INTERVAL PROJECTION',
    disclaimer: 'Algorithmic decay estimate based on elapsed training intervals and official syllabus revisions (PLFS / ASI). For developmental guidance, not certified clinical measurement.',
    projections,
  });
});

// ==========================================
// 4. /api/recommendations & /api/courses
// ==========================================
router.get('/recommendations', async (req, res) => {
  const completedIds = (db.officer.activeCourses || [])
    .filter((c) => c.status === 'completed')
    .map((c) => c.id);

  const recommendations = await recommendationEngine.getRankedRecommendations({
    designation: db.officer.designation,
    department: db.officer.department,
    cadre: db.officer.cadre,
    statisticalDomain: db.officer.statisticalDomain,
    competencies: db.officer.competencies,
    atRiskSkills: db.officer.atRiskSkills,
    experienceYears: db.officer.experienceYears,
    previousTraining: db.officer.previousTraining,
    completedCourseIds: completedIds,
  });

  res.json(recommendations);
});

router.get('/recommendations/next-best-skill', async (req, res) => {
  const completedIds = (db.officer.activeCourses || [])
    .filter((c) => c.status === 'completed')
    .map((c) => c.id);

  const nextBestSkill = await recommendationEngine.getNextBestSkill({
    designation: db.officer.designation,
    department: db.officer.department,
    cadre: db.officer.cadre,
    statisticalDomain: db.officer.statisticalDomain,
    competencies: db.officer.competencies,
    atRiskSkills: db.officer.atRiskSkills,
    experienceYears: db.officer.experienceYears,
    previousTraining: db.officer.previousTraining,
    completedCourseIds: completedIds,
  });

  res.json(nextBestSkill);
});

router.get('/courses', async (req, res) => {
  const courses = await SupabaseSync.getCourses();
  res.json(courses);
});

router.post('/courses/sync-official', async (req, res) => {
  const result = await OfficialCoursesService.syncFromGovPortals();
  db.courses = result.courses;
  res.json(result);
});

router.post('/courses/progress', (req, res) => {
  const { courseId, progress, status } = req.body;
  const course = db.courses.find((c) => c.id === courseId);

  if (course) {
    course.progress = progress;
    course.status = status;

    if (status === 'completed') {
      db.officer.completedCoursesCount += 1;
      db.officer.verifiedCredentialsCount += 1;

      // Update relevant competencies
      course.competenciesGained.forEach((gain) => {
        const matchingComp = db.officer.competencies.find(
          (c) => c.name.toLowerCase().includes(gain.toLowerCase()) || gain.toLowerCase().includes(c.domain.toLowerCase())
        );
        if (matchingComp) {
          matchingComp.currentScore = Math.min(100, matchingComp.currentScore + 10);
          matchingComp.verification = 'SYSTEM-VERIFIED';
          matchingComp.evidence = `Accredited course completion: ${course.title} via ${course.provider}`;
        }
      });

      // Record Skill Event
      db.skillEvents.push({
        id: `evt-course-${Date.now()}`,
        userId: 'usr-1',
        eventType: 'COURSE_COMPLETED',
        title: `Completed ${course.title}`,
        timestamp: new Date().toISOString()
      });
    }

    // Persist learning progress and updated officer scores in Supabase
    SupabaseSync.recordLearningProgress({
      userEmail: db.officer.email,
      courseId: course.id,
      courseTitle: course.title,
      progress: course.progress || progress || 0,
      status: (status as any) || 'in-progress',
    }).catch(() => {});
    SupabaseSync.syncEmployee(db.officer).catch(() => {});

    return res.json({ status: 'UPDATED', course });
  }

  res.status(404).json({ error: 'Course not found' });
});

// ==========================================
// 5. /api/materials & /api/quizzes (Document -> Grounded Quiz)
// ==========================================
router.post('/materials/upload', (req, res) => {
  const { fileName, fileType = 'PDF' } = req.body;
  res.json({
    materialId: `mat-${Date.now()}`,
    fileName: fileName || 'Uploaded_Document.pdf',
    fileType,
    pageCount: 42,
    extractedSections: [
      'Chapter 1: Scope & Operational Frame',
      'Chapter 2: Multi-Stage Sampling & Probability Inclusion',
      'Chapter 3: Imputation & Non-Sampling Error Treatment',
      'Chapter 4: Microdata Field Verification Protocols'
    ],
    status: 'EXTRACTED'
  });
});

router.post('/quizzes/generate', async (req, res) => {
  const {
    documentName = 'NSSO_77th_Round_Sampling_Design_Manual.pdf',
    fileType = 'PDF',
    targetDomain = 'Statistical',
    numQuestions = 5,
    difficulty = 'Intermediate',
    language = 'English',
    rawText
  } = req.body;

  // Try Groq first as requested ("Use Groq as the AI brain")
  let generatedQuiz = await GroqService.generateQuiz({
    documentName,
    fileType,
    targetDomain,
    numQuestions,
    difficulty,
    language,
    materialText: rawText,
  });

  if (!generatedQuiz) {
    generatedQuiz = await AIService.generateQuiz({
      documentName,
      fileType,
      targetDomain,
      numQuestions,
      difficulty,
      language
    });
  }

  db.currentQuiz = generatedQuiz;
  res.json(generatedQuiz);
});

router.get('/quizzes/current', (req, res) => {
  res.json(db.currentQuiz);
});

router.post('/quizzes/regenerate-question', (req, res) => {
  const { questionId, documentName, difficulty = 'Intermediate', language = 'English' } = req.body;
  
  const alternatives = [
    {
      text: 'In two-stage stratified sampling with PPS in NSSO urban frames, how is the inclusion probability adjusted when census enumeration blocks are updated?',
      options: [
        'By scaling selection probability inversely proportional to updated enterprise/household counts',
        'By discarding the entire stratum and re-enumerating adjacent wards',
        'By applying a flat 10% weighting penalty without recalculation',
        'By substituting the updated block with the nearest rural census village'
      ],
      correctOptionIndex: 0,
      explanation: 'Under Chapter 3 (Sec 3.4), inclusion probabilities are scaled using inverse probability weights proportional to updated stratum sizes to maintain unbiased Horvitz-Thompson estimators.',
      sourceDoc: {
        title: documentName || 'NSSO_77th_Round_Sampling_Design_Manual.pdf',
        page: 24,
        section: 'Section 3.4 — Stratum Weight Calibration',
        excerpt: 'When frame updates occur during field operations, selection weights are re-scaled inversely to block size ratios.'
      },
      competencyDomain: 'Statistical'
    },
    {
      text: 'Under PLFS guidelines for multi-member households, what consistency rule prevents double-counting of seasonal agricultural workers?',
      options: [
        'Mandatory verification against 30-day usual principal activity status (UPSS)',
        'Classifying all casual laborers under self-employed code 11',
        'Excluding household members residing outside for > 6 months',
        'Overriding individual work days with head of household declared total'
      ],
      correctOptionIndex: 0,
      explanation: 'PLFS Enumerator Handbook Chapter 2 specifies that Usual Principal Activity Status (UPSS) strictly governs labor force categorisation for all members residing at least 30 days during the reference period.',
      sourceDoc: {
        title: documentName || 'PLFS_Field_Enumerator_Consistency_Rules.ppt',
        page: 18,
        section: 'Slide 18: Usual Status Determination Rules',
        excerpt: 'The primary activity is determined based on major time criterion spent over the preceding 365 days.'
      },
      competencyDomain: 'Digital Governance'
    },
    {
      text: 'In CSPro / CAPI field validation for MoSPI survey schedules, which validation constraint ensures internal schedule integrity between demographic roster and consumption expenditure?',
      options: [
        'Relational range check linking roster count with Item 33 per-capita multiplier',
        'Manual visual inspection by the field supervisor before tablet sync',
        'Automatic zero-filling of skipped demographic blocks',
        'Disabling GPS coordinate tagging during household interviews'
      ],
      correctOptionIndex: 0,
      explanation: 'CSPro logic files embed hard logic checks (ERROR IF COUNT(ROSTER) != EXPENDITURE_HEAD_COUNT) preventing schedule completion until discrepancy is resolved in the field.',
      sourceDoc: {
        title: documentName || 'MoSPI_CAPI_Field_Validation_Guide.pdf',
        page: 31,
        section: 'Section 5.1 — Cross-Schedule Relational Constraints',
        excerpt: 'CAPI applications must enforce strict relational parity between demographic rosters and consumption block multipliers.'
      },
      competencyDomain: 'Technical'
    }
  ];

  const selectedAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
  const updatedQuestion = {
    id: questionId || `q-gen-${Date.now()}`,
    questionNumber: 1,
    ...selectedAlt
  };

  res.json({ success: true, question: updatedQuestion });
});

router.post('/quizzes/publish', (req, res) => {
  db.currentQuiz.status = 'Published';
  res.json({ status: 'PUBLISHED', quiz: db.currentQuiz });
});

// ==========================================
// 6. /api/assessments (Take Quiz -> Grounded Feedback -> Competency Update)
// ==========================================
router.post('/assessments/submit', (req, res) => {
  const { quizId, answers } = req.body; // answers: { [questionIndex]: selectedOptionIndex }
  const quiz = db.currentQuiz;

  let correctCount = 0;
  const weakDomains: string[] = [];

  quiz.questions.forEach((q, idx) => {
    const selected = answers ? answers[idx] : undefined;
    if (selected === q.correctOptionIndex) {
      correctCount++;
    } else {
      weakDomains.push(q.competencyDomain);
    }
  });

  const total = quiz.questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= 60;

  // Update Officer Profile competencies based on quiz performance
  const updatedComps: Array<{ name: string; oldScore: number; newScore: number }> = [];

  // Specifically update the target domain / competencies tested
  db.officer.competencies.forEach((comp) => {
    const isTarget =
      comp.domain === quiz.targetDomain ||
      comp.name.toLowerCase().includes(quiz.targetDomain.toLowerCase()) ||
      quiz.title.toLowerCase().includes(comp.name.toLowerCase()) ||
      comp.name.toLowerCase().includes('sampling');

    if (isTarget) {
      const oldScore = comp.currentScore;
      const newScore = passed
        ? Math.min(100, Math.max(oldScore, Math.round(percentage)))
        : Math.max(oldScore, Math.round((oldScore + percentage) / 2));

      comp.currentScore = newScore;
      comp.quizScore = percentage;
      comp.verifiedScore = newScore;
      comp.verification = 'SYSTEM-VERIFIED';
      comp.verificationStatus = 'VERIFIED';
      comp.confidence = 'HIGH';
      comp.evidence = `Validated in official NSSTA drill: "${quiz.title}" (Score: ${percentage}%, Verified ${new Date().toLocaleDateString('en-GB')})`;

      // Refresh decay retention!
      if (comp.decayRisk) {
        comp.decayRisk.isAtRisk = false;
        comp.decayRisk.lastAssessed = 'Today (Verified Drill)';
        comp.decayRisk.decayReason = `Retention baseline refreshed via official NSSTA examination (${percentage}%).`;
      }

      updatedComps.push({ name: comp.name, oldScore, newScore });
    }
  });

  // Re-calculate at-risk skills and overall readiness
  db.officer.atRiskSkills = db.officer.competencies
    .filter((c) => c.decayRisk?.isAtRisk)
    .map((c) => c.name);

  // Recalculate domain scores
  const domainTotals: Record<string, { sum: number; count: number }> = {};
  db.officer.competencies.forEach((c) => {
    if (!domainTotals[c.domain]) domainTotals[c.domain] = { sum: 0, count: 0 };
    domainTotals[c.domain].sum += c.currentScore;
    domainTotals[c.domain].count += 1;
  });
  Object.entries(domainTotals).forEach(([dom, { sum, count }]) => {
    (db.officer.domainScores as any)[dom] = Math.round(sum / count);
  });

  const totalScore = db.officer.competencies.reduce((acc, c) => acc + c.currentScore, 0);
  db.officer.readinessScore = Math.min(100, Math.round(totalScore / db.officer.competencies.length));
  db.officer.verifiedCredentialsCount += 1;
  db.officer.assessmentsCompleted += 1;

  // Record SkillEvent
  const eventId = `evt-quiz-${Date.now()}`;
  db.skillEvents.push({
    id: eventId,
    userId: 'usr-1',
    eventType: 'ASSESSMENT_PASSED',
    title: `Assessment Completed: ${quiz.title} (${percentage}%)`,
    score: percentage,
    timestamp: new Date().toISOString()
  });

  // Persist assessment result and updated officer scores in Supabase
  SupabaseSync.recordAssessmentResult({
    userEmail: db.officer.email,
    quizId: quiz.id,
    quizTitle: quiz.title,
    score: correctCount,
    total,
    percentage,
    passed,
  }).catch(() => {});
  SupabaseSync.syncEmployee(db.officer).catch(() => {});

  res.json({
    quizId: quiz.id,
    score: correctCount,
    total,
    percentage,
    passed,
    weakDomains: Array.from(new Set(weakDomains)),
    updatedCompetencies: updatedComps,
    newReadinessScore: db.officer.readinessScore,
    skillEventId: eventId,
    officer: db.officer
  });
});

// ==========================================
// 7. /api/peers
// ==========================================
router.get('/peers/match', (req, res) => {
  res.json(db.peers);
});

router.post('/peers/connect', (req, res) => {
  const { peerId } = req.body;
  const peer = db.peers.find((p) => p.id === peerId);
  if (peer) {
    peer.activeStatus = 'Peer Study Group';
  }
  res.json({
    status: 'REQUEST_SENT',
    peerId,
    message: 'Collaboration invitation dispatched via National Statistical Network.'
  });
});

// ==========================================
// 8. /api/analytics
// ==========================================
router.get('/analytics/workforce', (req, res) => {
  res.json({
    label: 'ILLUSTRATIVE DEMO DATA',
    disclaimer: 'Aggregated demonstration data synthesized for system evaluation. Not actual confidential MoSPI operational statistics.',
    metrics: {
      totalCadreTracked: 1420,
      systemVerifiedRatio: 62,
      criticalDecayAlerts: 142,
      averageReadinessScore: 71
    },
    departments: [
      { name: 'Field Operations Division (FOD)', readiness: 68, officialCount: 640, topGap: 'Sampling Methodology' },
      { name: 'National Accounts Division (NAD)', readiness: 84, officialCount: 180, topGap: 'Python Data Extraction' },
      { name: 'Price Statistics Division (PSD)', readiness: 74, officialCount: 210, topGap: 'Price Imputation Models' },
      { name: 'Economic Statistics Division (ESD)', readiness: 79, officialCount: 230, topGap: 'Enterprise Audits' },
      { name: 'Coordination & Training (C&T)', readiness: 88, officialCount: 160, topGap: 'Digital Ethics' }
    ]
  });
});

// ==========================================
// 9. /api/notifications
// ==========================================
router.get('/notifications', (req, res) => {
  res.json(db.notifications);
});

// ==========================================
// 10. /api/ai
// ==========================================
router.post('/ai/assistant', async (req, res) => {
  const { query, officer } = req.body;
  const targetOfficer = officer || db.officer;

  // 1. Fetch available courses directly from Supabase
  const availableCourses = await SupabaseSync.getCourses();

  // 2. Query Groq as primary AI brain with full officer profile + skill scores + gaps + Supabase courses
  const reply = await GroqService.consultAssistant(query, targetOfficer, availableCourses);
  if (reply && reply.trim()) {
    return res.json({ reply: reply.trim() });
  }

  // 3. Resilient fallback to domain engine
  const fallbackReply = await AIService.consultAssistant(query, targetOfficer);
  res.json({ reply: fallbackReply });
});

// ==========================================
// 11. /api/admin - Trainer & Faculty Provisioning (Requirement 2)
// ==========================================
router.post('/admin/create-trainer', (req, res) => {
  const { trainerName, trainerId, password, department, specialization } = req.body;
  if (!trainerId || !password) {
    return res.status(400).json({ error: 'Trainer ID and Password are required.' });
  }

  const normalizedId = trainerId.trim().toLowerCase();
  const existing = db.trainers.find((t) => t.email.toLowerCase() === normalizedId);
  if (existing) {
    return res.status(409).json({ error: `Trainer with ID ${trainerId} already exists in the faculty roster.` });
  }

  const newTrainer = {
    id: `TR-NSSTA-${Math.floor(200 + Math.random() * 800)}`,
    name: trainerName || 'NSSTA Faculty Member',
    email: normalizedId,
    password: password,
    department: department || 'National Statistical Systems Training Academy (NSSTA)',
    specialization: specialization || 'Sampling Methodology & Official Statistics',
    createdAt: new Date().toISOString(),
    status: 'Active' as const,
  };

  db.trainers.push(newTrainer);

  // Add to active users for login
  db.users.push({
    id: `usr-tr-${Date.now()}`,
    email: normalizedId,
    role: 'trainer',
    name: newTrainer.name,
    password: password
  });

  res.json({
    success: true,
    message: `Trainer credentials successfully provisioned for ${trainerId}. The trainer can now log in using this ID and password.`,
    trainer: newTrainer
  });
});

router.get('/admin/trainers', (req, res) => {
  res.json({
    trainers: db.trainers,
    totalCount: db.trainers.length
  });
});

// ==========================================
// 12. AI Skill Gap Engine (Requirement 6)
// ==========================================
router.get('/competencies/gap-analysis', (req, res) => {
  const targetBenchmark = req.query.benchmark ? Number(req.query.benchmark) : 80;
  const analysis = CompetencyEngine.analyzeGaps(db.officer.competencies, targetBenchmark);
  res.json(analysis);
});

router.post('/competencies/gap-analysis', (req, res) => {
  const { competencies, benchmark } = req.body;
  const targetComps = competencies || db.officer.competencies;
  const targetBenchmark = benchmark ? Number(benchmark) : 80;
  const analysis = CompetencyEngine.analyzeGaps(targetComps, targetBenchmark);
  res.json(analysis);
});

// ==========================================
// 13. Workforce Skill Heatmap & Macro Intelligence (Requirement 14)
// ==========================================
router.get('/analytics/workforce-heatmap', (req, res) => {
  const { organization, department, state_ut, designation, competency } = req.query;

  // India-wide Official Statistical System Heatmap Cells
  const allCells = [
    {
      id: 'hm-1',
      organization: 'MoSPI / NSO',
      department: 'Field Operations Division (FOD)',
      stateOrUt: 'Uttar Pradesh',
      designation: 'Junior Statistical Officer (JSO)',
      competency: 'Sampling Methodology & Design',
      domain: 'Statistical',
      averageScore: 78,
      targetBenchmark: 85,
      status: 'Optimal',
      officersCount: 380,
    },
    {
      id: 'hm-2',
      organization: 'MoSPI / NSO',
      department: 'Field Operations Division (FOD)',
      stateOrUt: 'Uttar Pradesh',
      designation: 'Junior Statistical Officer (JSO)',
      competency: 'Python & Automated ETL Microdata Scripting',
      domain: 'Technical',
      averageScore: 42,
      targetBenchmark: 75,
      status: 'Critical Deficit',
      officersCount: 380,
    },
    {
      id: 'hm-3',
      organization: 'MoSPI / NSO',
      department: 'Field Operations Division (FOD)',
      stateOrUt: 'Maharashtra',
      designation: 'Senior Statistical Officer (SSO)',
      competency: 'CSPro / CAPI Logic Verification & API Sync',
      domain: 'Digital Governance',
      averageScore: 84,
      targetBenchmark: 85,
      status: 'Optimal',
      officersCount: 220,
    },
    {
      id: 'hm-4',
      organization: 'MoSPI / NSO',
      department: 'Price Statistics Division (PSD)',
      stateOrUt: 'Delhi',
      designation: 'Statistical Officer (SO)',
      competency: 'Price Index & Imputation Systems',
      domain: 'Statistical',
      averageScore: 81,
      targetBenchmark: 85,
      status: 'Optimal',
      officersCount: 160,
    },
    {
      id: 'hm-5',
      organization: 'MoSPI / NSO',
      department: 'National Accounts Division (NAD)',
      stateOrUt: 'Delhi',
      designation: 'Assistant / Deputy Director (ISS)',
      competency: 'Gross Value Added (GVA) & Supply-Use Tables',
      domain: 'Statistical',
      averageScore: 88,
      targetBenchmark: 90,
      status: 'Optimal',
      officersCount: 95,
    },
    {
      id: 'hm-6',
      organization: 'State DES',
      department: 'State Directorate of Economics & Statistics',
      stateOrUt: 'Karnataka',
      designation: 'Statistical Investigator',
      competency: 'GIS Spatial Demarcation & Geofencing (UFS)',
      domain: 'Technical / GIS',
      averageScore: 48,
      targetBenchmark: 75,
      status: 'Critical Deficit',
      officersCount: 290,
    },
    {
      id: 'hm-7',
      organization: 'State DES',
      department: 'State Directorate of Economics & Statistics',
      stateOrUt: 'West Bengal',
      designation: 'Statistical Officer (SO)',
      competency: 'Sampling Methodology & Design',
      domain: 'Statistical',
      averageScore: 66,
      targetBenchmark: 80,
      status: 'Moderate Deficit',
      officersCount: 210,
    },
    {
      id: 'hm-8',
      organization: 'Labour Bureau',
      department: 'Consumer Price Index for Industrial Workers (CPI-IW)',
      stateOrUt: 'Himachal Pradesh',
      designation: 'Statistical Investigator',
      competency: 'Price Index & Imputation Systems',
      domain: 'Statistical',
      averageScore: 86,
      targetBenchmark: 85,
      status: 'Optimal',
      officersCount: 140,
    },
    {
      id: 'hm-9',
      organization: 'Ministry of Agriculture DES',
      department: 'Agricultural Statistics Division',
      stateOrUt: 'Madhya Pradesh',
      designation: 'Research Officer',
      competency: 'Agricultural Output Estimation & Crop Cutting Experiments',
      domain: 'Statistical',
      averageScore: 72,
      targetBenchmark: 80,
      status: 'Moderate Deficit',
      officersCount: 180,
    },
    {
      id: 'hm-10',
      organization: 'MoSPI / NSO',
      department: 'Economic Statistics Division (ESD)',
      stateOrUt: 'West Bengal',
      designation: 'Statistical Officer (SO)',
      competency: 'Annual Survey of Industries (ASI) Protocols',
      domain: 'Statistical',
      averageScore: 79,
      targetBenchmark: 80,
      status: 'Optimal',
      officersCount: 175,
    }
  ];

  let filtered = allCells;
  if (organization && organization !== 'ALL') {
    filtered = filtered.filter((c) => c.organization.toLowerCase().includes(String(organization).toLowerCase()));
  }
  if (department && department !== 'ALL') {
    filtered = filtered.filter((c) => c.department.toLowerCase().includes(String(department).toLowerCase()));
  }
  if (state_ut && state_ut !== 'ALL') {
    filtered = filtered.filter((c) => c.stateOrUt.toLowerCase().includes(String(state_ut).toLowerCase()));
  }
  if (designation && designation !== 'ALL') {
    filtered = filtered.filter((c) => c.designation.toLowerCase().includes(String(designation).toLowerCase()));
  }
  if (competency && competency !== 'ALL') {
    filtered = filtered.filter((c) => c.competency.toLowerCase().includes(String(competency).toLowerCase()));
  }

  res.json({
    appliedFilters: { organization, department, state_ut, designation, competency },
    totalOfficersCovered: filtered.reduce((acc, c) => acc + c.officersCount, 0),
    cells: filtered,
    macroSummary: {
      totalEmployeesTracked: 6420,
      overallReadinessPercentage: 68.4,
      trainingCompletionRate: 74.6,
      averageQuizScore: 78.2,
      criticalGapsCount: 4,
      optimalCount: 18,
    }
  });
});

// ==========================================
// 14. Sunbird RC Framework Integration Endpoints (Requirement 1 & Research Report)
// ==========================================
router.get('/sunbird-rc/discovery', async (req, res) => {
  const query = req.query.q as string;
  const result = await SunbirdRCAdapter.discovery(query);
  res.json(result);
});

router.get('/sunbird-rc/registry/:id', async (req, res) => {
  const result = await SunbirdRCAdapter.registry(req.params.id);
  res.json(result);
});

router.post('/sunbird-rc/telemetry', async (req, res) => {
  const result = await SunbirdRCAdapter.telemetry(req.body);
  res.json(result);
});

router.post('/sunbird-rc/claims', async (req, res) => {
  const result = await SunbirdRCAdapter.claims(req.body);
  res.json(result);
});

router.post('/sunbird-rc/attestation', async (req, res) => {
  const { claimId } = req.body;
  const result = await SunbirdRCAdapter.attestation(claimId);
  res.json(result);
});

// ==========================================
// 15. e-Sankhyiki RAG Official Datasets (Requirement 4 & Research Report)
// ==========================================
router.get('/e-sankhyiki/datasets', (req, res) => {
  res.json({
    portal: 'e-Sankhyiki (Official MoSPI Data Portal)',
    portalUrl: 'https://esankhyiki.mospi.gov.in',
    status: 'ACTIVE_GROUNDING_SOURCE',
    datasets: ESankhyikiRAGAdapter.getOfficialDatasets(),
  });
});

export default router;

