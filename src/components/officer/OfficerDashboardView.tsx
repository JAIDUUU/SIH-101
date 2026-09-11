import React from 'react';
import { OfficerProfile } from '../../types';
import { RadarChart } from '../common/RadarChart';
import {
  TrendingUp,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Award,
  ArrowRight,
  Sparkles,
  CreditCard,
  Play,
  Clock,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface OfficerDashboardViewProps {
  officer: OfficerProfile;
  onNavigate: (viewId: string) => void;
  onOpenAssistant: () => void;
}

export const OfficerDashboardView: React.FC<OfficerDashboardViewProps> = ({
  officer,
  onNavigate,
  onOpenAssistant,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Welcome & Cadre Status Banner */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-technical uppercase font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5">
                ACTIVE CADRE MEMBER
              </span>
              <span className="text-xs font-technical text-zinc-500">
                {officer.cadre} · {officer.station}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Officer Competency Console // {officer.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              {officer.designation} · {officer.department} · {officer.experienceYears} Years Service
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('profile-setup')}
              className="px-3 sm:px-4 py-2 border border-zinc-900 bg-amber-50 hover:bg-amber-100 text-zinc-950 text-xs font-technical uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              <span>{officer.isProfileSetup ? 'Update Profile' : 'Setup Profile'}</span>
            </button>
            <button
              onClick={() => onNavigate('skill-passport')}
              className="px-3 sm:px-4 py-2 border border-zinc-900 bg-white hover:bg-zinc-100 text-xs font-technical uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Skill Passport</span>
            </button>
            <button
              onClick={onOpenAssistant}
              className="px-3 sm:px-4 py-2 bg-zinc-950 hover:bg-black text-amber-300 hover:text-amber-200 text-xs font-technical uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Setup Pending Alert */}
      {!officer.isProfileSetup && (
        <div className="bg-amber-50/90 border-2 border-amber-600 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-technical uppercase font-bold text-amber-950 bg-amber-200 border border-amber-400 px-2 py-0.5">
                ONBOARDING ACTION REQUIRED
              </span>
              <span className="text-xs font-technical text-amber-900">
                Official Profile Not Yet Configured
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 font-heading">
              Configure your Cadre, Posting & Competencies
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 max-w-2xl font-sans">
              You have not yet submitted your official cadre details, posting station, or baseline self-assessment. Until setup is completed, your competency graph shows initial baseline values.
            </p>
          </div>
          <button
            onClick={() => onNavigate('profile-setup')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-technical uppercase tracking-wider font-bold shadow-sm transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Start Profile Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary KPI Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Readiness */}
        <div
          onClick={() => onNavigate('competencies')}
          className="p-5 bg-white border border-zinc-300 hover:border-zinc-900 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-technical uppercase text-zinc-500 mb-2">
            <span>OVERALL READINESS</span>
            <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-heading text-zinc-950">
              {officer.readinessScore}%
            </span>
            <span className="text-xs font-technical text-emerald-700 font-semibold">
              +4% vs Q3
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${officer.readinessScore}%` }}
            />
          </div>
          <div className="text-[11px] font-technical text-zinc-500 mt-2">
            Benchmark for SSO Promotion: 80%
          </div>
        </div>

        {/* Card 2: Current Learning */}
        <div
          onClick={() => onNavigate('courses')}
          className="p-5 bg-white border border-zinc-300 hover:border-zinc-900 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-technical uppercase text-zinc-500 mb-2">
            <span>CURRENT LEARNING</span>
            <BookOpen className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">
            {officer.activeCourses.length} Courses
          </div>
          <div className="text-xs font-technical text-amber-800 font-medium mt-1 truncate">
            {officer.activeCourses[0]?.title || 'Active Track'}
          </div>
          <div className="text-[11px] font-technical text-zinc-500 mt-2">
            {officer.activeCourses[0]?.progress}% overall path completed
          </div>
        </div>

        {/* Card 3: Completed Training */}
        <div
          onClick={() => onNavigate('skill-passport')}
          className="p-5 bg-white border border-zinc-300 hover:border-zinc-900 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-technical uppercase text-zinc-500 mb-2">
            <span>VERIFIED CREDENTIALS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold font-heading text-zinc-950">
            {officer.verifiedCredentialsCount} Badges
          </div>
          <div className="text-xs font-technical text-zinc-600 mt-1">
            {officer.completedCoursesCount} modules completed
          </div>
          <div className="text-[11px] font-technical text-zinc-500 mt-2">
            Ledger indexed via NSSTA & iGOT
          </div>
        </div>

        {/* Card 4: At-Risk Skills */}
        <div
          onClick={() => onNavigate('skill-decay')}
          className="p-5 bg-amber-50/70 border border-amber-300 hover:border-amber-500 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-technical uppercase text-amber-900 font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              AT-RISK SKILLS
            </span>
            <span className="text-[10px] bg-amber-200 text-amber-950 px-1 font-mono font-bold">
              2 FLAGGED
            </span>
          </div>
          <div className="text-3xl font-bold font-heading text-amber-950">
            {officer.atRiskSkills.length} Areas
          </div>
          <div className="text-xs font-technical text-amber-800 mt-1 truncate">
            {officer.atRiskSkills.join(', ')}
          </div>
          <div className="text-[11px] font-technical text-amber-900/80 mt-2 font-semibold">
            Decay expected in 3–6 months →
          </div>
        </div>
      </div>

      {/* "Next Best Action" Banner (Required by prompt) */}
      <div className="bg-[#FAF9F7] border-2 border-amber-400 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-technical font-bold uppercase tracking-widest text-amber-900 bg-amber-200 px-2 py-0.5">
                AI RECOMMENDATION // NEXT BEST ACTION
              </span>
              <span className="text-xs font-technical text-zinc-500">
                MATCH CONFIDENCE: 96%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-heading">
              Your biggest current gap is{' '}
              <span className="underline decoration-amber-500 decoration-3">
                Python for Statistical Analysis
              </span>
              .
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl font-sans">
              Your Technical domain score sits at 46%, significantly lagging your Statistical mastery (82%). 
              Completing this foundational NSSTA microdata processing module will elevate your technical score by an estimated +18%.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-technical text-zinc-700 pt-1">
              <span>SOURCE: <strong>NSSTA TPAC</strong></span>
              <span>•</span>
              <span>DURATION: <strong>18 Hours (Self-paced + Labs)</strong></span>
              <span>•</span>
              <span>DIFFICULTY: <strong>Intermediate</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('courses')}
              className="px-6 py-3 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 border border-zinc-900 cursor-pointer"
            >
              <span>Enroll / Resume Course</span>
              <Play className="w-3.5 h-3.5 fill-amber-400" />
            </button>
            <button
              onClick={() => onNavigate('learning-path')}
              className="px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-technical uppercase tracking-wider font-semibold transition-colors border border-zinc-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Full Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart vs Skill Gaps & Active Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 cols): Competency Radar Chart & Skill Passport Mini Preview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Radar Chart Box */}
          <div className="bg-white border border-zinc-300 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div>
                <div className="text-[10px] font-technical uppercase tracking-wider text-zinc-500 font-bold">
                  DOMAIN POLYGON
                </div>
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Competency Radar Profile
                </h3>
              </div>
              <button
                onClick={() => onNavigate('competencies')}
                className="text-xs font-technical text-amber-800 hover:underline uppercase font-bold"
              >
                Inspect All →
              </button>
            </div>

            <div className="py-2 flex justify-center">
              <RadarChart domainScores={officer.domainScores} size={270} />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-200 text-xs font-technical">
              <div className="p-2 bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500 block text-[10px]">HIGHEST DOMAIN</span>
                <span className="font-bold text-zinc-950">Statistical (82%)</span>
              </div>
              <div className="p-2 bg-amber-50 border border-amber-300">
                <span className="text-amber-800 block text-[10px] font-bold">PRIORITY DEFICIT</span>
                <span className="font-bold text-zinc-950">Technical (46%)</span>
              </div>
            </div>
          </div>

          {/* Skill Passport Mini Preview Card */}
          <div className="bg-zinc-950 text-white p-6 border border-zinc-900 relative shadow-md">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-amber-400 text-black flex items-center justify-center font-technical font-bold text-xs">
                  ID
                </div>
                <div>
                  <span className="text-[10px] font-technical text-amber-400 tracking-wider uppercase block">
                    DIGITAL SKILL IDENTITY
                  </span>
                  <span className="text-xs font-bold text-zinc-200 font-mono">
                    {officer.passportId}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-technical text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5">
                VERIFIED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400 font-technical">Cadre Designation:</span>
                <span className="font-semibold text-zinc-100">{officer.designation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400 font-technical">Service Tenor:</span>
                <span className="font-semibold text-zinc-100">{officer.experienceYears} Years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400 font-technical">Verified Credentials:</span>
                <span className="font-semibold text-amber-300">{officer.verifiedCredentialsCount} NSSTA/iGOT Badges</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('skill-passport')}
              className="mt-5 w-full py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-technical uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Full Digital Passport</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-950" />
            </button>
          </div>
        </div>

        {/* Right Col (7 cols): Current Skill Gaps & Active Learning Modules */}
        <div className="lg:col-span-7 space-y-6">
          {/* Current Skill Gaps Table */}
          <div className="bg-white border border-zinc-300 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div>
                <div className="text-[10px] font-technical uppercase tracking-wider text-zinc-500 font-bold">
                  DIAGNOSTIC GAP MATRIX
                </div>
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Current Skill Gaps & Target Thresholds
                </h3>
              </div>
              <span className="text-xs font-technical text-zinc-500">
                Ranked by Cadre Priority
              </span>
            </div>

            <div className="space-y-3">
              {officer.competencies
                .filter((c) => c.currentScore < c.targetScore)
                .slice(0, 4)
                .map((comp) => {
                  const gap = comp.targetScore - comp.currentScore;
                  return (
                    <div
                      key={comp.id}
                      className="p-3.5 border border-zinc-200 bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-400 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-950 font-heading">
                            {comp.name}
                          </span>
                          <span
                            className={`text-[9px] font-technical px-1.5 py-0.2 font-semibold ${
                              comp.verification === 'SYSTEM-VERIFIED'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {comp.verification}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-sans">
                          Domain: {comp.domain} · {comp.evidence.slice(0, 55)}...
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-technical text-xs">
                        <div className="text-right">
                          <span className="text-zinc-500 block text-[10px]">CURRENT / TARGET</span>
                          <span className="font-bold text-zinc-950">
                            {comp.currentScore}% / {comp.targetScore}%
                          </span>
                        </div>
                        <div className="px-2.5 py-1 bg-zinc-200/80 font-bold text-zinc-900 border border-zinc-300 text-center min-w-16">
                          Δ -{gap}%
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-between items-center text-xs font-technical">
              <span className="text-zinc-500">Showing top 4 high-impact gaps</span>
              <button
                onClick={() => onNavigate('competencies')}
                className="text-amber-800 hover:underline font-bold uppercase flex items-center gap-1"
              >
                <span>View Full Competency Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Learning Progress */}
          <div className="bg-white border border-zinc-300 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div>
                <div className="text-[10px] font-technical uppercase tracking-wider text-zinc-500 font-bold">
                  ACTIVE CURRICULAR DRILLS
                </div>
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Enrolled iGOT & NSSTA Modules
                </h3>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="text-xs font-technical text-amber-800 hover:underline uppercase font-bold"
              >
                Catalogue →
              </button>
            </div>

            <div className="space-y-4">
              {officer.activeCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border border-zinc-200 bg-[#FAFAFA] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-technical uppercase font-bold px-1.5 py-0.2 bg-zinc-900 text-white">
                          {c.provider}
                        </span>
                        <span className="text-xs font-technical text-zinc-500">
                          {c.duration}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-950 font-heading mt-1">
                        {c.title}
                      </h4>
                    </div>
                    <span className="text-xs font-technical font-bold text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
                      {c.progress}% DONE
                    </span>
                  </div>

                  <div className="w-full bg-zinc-200 h-1.5">
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-zinc-500 font-technical">
                      Next: Unit 3 · Sampling Weight Algorithms
                    </span>
                    <button
                      onClick={() => onNavigate('courses')}
                      className="text-xs font-technical font-semibold text-zinc-900 hover:text-black flex items-center gap-1 cursor-pointer"
                    >
                      <span>Resume Unit</span>
                      <Play className="w-3 h-3 text-amber-600 fill-amber-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
