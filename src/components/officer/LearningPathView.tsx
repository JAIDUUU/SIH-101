import React from 'react';
import { OfficerProfile } from '../../types';
import {
  GitMerge,
  CheckCircle2,
  Play,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Info,
} from 'lucide-react';

interface LearningPathViewProps {
  officer: OfficerProfile;
  onNavigate: (viewId: string) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  officer,
  onNavigate,
}) => {
  const [activeDomain, setActiveDomain] = React.useState<string>(
    officer.statisticalDomain || 'Survey Sampling (NSSO / PLFS)'
  );

  const getDomainRoadmap = (domain: string) => {
    if (domain.includes('Sampling') || domain.includes('PLFS') || domain.includes('HCES')) {
      return [
        {
          stepNumber: 1,
          title: 'Operational Protocols for Urban Frame Survey (UFS)',
          status: 'completed',
          source: 'nssta.gov.in (NSSTA)',
          duration: '12 Hours',
          difficulty: 'Foundational',
          matchPercentage: 99,
          competenciesGained: ['UFS Block Demarcation', 'Frame Updating', 'Cartographic Verification'],
          whyRecommended: 'Foundational prerequisite completed during initial onboarding; validated core field frames.',
        },
        {
          stepNumber: 2,
          title: 'Multi-Stage Stratified Sampling & Probability Proportional to Size (PPS)',
          status: 'active',
          source: 'NSSTA TPAC',
          duration: '18 Hours (Self-paced + 2 Labs)',
          difficulty: 'Intermediate',
          matchPercentage: 97,
          competenciesGained: ['Multi-Stage Allocation', 'PPS Sampling', 'Sub-sample Rotation', 'First-Stage Unit Selection'],
          whyRecommended: `Directly addresses your primary competency gap for ${officer.cadre}. Aligned with upcoming PLFS & HCES rounds.`,
        },
        {
          stepNumber: 3,
          title: 'CAPI Digital Data Collection & Schedule Field Audits',
          status: 'upcoming',
          source: 'iGOT Karmayogi / MoSPI',
          duration: '14 Hours',
          difficulty: 'Intermediate',
          matchPercentage: 93,
          competenciesGained: ['CAPI Validation Scripts', 'Field Audit Checklists', 'Real-Time Sync Diagnostics'],
          whyRecommended: 'Prevents non-sampling errors and equips officers for automated tablet-based survey supervision.',
        },
        {
          stepNumber: 4,
          title: 'Non-Sampling Error Treatment & Donor Imputation Models',
          status: 'upcoming',
          source: 'NSSTA TPAC',
          duration: '20 Hours',
          difficulty: 'Advanced',
          matchPercentage: 90,
          competenciesGained: ['Jackknife Variance', 'Hot-Deck Imputation', 'Survey Weight Calibration'],
          whyRecommended: 'Bridges the gap to Senior Statistical Officer benchmark (requires ≥80% readiness).',
        },
        {
          stepNumber: 5,
          title: 'Official Survey Sampling Lead & Cadre Certification',
          status: 'upcoming',
          source: 'NSSTA Greater Noida',
          duration: '2 Weeks (Residential Capstone)',
          difficulty: 'Advanced',
          matchPercentage: 86,
          competenciesGained: ['National Survey Coordination', 'Policy Brief Generation', 'Complex Sampling Diagnostics'],
          whyRecommended: 'Prepares officers for national round leadership and executive statistical officer promotions.',
        },
      ];
    } else if (domain.includes('Price') || domain.includes('CPI') || domain.includes('WPI')) {
      return [
        {
          stepNumber: 1,
          title: 'Item Basket Specifications & Market Quotation Collection',
          status: 'completed',
          source: 'mospi.gov.in (MoSPI)',
          duration: '10 Hours',
          difficulty: 'Foundational',
          matchPercentage: 98,
          competenciesGained: ['Price Specification Standards', 'Market Center Identification', 'Frequency Rules'],
          whyRecommended: 'Foundational certification completed for Price Statistics Division field units.',
        },
        {
          stepNumber: 2,
          title: 'Consumer Price Index (CPI) Compilation & Price Imputation Models',
          status: 'active',
          source: 'MoSPI Training Portal',
          duration: '18 Hours',
          difficulty: 'Intermediate',
          matchPercentage: 96,
          competenciesGained: ['Geometric Mean Formulae', 'Laspeyres Aggregation', 'Price Outlier Detection'],
          whyRecommended: `Critical operational training for ${officer.cadre} monthly index calculation schedules.`,
        },
        {
          stepNumber: 3,
          title: 'Non-Response Imputation for Seasonal Price Quotations',
          status: 'upcoming',
          source: 'NSSTA TPAC',
          duration: '14 Hours',
          difficulty: 'Intermediate',
          matchPercentage: 92,
          competenciesGained: ['Seasonal Adjustment', 'Comparable Substitution', 'Carry-Forward Controls'],
          whyRecommended: 'Maintains index reliability during seasonal supply shocks and missing vendor reports.',
        },
        {
          stepNumber: 4,
          title: 'Hedonic Adjustments & Chain-Weighted Price Indexing',
          status: 'upcoming',
          source: 'NSSTA Analytics Wing',
          duration: '20 Hours',
          difficulty: 'Advanced',
          matchPercentage: 88,
          competenciesGained: ['Hedonic Regression', 'Quality Adjustments', 'Superlative Index Numbers'],
          whyRecommended: 'Prepares division for upcoming MoSPI CPI base revisions.',
        },
        {
          stepNumber: 5,
          title: 'National Inflation Series Cadre Lead Certification',
          status: 'upcoming',
          source: 'MoSPI Central Training Facility',
          duration: '24 Hours',
          difficulty: 'Advanced',
          matchPercentage: 85,
          competenciesGained: ['Monetary Policy Interface', 'Sub-Index Harmonization', 'Macro Headline Briefings'],
          whyRecommended: 'Official credential for senior economists and price statistics division officers.',
        },
      ];
    } else if (domain.includes('National Accounts') || domain.includes('GDP') || domain.includes('GVA')) {
      return [
        {
          stepNumber: 1,
          title: 'System of National Accounts (SNA 2008 / 2025 Framework)',
          status: 'completed',
          source: 'mospi.gov.in (MoSPI)',
          duration: '14 Hours',
          difficulty: 'Foundational',
          matchPercentage: 99,
          competenciesGained: ['SNA Accounting Rules', 'Production Boundary', 'Institutional Sectors'],
          whyRecommended: 'Core conceptual grounding verified for National Accounts Division operations.',
        },
        {
          stepNumber: 2,
          title: 'GVA Compilation, SUT & Gross State Domestic Product (GSDP)',
          status: 'active',
          source: 'MoSPI Central Training Facility',
          duration: '22 Hours',
          difficulty: 'Intermediate',
          matchPercentage: 95,
          competenciesGained: ['Gross Value Added (GVA)', 'Supply-Use Tables (SUT)', 'GSDP Estimation'],
          whyRecommended: `Directly targets key competency gaps in macroeconomic aggregate compilation.`,
        },
        {
          stepNumber: 3,
          title: 'Corporate Financials & MCA21 Database Extrapolations',
          status: 'upcoming',
          source: 'NSSTA TPAC',
          duration: '16 Hours',
          difficulty: 'Intermediate',
          matchPercentage: 91,
          competenciesGained: ['MCA21 Parsing', 'Paid-up Capital Blow-up Factors', 'Enterprise Aggregates'],
          whyRecommended: 'Enables accurate formal enterprise sector value addition estimations.',
        },
        {
          stepNumber: 4,
          title: 'Deflators, Double Deflation, and Capital Stock Balancing',
          status: 'upcoming',
          source: 'NSSTA Analytics Lab',
          duration: '20 Hours',
          difficulty: 'Advanced',
          matchPercentage: 89,
          competenciesGained: ['Double Deflation', 'Perpetual Inventory Method (PIM)', 'Capital Formation'],
          whyRecommended: 'Advanced methodology aligned with international statistical standards.',
        },
        {
          stepNumber: 5,
          title: 'National Income Accounting Executive Certification',
          status: 'upcoming',
          source: 'MoSPI / NSSTA Greater Noida',
          duration: '2 Weeks Capstone',
          difficulty: 'Advanced',
          matchPercentage: 84,
          competenciesGained: ['GDP Release Briefings', 'Fiscal Deficit Aggregates', 'International Reporting'],
          whyRecommended: 'Executive credential for NAD Directorate postings.',
        },
      ];
    } else {
      // Data Science / Technical Track
      return [
        {
          stepNumber: 1,
          title: 'Python Fundamentals for Public Servants',
          status: 'completed',
          source: 'iGOT Karmayogi',
          duration: '12 Hours',
          difficulty: 'Foundational',
          matchPercentage: 99,
          competenciesGained: ['Python Syntax', 'Basic Data Types', 'Loops & Functions', 'CSV File I/O'],
          whyRecommended: 'Foundational prerequisite completed during initial onboarding; validated core scripting syntax.',
        },
        {
          stepNumber: 2,
          title: 'Python for Statistical Analysis & NSSO Data Processing',
          status: 'active',
          source: 'NSSTA TPAC',
          duration: '18 Hours (Self-paced + 2 Labs)',
          difficulty: 'Intermediate',
          matchPercentage: 96,
          competenciesGained: ['Pandas for Microdata', 'NSSO Fixed-Width Parsing', 'Sampling Variance Automation', 'Clean Data Export'],
          whyRecommended: `Directly addresses your primary technical gap in ${officer.cadre}. Aligned with FOD quarterly survey schedules.`,
        },
        {
          stepNumber: 3,
          title: 'Data Visualization & Statistical Reporting in Python',
          status: 'upcoming',
          source: 'NSSTA TPAC',
          duration: '14 Hours',
          difficulty: 'Intermediate',
          matchPercentage: 92,
          competenciesGained: ['Matplotlib & Seaborn', 'Official Chart Styling Standards', 'Automated PDF Dossiers', 'Interactive Dashboards'],
          whyRecommended: 'Empowers field officers to generate executive summary infographics for District Collector review.',
        },
        {
          stepNumber: 4,
          title: 'Applied Statistics & Imputation Models for Official Surveys',
          status: 'upcoming',
          source: 'NSSTA TPAC',
          duration: '20 Hours',
          difficulty: 'Advanced',
          matchPercentage: 89,
          competenciesGained: ['Jackknife Variance', 'Donor Imputation Rules', 'Small Area Estimation', 'Survey Calibration'],
          whyRecommended: 'Bridges the gap to Senior Statistical Officer benchmark (requires ≥80% overall readiness).',
        },
        {
          stepNumber: 5,
          title: 'AI/ML & Predictive Modeling for Official Statistics',
          status: 'upcoming',
          source: 'NSSTA Modernization Wing',
          duration: '24 Hours',
          difficulty: 'Advanced',
          matchPercentage: 85,
          competenciesGained: ['Supervised Satellite Imagery Crop Yields', 'GDP Nowcasting Sub-indices', 'Automated Anomaly Detection'],
          whyRecommended: 'Part of the MoSPI 2026–2030 National Modernization Roadmap; prepares officers for AI cadre deputations.',
        },
      ];
    }
  };

  const roadmapSteps = getDomainRoadmap(activeDomain);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              ADAPTIVE CURRICULAR GRAPH // ROADMAP ENGINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Personalized Learning Path
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Sequenced progression dynamically generated from your designation, field responsibilities, and verified diagnostic scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-technical text-xs">
            <span className="px-3 py-1.5 bg-zinc-100 border border-zinc-300 text-zinc-800">
              TARGET CADRE: <strong>Senior Statistical Officer</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Domain Track Switcher */}
        <div className="mt-5 pt-4 border-t border-zinc-200">
          <div className="text-[10px] font-technical uppercase text-zinc-500 font-bold mb-2">
            Active Competency Pathway Track:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'Survey Sampling (NSSO / PLFS)', label: 'Survey Sampling (NSSO/PLFS)' },
              { id: 'Price & Inflation Statistics (CPI / WPI)', label: 'Price & Inflation (CPI/WPI)' },
              { id: 'National Accounts & GDP Estimation', label: 'National Accounts & GDP' },
              { id: 'Technical & Data Science', label: 'Python & Data Science' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveDomain(t.id)}
                className={`px-3 py-1.5 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer border ${
                  activeDomain === t.id
                    ? 'bg-zinc-950 text-amber-400 border-zinc-950 font-bold shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Roadmap Sequence */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-300">
        {roadmapSteps.map((step) => {
          const isDone = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <div key={step.stepNumber} className="relative group">
              {/* Connector Node on Timeline */}
              <div
                className={`absolute -left-6 sm:-left-10 top-6 w-7 h-7 flex items-center justify-center border font-technical text-xs font-bold z-10 transition-colors ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : isActive
                    ? 'bg-amber-400 border-zinc-950 text-black shadow-xs ring-4 ring-amber-100'
                    : 'bg-white border-zinc-400 text-zinc-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4 text-white" /> : step.stepNumber}
              </div>

              {/* Course Card */}
              <div
                className={`bg-white border p-6 transition-all ${
                  isActive
                    ? 'border-2 border-zinc-950 shadow-md bg-[#FFFDF9]'
                    : isDone
                    ? 'border-zinc-300 opacity-90'
                    : 'border-zinc-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-technical uppercase font-bold px-2 py-0.5 bg-zinc-900 text-white">
                        {step.source}
                      </span>
                      <span className="text-xs font-technical text-zinc-500">
                        {step.duration}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-xs font-technical text-zinc-600">
                        {step.difficulty}
                      </span>

                      {isActive && (
                        <span className="text-[10px] font-technical uppercase font-bold px-2 py-0.5 bg-amber-200 text-amber-950 border border-amber-400">
                          CURRENT PRIORITY STEP
                        </span>
                      )}

                      {isDone && (
                        <span className="text-[10px] font-technical uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300">
                          COMPLETED & VERIFIED
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-zinc-950 font-heading">
                      {step.title}
                    </h3>

                    {/* Competencies Gained */}
                    <div>
                      <span className="text-[11px] font-technical uppercase text-zinc-500 font-semibold block mb-1.5">
                        Competencies Targeted:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {step.competenciesGained.map((comp) => (
                          <span
                            key={comp}
                            className="text-xs px-2.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium"
                          >
                            + {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* "Why this recommendation?" Section (Required by prompt) */}
                    <div className="mt-3 p-3.5 bg-amber-50/70 border-l-3 border-l-amber-500 border border-zinc-200 text-xs font-sans text-zinc-800">
                      <div className="flex items-center gap-1.5 text-[11px] font-technical uppercase font-bold text-amber-900 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Why this recommendation?
                      </div>
                      <p className="leading-relaxed text-zinc-700">{step.whyRecommended}</p>
                    </div>
                  </div>

                  {/* Right: Match Score & Action CTA */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 font-technical">
                    <div className="text-right">
                      <span className="text-zinc-500 block text-[10px] uppercase">
                        Curricular Match
                      </span>
                      <span className="text-2xl font-bold text-zinc-950 font-heading">
                        {step.matchPercentage}%
                      </span>
                    </div>

                    <div>
                      {isActive ? (
                        <button
                          onClick={() => onNavigate('courses')}
                          className="px-5 py-2.5 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase tracking-wider font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <span>Resume Course</span>
                          <Play className="w-3 h-3 fill-amber-400" />
                        </button>
                      ) : isDone ? (
                        <button
                          onClick={() => onNavigate('skill-passport')}
                          className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          View Certificate
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigate('courses')}
                          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Inspect Syllabus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
