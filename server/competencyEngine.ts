import { CompetencyItem, CompetencyDomain } from '../src/types';
import {
  STATISTICAL_DOMAINS,
  CENTRAL_STATISTICAL_ORGANIZATIONS,
  STATE_UT_STATISTICAL_ORGANIZATIONS,
} from './statisticalMasterData';

export interface CompetencyEngineInput {
  designation: string;
  department: string;
  experienceYears: number;
  cadre?: string;
  organization?: string;
  governanceLevel?: string;
  statisticalDomain?: string;
  selectedSkills?: string[];
  responsibilities?: string[] | string;
  previousTraining?: string[] | string;
  selfAssessedSkills?: Record<string, number>;
  assessmentHistory?: Array<{ competencyName: string; score: number; date?: string }>;
}

interface DomainSkillSpec {
  name: string;
  domain: CompetencyDomain;
  baseScore: number;
  refresherId: string;
  refresherTitle: string;
  decayReason?: string;
}

// Master Domain-Specific Competencies Blueprint (Organization -> Department -> Domain -> Required Competencies & Skills)
const DOMAIN_COMPETENCY_REGISTRY: Record<string, {
  coreCompetencies: DomainSkillSpec[];
  technicalSkills: DomainSkillSpec[];
}> = {
  'Labour Statistics': {
    coreCompetencies: [
      {
        name: 'Labour Statistics & Employment Indicators (LFPR, WPR, UR)',
        domain: 'Statistical',
        baseScore: 84,
        refresherId: 'course-plfs-analysis',
        refresherTitle: 'Periodic Labour Force Survey (PLFS) & Employment Analytics',
        decayReason: 'Quarterly PLFS revisions & revised activity status classifications.'
      },
      {
        name: 'PLFS Methodology & Activity Status Classification (UPS, UPSS, CWS)',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-plfs-analysis',
        refresherTitle: 'Periodic Labour Force Survey (PLFS) & Employment Analytics',
        decayReason: 'Annual changes in enterprise classification matrices and secondary activity codes.'
      },
      {
        name: 'Sampling Methodology & Stratified Cluster Selection',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher',
        decayReason: 'Lack of practical assessment in multi-stage stratification over 6 months.'
      },
      {
        name: 'Survey Design & Field Questionnaire Protocols',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      },
      {
        name: 'Digital Field Data Collection (CAPI / TAPI)',
        domain: 'Digital Governance',
        baseScore: 72,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Induction & Refresher in Multi-Stage Stratified Sampling'
      },
      {
        name: 'Data Quality Assurance & Non-Response Multipliers',
        domain: 'Statistical',
        baseScore: 70,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      }
    ],
    technicalSkills: [
      {
        name: 'Stata for Microdata Econometric Processing',
        domain: 'Technical',
        baseScore: 50,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'Stata Microdata Econometric Processing & svyset Procedures'
      },
      {
        name: 'R for Complex Survey Variance Estimation',
        domain: 'Technical',
        baseScore: 45,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python & R for Statistical Computing & Microdata ETL'
      },
      {
        name: 'Python for Microdata Cleaning & Pandas Automation',
        domain: 'Technical',
        baseScore: 42,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'SQL for Household Microdata Queries',
        domain: 'Technical',
        baseScore: 62,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Advanced Excel for Field Cross-Tabulations',
        domain: 'Technical',
        baseScore: 78,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      }
    ]
  },

  'National Accounts': {
    coreCompetencies: [
      {
        name: 'National Accounts & System of National Accounts (SNA 2008/2025)',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income'
      },
      {
        name: 'GDP/GVA Compilation Methodology & Sectoral Deflators',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income'
      },
      {
        name: 'Supply and Use Tables (SUT) & Input-Output Modeling',
        domain: 'Statistical',
        baseScore: 72,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income'
      },
      {
        name: 'Gross Capital Formation & Capital Stock Estimation',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income'
      },
      {
        name: 'Macroeconomic Aggregates & Nowcasting',
        domain: 'Statistical',
        baseScore: 68,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income'
      },
      {
        name: 'Data Quality & Balance of Payments Reconciliation',
        domain: 'Statistical',
        baseScore: 75,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income'
      }
    ],
    technicalSkills: [
      {
        name: 'R for Macroeconomic & Time-Series Modeling',
        domain: 'Technical',
        baseScore: 48,
        refresherId: 'course-py-stat',
        refresherTitle: 'Statistical Computing & Time-Series Modeling'
      },
      {
        name: 'Python for National Accounts Data Aggregation',
        domain: 'Technical',
        baseScore: 44,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Advanced Excel & Power Query for Fiscal Modeling',
        domain: 'Technical',
        baseScore: 82,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      },
      {
        name: 'SQL Database Queries for Enterprise Ingestion (MCA21)',
        domain: 'Technical',
        baseScore: 58,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Data Visualization & Macroeconomic Dashboards',
        domain: 'Digital Governance',
        baseScore: 64,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      }
    ]
  },

  'Price Statistics': {
    coreCompetencies: [
      {
        name: 'Consumer Price Index (CPI) Compilation & Basket Weighting',
        domain: 'Statistical',
        baseScore: 85,
        refresherId: 'course-cpi-index',
        refresherTitle: 'Consumer Price Index (CPI) Compilation & Imputation Techniques'
      },
      {
        name: 'Index Number Formulae (Laspeyres, Paasche & Geometric Mean)',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-cpi-index',
        refresherTitle: 'Consumer Price Index (CPI) Compilation & Imputation Techniques'
      },
      {
        name: 'Price Imputation, Outlier Treatment & Quality Adjustment',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'course-cpi-index',
        refresherTitle: 'Consumer Price Index (CPI) Compilation & Imputation Techniques'
      },
      {
        name: 'Retail Price Web Portal & Digital CAPI Validation Rules',
        domain: 'Digital Governance',
        baseScore: 70,
        refresherId: 'course-cpi-index',
        refresherTitle: 'Consumer Price Index (CPI) Compilation & Imputation Techniques'
      },
      {
        name: 'Cost of Living Indices & Inflation Analytics',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'course-cpi-index',
        refresherTitle: 'Consumer Price Index (CPI) Compilation & Imputation Techniques'
      }
    ],
    technicalSkills: [
      {
        name: 'SQL for Price Transaction Database Processing',
        domain: 'Technical',
        baseScore: 60,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Python for Automated Price Scraping & Outlier Diagnostics',
        domain: 'Technical',
        baseScore: 40,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Advanced Excel for High-Volume Price Matrices',
        domain: 'Technical',
        baseScore: 84,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      },
      {
        name: 'Data Quality Protocols & Consistency Auditing',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-cpi-index',
        refresherTitle: 'Consumer Price Index (CPI) Compilation & Imputation Techniques'
      }
    ]
  },

  'Industrial Statistics': {
    coreCompetencies: [
      {
        name: 'Annual Survey of Industries (ASI) Protocols & Factory Sector Framework',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-asi-field',
        refresherTitle: 'Annual Survey of Industries (ASI) Field Audit Certification'
      },
      {
        name: 'NIC-2008 & NPC-MS Industrial Code Classification',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-asi-field',
        refresherTitle: 'Annual Survey of Industries (ASI) Field Audit Certification'
      },
      {
        name: 'Index of Industrial Production (IIP) Base Weighting',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-asi-field',
        refresherTitle: 'Annual Survey of Industries (ASI) Field Audit Certification'
      },
      {
        name: 'Gross Output, Net Value Added & Capital Invested Computation',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'course-asi-field',
        refresherTitle: 'Annual Survey of Industries (ASI) Field Audit Certification'
      },
      {
        name: 'Factory Ledger Scrutiny & Balance Sheet Verification',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'course-asi-field',
        refresherTitle: 'Annual Survey of Industries (ASI) Field Audit Certification'
      }
    ],
    technicalSkills: [
      {
        name: 'SQL for Industrial Register Database Queries',
        domain: 'Technical',
        baseScore: 62,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Python for Factory Sector Microdata Cleaning',
        domain: 'Technical',
        baseScore: 42,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Data Processing & Batch Validation Engines',
        domain: 'Technical',
        baseScore: 66,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Advanced Excel for Corporate Accounts Reconciliation',
        domain: 'Technical',
        baseScore: 80,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      }
    ]
  },

  'Household Surveys': {
    coreCompetencies: [
      {
        name: 'Household Consumption Expenditure Survey (HCES) Methodology',
        domain: 'Statistical',
        baseScore: 84,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Induction & Refresher in Multi-Stage Stratified Sampling & NSSO Survey Design'
      },
      {
        name: 'Multi-Stage Stratified Sampling & First Stage Unit (FSU) Frame',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      },
      {
        name: 'Computer-Assisted Personal Interviewing (CAPI / CSPro)',
        domain: 'Digital Governance',
        baseScore: 78,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Induction & Refresher in Multi-Stage Stratified Sampling'
      },
      {
        name: 'Field Supervisory Scrutiny & Hamlet-Group Selection',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Induction & Refresher in Multi-Stage Stratified Sampling'
      },
      {
        name: 'Non-Sampling Error Quantification & Weight Calibration',
        domain: 'Statistical',
        baseScore: 72,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      }
    ],
    technicalSkills: [
      {
        name: 'Stata for Household Microdata Cleaning',
        domain: 'Technical',
        baseScore: 48,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'Stata Microdata Econometric Processing & svyset Procedures'
      },
      {
        name: 'SPSS for Socio-Economic Cross-Tabulations',
        domain: 'Technical',
        baseScore: 55,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'SPSS & Stata for Socio-Economic Tabulations'
      },
      {
        name: 'Python for Survey Validation Scripts',
        domain: 'Technical',
        baseScore: 40,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Advanced Excel for Field Inspection Dossiers',
        domain: 'Technical',
        baseScore: 82,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      }
    ]
  },

  'Agricultural Statistics': {
    coreCompetencies: [
      {
        name: 'General Crop Estimation Survey (GCES) & Crop Cutting Experiments (CCE)',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Agricultural Statistics & GCES Crop Cutting Experiments'
      },
      {
        name: 'Timely Reporting Scheme (TRS) & Land Utilization Statistics',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Agricultural Statistics & GCES Crop Cutting Experiments'
      },
      {
        name: 'Agriculture Census & Operational Holding Distribution',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Agricultural Statistics & GCES Crop Cutting Experiments'
      },
      {
        name: 'Advance Crop Production Estimates & Yield Modeling',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Agricultural Statistics & GCES Crop Cutting Experiments'
      },
      {
        name: 'Digital Plot Geo-Referencing & Mobile App Scrutiny',
        domain: 'Digital Governance',
        baseScore: 70,
        refresherId: 'course-gis-urban',
        refresherTitle: 'GIS Spatial Mapping & Digital Block Delineation'
      }
    ],
    technicalSkills: [
      {
        name: 'R for Crop Yield Regression & Variance Estimation',
        domain: 'Technical',
        baseScore: 46,
        refresherId: 'course-py-stat',
        refresherTitle: 'Statistical Computing & Crop Yield Regression'
      },
      {
        name: 'Advanced Excel for District Crop Balance Sheets',
        domain: 'Technical',
        baseScore: 84,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      },
      {
        name: 'AgriStack REST APIs Integration',
        domain: 'Technical',
        baseScore: 40,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'REST APIs & Data Exchange in Public Administration'
      },
      {
        name: 'Data Quality Assurance in Field Enumeration',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Induction & Refresher in Multi-Stage Stratified Sampling'
      }
    ]
  },

  'Sampling': {
    coreCompetencies: [
      {
        name: 'Multi-Stage Stratified Sampling & PPS Selection Design',
        domain: 'Statistical',
        baseScore: 85,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      },
      {
        name: 'Sampling Variance, Standard Errors & Design Effect (deff)',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      },
      {
        name: 'Urban Frame Survey (UFS) Digital Block Delineation',
        domain: 'Digital Governance',
        baseScore: 76,
        refresherId: 'course-gis-urban',
        refresherTitle: 'Urban Frame Survey (UFS) GIS Spatial Mapping & Block Delineation'
      },
      {
        name: 'Multiplier Calibration & Non-Response Adjustments',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      }
    ],
    technicalSkills: [
      {
        name: 'R (survey package) for Complex Survey Analysis',
        domain: 'Technical',
        baseScore: 52,
        refresherId: 'course-py-stat',
        refresherTitle: 'R Programming & Survey Package Automation'
      },
      {
        name: 'Python for Sample Selection Algorithms',
        domain: 'Technical',
        baseScore: 45,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Stata svy Commands & Stratification Setup',
        domain: 'Technical',
        baseScore: 50,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'Stata Microdata Econometric Processing & svyset Procedures'
      },
      {
        name: 'GIS & Spatial Frame Mapping',
        domain: 'Digital Governance',
        baseScore: 68,
        refresherId: 'course-gis-urban',
        refresherTitle: 'Urban Frame Survey (UFS) GIS Spatial Mapping'
      }
    ]
  },

  'Data Quality': {
    coreCompetencies: [
      {
        name: 'MoSPI Statistical Data Quality Framework & Error Diagnostics',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'MoSPI Data Quality Framework & Non-Sampling Error Audit'
      },
      {
        name: 'Microdata Outlier Detection & Automated Imputation',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'course-cpi-index',
        refresherTitle: 'Outlier Imputation & Statistical Consistency Diagnostics'
      },
      {
        name: 'Inter-Round Consistency & Longitudinal Harmonization',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Statistical Consistency Diagnostics & Survey Calibration'
      },
      {
        name: 'Audit Trail & Scrutiny Protocol Enforcement',
        domain: 'Digital Governance',
        baseScore: 80,
        refresherId: 'course-data-ethics',
        refresherTitle: 'Data Quality Auditing & Supervisory Inspection Norms'
      }
    ],
    technicalSkills: [
      {
        name: 'Python for Statistical Outlier Algorithms & SciPy',
        domain: 'Technical',
        baseScore: 46,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'SQL for Integrity Constraints & Consistency Rules',
        domain: 'Technical',
        baseScore: 64,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'R for Diagnostic Residual Plots & Imputation Models',
        domain: 'Technical',
        baseScore: 48,
        refresherId: 'course-py-stat',
        refresherTitle: 'R Programming & Survey Package Automation'
      },
      {
        name: 'Cybersecurity & Microdata Anonymization Protocols',
        domain: 'Digital Governance',
        baseScore: 68,
        refresherId: 'course-data-ethics',
        refresherTitle: 'DPDP Act 2023 & Statistical Confidentiality for Public Officers'
      }
    ]
  },

  'Data Collection': {
    coreCompetencies: [
      {
        name: 'Computer-Assisted Personal Interviewing (CAPI) Field Operations',
        domain: 'Digital Governance',
        baseScore: 82,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Induction & Refresher in Multi-Stage Stratified Sampling & NSSO Survey Design'
      },
      {
        name: 'Household Listing & Random Sample Selection in Field',
        domain: 'Statistical',
        baseScore: 85,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Field Team Supervision & Hamlet-Group Selection'
      },
      {
        name: 'Field Team Supervision & Spot Verification Standards',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Field Supervision Standards & Inspection Norms'
      },
      {
        name: 'Paradata Review, Geotagging & Interview Duration Scrutiny',
        domain: 'Digital Governance',
        baseScore: 74,
        refresherId: 'course-gis-urban',
        refresherTitle: 'Paradata Analytics & Geo-Verification in Field Surveys'
      }
    ],
    technicalSkills: [
      {
        name: 'CAPI Field Tablet Operating Systems & Sync APIs',
        domain: 'Technical',
        baseScore: 75,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'CAPI Field Operations & Synchronous Cloud Upload'
      },
      {
        name: 'Data Quality Verification at Field Stage',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Field Validation & Immediate Consistency Scrutiny'
      },
      {
        name: 'Advanced Excel for Field Progress Tracking',
        domain: 'Technical',
        baseScore: 80,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      }
    ]
  },

  'Data Processing': {
    coreCompetencies: [
      {
        name: 'High-Volume Statistical Microdata Batch Processing',
        domain: 'Technical',
        baseScore: 78,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'High-Volume Microdata ETL & Batch Pipeline Processing'
      },
      {
        name: 'Multiplier Generation & Weight Calibration Engines',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Modern Survey Sampling: Multi-Stage Stratification Refresher'
      },
      {
        name: 'Microdata Scrubbing, Consistency Checks & Imputation',
        domain: 'Technical',
        baseScore: 75,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Tabulation Plan Execution & Automated Validation',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'Automated Tabulation & Official Publication Formatting'
      }
    ],
    technicalSkills: [
      {
        name: 'SQL Database Architecture & High-Performance Querying',
        domain: 'Technical',
        baseScore: 68,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Python (Pandas/Polars) for Automated ETL Pipelines',
        domain: 'Technical',
        baseScore: 50,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Stata / SAS Microdata Processing Scripting',
        domain: 'Technical',
        baseScore: 58,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'Stata Microdata Econometric Processing & svyset Procedures'
      },
      {
        name: 'Government Cloud (MeghRaj) & Distributed Compute',
        domain: 'Digital Governance',
        baseScore: 52,
        refresherId: 'course-ai-llm-gov',
        refresherTitle: 'Government Cloud & Distributed Compute Architectures'
      }
    ]
  },

  'Data Dissemination': {
    coreCompetencies: [
      {
        name: 'National Data Warehouse (NDW) Official Microdata Curation',
        domain: 'Digital Governance',
        baseScore: 80,
        refresherId: 'course-open-data',
        refresherTitle: 'National Data Warehouse (NDW) Microdata Curation'
      },
      {
        name: 'Open Government Data (OGD / data.gov.in) Compliance',
        domain: 'Digital Governance',
        baseScore: 82,
        refresherId: 'course-open-data',
        refresherTitle: 'Open Government Data Architecture & Metadata Curation'
      },
      {
        name: 'Statistical Metadata & SDMX International Standards',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-open-data',
        refresherTitle: 'SDMX Metadata Harmonization & International Exchange'
      },
      {
        name: 'Interactive Data Storytelling & Dissemination Dashboards',
        domain: 'Digital Governance',
        baseScore: 72,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      }
    ],
    technicalSkills: [
      {
        name: 'REST APIs Consumption & Data Endpoint Deployment',
        domain: 'Technical',
        baseScore: 54,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'REST APIs & Data Exchange in Public Administration'
      },
      {
        name: 'Data Visualization with Power BI / Tableau / D3.js',
        domain: 'Technical',
        baseScore: 65,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      },
      {
        name: 'CKAN & NADA Portal Microdata Ingestion',
        domain: 'Technical',
        baseScore: 68,
        refresherId: 'course-open-data',
        refresherTitle: 'Open Government Data Architecture & Metadata Curation'
      },
      {
        name: 'Cybersecurity & DPDP Act Anonymization Protocols',
        domain: 'Digital Governance',
        baseScore: 70,
        refresherId: 'course-data-ethics',
        refresherTitle: 'DPDP Act 2023 & Statistical Confidentiality for Public Officers'
      }
    ]
  },

  'SDG': {
    coreCompetencies: [
      {
        name: 'SDG National Indicator Framework (NIF) Monitoring',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-sdg-indicators',
        refresherTitle: 'SDG National Indicator Framework & Monitoring Methodologies'
      },
      {
        name: 'State Indicator Framework (SIF) & Target 2030 Benchmarking',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-sdg-indicators',
        refresherTitle: 'State Indicator Framework & Target 2030 Benchmarking'
      },
      {
        name: 'Multi-Sectoral Data Harmonization & Administrative Data Gaps',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'course-sdg-indicators',
        refresherTitle: 'Multi-Sectoral Indicator Harmonization'
      },
      {
        name: 'Interactive SDG Dashboard Compilation & Index Computation',
        domain: 'Digital Governance',
        baseScore: 76,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      }
    ],
    technicalSkills: [
      {
        name: 'Data Visualization (Power BI / Interactive Maps)',
        domain: 'Technical',
        baseScore: 66,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      },
      {
        name: 'Python for Index Normalization & Aggregation',
        domain: 'Technical',
        baseScore: 48,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Open Data & SDMX Interoperability',
        domain: 'Technical',
        baseScore: 62,
        refresherId: 'course-open-data',
        refresherTitle: 'Open Government Data Architecture & Metadata Curation'
      },
      {
        name: 'REST APIs for Automated Ministry Feeds',
        domain: 'Technical',
        baseScore: 50,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'REST APIs & Data Exchange in Public Administration'
      }
    ]
  },

  'Social Statistics': {
    coreCompetencies: [
      {
        name: 'Social Indicators Report & Gender Statistics Compilation',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Social Indicators & Gender Statistics Compilation'
      },
      {
        name: 'Time Use Survey (TUS) Methodology & Activity Classification',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Time Use Survey (TUS) Methodological Guidelines'
      },
      {
        name: 'Vital Statistics & Civil Registration System (CRS) Analysis',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Civil Registration System (CRS) & Vital Rates Compilation'
      },
      {
        name: 'Composite Vulnerability & Social Index Formulation',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Social Indices & Vulnerability Mapping'
      }
    ],
    technicalSkills: [
      {
        name: 'SPSS for Social Survey Analysis',
        domain: 'Technical',
        baseScore: 56,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'SPSS & Stata for Socio-Economic Tabulations'
      },
      {
        name: 'Stata for Econometric Social Regressions',
        domain: 'Technical',
        baseScore: 48,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'Stata Microdata Econometric Processing & svyset Procedures'
      },
      {
        name: 'Python for Data Wrangling',
        domain: 'Technical',
        baseScore: 42,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Advanced Excel for Tabular Publications',
        domain: 'Technical',
        baseScore: 82,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      }
    ]
  },

  'Economic Statistics': {
    coreCompetencies: [
      {
        name: 'Index of Industrial Production (IIP) Methodology & Compilation',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-asi-field',
        refresherTitle: 'Index of Industrial Production (IIP) Methodology'
      },
      {
        name: 'Index of Eight Core Industries (ICI) Compilation',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-asi-field',
        refresherTitle: 'Eight Core Industries (ICI) Compilation Norms'
      },
      {
        name: 'Macroeconomic Aggregates & Business Register Maintenance',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Accounts Statistics (NAS): GVA Compilation, SUT & State Income'
      },
      {
        name: 'Statistical Dissemination & Advance Monthly Releases',
        domain: 'Digital Governance',
        baseScore: 75,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Official Releases & Macroeconomic Dissemination'
      }
    ],
    technicalSkills: [
      {
        name: 'Python for Macroeconomic Time Series',
        domain: 'Technical',
        baseScore: 45,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'SQL Database Querying for High-Volume Production Data',
        domain: 'Technical',
        baseScore: 60,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Data Visualization for Policy Briefs',
        domain: 'Technical',
        baseScore: 66,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      },
      {
        name: 'Advanced Excel for Seasonal Adjustment Models',
        domain: 'Technical',
        baseScore: 82,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      }
    ]
  },

  'Enterprise Surveys': {
    coreCompetencies: [
      {
        name: 'Annual Survey of Unincorporated Sector Enterprises (ASUSE)',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-asi-field',
        refresherTitle: 'Annual Survey of Unincorporated Sector Enterprises (ASUSE) Protocols'
      },
      {
        name: 'Informal Economy Estimation & Enterprise Classification',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'course-asi-field',
        refresherTitle: 'Informal Economy Estimation & Enterprise Classification'
      },
      {
        name: 'Enterprise Value Added & Employment Estimation',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'Enterprise Value Added & Employment Estimation'
      }
    ],
    technicalSkills: [
      {
        name: 'SQL Database Querying for Enterprise Register',
        domain: 'Technical',
        baseScore: 62,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Python for Microdata Wrangling & Multipliers',
        domain: 'Technical',
        baseScore: 44,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Statistical Analysis & NSSO Data Processing'
      },
      {
        name: 'Data Processing & Tabulation Execution',
        domain: 'Technical',
        baseScore: 68,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'Automated Tabulation & Official Publication Formatting'
      }
    ]
  },

  'Census/Population': {
    coreCompetencies: [
      {
        name: 'Decennial Population Census Protocols & Listing Methodology',
        domain: 'Statistical',
        baseScore: 84,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Census Protocols & Listing Methodologies'
      },
      {
        name: 'Sample Registration System (SRS) Vital Rates Compilation',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Sample Registration System (SRS) Vital Rates Compilation'
      },
      {
        name: 'Demographic Projections & Life Table Construction',
        domain: 'Statistical',
        baseScore: 75,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Demographic Projections & Life Table Construction'
      }
    ],
    technicalSkills: [
      {
        name: 'SPSS & R for Demographic Rates Calculation',
        domain: 'Technical',
        baseScore: 54,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'SPSS & R for Demographic Rates Calculation'
      },
      {
        name: 'SQL for Population Registry Databases',
        domain: 'Technical',
        baseScore: 65,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Data Visualization for Population Pyramids & Atlases',
        domain: 'Technical',
        baseScore: 68,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      }
    ]
  },

  'Health': {
    coreCompetencies: [
      {
        name: 'National Family Health Survey (NFHS) Survey Protocol',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'NFHS Complex Survey Design & Health Indicators'
      },
      {
        name: 'Health Management Information System (HMIS) Analytics',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'HMIS Analytics & Health Indicator Validation'
      },
      {
        name: 'National Health Accounts & Disease Burden Modeling',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'National Health Accounts & Disease Burden Modeling'
      }
    ],
    technicalSkills: [
      {
        name: 'Stata for Complex Demographic & Health Microdata',
        domain: 'Technical',
        baseScore: 50,
        refresherId: 'course-stata-microdata',
        refresherTitle: 'Stata Microdata Econometric Processing & svyset Procedures'
      },
      {
        name: 'R for Epidemiological Statistical Modeling',
        domain: 'Technical',
        baseScore: 48,
        refresherId: 'course-py-stat',
        refresherTitle: 'Statistical Computing & Epidemiological Modeling'
      },
      {
        name: 'Data Visualization for District Health Atlases',
        domain: 'Technical',
        baseScore: 66,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      }
    ]
  },

  'Education': {
    coreCompetencies: [
      {
        name: 'UDISE+ Educational Statistics & School Census Framework',
        domain: 'Statistical',
        baseScore: 82,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'UDISE+ Educational Statistics & School Census Framework'
      },
      {
        name: 'Gross Enrolment Ratio (GER) & Transition Rate Calculations',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Educational Transition Rates & GER Calculations'
      },
      {
        name: 'All India Survey on Higher Education (AISHE) Analytics',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'AISHE Data Framework & Institutional Modeling'
      }
    ],
    technicalSkills: [
      {
        name: 'Advanced Excel for Institutional Microdata',
        domain: 'Technical',
        baseScore: 84,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      },
      {
        name: 'SQL Database Processing for School Records',
        domain: 'Technical',
        baseScore: 62,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'SQL Relational Queries for Large Survey Datasets'
      },
      {
        name: 'Data Visualization for Educational Progress Maps',
        domain: 'Technical',
        baseScore: 65,
        refresherId: 'course-viz-dashboards',
        refresherTitle: 'Data Visualization & Interactive Storytelling'
      }
    ]
  },

  'Environment': {
    coreCompetencies: [
      {
        name: 'Framework for Development of Environment Statistics (FDES 2013)',
        domain: 'Statistical',
        baseScore: 80,
        refresherId: 'course-sdg-indicators',
        refresherTitle: 'Framework for Development of Environment Statistics (FDES 2013)'
      },
      {
        name: 'Natural Capital Accounting & UN-SEEA Environmental Accounts',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'mospi-nas-gva-402',
        refresherTitle: 'Natural Capital Accounting & UN-SEEA Environmental Accounts'
      },
      {
        name: 'Climate Resilience & Disaster Loss Statistics',
        domain: 'Statistical',
        baseScore: 74,
        refresherId: 'course-sdg-indicators',
        refresherTitle: 'Disaster Loss Statistics & Climate Resilience Indicators'
      }
    ],
    technicalSkills: [
      {
        name: 'R for Environmental Econometrics',
        domain: 'Technical',
        baseScore: 46,
        refresherId: 'course-py-stat',
        refresherTitle: 'Statistical Computing & Environmental Econometrics'
      },
      {
        name: 'Python for Geospatial Raster Data Processing',
        domain: 'Technical',
        baseScore: 44,
        refresherId: 'course-py-stat',
        refresherTitle: 'Python for Geospatial Raster Data Processing'
      },
      {
        name: 'Open Data Standards & Environmental Portals',
        domain: 'Digital Governance',
        baseScore: 68,
        refresherId: 'course-open-data',
        refresherTitle: 'Open Government Data Architecture & Metadata Curation'
      }
    ]
  },

  'Survey Design': {
    coreCompetencies: [
      {
        name: 'Survey Instrument Conceptualization & Cognitive Pre-testing',
        domain: 'Statistical',
        baseScore: 84,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Induction & Refresher in Multi-Stage Stratified Sampling & NSSO Survey Design'
      },
      {
        name: 'CAPI Questionnaire Logic, Skips & Consistency Check Rules',
        domain: 'Digital Governance',
        baseScore: 80,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'CAPI Validation Specifications & Logic Check Programming'
      },
      {
        name: 'Tabulation Plan & Classification System Harmonization',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'nssta-trg-2025-01',
        refresherTitle: 'Tabulation Plan Execution & Official Publication Formatting'
      },
      {
        name: 'Pilot Testing Protocols & Non-Sampling Error Prevention',
        domain: 'Statistical',
        baseScore: 76,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'Pilot Testing & Non-Sampling Error Prevention Protocols'
      }
    ],
    technicalSkills: [
      {
        name: 'APIs for Survey Specifications Exchange',
        domain: 'Technical',
        baseScore: 50,
        refresherId: 'course-sql-analytics',
        refresherTitle: 'REST APIs & Data Exchange in Public Administration'
      },
      {
        name: 'Data Quality Audit Protocols',
        domain: 'Statistical',
        baseScore: 78,
        refresherId: 'course-sampling-refresher',
        refresherTitle: 'MoSPI Data Quality Framework & Non-Sampling Error Audit'
      },
      {
        name: 'Advanced Excel for Codebook Architecture',
        domain: 'Technical',
        baseScore: 82,
        refresherId: 'course-excel-stats',
        refresherTitle: 'Power Query & Advanced Statistical Modeling in Excel'
      }
    ]
  }
};

