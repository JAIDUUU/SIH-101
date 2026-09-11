import React, { useState } from 'react';
import { OfficerProfile } from '../../types';
import {
  TrendingDown,
  AlertTriangle,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Info,
  Play,
  RotateCw,
  Calendar,
} from 'lucide-react';

interface SkillDecayViewProps {
  officer: OfficerProfile;
  onNavigate: (viewId: string) => void;
}

export const SkillDecayView: React.FC<SkillDecayViewProps> = ({
  officer,
  onNavigate,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'3m' | '6m' | '12m'>('6m');

  const atRiskCompetencies = officer.competencies.filter(
    (c) => c.decayRisk && c.decayRisk.isAtRisk
  );

  return (
    <div className="space-y-6">
      {/* Top Disclaimer & Title Card */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-technical uppercase tracking-widest text-amber-900 font-bold bg-amber-100 border border-amber-300 px-2 py-0.5">
                AI READINESS PROJECTION
              </span>
              <span className="text-xs font-technical text-zinc-500">
                TEMPORAL SKILL DECAY SIMULATOR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Predictive Competency Retention & Skill Decay
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Detecting silent competency degradation caused by operational routine, guideline revisions, and lack of verified laboratory practice.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-300 p-2 font-technical text-xs text-zinc-700">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-[11px] leading-tight">
              Algorithmic projection based on elapsed intervals & PLFS/ASI syllabus updates. Not a scientifically certified clinical psychometric.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Time Horizon Switcher */}
      <div className="bg-white border border-zinc-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-technical uppercase font-bold text-zinc-700">
            Forecast Horizon:
          </span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 p-1 border border-zinc-300">
          <button
            onClick={() => setSelectedHorizon('3m')}
            className={`px-4 py-1.5 text-xs font-technical uppercase tracking-wider transition-all ${
              selectedHorizon === '3m'
                ? 'bg-zinc-950 text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            3 Months (Quarterly)
          </button>
          <button
            onClick={() => setSelectedHorizon('6m')}
            className={`px-4 py-1.5 text-xs font-technical uppercase tracking-wider transition-all ${
              selectedHorizon === '6m'
                ? 'bg-zinc-950 text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            6 Months (Semi-Annual)
          </button>
          <button
            onClick={() => setSelectedHorizon('12m')}
            className={`px-4 py-1.5 text-xs font-technical uppercase tracking-wider transition-all ${
              selectedHorizon === '12m'
                ? 'bg-zinc-950 text-white font-bold shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            12 Months (Annual Audit)
          </button>
        </div>
      </div>

      {/* At-Risk Competency Cards */}
      <div className="space-y-6">
        {atRiskCompetencies.map((comp) => {
          const decay = comp.decayRisk!;
          const projectedScore =
            selectedHorizon === '3m'
              ? decay.projected3m
              : selectedHorizon === '6m'
              ? decay.projected6m
              : decay.projected12m;

          const delta = projectedScore - comp.currentScore;

          return (
            <div
              key={comp.id}
              className="bg-white border-2 border-amber-400 p-6 shadow-sm space-y-6"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-technical font-bold uppercase text-amber-900 bg-amber-200 px-2 py-0.5 border border-amber-300">
                      AT RISK OF DECAY
                    </span>
                    <span className="text-xs font-technical text-zinc-500">
                      Last Assessed: {decay.lastAssessed}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950 font-heading mt-1">
                    {comp.name}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Domain: {comp.domain} · Reason: {decay.decayReason}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-technical">
                  <div className="text-right">
                    <span className="text-zinc-500 block text-[10px]">CURRENT SCORE</span>
                    <span className="text-2xl font-bold text-zinc-950 font-heading">
                      {comp.currentScore}%
                    </span>
                  </div>
                  <div className="text-zinc-300 text-xl font-light">→</div>
                  <div className="text-right">
                    <span className="text-amber-800 block text-[10px] font-bold uppercase">
                      IN {selectedHorizon.toUpperCase()}
                    </span>
                    <span className="text-2xl font-bold text-amber-700 font-heading">
                      {projectedScore}%
                    </span>
                  </div>
                  <div className="px-2.5 py-1 bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs">
                    {delta}%
                  </div>
                </div>
              </div>

              {/* Clean Timeline: NOW → 3 MONTHS → 6 MONTHS → 12 MONTHS (Exact requirement) */}
              <div>
                <div className="text-[10px] font-technical uppercase font-bold text-zinc-500 mb-3 tracking-wider">
                  TIMELINE DECAY TRAJECTORY // WITHOUT INTERVENTION
                </div>

                <div className="grid grid-cols-4 gap-2 text-center font-technical">
                  {/* Step 1: NOW */}
                  <div className="p-3 bg-zinc-950 text-white border border-zinc-900">
                    <span className="text-[10px] text-amber-400 font-bold block mb-1">
                      NOW
                    </span>
                    <div className="text-xl font-bold">{comp.currentScore}%</div>
                    <span className="text-[10px] text-zinc-400 block mt-1">Verified Baseline</span>
                  </div>

                  {/* Step 2: 3 MONTHS */}
                  <div className="p-3 bg-zinc-100 text-zinc-900 border border-zinc-300">
                    <span className="text-[10px] text-zinc-600 font-bold block mb-1">
                      3 MONTHS
                    </span>
                    <div className="text-xl font-bold text-zinc-950">{decay.projected3m}%</div>
                    <span className="text-[10px] text-zinc-500 block mt-1">Minor Latency</span>
                  </div>

                  {/* Step 3: 6 MONTHS */}
                  <div className="p-3 bg-amber-50 text-amber-950 border-2 border-amber-400">
                    <span className="text-[10px] text-amber-800 font-bold block mb-1">
                      6 MONTHS
                    </span>
                    <div className="text-xl font-bold text-amber-900">{decay.projected6m}%</div>
                    <span className="text-[10px] text-amber-800 font-bold block mt-1">
                      AT RISK (CRITICAL)
                    </span>
                  </div>

                  {/* Step 4: 12 MONTHS */}
                  <div className="p-3 bg-zinc-50 text-zinc-900 border border-zinc-300">
                    <span className="text-[10px] text-zinc-600 font-bold block mb-1">
                      12 MONTHS
                    </span>
                    <div className="text-xl font-bold text-zinc-700">{decay.projected12m}%</div>
                    <span className="text-[10px] text-zinc-500 block mt-1">Significant Erosion</span>
                  </div>
                </div>
              </div>

              {/* Recommended Refresher Box */}
              <div className="bg-[#FAF9F7] border border-zinc-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-400 text-black flex items-center justify-center shrink-0 font-technical font-bold text-xs">
                    REF
                  </div>
                  <div>
                    <span className="text-[10px] font-technical uppercase font-bold text-amber-900 block">
                      RECOMMENDED PREVENTIVE REFRESHER
                    </span>
                    <h4 className="text-sm font-bold text-zinc-950 font-heading">
                      {decay.refresherTitle}
                    </h4>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      10-minute micro-assessment or 4-hour NSSTA TPAC laboratory drill restores 12-month certification.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate('officer-quiz')}
                    className="px-4 py-2 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Take Refresher Quiz</span>
                    <Play className="w-3.5 h-3.5 fill-amber-400" />
                  </button>
                  <button
                    onClick={() => onNavigate('courses')}
                    className="px-3 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Course Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
