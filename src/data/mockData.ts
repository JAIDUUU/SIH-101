import type { OfficerProfile, Course, GeneratedQuiz, PeerOfficer, NotificationItem, RegionalMetric } from '../types/index.ts';

export const PRIMARY_OFFICER: OfficerProfile = {
  id: 'OFF-MOSPI-2024-8842',
  name: 'Rajesh Kumar',
  designation: 'Statistical Officer',
  department: 'National Statistical Office (NSO) — Field Operations Division (FOD)',
  cadre: 'Subordinate Statistical Service (SSS)',
  employeeId: 'EMP-992014-RK',
  experienceYears: 12,
  education: 'M.Sc. in Statistics (University of Delhi), PGD in Applied Econometrics',
  station: 'Regional Office, Lucknow (Northern Zone)',
  email: 'rajesh.kumar@mospi.gov.in',
  readinessScore: 68,
  domainScores: {
    'Statistical': 82,
    'Technical': 46,
    'Digital Governance': 61,
    'Behavioural & Managerial': 78,
  },
  atRiskSkills: ['Sampling Methodology', 'GIS Spatial Analytics'],
  completedCoursesCount: 14,
  assessmentsCompleted: 9,
  passportId: 'SS-PASS-MOSPI-8842-IND',
  passportIssuedDate: '15 Jan 2025',
  verifiedCredentialsCount: 8,
  isProfileSetup: true,
  activeCourses: [
    {
      id: 'course-py-stat',
      title: 'Python for Statistical Analysis & NSSO Data Processing',
      provider: 'NSSTA TPAC',
      duration: '18 Hours (Self-paced + 2 Labs)',
      difficulty: 'Intermediate',
      competenciesGained: ['Python Data Extraction', 'Pandas for Microdata', 'Sampling Variance Calc'],
      matchPercentage: 96,
      recommendationReason: 'Directly addresses your primary competency gap (Technical: 46%) and recurring microdata validation requirements.',
      language: 'Bilingual',
      rating: 4.8,
      enrolledCount: 1420,
      tags: ['Python', 'NSSO Datasets', 'Automation'],
      status: 'in-progress',
      progress: 42
    },
    {
      id: 'course-cpi-index',
      title: 'Consumer Price Index (CPI) Compilation & Imputation Techniques',
      provider: 'iGOT Karmayogi',
      duration: '8 Hours',
      difficulty: 'Foundational',
      competenciesGained: ['Item Basket Weighting', 'Geometric Mean Formulae', 'Price Outlier Detection'],
      matchPercentage: 88,
      recommendationReason: 'Aligned with upcoming FOD quarterly retail price survey cycles.',
      language: 'English',
      rating: 4.7,
      enrolledCount: 2890,
      tags: ['Price Statistics', 'Macro Indicators'],
      status: 'in-progress',
      progress: 70
    }
  ],
  competencies: [
    {
      id: 'comp-1',
      name: 'Sampling Methodology & Design',
      domain: 'Statistical',
      currentScore: 82,
      targetScore: 90,
      verification: 'SYSTEM-VERIFIED',
      evidence: 'Validated through NSSTA Certified Assessment #SA-402 (Score: 82%, Sept 2024).',
      decayRisk: {
        isAtRisk: true,
        projected3m: 76,
        projected6m: 68,
        projected12m: 54,
        lastAssessed: '180 days ago',
        refresherCourseId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher',
        decayReason: 'Lack of practical assessment in multi-stage stratification over 6 months; updated PLFS sample guidelines released.'
      }
    },
    {
      id: 'comp-2',
      name: 'Python for Statistical Computing',
      domain: 'Technical',
      currentScore: 24,
      targetScore: 75,
      verification: 'SELF-ASSESSED',
      evidence: 'Self-reported in Annual Performance Profile (No verified quiz or project portfolio on file yet).',
      decayRisk: {
        isAtRisk: false,
        projected3m: 24,
        projected6m: 20,
        projected12m: 15,
        lastAssessed: 'Self-appraisal',
        refresherCourseId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing',
        decayReason: 'Foundational skill needing continuous laboratory drills.'
      }
    },
    {
      id: 'comp-3',
      name: 'GIS Spatial Analytics & Geo-tagging',
      domain: 'Technical',
      currentScore: 48,
      targetScore: 80,
      verification: 'SYSTEM-VERIFIED',
      evidence: 'Field Survey Geo-validation Drill (NSSTA Module GIS-104, March 2024).',
      decayRisk: {
        isAtRisk: true,
        projected3m: 42,
        projected6m: 35,
        projected12m: 25,
        lastAssessed: '240 days ago',
        refresherCourseId: 'course-gis-qgis',
        refresherTitle: 'QGIS Integration for Urban Frame Survey (UFS) Mapping',
        decayReason: 'Rapid tool shift from handheld legacy GPS to Bhuvan-Statistical Geoportal API standards.'
      }
    },
    {
      id: 'comp-4',
      name: 'Data Quality Assurance & Validation Rules',
      domain: 'Statistical',
      currentScore: 88,
      targetScore: 90,
      verification: 'SYSTEM-VERIFIED',
      evidence: 'DQAD Consistency Protocols Certification & 2024 Field Audit clearing 99.2% consistency.'
    },
    {
      id: 'comp-5',
      name: 'R for Applied Econometrics',
      domain: 'Technical',
      currentScore: 66,
      targetScore: 75,
      verification: 'SYSTEM-VERIFIED',
      evidence: 'Verified via National Accounts Division (NAD) Macro-Modeling Workshop 2023.'
    },
    {
      id: 'comp-6',
      name: 'Digital Data Capture (CAPI / CSPro)',
      domain: 'Digital Governance',
      currentScore: 74,
      targetScore: 85,
      verification: 'SYSTEM-VERIFIED',
      evidence: 'Tablet-assisted personal interviewing (TAPI) protocol examination completed.'
    },
    {
      id: 'comp-7',
      name: 'Public Data Dissemination & NDAP Standards',
      domain: 'Digital Governance',
      currentScore: 58,
      targetScore: 80,
      verification: 'SELF-ASSESSED',
      evidence: 'Self-declared participation in National Data & Analytics Platform orientation webinar.'
    },
    {
      id: 'comp-8',
      name: 'Field Team Leadership & Enumerator Supervision',
      domain: 'Behavioural & Managerial',
      currentScore: 84,
      targetScore: 85,
      verification: 'SYSTEM-VERIFIED',
      evidence: 'Supervised 36 field investigators across 4 districts with on-schedule completion.'
    },
    {
      id: 'comp-9',
      name: 'Ethical Statistical Reporting & Confidentiality',
      domain: 'Behavioural & Managerial',
      currentScore: 92,
      targetScore: 95,
      verification: 'SYSTEM-VERIFIED',
      evidence: 'Official Statistics Act, 2008 compliance clearance and ethics certification.'
    }
  ]
};

