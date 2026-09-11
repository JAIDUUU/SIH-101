import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Layers,
  ShieldAlert,
  Database,
  MapPin,
  Cpu,
  Lock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface FutureWorkforceReadinessViewProps {
  onNavigate: (viewId: string) => void;
}

export const FutureWorkforceReadinessView: React.FC<FutureWorkforceReadinessViewProps> = ({
  onNavigate,
}) => {
  const [activeYear, setActiveYear] = useState<'2026' | '2027' | '2028'>('2026');

  const futurePriorities = [
    {
      id: 'aiml',
      name: 'AI/ML in Official Statistics',
      icon: Cpu,
      currentReadiness: 34,
      targetReadiness: 78,
      riskLevel: 'HIGH',
      description:
        'Automated satellite imagery classification for agricultural crop yield forecasts and NLP for unstructured survey comments.',
      milestones: {
        '2026': 'Deploy pilot automated crop yield inference models in 50 agrarian districts; train 300 ISS cadre.',
        '2027': 'Integrate real-time consumer expenditure sentiment parsing from retail electronic invoices.',
        '2028': 'Autonomous quarterly GDP nowcasting sub-index computation with machine learning validation.',
      },
      intervention: 'Commission NSSTA Modernization Track: Applied PyTorch & Geospatial AI for Official Surveys.',
    },
    {
      id: 'bigdata',
      name: 'Big Data Pipelines & High-Throughput Streaming',
      icon: Database,
      currentReadiness: 42,
      targetReadiness: 82,
      riskLevel: 'HIGH',
      description:
        'Continuous ingestion of high-frequency GST, UPI transaction streams, and electricity consumption telemetry.',
      milestones: {
        '2026': 'Establish Kafka/Spark ingestion nodes for daily e-way bill volume indicators across state borders.',
        '2027': 'Transition Annual Survey of Industries (ASI) data pipeline to continuous automated ingestion.',
        '2028': 'Zero-latency national economic activity dashboard updated at midnight daily.',
      },
      intervention: 'Mandate iGOT Apache Spark & PySpark data engineering lab drills for SSS officers.',
    },
    {
      id: 'cloud',
      name: 'Cloud Data Architecture & Lakehouse Infrastructure',
      icon: Layers,
      currentReadiness: 48,
      targetReadiness: 85,
      riskLevel: 'MODERATE',
      description:
        'Migration of national statistical archives from legacy isolated server rooms to sovereign NIC GovCloud lakehouse nodes.',
      milestones: {
        '2026': 'Migrate 10 years of NSSO microdata rounds to S3-compatible sovereign object storage with Parquet format.',
        '2027': 'Implement multi-tenant role-based data mesh for inter-ministerial query federation.',
        '2028': 'Universal query access for accredited research institutions with automated cryptographic k-anonymity.',
      },
      intervention: 'Partner with NIC Cloud Academy for Data Lakehouse & Iceberg architecture certifications.',
    },
    {
      id: 'gis',
      name: 'GIS Spatial Mapping & Urban Frame Modernization',
      icon: MapPin,
      currentReadiness: 52,
      targetReadiness: 90,
      riskLevel: 'MODERATE',
      description:
        'Digitization of Urban Frame Survey (UFS) paper sketch maps into geo-referenced polygon boundaries with GPS tagging.',
      milestones: {
        '2026': 'Complete geo-referencing of 100% urban blocks in Tier 1 and Tier 2 cities via QGIS mobile app.',
        '2027': 'Integrate Bhuvan satellite basemaps directly into tablet-based field listing questionnaires.',
        '2028': 'Dynamic 3D demographic density visualization down to 500-meter hexagonal grids.',
      },
      intervention: 'Roll out NSSTA Mobile GIS & Drone Survey Validation Refresher for FOD field staff.',
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity & Data Privacy for Statistical Systems',
      icon: Lock,
      currentReadiness: 58,
      targetReadiness: 92,
      riskLevel: 'CRITICAL',
      description:
        'Compliance with the Digital Personal Data Protection (DPDP) Act, differential privacy algorithms, and cryptographic audit logs.',
      milestones: {
        '2026': 'Implement DPDP consent architecture and differential privacy noise injections across public microdata.',
        '2027': 'Annual Red Team penetration audits for all CAPI data ingestion servers across regional offices.',
        '2028': 'Zero Trust Network Architecture (ZTNA) enforced across all 48 FOD regional offices.',
      },
      intervention: 'Compulsory CERT-In / NSSTA Data Privacy & Secure Microdata Handling certification.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              STRATEGIC HORIZON 2026–2028 // FUTURE READINESS INDEX
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Future Statistical Workforce Readiness
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Anticipating technology shifts mandated by national modernization roadmaps: AI/ML, big data streams, sovereign GovCloud, and DPDP compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('regional-readiness')}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 text-xs font-technical uppercase font-bold transition-colors cursor-pointer"
            >
              Regional Breakdown →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Tabs: 2026 → 2027 → 2028 (Exact requirement) */}
      <div className="bg-white border border-zinc-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-technical uppercase font-bold text-zinc-950">
            Target Year Milestone Horizon:
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto font-technical text-xs">
          {(['2026', '2027', '2028'] as const).map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-5 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeYear === year
                  ? 'bg-zinc-950 text-white border-2 border-zinc-950 shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
              }`}
            >
              Year {year}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Cards List */}
      <div className="space-y-6">
        {futurePriorities.map((item) => {
          const Icon = item.icon;
          const currentMilestone = item.milestones[activeYear];

          return (
            <div
              key={item.id}
              className="bg-white border border-zinc-300 p-6 shadow-xs space-y-4 hover:border-zinc-900 transition-colors"
            >
              {/* Priority Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-200 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-zinc-900 text-amber-400 flex items-center justify-center font-bold shrink-0 border border-zinc-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-950 font-heading">
                        {item.name}
                      </h3>
                      <span
                        className={`text-[9px] font-technical uppercase font-bold px-2 py-0.5 border ${
                          item.riskLevel === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-950 border-rose-300'
                            : item.riskLevel === 'HIGH'
                            ? 'bg-amber-100 text-amber-950 border-amber-300'
                            : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                        }`}
                      >
                        {item.riskLevel} GAP RISK
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1 max-w-xl font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Score Progress */}
                <div className="flex items-center gap-4 shrink-0 font-technical text-xs">
                  <div className="text-right">
                    <span className="text-zinc-500 text-[10px] block">CURRENT / TARGET</span>
                    <span className="text-lg font-bold text-zinc-950">
                      {item.currentReadiness}% → {item.targetReadiness}%
                    </span>
                  </div>
                  <div className="w-24 bg-zinc-100 h-2 border border-zinc-200">
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${item.currentReadiness}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Year Milestone Display for Selected Year */}
              <div className="p-4 bg-[#FAF9F7] border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-technical uppercase font-bold text-amber-900 block mb-1">
                    YEAR {activeYear} STRATEGIC MILESTONE OBJECTIVE
                  </span>
                  <p className="font-sans text-zinc-800 font-medium">
                    {currentMilestone}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-white border border-zinc-300 font-technical text-[10px] uppercase font-semibold text-zinc-700 shrink-0">
                  Target FY{activeYear}
                </span>
              </div>

              {/* Recommended Strategic Intervention */}
              <div className="p-3 bg-amber-50/60 border-l-3 border-l-amber-500 border border-zinc-200 text-xs font-sans text-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-zinc-950 font-heading">
                    Prescribed Human Capital Intervention:
                  </span>{' '}
                  {item.intervention}
                </div>
                <button
                  onClick={() => onNavigate('quiz-generator')}
                  className="px-3.5 py-1.5 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase font-bold tracking-wider shrink-0 transition-colors cursor-pointer"
                >
                  Commission Course
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
