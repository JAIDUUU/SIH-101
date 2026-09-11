export type Role = 'officer' | 'trainer' | 'admin' | 'public';
export type UserRole = Role;

export type CompetencyDomain = 'Statistical' | 'Technical' | 'Digital Governance' | 'Behavioural & Managerial';

export type VerificationType = 'SELF-ASSESSED' | 'SYSTEM-VERIFIED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CompetencyItem {
  id: string;
  name: string;
  domain: CompetencyDomain;
  currentScore: number;
  targetScore: number;
  verification: VerificationType;
  evidence: string;
  decayRisk?: {
    isAtRisk: boolean;
    projected3m: number;
    projected6m: number;
    projected12m: number;
    lastAssessed: string;
    refresherCourseId: string;
    refresherTitle: string;
    decayReason: string;
  };
}

export interface Course {
  id: string;
  title: string;
  provider: 'iGOT Karmayogi' | 'NSSTA TPAC' | 'nssta.gov.in (NSSTA)' | 'mospi.gov.in (MoSPI)' | string;
  duration: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  competenciesGained: string[];
  matchPercentage: number;
  recommendationReason: string;
  language: 'English' | 'Hindi' | 'Bilingual';
  rating: number;
  enrolledCount: number;
  tags: string[];
  status?: 'not-started' | 'in-progress' | 'completed';
  progress?: number;
  portalUrl?: string;
  officialCircularRef?: string;
  cadreEligibility?: string;
  syllabusTopics?: string[];
}

export interface OfficerProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  cadre: string;
  employeeId: string;
  experienceYears: number;
  education: string;
  station: string;
  email: string;
  readinessScore: number;
  domainScores: Record<CompetencyDomain, number>;
  atRiskSkills: string[];
  activeCourses: Course[];
  completedCoursesCount: number;
  assessmentsCompleted: number;
  competencies: CompetencyItem[];
  passportId: string;
  passportIssuedDate: string;
  verifiedCredentialsCount: number;
  isProfileSetup?: boolean;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  sourceDoc: {
    title: string;
    page: number;
    section: string;
    excerpt: string;
  };
  competencyDomain: string;
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  sourceDocument: string;
  sourceType: 'PDF' | 'PPT' | 'DOCX';
  documentPages: number;
  targetDomain: string;
  questionsCount: number;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  language: 'English' | 'Hindi' | 'Bilingual';
  createdAt: string;
  status: 'Draft' | 'Published' | 'Under Review';
  questions: QuizQuestion[];
}

export interface PeerOfficer {
  id: string;
  name: string;
  designation: string;
  department: string;
  station: string;
  expertiseArea: string;
  keySkills: string[];
  complementaryReason: string;
  matchScore: number;
  activeStatus: 'Available for Mentorship' | 'Peer Study Group' | 'Busy';
  avatarInitials: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'risk' | 'course' | 'assessment' | 'system';
  read: boolean;
  actionLabel?: string;
  actionTarget?: string;
}

export interface RegionalMetric {
  id: string;
  zone: 'Northern' | 'Western' | 'Southern' | 'Eastern' | 'North-Eastern' | 'Central';
  stateCount: number;
  officialCount: number;
  avgReadiness: number;
  topGap: string;
  leadInstitution: string;
  samplingAccuracy: number;
  digitalCadreReadiness: number;
}