export const INITIAL_UNCONFIGURED_OFFICER: OfficerProfile = {
  id: 'OFF-NEW-PENDING',
  name: 'Officer (Profile Pending)',
  designation: 'Cadre Selection Pending',
  department: 'Ministry of Statistics & Programme Implementation (MoSPI)',
  cadre: 'Subordinate Statistical Service (SSS)',
  employeeId: 'PENDING-ID',
  experienceYears: 0,
  education: 'Self-Service Setup Required',
  station: 'Pending Regional Posting',
  email: '',
  readinessScore: 0,
  domainScores: {
    'Statistical': 0,
    'Technical': 0,
    'Digital Governance': 0,
    'Behavioural & Managerial': 0,
  },
  atRiskSkills: [],
  completedCoursesCount: 0,
  assessmentsCompleted: 0,
  passportId: 'PASS-PENDING',
  passportIssuedDate: 'Not Issued',
  verifiedCredentialsCount: 0,
  activeCourses: [],
  competencies: [],
  isProfileSetup: false,
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-py-stat',
    title: 'Python for Statistical Analysis & NSSO Microdata',
    provider: 'NSSTA TPAC',
    duration: '18 Hours',
    difficulty: 'Intermediate',
    competenciesGained: ['Python Data Extraction', 'Pandas for Microdata', 'Survey Weights Automation'],
    matchPercentage: 96,
    recommendationReason: 'Targeted directly at your 46% Technical domain score; solves recurring manual script bottlenecks in survey compilation.',
    language: 'Bilingual',
    rating: 4.8,
    enrolledCount: 1420,
    tags: ['Python', 'NSSO Microdata', 'Automation', 'Pandas']
  },
  {
    id: 'course-sampling-refresher',
    title: 'Modern Survey Sampling: Multi-Stage Stratification Refresher',
    provider: 'NSSTA TPAC',
    duration: '10 Hours',
    difficulty: 'Intermediate',
    competenciesGained: ['Stratified Random Sampling', 'Cluster PPS Selection', 'Sampling Error Estimation'],
    matchPercentage: 94,
    recommendationReason: 'Urgent refresher: Prevents projected skill decay from 82% to 68% over the next 6 months.',
    language: 'English',
    rating: 4.9,
    enrolledCount: 3150,
    tags: ['Sampling', 'At-Risk Refresh', 'PLFS', 'ASI']
  },
  {
    id: 'course-gis-qgis',
    title: 'QGIS Integration for Urban Frame Survey (UFS) Mapping',
    provider: 'iGOT Karmayogi',
    duration: '14 Hours',
    difficulty: 'Intermediate',
    competenciesGained: ['Spatial Boundary Demarcation', 'Geo-tagging Validation', 'Bhuvan Map Layers'],
    matchPercentage: 91,
    recommendationReason: 'Restores decaying GIS competency (currently 48%, projected to decay to 35%).',
    language: 'English',
    rating: 4.6,
    enrolledCount: 1980,
    tags: ['GIS', 'Urban Frame Survey', 'Spatial Statistics']
  },
  {
    id: 'course-cpi-index',
    title: 'Consumer Price Index (CPI) Compilation & Imputation Techniques',
    provider: 'iGOT Karmayogi',
    duration: '8 Hours',
    difficulty: 'Foundational',
    competenciesGained: ['Item Basket Weighting', 'Geometric Mean Formulae', 'Price Outlier Detection'],
    matchPercentage: 88,
    recommendationReason: 'Recommended for quarterly price survey oversight in northern field offices.',
    language: 'Hindi',
    rating: 4.7,
    enrolledCount: 2890,
    tags: ['Price Statistics', 'Macro Indicators']
  },
  {
    id: 'course-aiml-stats',
    title: 'Machine Learning & Predictive Modeling in Official Statistics',
    provider: 'NSSTA TPAC',
    duration: '24 Hours',
    difficulty: 'Advanced',
    competenciesGained: ['Supervised Imputation', 'Nowcasting GDP Sub-indices', 'Satellite Imagery Crop Yields'],
    matchPercentage: 85,
    recommendationReason: 'Future workforce capability requirement (MoSPI Modernization Roadmap 2026-2030).',
    language: 'English',
    rating: 4.9,
    enrolledCount: 840,
    tags: ['AI/ML', 'Nowcasting', 'Advanced Modeling']
  },
  {
    id: 'course-data-gov',
    title: 'National Data Governance Framework & Open Data Standards',
    provider: 'iGOT Karmayogi',
    duration: '6 Hours',
    difficulty: 'Foundational',
    competenciesGained: ['Data Quality Assurance', 'Metadata Standardization', 'Anonymization Protocols'],
    matchPercentage: 79,
    recommendationReason: 'Closes gap in Digital Governance from 61% to target 80%.',
    language: 'Bilingual',
    rating: 4.5,
    enrolledCount: 4120,
    tags: ['Digital Governance', 'NDAP', 'Metadata']
  }
];