// General / Cross-Cutting Competencies (Available across all cadres as "Additional Skills")
const GENERAL_ADDITIONAL_COMPETENCIES: DomainSkillSpec[] = [
  {
    name: 'Public Sector Ethics & Data Stewardship (DPDP Act 2023)',
    domain: 'Behavioural & Managerial',
    baseScore: 88,
    refresherId: 'course-data-ethics',
    refresherTitle: 'DPDP Act 2023 & Statistical Confidentiality for Public Officers',
    decayReason: 'Statutory bi-annual compliance requirement under DPDP Act 2023.'
  },
  {
    name: 'Administrative Governance & Government Office Procedures',
    domain: 'Behavioural & Managerial',
    baseScore: 82,
    refresherId: 'course-data-ethics',
    refresherTitle: 'Central Secretariat Manual of Office Procedure (CSMOP)'
  },
  {
    name: 'Generative AI & Modern Public Productivity Tools',
    domain: 'Digital Governance',
    baseScore: 50,
    refresherId: 'course-ai-llm-gov',
    refresherTitle: 'Generative AI & Data Governance in Statistical Registries',
    decayReason: 'Rapidly evolving AI tooling guidelines across Ministry departments.'
  },
  {
    name: 'Cybersecurity & Digital Workplace Standards',
    domain: 'Digital Governance',
    baseScore: 68,
    refresherId: 'course-data-ethics',
    refresherTitle: 'Cybersecurity Hygiene & CERT-In Information Security Guidelines'
  }
];

