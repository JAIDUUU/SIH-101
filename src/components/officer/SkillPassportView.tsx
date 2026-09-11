import React from 'react';
import { OfficerProfile } from '../../types';
import { RadarChart } from '../common/RadarChart';
import {
  ShieldCheck,
  CreditCard,
  Download,
  Share2,
  Printer,
  Award,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  QrCode,
} from 'lucide-react';

interface SkillPassportViewProps {
  officer: OfficerProfile;
  onNavigate: (viewId: string) => void;
}

export const SkillPassportView: React.FC<SkillPassportViewProps> = ({
  officer,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-300 p-4 shadow-xs">
        <div>
          <span className="text-[10px] font-technical uppercase font-bold text-amber-800 tracking-wider">
            DIGITAL CREDENTIAL DOSSIER // IMMUTABLE COMPETENCY LEDGER
          </span>
          <h1 className="text-xl font-bold text-zinc-950 font-heading">
            Official Statistical Skill Passport
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 text-xs font-technical uppercase font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={() => alert(`Official verification URI: https://skillsutra.gov.in/verify/${officer.passportId}`)}
            className="px-4 py-1.5 bg-zinc-950 hover:bg-black text-amber-400 border border-zinc-900 text-xs font-technical uppercase font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Verification Link</span>
          </button>
        </div>
      </div>

      {/* Main Digital Passport Document Card */}
      <div className="bg-[#FFFFFF] border-2 border-zinc-950 shadow-lg overflow-hidden relative">
        {/* Gold Technical Top Border Line */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300" />

        {/* Passport Header Strip */}
        <div className="p-6 bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-400 text-black flex items-center justify-center font-technical font-bold text-lg border border-amber-300 shadow-xs">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-technical text-amber-400 uppercase tracking-widest font-bold">
                  SKILL SUTRA // OFFICIAL PASSPORT
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.2 font-mono">
                  ACTIVE STATUS
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-heading tracking-tight text-white">
                Republic of India · Statistical System Cadre Passport
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right font-technical">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
              PASSPORT NUMBER
            </div>
            <div className="text-sm font-bold text-amber-400 font-mono tracking-wider">
              {officer.passportId}
            </div>
            <div className="text-[10px] text-zinc-400">ISSUED: {officer.passportIssuedDate}</div>
          </div>
        </div>

        {/* Passport Identity Section */}
        <div className="p-8 bg-[#FAF9F7] border-b border-zinc-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Photo/Monogram Badge (3 cols) */}
            <div className="md:col-span-3 flex flex-col items-center text-center">
              <div className="w-32 h-36 bg-white border-2 border-zinc-900 p-2 shadow-sm flex flex-col items-center justify-center relative">
                <div className="w-20 h-20 bg-zinc-900 text-amber-400 flex items-center justify-center font-heading font-extrabold text-2xl border border-zinc-700">
                  RK
                </div>
                <span className="text-[9px] font-technical uppercase font-bold text-zinc-500 mt-2">
                  EMP-992014-RK
                </span>
                <span className="absolute -bottom-2.5 px-2 py-0.5 bg-emerald-700 text-white font-technical text-[9px] uppercase font-bold">
                  VERIFIED CADRE
                </span>
              </div>
            </div>

            {/* Middle Identity Details (6 cols) */}
            <div className="md:col-span-6 space-y-3 font-sans">
              <div>
                <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold tracking-wider block">
                  OFFICIAL HOLDER NAME
                </span>
                <h3 className="text-2xl font-bold text-zinc-950 font-heading">
                  {officer.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-technical uppercase text-zinc-500 font-semibold block">
                    Designation
                  </span>
                  <strong className="text-zinc-900 font-medium">{officer.designation}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-technical uppercase text-zinc-500 font-semibold block">
                    Cadre
                  </span>
                  <strong className="text-zinc-900 font-medium">{officer.cadre}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-technical uppercase text-zinc-500 font-semibold block">
                    Parent Department
                  </span>
                  <span className="text-zinc-800 text-[11px] leading-tight block">
                    {officer.department}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-technical uppercase text-zinc-500 font-semibold block">
                    Station & Zone
                  </span>
                  <strong className="text-zinc-900 font-medium">{officer.station}</strong>
                </div>

                <div className="col-span-2">
                  <span className="text-[10px] font-technical uppercase text-zinc-500 font-semibold block">
                    Service Experience & Academic Foundation
                  </span>
                  <span className="text-zinc-700 text-xs">
                    {officer.experienceYears} Years in Official Statistics · {officer.education}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Overall Readiness Seal (3 cols) */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-4 bg-white border border-zinc-300 text-center shadow-xs">
              <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold mb-1">
                OVERALL READINESS
              </span>
              <div className="text-4xl font-extrabold text-zinc-950 font-heading">
                {officer.readinessScore}%
              </div>
              <div className="w-full bg-zinc-200 h-1.5 my-2">
                <div className="bg-amber-500 h-full" style={{ width: `${officer.readinessScore}%` }} />
              </div>
              <span className="text-[10px] font-technical text-amber-900 font-bold uppercase">
                TIER 2 STATISTICAL OFFICER
              </span>
              <span className="text-[9px] text-zinc-500 mt-1">SSO promotion target: 80%</span>
            </div>
          </div>
        </div>

        {/* Competency Radar & Verified Competencies */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-zinc-300">
          {/* Radar Chart (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-200 pb-6 lg:pb-0 lg:pr-6">
            <span className="text-xs font-technical uppercase font-bold text-zinc-800 mb-3 tracking-wider">
              Competency Radar Profile
            </span>
            <RadarChart domainScores={officer.domainScores} size={250} />
          </div>

          {/* Verified Competencies Table (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-technical uppercase font-bold text-zinc-900 tracking-wider">
                Cryptographically Verified Competencies
              </span>
              <span className="text-[10px] font-technical text-emerald-800 font-bold uppercase bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                {officer.verifiedCredentialsCount} Accredited
              </span>
            </div>

            <div className="space-y-2">
              {officer.competencies
                .filter((c) => c.verification === 'SYSTEM-VERIFIED')
                .map((comp) => (
                  <div
                    key={comp.id}
                    className="p-2.5 bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <span className="font-bold text-zinc-950 font-heading block">
                          {comp.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-technical">
                          Domain: {comp.domain}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-technical">
                      <span className="text-sm font-bold text-zinc-950">{comp.currentScore}%</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Learning History & Achievements */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-zinc-300">
          {/* Learning History */}
          <div className="space-y-3">
            <span className="text-xs font-technical uppercase font-bold text-zinc-900 tracking-wider block">
              Curricular Learning History (Recent)
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#FAF9F6] border border-zinc-200 space-y-1">
                <div className="flex justify-between font-technical text-[10px]">
                  <span className="text-zinc-500">NSSTA Greater Noida · 2024</span>
                  <span className="text-emerald-700 font-bold">Passed (92%)</span>
                </div>
                <div className="font-bold text-zinc-950">
                  Data Quality Assurance & Validation Consistency Protocols
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-zinc-200 space-y-1">
                <div className="flex justify-between font-technical text-[10px]">
                  <span className="text-zinc-500">iGOT Karmayogi · 2023</span>
                  <span className="text-emerald-700 font-bold">Completed (100%)</span>
                </div>
                <div className="font-bold text-zinc-950">
                  Public Data Dissemination & Official Statistics Ethics
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-zinc-200 space-y-1">
                <div className="flex justify-between font-technical text-[10px]">
                  <span className="text-zinc-500">NSSTA TPAC · 2023</span>
                  <span className="text-emerald-700 font-bold">Certified</span>
                </div>
                <div className="font-bold text-zinc-950">
                  Digital Data Capture (CAPI / CSPro) Field Administration
                </div>
              </div>
            </div>
          </div>

          {/* Achievements & Honors */}
          <div className="space-y-3">
            <span className="text-xs font-technical uppercase font-bold text-zinc-900 tracking-wider block">
              Official Honors & Field Commendations
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-300 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-zinc-950 font-heading">
                    National Quality Audit Commendation (2024)
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    Cleared 99.2% consistency checks across 4 survey districts in Northern Zone.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-300 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-zinc-950 font-heading">
                    10-Year Statistical Cadre Long-Service Medal
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    Recognized by Ministry for dedicated service in Subordinate Statistical Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* At-Risk Skills Warning & Assessment History */}
        <div className="p-8 bg-[#FAF9F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-technical uppercase font-bold text-amber-900 block">
                FLAGGED FOR REFRESHER INTERVENTION
              </span>
              <p className="text-xs text-zinc-700">
                2 competencies at risk: <strong>Sampling Methodology (82% → 68%)</strong> and <strong>GIS Spatial Analytics (48% → 35%)</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('skill-decay')}
            className="px-4 py-2 bg-zinc-950 hover:bg-black text-amber-300 border border-zinc-900 text-xs font-technical uppercase tracking-wider font-bold transition-colors shrink-0 cursor-pointer"
          >
            Inspect AI Readiness Projection
          </button>
        </div>

        {/* Passport Machine-Readable Zone Footer */}
        <div className="bg-zinc-900 text-zinc-400 p-4 border-t border-zinc-800 font-mono text-[11px] tracking-widest overflow-x-auto select-none">
          <div>P&lt;IND&lt;&lt;KUMAR&lt;&lt;RAJESH&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
          <div>SS8842MOSPI9IND7408125M2901155SSS&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</div>
        </div>
      </div>
    </div>
  );
};