export const DEMO_SAMPLE_QUIZ: GeneratedQuiz = {
  id: 'quiz-nssta-sampling-2025',
  title: 'NSSTA Official Assessment: Multi-Stage Stratified Sampling & Non-Sampling Error Controls',
  sourceDocument: 'NSSTA_Training_Manual_Sampling_Design_Vol_IV.pdf',
  sourceType: 'PDF',
  documentPages: 42,
  targetDomain: 'Statistical',
  questionsCount: 5,
  difficulty: 'Intermediate',
  language: 'English',
  createdAt: 'Generated 2 hours ago by NSSTA AI Core',
  status: 'Published',
  questions: [
    {
      id: 'q1',
      questionNumber: 1,
      text: 'In a two-stage stratified sampling design for the Periodic Labour Force Survey (PLFS), how are First Stage Units (FSUs) selected within rural strata according to standard NSO procedure?',
      options: [
        'Simple Random Sampling without Replacement (SRSWOR)',
        'Probability Proportional to Size with Replacement (PPSWR) based on 2011 Census population',
        'Systematic Sampling with Equal Probability',
        'Cluster sampling based on geographical proximity only'
      ],
      correctOptionIndex: 1,
      explanation: 'Rural First Stage Units (villages/panchayats) are selected using Probability Proportional to Size with Replacement (PPSWR), where size represents the census village population, ensuring representative probability matching population density.',
      sourceDoc: {
        title: 'NSSTA Training Manual Vol IV — Sampling Methodologies',
        page: 14,
        section: 'Section 3.2: Rural Frame Stratification & FSU Allocation Rules',
        excerpt: '“In rural sectors, the first stage units (FSUs) are census villages allocated across rural sub-strata and chosen by Probability Proportional to Size (PPSWR), with Census 2011 population as size metric...”'
      },
      competencyDomain: 'Statistical'
    },
    {
      id: 'q2',
      questionNumber: 2,
      text: 'When calculating the sampling variance of an estimated ratio in a multi-stage survey, which estimator is officially recommended by MoSPI to account for intra-cluster correlation?',
      options: [
        'Classical Jackknife or Sub-sample Replicate Variance Estimator',
        'Ordinary Least Squares Unadjusted Standard Error',
        'Unweighted Poisson Sample Dispersion',
        'Geometric Mean Variance Approximation'
      ],
      correctOptionIndex: 0,
      explanation: 'The Jackknife replication technique or linearised Taylor-series expansion across half-sample replicates is officially mandated to avoid underestimating standard errors caused by cluster correlation.',
      sourceDoc: {
        title: 'NSSTA Training Manual Vol IV — Sampling Methodologies',
        page: 27,
        section: 'Section 5.4: Variance Estimation & Complex Survey Adjustments',
        excerpt: '“Because households within the same FSU share common local traits, OLS variances will be biased downward. Statistical investigators must deploy Jackknife sub-sample replicates to derive conservative, valid confidence intervals.”'
      },
      competencyDomain: 'Statistical'
    },
    {
      id: 'q3',
      questionNumber: 3,
      text: 'What is the primary operational safeguard implemented during CAPI (Computer-Assisted Personal Interviewing) to prevent non-sampling enumerator fabrication in household surveys?',
      options: [
        'Post-survey telephone audits only',
        'Cryptographic geo-fenced timestamping with automatic interview pace latency thresholds',
        'Manual signature collection on paper log sheets',
        'Self-declaration affidavits submitted monthly'
      ],
      correctOptionIndex: 1,
      explanation: 'Modern CAPI tablets in MoSPI employ real-time geo-fencing (ensuring the investigator is physically within the sampled enumeration block) combined with time-latency audits per question to prevent rapid scripted skipping.',
      sourceDoc: {
        title: 'NSSTA Training Manual Vol IV — Sampling Methodologies',
        page: 38,
        section: 'Section 8.1: Quality Control Protocols in Digital Field Capture',
        excerpt: '“The CAPI client continuously verifies tablet coordinates against the pre-loaded Urban Frame Block boundaries. If an interview is logged outside a 50m tolerance, or if duration per module falls below 180 seconds, the survey unit is flagged for supervisory spot verification.”'
      },
      competencyDomain: 'Digital Governance'
    },
    {
      id: 'q4',
      questionNumber: 4,
      text: 'Under the Modified Laspeyres formula utilized for Consumer Price Index (CPI) basket calculations, how is missing price data for seasonal perishable items imputed?',
      options: [
        'Assumed to be zero for the missing period',
        'Replaced by the overall state-level all-items inflation rate',
        'Carried forward without change for up to 12 months',
        'Imputed using relative price movement of matched donor items within the same sub-group'
      ],
      correctOptionIndex: 3,
      explanation: 'Standard MoSPI CPI compilation protocols prohibit indefinite carry-over of unobserved prices. Imputation must follow the relative price relatives of closely matched items within the same commodity group.',
      sourceDoc: {
        title: 'NSSTA Training Manual Vol IV — Sampling Methodologies',
        page: 22,
        section: 'Section 4.3: Imputation Rules for Missing Quotations',
        excerpt: '“Carrying forward old prices induces artificial deflationary inertia. For perishables, imputations must be derived dynamically from the average price relative of donor commodities belonging to the identical five-digit COICOP class.”'
      },
      competencyDomain: 'Statistical'
    },
    {
      id: 'q5',
      questionNumber: 5,
      text: 'In Python-based processing of NSSO unit-level data, which library data structure is optimized for memory-efficient handling of large multi-round hierarchical text tables?',
      options: [
        'Standard Python dict of lists',
        'Polars or PyArrow table with categorical encoding for state/district codes',
        'Uncompressed CSV loaded directly into SQLite in-memory',
        'JSON document arrays'
      ],
      correctOptionIndex: 1,
      explanation: 'PyArrow and Polars categorical arrays drastically cut RAM usage when reading million-row NSSO microdata files, preventing memory overflow on standard government-issued workstations.',
      sourceDoc: {
        title: 'NSSTA Training Manual Vol IV — Sampling Methodologies',
        page: 41,
        section: 'Appendix C: High-Throughput Microdata Scripting Guidelines',
        excerpt: '“For rounds exceeding 2GB raw ASCII size, officers are instructed to leverage arrow-backed categorical structures to compress memory footprint by up to 75% on 8GB client terminals.”'
      },
      competencyDomain: 'Technical'
    }
  ]
};

