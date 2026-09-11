import React, { useState } from 'react';
import { OfficerProfile, CompetencyDomain, VerificationType } from '../../types';
import {
  BrainCircuit,
  ShieldCheck,
  UserCheck,
  Filter,
  ArrowUpRight,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  Building2,
  Briefcase,
} from 'lucide-react';

interface CompetencyIntelligenceViewProps {
  officer: OfficerProfile;
  onNavigate: (viewId: string) => void;
}

export const CompetencyIntelligenceView: React.FC<CompetencyIntelligenceViewProps> = ({
  officer,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'REQUIRED' | 'ADDITIONAL'>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedVerification, setSelectedVerification] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const domains: (CompetencyDomain | 'All')[] = [
    'All',
    'Statistical',
    'Technical',
    'Digital Governance',
    'Behavioural & Managerial',
  ];

  const primaryDomain = officer.statisticalDomain || 'Household Surveys';

  const filteredCompetencies = officer.competencies.filter((comp) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'REQUIRED' && (comp.isRequired || comp.category === 'REQUIRED')) ||
      (selectedCategory === 'ADDITIONAL' && (!comp.isRequired || comp.category === 'ADDITIONAL'));
    const matchesDomain = selectedDomain === 'All' || comp.domain === selectedDomain;
    const matchesVerification =
      selectedVerification === 'All' || comp.verification === selectedVerification;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.evidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.statisticalDomain && comp.statisticalDomain.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDomain && matchesVerification && matchesSearch;
  });

  const verifiedCount = officer.competencies.filter(
    (c) => c.verification === 'SYSTEM-VERIFIED'
  ).length;
  const selfAssessedCount = officer.competencies.filter(
    (c) => c.verification === 'SELF-ASSESSED'
  ).length;
  const requiredCount = officer.competencies.filter(
    (c) => c.isRequired || c.category === 'REQUIRED'
  ).length;
  const additionalCount = officer.competencies.filter(
    (c) => !c.isRequired || c.category === 'ADDITIONAL'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              CADRE COMPETENCY AUDIT ENGINE // DYNAMIC DOMAIN MAPPING
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Competency Intelligence Matrix
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Required competencies are dynamically determined by your official deployment hierarchy: Organization → Department → Cadre → Work Domain.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-technical text-xs">
            <div className="px-3.5 py-2 bg-amber-100 border border-amber-400 text-amber-950">
              <span className="block text-[10px] text-amber-800 font-bold uppercase">
                DOMAIN REQUIRED
              </span>
              <span className="text-base font-bold">{requiredCount} Competencies</span>
            </div>
            <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-950">
              <span className="block text-[10px] text-emerald-800 font-bold uppercase">
                SYSTEM-VERIFIED
              </span>
              <span className="text-base font-bold">{verifiedCount} Verified</span>
            </div>
            <div className="px-3.5 py-2 bg-zinc-100 border border-zinc-300 text-zinc-950">
              <span className="block text-[10px] text-zinc-600 font-bold uppercase">
                SELF-ASSESSED
              </span>
              <span className="text-base font-bold">{selfAssessedCount} Pending</span>
            </div>
          </div>
        </div>

        {/* Dynamic Mapping Hierarchy Trail */}
        <div className="mt-5 pt-4 border-t border-zinc-200 bg-zinc-50/70 p-3 text-xs font-technical flex flex-wrap items-center gap-y-2 gap-x-3 text-zinc-700">
          <span className="text-amber-900 font-bold uppercase flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            Cadre Mapping Chain:
          </span>
          <span className="bg-white border border-zinc-300 px-2 py-0.5 text-zinc-900 font-medium">
            <strong>Org:</strong> {officer.organization ? officer.organization.split('(')[0].trim() : 'MoSPI / NSO'}
          </span>
          <span className="text-zinc-400">→</span>
          <span className="bg-white border border-zinc-300 px-2 py-0.5 text-zinc-900 font-medium">
            <strong>Dept:</strong> {officer.department}
          </span>
          <span className="text-zinc-400">→</span>
          <span className="bg-white border border-zinc-300 px-2 py-0.5 text-zinc-900 font-medium">
            <strong>Cadre:</strong> {officer.cadre}
          </span>
          <span className="text-zinc-400">→</span>
          <span className="bg-white border border-zinc-300 px-2 py-0.5 text-zinc-900 font-medium">
            <strong>Designation:</strong> {officer.designation}
          </span>
          <span className="text-zinc-400">→</span>
          <span className="bg-amber-100 border border-amber-400 px-2.5 py-0.5 text-amber-950 font-bold">
            ★ Domain: {primaryDomain}
          </span>
        </div>
      </div>

      {/* Verification Policy Notice */}
      <div className="bg-[#FAF9F7] border-l-4 border-l-amber-500 border border-zinc-300 p-4 text-xs font-sans text-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-zinc-950 font-heading">
              Official FRAC Metamodel Policy:
            </span>{' '}
            Required competencies are strictly matched to your statistical domain ({primaryDomain}). Cross-cutting behavioural and general digital skills are catalogued separately as additional competencies.
          </div>
        </div>
        <button
          onClick={() => onNavigate('officer-quiz')}
          className="px-4 py-1.5 bg-zinc-950 hover:bg-black text-amber-300 text-xs font-technical uppercase font-bold tracking-wider shrink-0 transition-colors cursor-pointer"
        >
          Verify Pending Skills
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-300 p-4 flex flex-col gap-3">
        {/* Row 1: Category Filter (Required vs Additional) */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-200">
          <span className="text-xs font-technical uppercase text-zinc-500 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
            }`}
          >
            All ({officer.competencies.length})
          </button>
          <button
            onClick={() => setSelectedCategory('REQUIRED')}
            className={`px-3 py-1 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer ${
              selectedCategory === 'REQUIRED'
                ? 'bg-amber-500 text-zinc-950 font-bold border border-amber-600'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300'
            }`}
          >
            ★ Required Cadre Skills ({requiredCount})
          </button>
          <button
            onClick={() => setSelectedCategory('ADDITIONAL')}
            className={`px-3 py-1 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer ${
              selectedCategory === 'ADDITIONAL'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
            }`}
          >
            Additional / Cross-Cutting ({additionalCount})
          </button>
        </div>

        {/* Row 2: Domain Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-technical uppercase text-zinc-500 font-bold mr-1">
              Domain:
            </span>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-2.5 py-1 text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedDomain === dom
                    ? 'bg-zinc-950 text-white font-bold'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="bg-zinc-100 border border-zinc-300 px-3 py-1 text-xs font-technical uppercase focus:outline-none"
            >
              <option value="All">All Verification</option>
              <option value="SYSTEM-VERIFIED">System-Verified</option>
              <option value="SELF-ASSESSED">Self-Assessed</option>
            </select>

            <input
              type="text"
              placeholder="Search competency or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FAF9F6] border border-zinc-300 px-3 py-1 text-xs font-sans focus:outline-none focus:border-zinc-900 w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Competencies Table / Card Grid */}
      <div className="space-y-3">
        {filteredCompetencies.length === 0 ? (
          <div className="p-8 bg-white border border-zinc-300 text-center text-zinc-600 text-xs font-sans">
            No competencies found matching your filter criteria.
          </div>
        ) : (
          filteredCompetencies.map((comp) => {
            const gap = comp.targetScore - comp.currentScore;
            const isVerified = comp.verification === 'SYSTEM-VERIFIED';
            const isRequired = comp.isRequired || comp.category === 'REQUIRED';

            return (
              <div
                key={comp.id}
                className="bg-white border border-zinc-300 p-5 hover:border-zinc-900 transition-colors shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Competency Name & Domain */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-950 font-heading">
                        {comp.name}
                      </h3>
                      {/* Required vs Additional Badge */}
                      <span
                        className={`text-[10px] font-technical font-bold uppercase tracking-wider px-2 py-0.5 border ${
                          isRequired
                            ? 'bg-amber-100 text-amber-950 border-amber-400'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                        }`}
                      >
                        {isRequired ? '★ REQUIRED CADRE SKILL' : 'ADDITIONAL / GENERAL'}
                      </span>
                      {/* Verification Badge */}
                      <span
                        className={`text-[10px] font-technical font-bold uppercase tracking-wider px-2 py-0.5 border ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                        }`}
                      >
                        {comp.verification}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-technical text-zinc-500">
                      <span className="font-semibold text-zinc-800 uppercase">
                        Domain: {comp.domain}
                      </span>
                      {comp.statisticalDomain && (
                        <>
                          <span>•</span>
                          <span className="text-amber-900 font-semibold">
                            Syllabus: {comp.statisticalDomain}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="truncate max-w-sm">
                        Evidence: <strong className="text-zinc-900 font-sans font-normal">{comp.evidence}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right: Scores, Delta & Action */}
                  <div className="flex items-center gap-6 shrink-0 font-technical">
                    {/* Score Bars */}
                    <div className="w-48 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500 text-[10px]">CURRENT</span>
                        <span className="font-bold text-zinc-950">{comp.currentScore}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-2 overflow-hidden border border-zinc-200">
                        <div
                          className={`h-full ${
                            isVerified ? 'bg-amber-500' : 'bg-amber-300'
                          }`}
                          style={{ width: `${comp.currentScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500">
                        <span>Target: {comp.targetScore}%</span>
                        <span className="font-bold text-amber-900">
                          {gap > 0 ? `Gap: -${gap}%` : 'Benchmark Achieved'}
                        </span>
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div>
                      {!isVerified ? (
                        <button
                          onClick={() => onNavigate('officer-quiz')}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 border border-amber-500 text-xs font-technical font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                          title="Take verified quiz to upgrade status"
                        >
                          <span>Verify Skill</span>
                          <Play className="w-3 h-3 fill-zinc-950" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigate('skill-decay')}
                          className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 text-xs font-technical font-medium uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                          title="Inspect decay risk"
                        >
                          <span>Decay Radar</span>
                          <ArrowUpRight className="w-3 h-3 text-zinc-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
