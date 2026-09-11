/**
 * India-wide Official Statistical System Master / Reference Data
 * Sourced from MoSPI, NSSTA, National Statistical Commission (NSC) Framework, and State DES Directory.
 *
 * Strictly master/reference data - no fake real-person identities.
 */

export type GovernanceTier = 'Central Government' | 'State Government' | 'Union Territory';

export interface StatisticalOrganization {
  id: string;
  name: string;
  shortCode: string;
  tier: GovernanceTier;
  stateOrUt?: string;
  headquarters: string;
  cadres: string[];
  departments: StatisticalDepartment[];
}

export interface StatisticalDepartment {
  id: string;
  name: string;
  code: string;
  description: string;
  subUnits?: string[];
  primaryDomains: string[];
}

export interface StatisticalDesignation {
  id: string;
  title: string;
  shortCode: string;
  group: 'Group A (Gazetted)' | 'Group B (Gazetted)' | 'Group B (Non-Gazetted)' | 'Group C';
  applicableTiers: GovernanceTier[];
  typicalCadres: string[];
  level: number; // 1 to 10 seniority hierarchy
}

export interface StatisticalDomainMaster {
  id: string;
  name: string;
  category: 'Macro & Economic' | 'Social & Demographic' | 'Field & Methodological' | 'Technology & Data Management';
  description: string;
  coreSurveysOrFrameworks: string[];
  recommendedTechnicalSkills: string[];
}

export interface TechnicalCompetencyMaster {
  id: string;
  name: string;
  category: 'Programming & Computing' | 'Specialized Statistical Software' | 'Data Infrastructure & Cloud' | 'Advanced AI & Modern Data Stack' | 'Security & Governance';
  description: string;
  proficiencyLevels: ('Foundational' | 'Intermediate' | 'Advanced')[];
  associatedTools: string[];
}

export interface TrainingOrganizationMaster {
  id: string;
  name: string;
  shortCode: string;
  type: 'Central Apex Academy' | 'National Civil Service Platform' | 'Statistical Research Institute' | 'Civil Service Institute' | 'State Training Institute';
  location: string;
  portalUrl: string;
  description: string;
}