export const MOCK_PEERS: PeerOfficer[] = [
  {
    id: 'peer-1',
    name: 'Dr. Ananya Deshmukh',
    designation: 'Senior Statistical Officer',
    department: 'Data Quality Assurance Division (DQAD), Kolkata',
    station: 'Eastern Zone',
    expertiseArea: 'Python for Statistical Computing & Machine Learning',
    keySkills: ['Python (Pandas/Statsmodels)', 'Automated Validation Scripts', 'PyArrow Microdata'],
    complementaryReason: 'She scores 94% in Python and seeks guidance in Field Sampling Operations (which you master at 82%). High reciprocal synergy.',
    matchScore: 97,
    activeStatus: 'Available for Mentorship',
    avatarInitials: 'AD'
  },
  {
    id: 'peer-2',
    name: 'K. V. Ramanathan',
    designation: 'Joint Director (Methodology)',
    department: 'Survey Design & Research Division (SDRD), New Delhi',
    station: 'Northern Zone',
    expertiseArea: 'Complex Sampling & Non-response Imputation',
    keySkills: ['Multi-Stage Stratification', 'Weight Calibration', 'Small Area Estimation'],
    complementaryReason: 'Led recent NSSTA Sampling Methodology refresh; ideal senior mentor to elevate your sampling confidence from 82% to 90%.',
    matchScore: 92,
    activeStatus: 'Peer Study Group',
    avatarInitials: 'KR'
  },
  {
    id: 'peer-3',
    name: 'Pooja Bhattacharya',
    designation: 'Assistant Director (IT & GIS)',
    department: 'Computer Centre, R.K. Puram, New Delhi',
    station: 'Central HQ',
    expertiseArea: 'GIS Spatial Analytics & Bhuvan Geoportal',
    keySkills: ['QGIS Automation', 'Geo-JSON Validation', 'Satellite Census Layering'],
    complementaryReason: 'Can resolve your GIS decay risk through weekly 20-min practical peer coding sprints on Urban Frame blocks.',
    matchScore: 89,
    activeStatus: 'Available for Mentorship',
    avatarInitials: 'PB'
  },
  {
    id: 'peer-4',
    name: 'Suresh Chandra Panda',
    designation: 'Statistical Officer',
    department: 'National Accounts Division (NAD), New Delhi',
    station: 'Central HQ',
    expertiseArea: 'Macroeconomic Aggregates & GDP Nowcasting',
    keySkills: ['R Econometrics', 'Supply-Use Tables', 'Input-Output Modeling'],
    complementaryReason: 'Active co-learner on the MoSPI Modernization Learning Path; completed Python for Official Stats last month.',
    matchScore: 84,
    activeStatus: 'Peer Study Group',
    avatarInitials: 'SP'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Competency At Risk: Sampling Methodology',
    message: 'Your sampling score is projected to drop from 82% to 68% in 6 months due to lapse in verified assessments.',
    timestamp: '2 hours ago',
    type: 'risk',
    read: false,
    actionLabel: 'Take Refresher Quiz',
    actionTarget: 'officer-quiz'
  },
  {
    id: 'notif-2',
    title: 'New NSSTA Programme Aligned with Your Profile',
    message: 'NSSTA Greater Noida has published "Advanced Python for Microdata Processing" matching your technical role gap.',
    timestamp: 'Yesterday at 16:30',
    type: 'course',
    read: false,
    actionLabel: 'View Course',
    actionTarget: 'courses'
  },
  {
    id: 'notif-3',
    title: 'Assessment Score Verified',
    message: 'Data Quality Assurance & Validation Drill verified: Your score improved to 88% (+6%). Digital Skill Passport updated.',
    timestamp: '3 days ago',
    type: 'assessment',
    read: true,
    actionLabel: 'Open Passport',
    actionTarget: 'skill-passport'
  },
  {
    id: 'notif-4',
    title: 'GIS Spatial Analytics Flagged',
    message: 'Urban Frame Survey guidelines have updated to Bhuvan 3.0 standards. Take the 15-min gap diagnostic.',
    timestamp: '5 days ago',
    type: 'risk',
    read: true,
    actionLabel: 'Check Decay',
    actionTarget: 'skill-decay'
  }
];

