import { Course } from '../src/types';

export interface IGOTAdapter {
  searchCourses(query: string): Promise<Course[]>;
  getCourse(id: string): Promise<Course | null>;
  syncCredential(userId: string, courseId: string): Promise<{ synced: boolean; credentialId: string }>;
}

export interface NSSTAAdapter {
  fetchCurriculum(): Promise<Course[]>;
  verifyAccreditation(drillId: string): Promise<{ valid: boolean; level: string }>;
}

export class MockIGOTService implements IGOTAdapter {
  private courses: Course[] = [
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
    },
    {
      id: 'course-data-ethics',
      title: 'DPDP Act 2023 & Statistical Confidentiality for Public Officers',
      provider: 'iGOT Karmayogi',
      duration: '6 Hours',
      difficulty: 'Foundational',
      competenciesGained: ['Data Privacy Law', 'Microdata Anonymization', 'Official Secrets Act Compliance'],
      matchPercentage: 84,
      recommendationReason: 'Mandatory bi-annual statutory refresher for all FOD / NSO enumerators and supervisors.',
      language: 'Hindi',
      rating: 4.9,
      enrolledCount: 5400,
      tags: ['Governance', 'Compliance', 'Ethics'],
      status: 'not-started',
      progress: 0
    },
    {
      id: 'course-ai-llm-gov',
      title: 'Generative AI & Data Governance in Statistical Registries',
      provider: 'iGOT Karmayogi',
      duration: '10 Hours',
      difficulty: 'Intermediate',
      competenciesGained: ['LLM Prompt Verification', 'Metadata Tagging', 'Algorithmic Audits'],
      matchPercentage: 82,
      recommendationReason: 'Addresses emerging digital transformation initiatives across Ministry divisions.',
      language: 'English',
      rating: 4.6,
      enrolledCount: 1750,
      tags: ['Artificial Intelligence', 'Digital Governance'],
      status: 'not-started',
      progress: 0
    }
  ];

  async searchCourses(query: string): Promise<Course[]> {
    return this.courses;
  }

  async getCourse(id: string): Promise<Course | null> {
    return this.courses.find((c) => c.id === id) || null;
  }

  async syncCredential(userId: string, courseId: string) {
    return {
      synced: true,
      credentialId: `IGOT-CRED-MOSPI-${courseId.toUpperCase().slice(-5)}`
    };
  }
}

export class MockNSSTAService implements NSSTAAdapter {
  private courses: Course[] = [
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
      id: 'course-sampling-refresher',
      title: 'Modern Survey Sampling: Multi-Stage Stratification Refresher',
      provider: 'NSSTA TPAC',
      duration: '12 Hours',
      difficulty: 'Advanced',
      competenciesGained: ['Probability Proportional to Size (PPS)', 'Post-Stratification Weighting', 'Non-Response Imputation'],
      matchPercentage: 94,
      recommendationReason: 'Critical skill decay mitigation: Your sampling design drill interval exceeds 180 days.',
      language: 'English',
      rating: 4.9,
      enrolledCount: 890,
      tags: ['Survey Sampling', 'Methodology', 'PLFS'],
      status: 'not-started',
      progress: 0
    },
    {
      id: 'course-gis-urban',
      title: 'Urban Frame Survey (UFS) GIS Spatial Mapping & Block Delineation',
      provider: 'NSSTA TPAC',
      duration: '14 Hours',
      difficulty: 'Intermediate',
      competenciesGained: ['QGIS Microdata Layering', 'Satellite Imagery Ground-Truthing', 'Shapefile Boundary Creation'],
      matchPercentage: 91,
      recommendationReason: 'High developmental impact for ongoing modernization of National Urban Statistical Frames.',
      language: 'English',
      rating: 4.7,
      enrolledCount: 650,
      tags: ['GIS', 'Remote Sensing', 'Urban Statistics'],
      status: 'not-started',
      progress: 0
    }
  ];

  async fetchCurriculum(): Promise<Course[]> {
    return this.courses;
  }

  async verifyAccreditation(drillId: string) {
    return {
      valid: true,
      level: 'NSSTA Technical Proficiency Level 3'
    };
  }
}
