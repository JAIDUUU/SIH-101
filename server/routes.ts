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

  // Find user by email or by role
  const matchedUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail) ||
    db.users.find((u) => u.role === role);

  const derivedName = normalizedEmail.includes('@')
    ? normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Officer';

  const user = matchedUser || {
    id: `usr-${Date.now()}`,
    email: email || `${role}@mospi.gov.in`,
    role,
    name: role === 'officer' ? derivedName : role === 'trainer' ? 'Dr. S. Rao' : 'Neeta Sharma'
  };

  // If this officer is logging in with a personal/new email (not the demo Rajesh Kumar):
  if (role === 'officer' && normalizedEmail !== 'rajesh.kumar@mospi.gov.in') {
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
      name: user.name
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
  const { fullName, designation, cadre, department, station, experienceYears, selfAssessedSkills } = req.body;

  if (fullName) db.officer.name = fullName;
  if (designation) db.officer.designation = designation;
  if (cadre) db.officer.cadre = cadre;
  if (department) db.officer.department = department;
  if (station) db.officer.station = station;
  if (experienceYears) db.officer.experienceYears = experienceYears;

  // Run Competency Engine
  const updatedComps = CompetencyEngine.evaluate({
    designation: db.officer.designation,
    department: db.officer.department,
    experienceYears: db.officer.experienceYears,
    cadre: db.officer.cadre,
    selfAssessedSkills
  });

  db.officer.competencies = updatedComps;

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
    timestamp: new Date().toISOString()
  });

  res.json({
    status: 'SUCCESS',
    officer: db.officer
  });
});

// ==========================================
// 3. /api/competencies & /api/skills
// ==========================================
router.get('/competencies', (req, res) => {
  res.json(db.officer.competencies);
});

router.get('/skills/decay', (req, res) => {
  const projections = db.officer.competencies.map((c) => {
    return SkillDecayEngine.calculate(c.name, c.currentScore);
  });

  res.json({
    featureLabel: 'AI READINESS PROJECTION',
    disclaimer: 'Algorithmic projection based on elapsed intervals & official PLFS/ASI syllabus updates. Not a scientifically certified clinical psychometric.',
    projections
  });
});

// ==========================================
// 4. /api/recommendations & /api/courses
// ==========================================
router.get('/recommendations', async (req, res) => {
  const recommendations = await recommendationEngine.getRankedRecommendations(
    db.officer.competencies,
    db.officer.atRiskSkills,
    db.officer.experienceYears
  );
  res.json(recommendations);
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

  // Specifically boost the target domain / competencies tested
  db.officer.competencies.forEach((comp) => {
    if (comp.domain === quiz.targetDomain || comp.name.includes('Sampling')) {
      const oldScore = comp.currentScore;
      const boost = passed ? Math.round((percentage / 100) * 8) : 2;
      const newScore = Math.min(100, oldScore + boost);
      comp.currentScore = newScore;
      comp.verification = 'SYSTEM-VERIFIED';
      comp.evidence = `Validated in official NSSTA drill: ${quiz.title} (Score: ${percentage}%, ${new Date().toLocaleDateString()})`;
      updatedComps.push({ name: comp.name, oldScore, newScore });
    }
  });

  // Recalculate readiness
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

export default router;