export const MOCK_REGIONAL_DATA: RegionalMetric[] = [
  {
    id: 'reg-north',
    zone: 'Northern',
    stateCount: 7,
    officialCount: 1420,
    avgReadiness: 71,
    topGap: 'Python for Automated Microdata (34% avg)',
    leadInstitution: 'NSSTA Headquarters, Greater Noida',
    samplingAccuracy: 88,
    digitalCadreReadiness: 66
  },
  {
    id: 'reg-south',
    zone: 'Southern',
    stateCount: 5,
    officialCount: 1280,
    avgReadiness: 74,
    topGap: 'GIS Spatial Validation (42% avg)',
    leadInstitution: 'Regional Training Centre, Bengaluru',
    samplingAccuracy: 91,
    digitalCadreReadiness: 72
  },
  {
    id: 'reg-west',
    zone: 'Western',
    stateCount: 4,
    officialCount: 1150,
    avgReadiness: 69,
    topGap: 'Cloud Data Pipelines & Big Data Imputation (29% avg)',
    leadInstitution: 'Zonal Training Office, Mumbai',
    samplingAccuracy: 85,
    digitalCadreReadiness: 64
  },
  {
    id: 'reg-east',
    zone: 'Eastern',
    stateCount: 5,
    officialCount: 1390,
    avgReadiness: 67,
    topGap: 'Modern Survey Sampling Refresher (48% decay)',
    leadInstitution: 'SDRD Academic Wing, Kolkata',
    samplingAccuracy: 84,
    digitalCadreReadiness: 61
  },
  {
    id: 'reg-ne',
    zone: 'North-Eastern',
    stateCount: 8,
    officialCount: 640,
    avgReadiness: 62,
    topGap: 'CAPI / TAPI Offline Resilience Protocols (38% avg)',
    leadInstitution: 'Sub-Regional Training Centre, Guwahati',
    samplingAccuracy: 79,
    digitalCadreReadiness: 56
  },
  {
    id: 'reg-central',
    zone: 'Central',
    stateCount: 3,
    officialCount: 920,
    avgReadiness: 65,
    topGap: 'Price Statistics Outlier Algorithms (37% avg)',
    leadInstitution: 'RTC Bhopal',
    samplingAccuracy: 82,
    digitalCadreReadiness: 59
  }
];