export class CompetencyEngine {
  /**
   * Resolves the primary statistical domain based on:
   * 1. Direct user input (if provided and valid)
   * 2. Department name matching against Central and State statistical organizations
   * 3. Default fallback to 'Household Surveys'
   */
  public static resolveDomain(input: CompetencyEngineInput): string {
    if (input.statisticalDomain && DOMAIN_COMPETENCY_REGISTRY[input.statisticalDomain]) {
      return input.statisticalDomain;
    }

    // Try finding domain match in department description or primaryDomains
    const deptLower = (input.department || '').toLowerCase();
    const orgLower = (input.organization || '').toLowerCase();

    // Check central departments
    for (const org of CENTRAL_STATISTICAL_ORGANIZATIONS) {
      for (const dept of org.departments) {
        if (deptLower.includes(dept.name.toLowerCase()) || deptLower.includes(dept.code.toLowerCase()) || dept.name.toLowerCase().includes(deptLower)) {
          if (dept.primaryDomains && dept.primaryDomains.length > 0) {
            const matched = dept.primaryDomains.find(d => DOMAIN_COMPETENCY_REGISTRY[d]);
            if (matched) return matched;
          }
        }
      }
    }

    // Check state departments
    for (const org of STATE_UT_STATISTICAL_ORGANIZATIONS) {
      for (const dept of org.departments) {
        if (deptLower.includes(dept.name.toLowerCase()) || deptLower.includes(dept.code.toLowerCase()) || dept.name.toLowerCase().includes(deptLower)) {
          if (dept.primaryDomains && dept.primaryDomains.length > 0) {
            const matched = dept.primaryDomains.find(d => DOMAIN_COMPETENCY_REGISTRY[d]);
            if (matched) return matched;
          }
        }
      }
    }

    // Keyword heuristics
    if (deptLower.includes('national account') || deptLower.includes('state income') || deptLower.includes('sdp') || deptLower.includes('gdp') || orgLower.includes('national accounts')) {
      return 'National Accounts';
    }
    if (deptLower.includes('labour') || deptLower.includes('plfs') || deptLower.includes('employment') || orgLower.includes('labour bureau')) {
      return 'Labour Statistics';
    }
    if (deptLower.includes('price') || deptLower.includes('cpi') || deptLower.includes('wpi') || deptLower.includes('cost of living')) {
      return 'Price Statistics';
    }
    if (deptLower.includes('industr') || deptLower.includes('asi') || deptLower.includes('factory')) {
      return 'Industrial Statistics';
    }
    if (deptLower.includes('agri') || deptLower.includes('crop') || deptLower.includes('gces') || deptLower.includes('sasa')) {
      return 'Agricultural Statistics';
    }
    if (deptLower.includes('sampling') || deptLower.includes('sdrd') || deptLower.includes('methodolog')) {
      return 'Sampling';
    }
    if (deptLower.includes('data quality') || deptLower.includes('scrutiny') || deptLower.includes('audit')) {
      return 'Data Quality';
    }
    if (deptLower.includes('data process') || deptLower.includes('computer') || deptLower.includes('diid')) {
      return 'Data Processing';
    }
    if (deptLower.includes('disseminat') || deptLower.includes('warehouse') || deptLower.includes('ndw')) {
      return 'Data Dissemination';
    }
    if (deptLower.includes('sdg') || deptLower.includes('dmeo') || deptLower.includes('niti')) {
      return 'SDG';
    }
    if (deptLower.includes('field') || deptLower.includes('fod') || deptLower.includes('dso') || deptLower.includes('regional office')) {
      return 'Household Surveys';
    }

    return 'Household Surveys';
  }

