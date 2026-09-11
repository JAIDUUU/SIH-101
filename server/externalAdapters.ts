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

/**
 * Sunbird RC (Registry and Credential) Framework Adapter (Requirement 1 & Research Report)
 * Exposes the official REST APIs: Registry API, Discovery API, Telemetry API, Claims API, Attestation API.
 */
export class SunbirdRCAdapter {
  public static async discovery(query?: string) {
    return {
      framework: 'Sunbird-RC v2.4.1 (FRAC Metamodel)',
      registryType: 'LearnerCompetencyRegistry',
      items: [
        {
          competencyId: 'COMP-STAT-SAMP-01',
          name: 'Sampling Methodology & Design',
          domain: 'Domain (D)',
          accreditingBody: 'NSSTA Greater Noida',
          attestationPolicy: 'EXAM_VERIFIED_LEVEL_3',
        },
        {
          competencyId: 'COMP-TECH-PY-02',
          name: 'Python for Statistical Computing & Microdata ETL',
          domain: 'Functional (F)',
          accreditingBody: 'iGOT Karmayogi / NCI',
          attestationPolicy: 'LAB_SUBMISSION_PASS',
        },
        {
          competencyId: 'COMP-STAT-CPI-03',
          name: 'Price Index & Imputation Systems',
          domain: 'Domain (D)',
          accreditingBody: 'Price Statistics Division (PSD) / NSSTA',
          attestationPolicy: 'QUARTERLY_SURVEY_CYCLE_EVAL',
        },
        {
          competencyId: 'COMP-BEH-ETHICS-04',
          name: 'Public Sector Ethics & Data Stewardship (DPDP Act)',
          domain: 'Behavioural (B)',
          accreditingBody: 'DoPT / iGOT Karmayogi',
          attestationPolicy: 'STATUTORY_COMPLIANCE_CERT',
        }
      ]
    };
  }

  public static async registry(employeeId: string) {
    return {
      registryId: `RC-REG-${employeeId}`,
      entityType: 'StatisticalOfficer',
      ulpId: `ULP-IN-MOSPI-${employeeId}`,
      eLockerStatus: 'SYNCED_AND_AUTHENTICATED',
      lastSynced: new Date().toISOString(),
      attestationsCount: 4,
      credentialFormat: 'W3C Verifiable Credentials (Ed25519Signature2020)',
    };
  }

  public static async telemetry(event: {
    actorId: string;
    eventType: 'ASSESSMENT_ATTEMPT' | 'COURSE_PROGRESS' | 'CREDENTIAL_CLAIM';
    details: any;
  }) {
    return {
      telemetryStatus: 'INGESTED',
      eventId: `TEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      sink: 'Sunbird Telemetry Stream / eGov Open Standards',
      acknowledged: true,
    };
  }

  public static async claims(claimData: {
    employeeId: string;
    competencyName: string;
    score: number;
    verifier: string;
  }) {
    return {
      claimId: `CLM-${Date.now()}`,
      status: 'ISSUED',
      signature: 'sha256withRSA:49f8a10b42c8d7e9f3b5...',
      issuedAt: new Date().toISOString(),
      credentialSubject: {
        id: `did:india:mospi:${claimData.employeeId}`,
        competency: claimData.competencyName,
        proficiencyScore: claimData.score,
        accreditedBy: claimData.verifier,
      }
    };
  }

  public static async attestation(claimId: string) {
    return {
      attestationId: `ATT-${Date.now()}`,
      claimId,
      status: 'CRYPTOGRAPHICALLY_VERIFIED',
      verifiedBy: 'National Statistical Systems Training Academy (NSSTA)',
      qrPayload: `https://skillsutra.gov.in/verify/attestation/${claimId}`,
    };
  }
}

/**
 * e-Sankhyiki RAG Adapter (Requirement 4 & Research Report)
 * Provides official verifiable datasets (CPI, IIP, ASI, PLFS) for AI RAG groundings.
 */
export class ESankhyikiRAGAdapter {
  public static getOfficialDatasets() {
    return [
      {
        dataset: 'Consumer Price Index (CPI)',
        baseYear: '2012=100',
        latestGeneralIndex: '192.4 (All India Combined)',
        itemBaskets: '299 items (Rural) / 310 items (Urban)',
        frequency: 'Monthly (Released 12th of each month)',
        citation: 'MoSPI Price Statistics Division (PSD) Press Note',
      },
      {
        dataset: 'Index of Industrial Production (IIP)',
        baseYear: '2011-12=100',
        manufacturingWeight: '77.63%',
        miningWeight: '14.37%',
        electricityWeight: '7.99%',
        frequency: 'Monthly (Released 12th of each month)',
        citation: 'MoSPI Economic Statistics Division (ESD)',
      },
      {
        dataset: 'Annual Survey of Industries (ASI)',
        coverage: 'Factories registered under Sections 2m(i) and 2m(ii) of the Factories Act, 1948',
        keyVariables: 'Gross Value Added (GVA), Invested Capital, Total Persons Engaged',
        latestRound: 'ASI 2022-23 (Final Results)',
        citation: 'MoSPI Industrial Statistics Wing (ISW), Kolkata',
      },
      {
        dataset: 'Periodic Labour Force Survey (PLFS)',
        indicators: 'Labour Force Participation Rate (LFPR), Worker Population Ratio (WPR), Unemployment Rate (UR)',
        currentUR: '3.2% (Persons aged 15 years and above in usual status)',
        samplingMethodology: 'Two-Stage Stratified Sampling (First-stage: FSUs/Census enumeration blocks, Second-stage: Households)',
        citation: 'MoSPI Survey Design and Research Division (SDRD) & FOD',
      }
    ];
  }
}
