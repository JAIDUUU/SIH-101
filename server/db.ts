import type { OfficerProfile, CompetencyItem, Course, GeneratedQuiz, PeerOfficer, NotificationItem } from '../src/types/index.ts';
import { PRIMARY_OFFICER, DEMO_SAMPLE_QUIZ } from '../src/data/mockData.ts';
import { OFFICIAL_GOV_COURSES } from './officialCoursesService.ts';
import { OFFICIAL_IGOT_SADHANA_COURSES } from './igotSadhanaCourses.ts';

export interface SkillEventRecord {
  id: string;
  userId: string;
  eventType: 'ASSESSMENT_PASSED' | 'COURSE_COMPLETED' | 'PROFILE_UPDATED';
  title: string;
  score?: number;
  timestamp: string;
}

export interface UserRecord {
  id: string;
  email: string;
  role: 'officer' | 'trainer' | 'admin';
  name: string;
  password?: string;
}

export interface TrainerRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  department: string;
  specialization: string;
  createdAt: string;
  status: 'Active' | 'Suspended';
}

class DatabaseStore {
  public users: UserRecord[] = [
    { id: 'usr-1', email: 'rajesh.kumar@mospi.gov.in', role: 'officer', name: 'Rajesh Kumar' },
    { id: 'usr-2', email: 'dr.srao@nssta.gov.in', role: 'trainer', name: 'Dr. S. Rao' },
    { id: 'usr-3', email: 'neeta.sharma@mospi.gov.in', role: 'admin', name: 'Neeta Sharma' },
  ];

  public trainers: TrainerRecord[] = [
    {
      id: 'TR-NSSTA-101',
      name: 'Dr. S. Rao',
      email: 'dr.srao@nssta.gov.in',
      department: 'National Statistical Systems Training Academy (NSSTA)',
      specialization: 'Sampling Design & Multi-Stage Stratification',
      createdAt: '2025-01-10T10:00:00Z',
      status: 'Active',
    }
  ];

  public officer: OfficerProfile = JSON.parse(JSON.stringify(PRIMARY_OFFICER));
  public currentQuiz: GeneratedQuiz = JSON.parse(JSON.stringify(DEMO_SAMPLE_QUIZ));
  public skillEvents: SkillEventRecord[] = [
    {
      id: 'evt-init-1',
      userId: 'usr-1',
      eventType: 'ASSESSMENT_PASSED',
      title: 'Sampling Methodology Certification (NSSTA #SA-402)',
      score: 82,
      timestamp: '2024-09-15T10:30:00Z',
    }
  ];
  public courses: Course[] = JSON.parse(JSON.stringify([...OFFICIAL_GOV_COURSES, ...OFFICIAL_IGOT_SADHANA_COURSES]));

  public peers: PeerOfficer[] = [
    {
      id: 'peer-1',
      name: 'Dr. Ananya Sharma',
      designation: 'Deputy Director',
      department: 'National Accounts Division (NAD), New Delhi',
      station: 'Central Ministry HQ, New Delhi',
      expertiseArea: 'Advanced Econometrics & Macroeconomic Aggregates',
      keySkills: ['R Programming', 'Input-Output Tables', 'SUT Modeling'],
      complementaryReason: 'High technical score (88%) matches your developmental priority in Python/R computing.',
      matchScore: 94,
      activeStatus: 'Available for Mentorship',
      avatarInitials: 'AS',
    },
    {
      id: 'peer-2',
      name: 'Suresh Patel',
      designation: 'Senior Statistical Officer',
      department: 'FOD Regional Office, Ahmedabad',
      station: 'Western Zone, Ahmedabad',
      expertiseArea: 'CAPI Implementation & Enterprise Data Audits',
      keySkills: ['ASI Schedule Processing', 'Field Data Verification', 'CSPro'],
      complementaryReason: 'Shares your FOD operational cadre; actively pursuing similar predictive decay refreshers.',
      matchScore: 89,
      activeStatus: 'Peer Study Group',
      avatarInitials: 'SP',
    },
    {
      id: 'peer-3',
      name: 'Meenakshi Sundaram',
      designation: 'Statistical Officer',
      department: 'Price Statistics Division (PSD), Chennai',
      station: 'Southern Zone, Chennai',
      expertiseArea: 'Retail Price Indices & Geometric Mean Aggregation',
      keySkills: ['CPI Compilation', 'Market Basket Survey', 'Weight Revision'],
      complementaryReason: 'Top collaborator in southern zone price data validation and index harmonization.',
      matchScore: 84,
      activeStatus: 'Peer Study Group',
      avatarInitials: 'MS',
    }
  ];

  public notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'AI Skill Decay Alert: Sampling Methodology',
      message: 'Your elapsed drill interval has exceeded 180 days. Projected competency loss is 14 points without refresher certification.',
      timestamp: '2 hours ago',
      type: 'risk',
      read: false,
      actionLabel: 'Review Projection',
      actionTarget: 'skill-decay',
    },
    {
      id: 'notif-2',
      title: 'Recommended Course Matched: Python for NSSO Data',
      message: 'New NSSTA TPAC lab module opened addressing your primary Technical competency gap.',
      timestamp: 'Yesterday',
      type: 'course',
      read: false,
      actionLabel: 'View Course',
      actionTarget: 'courses',
    }
  ];
}

export const db = new DatabaseStore();