  /**
   * Evaluates competencies dynamically based on:
   * Organization → Department → Designation/Cadre → Work Domain → Required Competencies & Skills
   */
  public static evaluate(input: CompetencyEngineInput): CompetencyItem[] {
    const isSeniorOrISS =
      (input.designation && (
        input.designation.includes('Director') ||
        input.designation.includes('DDG') ||
        input.designation.includes('ADG') ||
        input.designation.includes('DG') ||
        input.designation.includes('Joint Director') ||
        input.designation.includes('Deputy Director')
      )) ||
      (input.cadre && (input.cadre.includes('ISS') || input.cadre.includes('Indian Statistical Service')));

    const primaryDomain = this.resolveDomain(input);
    const domainData = DOMAIN_COMPETENCY_REGISTRY[primaryDomain] || DOMAIN_COMPETENCY_REGISTRY['Household Surveys'];

    // Collect domain-specific required items
    const requiredItems: Array<{ spec: DomainSkillSpec; isRequired: boolean; category: 'REQUIRED' | 'ADDITIONAL' }> = [];

    // 1. Domain-specific core competencies (MANDATORY / REQUIRED)
    domainData.coreCompetencies.forEach((spec) => {
      requiredItems.push({ spec, isRequired: true, category: 'REQUIRED' });
    });

    // 2. Domain-specific technical skills (MANDATORY / REQUIRED)
    domainData.technicalSkills.forEach((spec) => {
      requiredItems.push({ spec, isRequired: true, category: 'REQUIRED' });
    });

    // 3. User Self-Declared / Additional Skills (NOT automatically required, NOT automatically verified)
    if (input.selectedSkills && input.selectedSkills.length > 0) {
      input.selectedSkills.forEach((skillName) => {
        // Only add if not already in required list
        const exists = requiredItems.some((item) => item.spec.name.toLowerCase() === skillName.toLowerCase());
        if (!exists) {
          requiredItems.push({
            spec: {
              name: skillName,
              domain: 'Technical',
              baseScore: input.selfAssessedSkills?.[skillName] || 50,
              refresherId: 'nssta-ds-python-603',
              refresherTitle: 'Data Science & Statistical Computing Refresher',
              decayReason: 'Self-declared additional capability; requires official baseline diagnostic.'
            },
            isRequired: false,
            category: 'ADDITIONAL'
          });
        }
      });
    }

    // 4. Cross-cutting universal public service standards (ADDITIONAL)
    GENERAL_ADDITIONAL_COMPETENCIES.forEach((spec) => {
      const exists = requiredItems.some((item) => item.spec.name.toLowerCase() === spec.name.toLowerCase());
      if (!exists) {
        requiredItems.push({ spec, isRequired: false, category: 'ADDITIONAL' });
      }
    });

    const result: CompetencyItem[] = [];

    requiredItems.forEach(({ spec, isRequired, category }, index) => {
      const id = `comp-${primaryDomain.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index + 1}`;
      let baseScore = spec.baseScore;
      let selfAssessedScore: number | undefined = undefined;
      let diagnosticScore: number | undefined = undefined;
      let verifiedScore: number | undefined = undefined;
      let verification: 'SELF-ASSESSED' | 'SYSTEM-VERIFIED' = 'SELF-ASSESSED';
      let verificationStatus: 'SELF-ASSESSED' | 'DIAGNOSTIC' | 'VERIFIED' = 'SELF-ASSESSED';
      let confidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
      let evidence = isRequired
        ? `Mandatory requirement for ${input.designation || 'Statistical Cadre'} in ${primaryDomain} domain.`
        : `Self-declared additional competency candidate.`;

      // 1. Target Score Calculation (Senior/ISS officers have higher benchmarks for leadership)
      let targetScore = 80;
      if (isSeniorOrISS) {
        targetScore = spec.domain === 'Statistical' ? 95 : spec.domain === 'Behavioural & Managerial' ? 92 : 88;
      } else {
        targetScore = spec.domain === 'Statistical' ? 90 : spec.domain === 'Technical' ? 80 : 85;
      }

      // 2. Experience context (influences target benchmark expectations rather than inflating score)
      if (input.experienceYears > 5 && isSeniorOrISS) {
        targetScore = Math.min(98, targetScore + 2);
      }

      // 3. User Self-Assessed Input
      if (input.selfAssessedSkills) {
        if (input.selfAssessedSkills[spec.name] !== undefined) {
          selfAssessedScore = input.selfAssessedSkills[spec.name];
          baseScore = selfAssessedScore;
          evidence = `Self-appraisal submitted: ${selfAssessedScore}/100. Pending official NSSTA assessment.`;
        } else if (spec.domain === 'Statistical' && input.selfAssessedSkills['Statistical'] !== undefined) {
          selfAssessedScore = Math.round((baseScore + input.selfAssessedSkills['Statistical']) / 2);
          baseScore = selfAssessedScore;
        } else if (spec.domain === 'Technical' && input.selfAssessedSkills['Technical'] !== undefined) {
          selfAssessedScore = Math.round((baseScore + input.selfAssessedSkills['Technical']) / 2);
          baseScore = selfAssessedScore;
        }
      }

      // 4. Assessment History Validation (Official Verified Evidence)
      if (input.assessmentHistory && input.assessmentHistory.length > 0) {
        const matching = input.assessmentHistory.find(
          (a) => a.competencyName.toLowerCase() === spec.name.toLowerCase() || spec.name.toLowerCase().includes(a.competencyName.toLowerCase())
        );
        if (matching) {
          verifiedScore = matching.score;
          baseScore = matching.score;
          verification = 'SYSTEM-VERIFIED';
          verificationStatus = 'VERIFIED';
          confidence = 'HIGH';
          evidence = `Officially verified in NSSTA assessment (${matching.date || 'Recent Cycle'}, Score: ${matching.score}%).`;
        }
      }

      // If not officially verified, it strictly remains SELF-ASSESSED
      if (!verifiedScore) {
        verification = 'SELF-ASSESSED';
        verificationStatus = 'SELF-ASSESSED';
        confidence = selfAssessedScore ? 'MEDIUM' : 'LOW';
      }

      // 5. Calculate Temporal Decay Risk (Projection / Estimate)
      const decayMonthly = spec.domain === 'Technical' ? 2.5 : spec.domain === 'Digital Governance' ? 3.5 : 2.0;
      const proj3m = Math.max(10, Math.round(baseScore - decayMonthly * 3));
      const proj6m = Math.max(10, Math.round(baseScore - decayMonthly * 6));
      const proj12m = Math.max(10, Math.round(baseScore - decayMonthly * 12));
      const isAtRisk = proj6m < 60 || (baseScore - proj6m >= 14);

      result.push({
        id,
        name: spec.name,
        domain: spec.domain,
        currentScore: baseScore,
        targetScore,
        verification,
        verificationStatus,
        selfAssessedScore,
        diagnosticScore,
        verifiedScore,
        confidence,
        evidence,
        category,
        isRequired,
        statisticalDomain: isRequired ? primaryDomain : 'General / Additional',
        decayRisk: {
          isAtRisk,
          projected3m: proj3m,
          projected6m: proj6m,
          projected12m: proj12m,
          lastAssessed: verification === 'SYSTEM-VERIFIED' ? 'Verified cycle' : 'Self-assessment only (Unverified)',
          refresherCourseId: spec.refresherId,
          refresherTitle: spec.refresherTitle,
          decayReason: spec.decayReason || (isAtRisk
            ? `Estimated skill retention risk based on elapsed time without practical verification.`
            : `Proficiency baseline steady; periodic refresher recommended.`)
        }
      });
    });

    return result;
  }