// -----------------------------------------------------------------------------
// 1. CENTRAL GOVERNMENT STATISTICAL ORGANIZATIONS
// -----------------------------------------------------------------------------
export const CENTRAL_STATISTICAL_ORGANIZATIONS: StatisticalOrganization[] = [
  {
    id: 'mospi-nso',
    name: 'Ministry of Statistics and Programme Implementation (MoSPI) / National Statistical Office (NSO)',
    shortCode: 'MoSPI / NSO',
    tier: 'Central Government',
    headquarters: 'New Delhi (Khurshid Lal Bhawan & Sankhyiki Bhawan)',
    cadres: [
      'Indian Statistical Service (ISS)',
      'Subordinate Statistical Service (SSS)',
      'General Central Service (Statistical / IT)',
    ],
    departments: [
      {
        id: 'nso-fod',
        name: 'Field Operations Division (FOD)',
        code: 'FOD',
        description: 'Nationwide field network across 6 Zonal & 53 Regional Offices responsible for socio-economic surveys (PLFS, ASI, ASUSE).',
        subUnits: ['Zonal Offices', 'Regional Offices (RO)', 'Sub-Regional Offices (SRO)', 'Urban Frame Survey (UFS) Units'],
        primaryDomains: ['Household Surveys', 'Industrial Statistics', 'Data Collection', 'Sampling Methodology'],
      },
      {
        id: 'nso-nad',
        name: 'National Accounts Division (NAD)',
        code: 'NAD',
        description: 'Compilation of National Accounts, Gross Domestic Product (GDP), Gross Value Added (GVA), and Supply-Use Tables.',
        subUnits: ['GDP Compilation Wing', 'Public Sector Accounts', 'Consolidated Capital Formation', 'State Accounts Coordination'],
        primaryDomains: ['National Accounts', 'Economic Statistics', 'Data Processing'],
      },
      {
        id: 'nso-esd',
        name: 'Economic Statistics Division (ESD)',
        code: 'ESD',
        description: 'Compilation of Index of Industrial Production (IIP), Annual Survey of Industries (ASI) processing, and Economic Census.',
        subUnits: ['IIP Unit', 'ASI Processing Wing', 'Business Register Unit', 'Economic Census Coordination'],
        primaryDomains: ['Economic Statistics', 'Industrial Statistics', 'Enterprise Surveys'],
      },
      {
        id: 'nso-ssd',
        name: 'Social Statistics Division (SSD)',
        code: 'SSD',
        description: 'Monitoring of Sustainable Development Goals (SDG-NIF), Gender Statistics, Environment Statistics, and Social Indicators.',
        subUnits: ['SDG Monitoring Unit', 'EnviStats & Green Accounting Cell', 'Social Statistics Publications', 'Time Use Survey Wing'],
        primaryDomains: ['Social Statistics', 'SDG', 'Environment Statistics', 'Health Statistics'],
      },
      {
        id: 'nso-diid',
        name: 'Data Informatics and Innovation Division (DIID)',
        code: 'DIID',
        description: 'Modernization of statistical architecture, cloud infrastructure, AI/ML adoption, and National Data Warehouse dissemination.',
        subUnits: ['AI & Modern Analytics Cell', 'Data Warehouse & Dissemination Unit', 'CAPI & Survey Software Systems', 'Cloud & Cyber Infrastructure'],
        primaryDomains: ['Data Dissemination', 'Data Processing', 'Data Quality', 'Survey Design'],
      },
      {
        id: 'nso-sdrd',
        name: 'Survey Design and Research Division (SDRD)',
        code: 'SDRD',
        description: 'Formulation of sampling designs, questionnaire concepts, definitions, and technical reports for all NSS rounds.',
        subUnits: ['Sampling Frame Formulation', 'Questionnaire Design Lab', 'Tabulation Planning Cell', 'Technical Scrutiny Desk'],
        primaryDomains: ['Sampling Methodology', 'Survey Design', 'Data Quality'],
      },
      {
        id: 'nso-cpd',
        name: 'Coordination and Publication Division (CPD)',
        code: 'CPD',
        description: 'International statistical coordination (UNSD, SAARC), publication of Statistical Year Book, and Parliamentary interfaces.',
        subUnits: ['International Coordination Wing', 'Statistical Standards & Metadata Unit', 'Statistical Publications Bureau'],
        primaryDomains: ['Data Dissemination', 'Social Statistics'],
      },
      {
        id: 'nso-price',
        name: 'Price Statistics Division (PSD)',
        code: 'PSD',
        description: 'Monthly compilation and dissemination of Consumer Price Index (CPI) Rural, Urban, and Combined.',
        subUnits: ['Retail Price Analysis Cell', 'Price Imputation & Quality Adjustment Lab', 'House Rent Survey Unit'],
        primaryDomains: ['Price Statistics', 'Economic Statistics', 'Data Quality'],
      },
    ],
  },
  {
    id: 'min-agri-des',
    name: 'Ministry of Agriculture & Farmers Welfare — Directorate of Economics & Statistics (DES)',
    shortCode: 'MoA&FW / DES',
    tier: 'Central Government',
    headquarters: 'Krishi Bhawan, New Delhi',
    cadres: ['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)', 'Departmental Statistical Cadre'],
    departments: [
      {
        id: 'agri-crop-stats',
        name: 'Agricultural Statistics & Crop Forecast Division',
        code: 'ASCFD',
        description: 'Advance estimates of area and production of principal foodgrain and commercial crops, GCES validation.',
        primaryDomains: ['Agricultural Statistics', 'Sampling Methodology', 'Data Collection'],
      },
      {
        id: 'agri-census-wing',
        name: 'Agriculture Census & Land Use Division',
        code: 'ACLD',
        description: 'Quinquennial Agriculture Census, Input Survey, and operational holding distributions.',
        primaryDomains: ['Agricultural Statistics', 'Census / Population', 'Enterprise Surveys'],
      },
    ],
  },
  {
    id: 'min-commerce-oea',
    name: 'Ministry of Commerce & Industry — Office of Economic Adviser (OEA / DPIIT) & DGCI&S',
    shortCode: 'MoC&I / OEA & DGCI&S',
    tier: 'Central Government',
    headquarters: 'Udyog Bhawan, New Delhi & Kolkata',
    cadres: ['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)', 'Departmental Statistical Cadre'],
    departments: [
      {
        id: 'oea-wpi-division',
        name: 'Wholesale Price Index (WPI) & Core Industries Division',
        code: 'WPI-CID',
        description: 'Compilation of monthly WPI and Index of Eight Core Industries (ICI).',
        primaryDomains: ['Price Statistics', 'Economic Statistics', 'Industrial Statistics'],
      },
      {
        id: 'dgcis-foreign-trade',
        name: 'Directorate General of Commercial Intelligence and Statistics (DGCI&S)',
        code: 'DGCI&S',
        description: 'Official repository and compiler of India merchandise export-import foreign trade statistics.',
        primaryDomains: ['Economic Statistics', 'Data Dissemination', 'Data Processing'],
      },
    ],
  },
  {
    id: 'min-labour-bureau',
    name: 'Ministry of Labour & Employment — Labour Bureau',
    shortCode: 'MoL&E / Labour Bureau',
    tier: 'Central Government',
    headquarters: 'Chandigarh & Shimla',
    cadres: ['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)', 'Labour Bureau Cadre'],
    departments: [
      {
        id: 'lb-cpi-iw',
        name: 'Consumer Price Index for Industrial Workers (CPI-IW) Division',
        code: 'CPI-IW',
        description: 'Compilation of CPI-IW, CPI-AL (Agricultural Labourers), and CPI-RL (Rural Labourers).',
        primaryDomains: ['Price Statistics', 'Labour Statistics'],
      },
      {
        id: 'lb-employment-surveys',
        name: 'All-India Surveys & Wage Statistics Division',
        code: 'AISWSD',
        description: 'Quarterly Employment Survey (QES), All India Survey on Migrant Workers, and Occupational Wage Survey.',
        primaryDomains: ['Labour Statistics', 'Household Surveys', 'Enterprise Surveys'],
      },
    ],
  },
  {
    id: 'min-health-stats',
    name: 'Ministry of Health & Family Welfare — Statistics & HMIS Division',
    shortCode: 'MoHFW / Stats & HMIS',
    tier: 'Central Government',
    headquarters: 'Nirman Bhawan, New Delhi',
    cadres: ['Indian Statistical Service (ISS)', 'Subordinate Statistical Service (SSS)'],
    departments: [
      {
        id: 'hmis-division',
        name: 'Health Management Information System (HMIS) & NFHS Cell',
        code: 'HMIS-NFHS',
        description: 'Facilitation of National Family Health Survey (NFHS), facility data compilation, and National Health Accounts.',
        primaryDomains: ['Health Statistics', 'Social Statistics', 'Household Surveys'],
      },
    ],
  },
  {
    id: 'min-finance-dea',
    name: 'Ministry of Finance — Department of Economic Affairs & Department of Revenue',
    shortCode: 'MoF / DEA & DoR',
    tier: 'Central Government',
    headquarters: 'North Block, New Delhi',
    cadres: ['Indian Statistical Service (ISS)', 'Indian Economic Service (IES)', 'Subordinate Statistical Service (SSS)'],
    departments: [
      {
        id: 'dea-economic-div',
        name: 'Economic Division (Economic Survey Compilation Desk)',
        code: 'ECON-SURV',
        description: 'Macro-fiscal modeling, public finance database, and Economic Survey drafting support.',
        primaryDomains: ['National Accounts', 'Economic Statistics'],
      },
      {
        id: 'dor-tax-research',
        name: 'Tax Research Unit & Revenue Statistics Cell',
        code: 'TRU-REV',
        description: 'Direct and indirect (GST) tax revenue data analysis, buoyancy models, and microdata processing.',
        primaryDomains: ['Economic Statistics', 'Data Processing'],
      },
    ],
  },
  {
    id: 'rbi-dsim',
    name: 'Reserve Bank of India — Department of Statistics and Information Management (DSIM)',
    shortCode: 'RBI / DSIM',
    tier: 'Central Government',
    headquarters: 'Central Office, Mumbai',
    cadres: ['RBI Statistical Cadre', 'Research Officers (DSIM)'],
    departments: [
      {
        id: 'rbi-macro-modeling',
        name: 'Monetary Statistics & Inflation Expectation Surveys Wing',
        code: 'MS-IES',
        description: 'Conducting Consumer Confidence Surveys (CCS), Inflation Expectations Survey of Households (IESH), and flow of funds.',
        primaryDomains: ['Economic Statistics', 'Price Statistics', 'Household Surveys'],
      },
    ],
  },
  {
    id: 'niti-aayog-dmeo',
    name: 'NITI Aayog — Development Monitoring and Evaluation Office (DMEO)',
    shortCode: 'NITI / DMEO',
    tier: 'Central Government',
    headquarters: 'NITI Bhawan, New Delhi',
    cadres: ['Indian Statistical Service (ISS)', 'Lateral Statistical Experts'],
    departments: [
      {
        id: 'dmeo-eval-wing',
        name: 'Data & Evaluation Governance Division',
        code: 'DEGD',
        description: 'Data Governance Quality Index (DGQI), Output-Outcome Monitoring Framework (OOMF), and Centrally Sponsored Scheme evaluations.',
        primaryDomains: ['Data Quality', 'SDG', 'Social Statistics'],
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// 2. STATE / UT STATISTICAL ORGANIZATIONS (All 28 States & 8 UTs)
// -----------------------------------------------------------------------------
export const STATE_UT_NAMES = [
  // 28 States
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // 8 Union Territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const STATE_UT_STATISTICAL_ORGANIZATIONS: StatisticalOrganization[] = [
  {
    id: 'state-up-des',
    name: 'Directorate of Economics & Statistics, Government of Uttar Pradesh',
    shortCode: 'UP DES',
    tier: 'State Government',
    stateOrUt: 'Uttar Pradesh',
    headquarters: 'Lucknow',
    cadres: ['State Statistical Service (SSS-UP)', 'District Statistical Cadre'],
    departments: [
      {
        id: 'up-sdp-div',
        name: 'State Domestic Product (SDP) & National Accounts Wing',
        code: 'UP-SDP',
        description: 'Compilation of GSDP, District Domestic Product (DDP), and Gross Capital Formation.',
        primaryDomains: ['National Accounts', 'Economic Statistics'],
      },
      {
        id: 'up-dso-network',
        name: 'District Statistical Offices (DSO Network - 75 Districts)',
        code: 'UP-DSO',
        description: 'District level data collection, crop cutting experiments, and block level data coordination.',
        primaryDomains: ['Data Collection', 'Agricultural Statistics', 'Household Surveys'],
      },
      {
        id: 'up-crs-vital',
        name: 'Vital Statistics & Civil Registration System (CRS) Division',
        code: 'UP-CRS',
        description: 'Registration of births and deaths, infant mortality rates and vital indices.',
        primaryDomains: ['Social Statistics', 'Census / Population'],
      },
    ],
  },
  {
    id: 'state-mh-des',
    name: 'Directorate of Economics and Statistics, Government of Maharashtra',
    shortCode: 'Maharashtra DES',
    tier: 'State Government',
    stateOrUt: 'Maharashtra',
    headquarters: 'Mumbai',
    cadres: ['Maharashtra Statistical Service (MSS)', 'Subordinate Statistical Cadre'],
    departments: [
      {
        id: 'mh-sdp-div',
        name: 'State Income & National Accounts Branch',
        code: 'MH-SDP',
        description: 'Gross and Net State Domestic Product, District Income Estimates.',
        primaryDomains: ['National Accounts', 'Economic Statistics'],
      },
      {
        id: 'mh-survey-div',
        name: 'Socio-Economic Surveys & NSS State Sample Wing',
        code: 'MH-NSS',
        description: 'Independent matching state sample collection for NSS socio-economic rounds.',
        primaryDomains: ['Household Surveys', 'Sampling Methodology', 'Data Quality'],
      },
      {
        id: 'mh-dso-network',
        name: 'District Statistical Offices (36 Districts of Maharashtra)',
        code: 'MH-DSO',
        description: 'District Statistical Yearbooks, Regional economic planning and village directory maintenance.',
        primaryDomains: ['Data Collection', 'Data Dissemination'],
      },
    ],
  },
  {
    id: 'state-ka-des',
    name: 'Directorate of Economics and Statistics, Government of Karnataka',
    shortCode: 'Karnataka DES',
    tier: 'State Government',
    stateOrUt: 'Karnataka',
    headquarters: 'Bengaluru (MS Building)',
    cadres: ['Karnataka State Statistical Service', 'District Statistical Officers Cadre'],
    departments: [
      {
        id: 'ka-state-income',
        name: 'State Income and Public Finance Division',
        code: 'KA-SID',
        description: 'GSDP estimation and Economic Survey of Karnataka drafting.',
        primaryDomains: ['National Accounts', 'Economic Statistics'],
      },
      {
        id: 'ka-agri-stats',
        name: 'State Agriculture Statistics Authority (SASA Karnataka)',
        code: 'KA-SASA',
        description: 'General Crop Estimation Surveys (GCES) and Timely Reporting Scheme (TRS).',
        primaryDomains: ['Agricultural Statistics', 'Sampling Methodology'],
      },
    ],
  },
  {
    id: 'state-tn-des',
    name: 'Department of Economics and Statistics, Government of Tamil Nadu',
    shortCode: 'Tamil Nadu DES',
    tier: 'State Government',
    stateOrUt: 'Tamil Nadu',
    headquarters: 'Chennai (Teynampet)',
    cadres: ['Tamil Nadu Statistics Service', 'Tamil Nadu Statistics Subordinate Service'],
    departments: [
      {
        id: 'tn-sdp-wing',
        name: 'State Income & Economic Indicators Wing',
        code: 'TN-SIEI',
        description: 'Tamil Nadu GSDP, District Domestic Product, and Index of Industrial Production.',
        primaryDomains: ['National Accounts', 'Industrial Statistics'],
      },
      {
        id: 'tn-price-index',
        name: 'Price Statistics and Cost of Living Division',
        code: 'TN-PRICE',
        description: 'Compilation of Working Class Consumer Price Index for Tamil Nadu urban & rural centers.',
        primaryDomains: ['Price Statistics', 'Labour Statistics'],
      },
    ],
  },
  {
    id: 'state-wb-baes',
    name: 'Bureau of Applied Economics and Statistics, Government of West Bengal',
    shortCode: 'West Bengal BAES',
    tier: 'State Government',
    stateOrUt: 'West Bengal',
    headquarters: 'Kolkata (Salt Lake)',
    cadres: ['West Bengal Statistical Service (WBSS)', 'West Bengal Subordinate Statistical Service'],
    departments: [
      {
        id: 'wb-state-income',
        name: 'State Income and Economic Research Division',
        code: 'WB-SIER',
        description: 'Compilation of West Bengal GSDP, input-output tables, and district accounts.',
        primaryDomains: ['National Accounts', 'Economic Statistics'],
      },
      {
        id: 'wb-dso-wing',
        name: 'District Statistical Offices (23 Districts)',
        code: 'WB-DSO',
        description: 'District Statistical Handbooks and NSS matching sample surveys.',
        primaryDomains: ['Household Surveys', 'Data Collection'],
      },
    ],
  },
  {
    id: 'ut-delhi-des',
    name: 'Directorate of Economics and Statistics, Government of NCT of Delhi',
    shortCode: 'Delhi DES',
    tier: 'Union Territory',
    stateOrUt: 'Delhi (NCT)',
    headquarters: 'Vikas Bhawan-II, Civil Lines, Delhi',
    cadres: ['Delhi Statistical Service (Planning & Statistical Cadre)', 'UT Subordinate Cadre'],
    departments: [
      {
        id: 'delhi-sdp-cell',
        name: 'Gross State Domestic Product & Economic Survey of Delhi Unit',
        code: 'DEL-SDP',
        description: 'Economy of Delhi publication, GSDP, per capita income, and urban service surveys.',
        primaryDomains: ['National Accounts', 'Economic Statistics', 'Social Statistics'],
      },
      {
        id: 'delhi-vital-stats',
        name: 'Vital Statistics & Chief Registrar of Births and Deaths Wing',
        code: 'DEL-CRBD',
        description: 'Digitized registration of civil vital events and Annual Vital Statistics Report.',
        primaryDomains: ['Social Statistics', 'Census / Population'],
      },
    ],
  },
  {
    id: 'ut-jk-des',
    name: 'Directorate of Economics & Statistics, UT of Jammu and Kashmir',
    shortCode: 'J&K DES',
    tier: 'Union Territory',
    stateOrUt: 'Jammu and Kashmir',
    headquarters: 'Srinagar / Jammu',
    cadres: ['J&K Economics & Statistics (Gazetted) Service', 'J&K E&S (Non-Gazetted) Service'],
    departments: [
      {
        id: 'jk-sdp-wing',
        name: 'Macro-Economic Aggregates & GSDP Wing',
        code: 'JK-SDP',
        description: 'Estimation of UT GSDP, District Good Governance Index (DGGI), and price indices.',
        primaryDomains: ['National Accounts', 'SDG', 'Price Statistics'],
      },
      {
        id: 'jk-cpo-network',
        name: 'District Chief Planning & Statistical Offices (20 Districts)',
        code: 'JK-CPO',
        description: 'District level data collation, developmental monitoring, and NSS state sample.',
        primaryDomains: ['Data Collection', 'Household Surveys'],
      },
    ],
  },
];

// Helper to get generic DES for any State/UT not explicitly mapped
export function getOrCreateStateOrganization(stateName: string, tier: GovernanceTier): StatisticalOrganization {
  const existing = STATE_UT_STATISTICAL_ORGANIZATIONS.find(
    (o) => o.stateOrUt?.toLowerCase() === stateName.toLowerCase()
  );
  if (existing) return existing;

  const short = stateName.substring(0, 3).toUpperCase();
  return {
    id: `state-${stateName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-des`,
    name: `Directorate of Economics & Statistics, ${tier === 'Union Territory' ? 'UT of' : 'Government of'} ${stateName}`,
    shortCode: `${short} DES`,
    tier,
    stateOrUt: stateName,
    headquarters: `Capital / HQ of ${stateName}`,
    cadres: [`${stateName} State Statistical Service`, 'District Statistical Cadre'],
    departments: [
      {
        id: `${short.toLowerCase()}-sdp-div`,
        name: 'State Domestic Product (SDP) & Economic Indicators Wing',
        code: `${short}-SDP`,
        description: 'Compilation of GSDP, District Domestic Product, and State Economic Survey.',
        primaryDomains: ['National Accounts', 'Economic Statistics'],
      },
      {
        id: `${short.toLowerCase()}-dso-net`,
        name: 'District Statistical Offices (DSO Network)',
        code: `${short}-DSO`,
        description: 'District level statistical field operations, crop estimation, and local surveys.',
        primaryDomains: ['Data Collection', 'Household Surveys', 'Agricultural Statistics'],
      },
      {
        id: `${short.toLowerCase()}-vital-div`,
        name: 'Vital Statistics & Demography Cell',
        code: `${short}-VITAL`,
        description: 'Civil Registration System, birth and death vital metrics.',
        primaryDomains: ['Social Statistics', 'Census / Population'],
      },
    ],
  };
}

// -----------------------------------------------------------------------------
// 3. RELEVANT DESIGNATIONS (Official Hierarchical Cadre Ranks)
// -----------------------------------------------------------------------------
export const STATISTICAL_DESIGNATIONS: StatisticalDesignation[] = [
  {
    id: 'desig-jso',
    title: 'Junior Statistical Officer (JSO)',
    shortCode: 'JSO',
    group: 'Group B (Non-Gazetted)',
    applicableTiers: ['Central Government', 'State Government', 'Union Territory'],
    typicalCadres: ['Subordinate Statistical Service (SSS)', 'State Subordinate Cadre'],
    level: 6, // 7th CPC Pay Level 6
  },
  {
    id: 'desig-sso',
    title: 'Senior Statistical Officer (SSO)',
    shortCode: 'SSO',
    group: 'Group B (Gazetted)',
    applicableTiers: ['Central Government', 'State Government', 'Union Territory'],
    typicalCadres: ['Subordinate Statistical Service (SSS)', 'State Statistical Cadre'],
    level: 7, // 7th CPC Pay Level 7
  },
  {
    id: 'desig-so',
    title: 'Statistical Officer (SO)',
    shortCode: 'SO',
    group: 'Group B (Gazetted)',
    applicableTiers: ['Central Government', 'State Government', 'Union Territory'],
    typicalCadres: ['Subordinate Statistical Service (SSS)', 'State Statistical Service'],
    level: 7,
  },
  {
    id: 'desig-si-1',
    title: 'Statistical Investigator (Grade I)',
    shortCode: 'SI-I',
    group: 'Group B (Gazetted)',
    applicableTiers: ['Central Government', 'State Government'],
    typicalCadres: ['Central Ministry Statistical Cell', 'Labour Bureau Cadre'],
    level: 7,
  },
  {
    id: 'desig-si-2',
    title: 'Statistical Investigator (Grade II)',
    shortCode: 'SI-II',
    group: 'Group B (Non-Gazetted)',
    applicableTiers: ['Central Government', 'State Government'],
    typicalCadres: ['Central Ministry Statistical Cell', 'DES Cadre'],
    level: 6,
  },
  {
    id: 'desig-sa',
    title: 'Statistical Assistant (SA)',
    shortCode: 'SA',
    group: 'Group C',
    applicableTiers: ['State Government', 'Union Territory'],
    typicalCadres: ['District Statistical Office', 'State Departmental Unit'],
    level: 5,
  },
  {
    id: 'desig-ro',
    title: 'Research Officer (Statistics)',
    shortCode: 'RO',
    group: 'Group B (Gazetted)',
    applicableTiers: ['Central Government', 'State Government'],
    typicalCadres: ['Ministry / Planning Department', 'NITI Aayog DMEO', 'RBI DSIM'],
    level: 8,
  },
  {
    id: 'desig-sro',
    title: 'Senior Research Officer (SRO)',
    shortCode: 'SRO',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government', 'State Government'],
    typicalCadres: ['NITI Aayog DMEO', 'Economic Research Cell'],
    level: 10,
  },
  {
    id: 'desig-ad',
    title: 'Assistant Director (AD)',
    shortCode: 'AD',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government', 'State Government', 'Union Territory'],
    typicalCadres: ['Indian Statistical Service (ISS - Junior Time Scale)', 'State Statistical Service Class I'],
    level: 10, // Pay Level 10
  },
  {
    id: 'desig-dd',
    title: 'Deputy Director (DD)',
    shortCode: 'DD',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government', 'State Government', 'Union Territory'],
    typicalCadres: ['Indian Statistical Service (ISS - Senior Time Scale)', 'State Statistical Service Class I'],
    level: 11, // Pay Level 11
  },
  {
    id: 'desig-jd',
    title: 'Joint Director (JD)',
    shortCode: 'JD',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government', 'State Government', 'Union Territory'],
    typicalCadres: ['Indian Statistical Service (ISS - Junior Administrative Grade)', 'State Joint Director Cadre'],
    level: 12, // Pay Level 12
  },
  {
    id: 'desig-dir',
    title: 'Director (DIR)',
    shortCode: 'DIR',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government', 'State Government'],
    typicalCadres: ['Indian Statistical Service (ISS - Selection Grade)', 'Director DES'],
    level: 13, // Pay Level 13
  },
  {
    id: 'desig-ddg',
    title: 'Deputy Director General (DDG)',
    shortCode: 'DDG',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government'],
    typicalCadres: ['Indian Statistical Service (ISS - Senior Administrative Grade)'],
    level: 14, // Pay Level 14
  },
  {
    id: 'desig-adg',
    title: 'Additional Director General (ADG)',
    shortCode: 'ADG',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government'],
    typicalCadres: ['Indian Statistical Service (ISS - Higher Administrative Grade)'],
    level: 15, // Pay Level 15
  },
  {
    id: 'desig-dg',
    title: 'Director General (DG / Chief Statistician of India)',
    shortCode: 'DG / CSI',
    group: 'Group A (Gazetted)',
    applicableTiers: ['Central Government'],
    typicalCadres: ['Indian Statistical Service (Apex)'],
    level: 17, // Apex
  },
];

// -----------------------------------------------------------------------------
// 4. STATISTICAL DOMAINS (All 20 Required Domains)
// -----------------------------------------------------------------------------
export const STATISTICAL_DOMAINS: StatisticalDomainMaster[] = [
  {
    id: 'dom-national-accounts',
    name: 'National Accounts',
    category: 'Macro & Economic',
    description: 'Compilation of GDP, GVA, Gross Capital Formation, Supply and Use Tables (SUT), and System of National Accounts (SNA 2008 / 2025).',
    coreSurveysOrFrameworks: ['SNA 2008', 'Input-Output Tables', 'GSDP Guidelines', 'Capital Stock Estimation'],
    recommendedTechnicalSkills: ['R', 'Python', 'Excel', 'SQL', 'Data Visualization'],
  },
  {
    id: 'dom-economic-stats',
    name: 'Economic Statistics',
    category: 'Macro & Economic',
    description: 'Index of Industrial Production (IIP), Eight Core Industries (ICI), Balance of Payments interface, and macroeconomic aggregates.',
    coreSurveysOrFrameworks: ['IIP Base 2011-12', 'Index of Core Industries', 'Business Register (BR)'],
    recommendedTechnicalSkills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
  },
  {
    id: 'dom-social-stats',
    name: 'Social Statistics',
    category: 'Social & Demographic',
    description: 'Composite social indices, Gender Statistics, Time Use Survey, Disability statistics, and crime statistics.',
    coreSurveysOrFrameworks: ['Time Use Survey (TUS)', 'Women and Men in India', 'Social Indicators Report'],
    recommendedTechnicalSkills: ['SPSS', 'Stata', 'Python', 'Excel'],
  },
  {
    id: 'dom-price-stats',
    name: 'Price Statistics',
    category: 'Macro & Economic',
    description: 'Compilation of Consumer Price Index (CPI-Rural/Urban/Combined), WPI, CPI-IW, and cost-of-living metrics.',
    coreSurveysOrFrameworks: ['CPI Base 2012', 'WPI Base 2011-12', 'CPI-IW Base 2016', 'Retail Price Web Portal'],
    recommendedTechnicalSkills: ['SQL', 'Python', 'Excel', 'Data Quality'],
  },
  {
    id: 'dom-labour-stats',
    name: 'Labour Statistics',
    category: 'Social & Demographic',
    description: 'Periodic Labour Force Survey (PLFS), Workforce Participation Rates, Unemployment Rates, and Quarterly Employment Surveys.',
    coreSurveysOrFrameworks: ['PLFS Annual & Quarterly', 'Quarterly Employment Survey (QES)', 'Occupational Wage Survey'],
    recommendedTechnicalSkills: ['Stata', 'R', 'Python', 'SQL'],
  },
  {
    id: 'dom-industrial-stats',
    name: 'Industrial Statistics',
    category: 'Macro & Economic',
    description: 'Annual Survey of Industries (ASI), factory sector statistics, capital invested, gross output, and net value added.',
    coreSurveysOrFrameworks: ['Annual Survey of Industries (ASI)', 'NIC 2008 Classification', 'NPC-MS Product Code'],
    recommendedTechnicalSkills: ['SQL', 'Python', 'Excel', 'Data Processing'],
  },
  {
    id: 'dom-agricultural-stats',
    name: 'Agricultural Statistics',
    category: 'Macro & Economic',
    description: 'General Crop Estimation Survey (GCES), Timely Reporting Scheme (TRS), Agriculture Census, and Land Use Statistics.',
    coreSurveysOrFrameworks: ['GCES Manual', 'Agriculture Census', 'Input Survey', 'Cost of Cultivation Studies'],
    recommendedTechnicalSkills: ['R', 'Excel', 'Data Quality', 'APIs'],
  },
  {
    id: 'dom-household-surveys',
    name: 'Household Surveys',
    category: 'Field & Methodological',
    description: 'Socio-economic sample surveys on household consumption expenditure (HCES), education, healthcare, and amenities.',
    coreSurveysOrFrameworks: ['Household Consumption Expenditure Survey (HCES)', 'NSS 75th/78th/79th Rounds'],
    recommendedTechnicalSkills: ['Stata', 'SPSS', 'R', 'Python', 'Data Quality'],
  },
  {
    id: 'dom-enterprise-surveys',
    name: 'Enterprise Surveys',
    category: 'Macro & Economic',
    description: 'Annual Survey of Unincorporated Sector Enterprises (ASUSE), Service Sector surveys, and informal economy enumeration.',
    coreSurveysOrFrameworks: ['ASUSE Survey Manual', 'Economic Census Framing', 'Informal Sector Matrix'],
    recommendedTechnicalSkills: ['SQL', 'Python', 'Data Processing'],
  },
  {
    id: 'dom-census-population',
    name: 'Census/Population',
    category: 'Social & Demographic',
    description: 'Decennial population census methodologies, Sample Registration System (SRS) vital rates, and demographic projections.',
    coreSurveysOrFrameworks: ['Census Enumeration Protocol', 'SRS Bulletins', 'National Population Projections Report'],
    recommendedTechnicalSkills: ['SPSS', 'R', 'SQL', 'Data Visualization'],
  },
  {
    id: 'dom-health-stats',
    name: 'Health',
    category: 'Social & Demographic',
    description: 'National Family Health Survey (NFHS), HMIS analytics, morbidity & healthcare utilization, and disease surveillance data.',
    coreSurveysOrFrameworks: ['NFHS-5/NFHS-6', 'HMIS MoHFW', 'National Health Accounts (NHA)'],
    recommendedTechnicalSkills: ['Stata', 'R', 'Data Visualization', 'Python'],
  },
  {
    id: 'dom-education-stats',
    name: 'Education',
    category: 'Social & Demographic',
    description: 'Educational participation, drop-out analytics, UDISE+ school data, and All India Survey on Higher Education (AISHE).',
    coreSurveysOrFrameworks: ['UDISE+ Data System', 'AISHE Reports', 'NSS Education Surveys'],
    recommendedTechnicalSkills: ['Excel', 'SQL', 'Data Visualization', 'Python'],
  },
  {
    id: 'dom-environment-stats',
    name: 'Environment',
    category: 'Social & Demographic',
    description: 'Framework for the Development of Environment Statistics (FDES), EnviStats India, and Natural Capital Accounting (SEEA).',
    coreSurveysOrFrameworks: ['FDES 2013', 'UN-SEEA Guidelines', 'EnviStats India Vol I & II'],
    recommendedTechnicalSkills: ['R', 'Python', 'Data Visualization', 'Open Data'],
  },
  {
    id: 'dom-sdg-stats',
    name: 'SDG',
    category: 'Social & Demographic',
    description: 'Sustainable Development Goals National Indicator Framework (NIF) monitoring across 17 goals, State Indicator Frameworks (SIF).',
    coreSurveysOrFrameworks: ['MoSPI SDG-NIF Baseline', 'NITI Aayog SDG India Index', 'Global SDG Metadata'],
    recommendedTechnicalSkills: ['Data Visualization', 'Python', 'APIs', 'Open Data'],
  },
  {
    id: 'dom-sampling-methodology',
    name: 'Sampling',
    category: 'Field & Methodological',
    description: 'Stratified multi-stage sampling designs, Probability Proportional to Size (PPS), circular systematic sampling, and sampling variance.',
    coreSurveysOrFrameworks: ['NSS Sampling Design Manuals Vol I-IV', 'Urban Frame Survey (UFS) Guidelines'],
    recommendedTechnicalSkills: ['R (survey package)', 'Python', 'Stata', 'Excel'],
  },
  {
    id: 'dom-survey-design',
    name: 'Survey Design',
    category: 'Field & Methodological',
    description: 'Instrument conceptualization, questionnaire formulation, cognitive testing, CAPI digital validation rules, and interview protocols.',
    coreSurveysOrFrameworks: ['CAPI Validation Specifications', 'Pilot Testing Framework', 'Enumerator Instructions Manual'],
    recommendedTechnicalSkills: ['APIs', 'Data Quality', 'Excel'],
  },
  {
    id: 'dom-data-quality',
    name: 'Data Quality',
    category: 'Field & Methodological',
    description: 'Non-sampling error quantification, imputation of missing entries, consistency audits, outlier detection, and data auditing.',
    coreSurveysOrFrameworks: ['MoSPI Data Quality Framework', 'UN Fundamental Principles of Official Statistics'],
    recommendedTechnicalSkills: ['Python', 'R', 'SQL', 'Cybersecurity'],
  },
  {
    id: 'dom-data-collection',
    name: 'Data Collection',
    category: 'Field & Methodological',
    description: 'Computer Assisted Personal Interviewing (CAPI), tablet-based data capture, geo-tagging, field verification, and supervisory scrutiny.',
    coreSurveysOrFrameworks: ['CAPI Field App (Survey Solutions/Custom)', 'UFS Digital Block Mapping'],
    recommendedTechnicalSkills: ['APIs', 'Open Data', 'Data Quality'],
  },
  {
    id: 'dom-data-processing',
    name: 'Data Processing',
    category: 'Technology & Data Management',
    description: 'Microdata scrubbing, multiplier weight calibration, anonymization protocols, and tabulation plan execution.',
    coreSurveysOrFrameworks: ['National Data Archive (NADA) Standards', 'Microdata Anonymization Protocol'],
    recommendedTechnicalSkills: ['SQL', 'Python', 'SAS', 'Stata', 'Cloud Computing'],
  },
  {
    id: 'dom-data-dissemination',
    name: 'Data Dissemination',
    category: 'Technology & Data Management',
    description: 'Open government data, National Data Warehouse for Official Statistics, REST API endpoints, and interactive visualization portals.',
    coreSurveysOrFrameworks: ['National Data Warehouse (NDW)', 'data.gov.in (OGD)', 'NADA Microdata Dissemination'],
    recommendedTechnicalSkills: ['APIs', 'Open Data', 'Data Visualization', 'Cybersecurity'],
  },
];

// -----------------------------------------------------------------------------
// 5. TECHNICAL COMPETENCIES (All 14 Required Skills)
// -----------------------------------------------------------------------------
export const TECHNICAL_COMPETENCIES: TechnicalCompetencyMaster[] = [
  {
    id: 'comp-python',
    name: 'Python',
    category: 'Programming & Computing',
    description: 'Data manipulation with Pandas, numerical computing with NumPy, statistical modeling with Statsmodels/SciPy, and automation scripts.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Pandas', 'NumPy', 'Jupyter', 'Statsmodels', 'Matplotlib'],
  },
  {
    id: 'comp-r',
    name: 'R',
    category: 'Programming & Computing',
    description: 'Complex survey analysis with the "survey" library, econometric analysis, Tidyverse data pipelines, and R Shiny dashboards.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Tidyverse', 'survey package', 'ggplot2', 'R Shiny', 'R Markdown'],
  },
  {
    id: 'comp-sql',
    name: 'SQL',
    category: 'Data Infrastructure & Cloud',
    description: 'Relational database querying, multi-table joins, subqueries, indexing, window functions, and PostgreSQL analytical queries.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['PostgreSQL', 'MySQL', 'DBeaver', 'Query Optimization'],
  },
  {
    id: 'comp-stata',
    name: 'Stata',
    category: 'Specialized Statistical Software',
    description: 'Microdata econometric processing, survey design declaring (svyset), panel regression models, and instrumental variables.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Stata MP', 'Do-files', 'svy commands', 'Microdata Analysis'],
  },
  {
    id: 'comp-spss',
    name: 'SPSS',
    category: 'Specialized Statistical Software',
    description: 'Descriptive and inferential statistical operations, cross-tabulations, factor analysis, and public health data exploration.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['IBM SPSS Statistics', 'SPSS Syntax', 'Cross-Tabs', 'ANOVA'],
  },
  {
    id: 'comp-sas',
    name: 'SAS',
    category: 'Specialized Statistical Software',
    description: 'Base SAS programming, SAS Macro facility, high-volume statistical dataset manipulation, and enterprise data validation.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Base SAS', 'SAS Macros', 'PROC SQL', 'Enterprise Guide'],
  },
  {
    id: 'comp-excel',
    name: 'Excel',
    category: 'Programming & Computing',
    description: 'Advanced spreadsheet formulas, Power Query microdata cleaning, complex Pivot Tables, statistical add-ins, and data modeling.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Power Query', 'Pivot Tables', 'XLOOKUP', 'VBA / Macros', 'Solver'],
  },
  {
    id: 'comp-data-viz',
    name: 'Data Visualization',
    category: 'Programming & Computing',
    description: 'Dashboard creation in Power BI, Tableau, interactive storytelling with D3.js, geospatial thematic mapping, and chart design.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Power BI', 'Tableau', 'D3.js', 'Seaborn', 'QGIS'],
  },
  {
    id: 'comp-apis',
    name: 'APIs',
    category: 'Data Infrastructure & Cloud',
    description: 'REST API consumption, building microdata endpoints, JSON/XML payload serialization, and automated data exchange protocols.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['REST APIs', 'Postman', 'FastAPI', 'cURL', 'OpenAPI Specs'],
  },
  {
    id: 'comp-open-data',
    name: 'Open Data',
    category: 'Security & Governance',
    description: 'Open Government Data (OGD) architecture, CKAN portal ingestion, National Data Archive (NADA) curation, and metadata schemas.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['data.gov.in', 'CKAN', 'Dublin Core', 'SDMX', 'NADA Portal'],
  },
  {
    id: 'comp-ai-ml',
    name: 'AI/ML',
    category: 'Advanced AI & Modern Data Stack',
    description: 'Machine Learning algorithms (Random Forest, XGBoost, Clustering), predictive imputation, anomaly and outlier detection in microdata.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'Outlier Detection'],
  },
  {
    id: 'comp-gen-ai',
    name: 'Generative AI',
    category: 'Advanced AI & Modern Data Stack',
    description: 'Large Language Models (LLMs), prompt engineering, document intelligence on survey manuals, and automated quiz/report generation.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['Gemini API', 'RAG Architectures', 'LangChain', 'Prompt Engineering'],
  },
  {
    id: 'comp-cloud',
    name: 'Cloud Computing',
    category: 'Data Infrastructure & Cloud',
    description: 'Government Cloud (MeghRaj), virtual machines, cloud data warehouses, containerization, and distributed data processing.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['NIC MeghRaj', 'Docker', 'Google Cloud', 'AWS', 'Blob Storage'],
  },
  {
    id: 'comp-cybersecurity',
    name: 'Cybersecurity',
    category: 'Security & Governance',
    description: 'Digital Personal Data Protection (DPDP) Act 2023 compliance, statistical data anonymization, role-based access control, and audit logs.',
    proficiencyLevels: ['Foundational', 'Intermediate', 'Advanced'],
    associatedTools: ['DPDP Act Compliance', 'Data Anonymization', 'RBAC', 'Encryption', 'CERT-In Norms'],
  },
];