export const MOCK_WORKFORCE_STATS = {
  totalOfficials: 6800,
  averageReadiness: 67.4,
  activeLearners: 4210,
  coursesCompletedThisQuarter: 3840,
  topSkillGaps: [
    { skill: 'AI/ML in Official Statistics', current: 31, required: 60, gap: 29, priority: 'CRITICAL' },
    { skill: 'Python for Statistical Computing', current: 41, required: 75, gap: 34, priority: 'HIGH' },
    { skill: 'GIS Spatial Analytics & Bhuvan', current: 44, required: 70, gap: 26, priority: 'HIGH' },
    { skill: 'Secure Cloud & NDAP Governance', current: 52, required: 80, gap: 28, priority: 'MEDIUM' }
  ],
  departmentBreakdown: [
    { dept: 'National Accounts Division (NAD)', officials: 620, readiness: 76 },
    { dept: 'Field Operations Division (FOD)', officials: 3100, readiness: 64 },
    { dept: 'Survey Design & Research (SDRD)', officials: 840, readiness: 81 },
    { dept: 'Data Quality Assurance (DQAD)', officials: 780, readiness: 73 },
    { dept: 'Economic Statistics Division (ESD)', officials: 910, readiness: 69 },
    { dept: 'Social Statistics Division (SSD)', officials: 550, readiness: 66 }
  ]
};