  /**
   * AI Skill Gap Engine (FRAC Metamodel):
   * Compares current vs target competency, calculates delta, groups by BDF typology.
   */
  public static analyzeGaps(competencies: CompetencyItem[], targetBenchmark: number = 80) {
    const gaps = competencies.map((comp) => {
      const current = comp.currentScore;
      const target = comp.targetScore || targetBenchmark;
      const delta = Math.max(0, target - current);

      let severity: 'CRITICAL' | 'MODERATE' | 'COMPETENT' = 'COMPETENT';
      if (delta >= 25) {
        severity = 'CRITICAL';
      } else if (delta >= 10) {
        severity = 'MODERATE';
      }

      let bdfCategory: 'Domain (D)' | 'Functional (F)' | 'Behavioural (B)' = 'Domain (D)';
      if (comp.domain === 'Technical' || comp.domain === 'Digital Governance') {
        bdfCategory = 'Functional (F)';
      } else if (comp.domain === 'Behavioural & Managerial') {
        bdfCategory = 'Behavioural (B)';
      }

      const recommendedCourse = {
        courseId: comp.decayRisk?.refresherCourseId || 'course-py-stat',
        title: comp.decayRisk?.refresherTitle || 'Python for Statistical Analysis & NSSO Data Processing',
        provider: 'NSSTA TPAC / iGOT Karmayogi',
        expectedLift: delta > 0 ? `+${Math.min(25, Math.round(delta * 0.8))}%` : '+5%',
      };

      return {
        competencyId: comp.id,
        competencyName: comp.name,
        domain: comp.domain,
        category: comp.category || 'REQUIRED',
        isRequired: comp.isRequired ?? true,
        statisticalDomain: comp.statisticalDomain || 'General',
        bdfCategory,
        currentScore: current,
        targetScore: target,
        gapDelta: delta,
        severity,
        verificationStatus: comp.verification,
        recommendedCourse,
        targetDate: severity === 'CRITICAL' ? 'Within 30 Days' : severity === 'MODERATE' ? 'Within 60 Days' : 'Routine Refresher (Annual)',
        priorityRank: severity === 'CRITICAL' ? 1 : severity === 'MODERATE' ? 2 : 3,
      };
    });

    // Sort by priority: Mandatory required competencies first, then severity priority rank, then largest gap delta
    gaps.sort((a, b) => {
      if (a.isRequired !== b.isRequired) {
        return a.isRequired ? -1 : 1;
      }
      if (a.priorityRank !== b.priorityRank) {
        return a.priorityRank - b.priorityRank;
      }
      return b.gapDelta - a.gapDelta;
    });

    const criticalCount = gaps.filter((g) => g.severity === 'CRITICAL').length;
    const moderateCount = gaps.filter((g) => g.severity === 'MODERATE').length;
    const competentCount = gaps.filter((g) => g.severity === 'COMPETENT').length;

    const overallCurrentAvg = Math.round(
      competencies.reduce((acc, c) => acc + c.currentScore, 0) / (competencies.length || 1)
    );
    const overallTargetAvg = Math.round(
      competencies.reduce((acc, c) => acc + (c.targetScore || targetBenchmark), 0) / (competencies.length || 1)
    );

    return {
      evaluatedAt: new Date().toISOString(),
      overallReadiness: overallCurrentAvg,
      targetBenchmark: overallTargetAvg,
      totalCompetencies: competencies.length,
      summary: {
        criticalGaps: criticalCount,
        moderateGaps: moderateCount,
        competentCount: competentCount,
      },
      bdfBreakdown: {
        domain: gaps.filter((g) => g.bdfCategory === 'Domain (D)').length,
        functional: gaps.filter((g) => g.bdfCategory === 'Functional (F)').length,
        behavioural: gaps.filter((g) => g.bdfCategory === 'Behavioural (B)').length,
      },
      gaps,
    };
  }
}