// -----------------------------------------------------------------------------
// 6. TRAINING ORGANIZATIONS
// -----------------------------------------------------------------------------
export const TRAINING_ORGANIZATIONS: TrainingOrganizationMaster[] = [
  {
    id: 'train-nssta',
    name: 'National Statistical Systems Training Academy (NSSTA)',
    shortCode: 'NSSTA',
    type: 'Central Apex Academy',
    location: 'Plot No. 22, Knowledge Park-II, Greater Noida, Uttar Pradesh',
    portalUrl: 'https://nssta.gov.in',
    description: 'Apex national training institution under MoSPI dedicated to capacity building in official statistics for ISS, SSS, and State DES officers.',
  },
  {
    id: 'train-igot',
    name: 'iGOT Karmayogi (Mission Karmayogi Bharat)',
    shortCode: 'iGOT Karmayogi',
    type: 'National Civil Service Platform',
    location: 'DoPT, Government of India, New Delhi',
    portalUrl: 'https://portal.igotkarmayogi.gov.in',
    description: 'National digital capacity-building platform for civil servants providing curated courses, competencies, and SADHANA Saptah learning programs.',
  },
  {
    id: 'train-isi',
    name: 'Indian Statistical Institute (ISI)',
    shortCode: 'ISI',
    type: 'Statistical Research Institute',
    location: 'Kolkata, New Delhi, Bengaluru',
    portalUrl: 'https://www.isical.ac.in',
    description: 'Institution of National Importance fostering advanced research, sampling theory, and statistical training.',
  },
  {
    id: 'train-istm',
    name: 'Institute of Secretariat Training and Management (ISTM)',
    shortCode: 'ISTM',
    type: 'Civil Service Institute',
    location: 'Old JNU Campus, New Delhi',
    portalUrl: 'https://www.istm.gov.in',
    description: 'Central training institute under DoPT for administrative governance, public procurement, and service rules.',
  },
  {
    id: 'train-nic',
    name: 'National Informatics Centre Training Division (NIC)',
    shortCode: 'NIC Training',
    type: 'Civil Service Institute',
    location: 'CGO Complex, New Delhi',
    portalUrl: 'https://www.nic.in',
    description: 'Training official cadres on government cloud (MeghRaj), e-Governance, CAPI apps, and cybersecurity.',
  },
  {
    id: 'train-iipa',
    name: 'Indian Institute of Public Administration (IIPA)',
    shortCode: 'IIPA',
    type: 'Civil Service Institute',
    location: 'IP Estate, Ring Road, New Delhi',
    portalUrl: 'https://www.iipa.org.in',
    description: 'Premier training institute in public policy, governance leadership, and project monitoring.',
  },
  {
    id: 'train-ati',
    name: 'State Administrative Training Institutes & Regional Statistical Training Units (ATIs)',
    shortCode: 'State ATIs',
    type: 'State Training Institute',
    location: 'Across State Capitals (e.g., YASHADA Pune, ATI Mysore, ATI West Bengal, UPAMVP Lucknow)',
    portalUrl: 'https://dopt.gov.in/state-atis',
    description: 'State-level academies providing foundation and refresher training to State DES and District Statistical Officers.',
  },
];
