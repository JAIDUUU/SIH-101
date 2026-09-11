import React, { useState } from 'react';
import { BrandMark } from '../common/BrandMark';
import { LiveTelemetryTerminal } from './LiveTelemetryTerminal';
import {
  ArrowRight,
  TrendingDown,
  Target,
  FileCheck2,
  Compass,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';

interface LandingPageViewProps {
  onGetStarted: () => void;
  onExplore: () => void;
  onSelectRole: (role: 'officer' | 'trainer' | 'admin') => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onGetStarted,
  onExplore,
  onSelectRole,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleScrollToWorkflow = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExplore();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111215] flex flex-col font-sans">
      {/* 1. Hero Section with Live Telemetry Terminal */}
      <section className="relative border-b border-zinc-200/90 bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 px-5 sm:px-10 lg:px-20 overflow-hidden bg-grid-subtle">
        <div className="max-w-5xl mx-auto">
          {/* Terminal Command Line + Institutional Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 text-amber-400 rounded-md border border-zinc-900 text-xs font-technical uppercase tracking-wider font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-subtle-pulse" />
                MoSPI // DIID
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-md border border-zinc-300/80 text-xs font-technical text-zinc-800 uppercase tracking-wider font-medium">
                iGOT Karmayogi &amp; NSSTA Integrated
              </div>
            </div>

            {/* Terminal status with continuous blinking caret */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-[#FAF9F7] rounded-md border border-zinc-200 text-xs font-technical text-zinc-700">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" />
              <span>$ skill-sutra --mode live-telemetry</span>
              <span className="inline-block w-2 h-3.5 bg-amber-500 animate-terminal-blink align-middle ml-0.5" />
            </div>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 font-heading leading-[1.12] mb-3">
            Know what your officers need to learn.
          </h1>
          <p className="text-xl sm:text-2xl text-amber-800 font-heading font-medium tracking-tight mb-5">
            AI-powered competency intelligence for India's Official Statistical System.
          </p>

          {/* Hero Summary */}
          <p className="max-w-2xl text-base sm:text-lg text-zinc-600 font-sans leading-relaxed mb-8">
            Skill Sutra builds a role-specific competency profile, identifies skill gaps, recommends relevant training, and verifies learning through AI-powered assessments.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-12">
            <button
              id="hero-get-started-btn"
              onClick={onGetStarted}
              className="px-7 py-3.5 bg-zinc-950 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold rounded-lg flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 border border-zinc-900 shadow-sm cursor-pointer"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <button
              id="hero-see-how-it-works-btn"
              onClick={handleScrollToWorkflow}
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-technical uppercase tracking-wider font-bold rounded-lg flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 border border-amber-500 shadow-sm cursor-pointer"
            >
              <span>SEE HOW IT WORKS</span>
              <Compass className="w-4 h-4 text-zinc-950" />
            </button>
          </div>

          {/* Live Telemetry Terminal Window */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2 text-xs font-technical text-zinc-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-beacon-green" />
                <span>REAL-TIME SYSTEM STREAM // NSSTA EVALUATION GATEWAY</span>
              </div>
              <span className="text-[11px] font-technical text-zinc-400 font-bold">
                OFFICIAL NATIONAL PORTAL
              </span>
            </div>
            <LiveTelemetryTerminal />
          </div>

          {/* Product Capabilities (Grounded Product Features with Terminal Micro-Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-zinc-200/80">
            <div className="terminal-card p-4.5 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-technical font-bold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                    ROLE-SPECIFIC
                  </span>
                  <span className="text-[10px] font-technical text-zinc-400">[CAP-01]</span>
                </div>
                <div className="text-sm font-bold text-zinc-950 font-heading">Competency mapping</div>
                <div className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Designation, posting &amp; statistical domain aligned baselines.
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-technical text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-subtle-pulse" />
                <span>MoSPI Cadres: JSO / SSO / ISS</span>
              </div>
            </div>

            <div className="terminal-card p-4.5 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-technical font-bold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                    AI-POWERED
                  </span>
                  <span className="text-[10px] font-technical text-zinc-400">[CAP-02]</span>
                </div>
                <div className="text-sm font-bold text-zinc-950 font-heading">Assessment &amp; recommendations</div>
                <div className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Grounded skill gap detection paired with ranked iGOT modules.
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-technical text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-subtle-pulse" />
                <span>Dynamic Gap Prioritization</span>
              </div>
            </div>

            <div className="terminal-card p-4.5 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-technical font-bold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                    SOURCE-GROUNDED
                  </span>
                  <span className="text-[10px] font-technical text-zinc-400">[CAP-03]</span>
                </div>
                <div className="text-sm font-bold text-zinc-950 font-heading">Quiz evidence</div>
                <div className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Questions extracted with chapter and page-level manual citations.
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-technical text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-subtle-pulse" />
                <span>Faculty Review Before Publish</span>
              </div>
            </div>

            <div className="terminal-card p-4.5 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-technical font-bold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                    SKILL-READY
                  </span>
                  <span className="text-[10px] font-technical text-zinc-400">[CAP-04]</span>
                </div>
                <div className="text-sm font-bold text-zinc-950 font-heading">Readiness &amp; decay tracking</div>
                <div className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Timely refresher alerts based on elapsed interval &amp; syllabus.
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-technical text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-subtle-pulse" />
                <span>Refreshed on Verified Exam</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Challenge Section */}
      <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-20 border-b border-zinc-200/90 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 01]</span>
            <span>THE CHALLENGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-3">
            Why existing training is not enough
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed mb-10">
            Officials in India's statistical cadres handle critical, specialized operations across National Accounts, Price Statistics, and Field Operations. Traditional generic training lacks role-specific diagnostic depth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center font-technical font-bold text-xs mb-4">
                01
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-2 font-heading uppercase tracking-wide">
                SKILL GAPS STAY HIDDEN
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Officers may complete training without knowing which competencies still need improvement.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-technical text-zinc-400">
                <span>DIAGNOSTIC GAP</span>
              </div>
            </div>

            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center font-technical font-bold text-xs mb-4">
                02
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-2 font-heading uppercase tracking-wide">
                ONE-SIZE-FITS-ALL TRAINING
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Different statistical roles require different competencies, tools and learning paths.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-technical text-zinc-400">
                <span>ROLE MISALIGNMENT</span>
              </div>
            </div>

            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center font-technical font-bold text-xs mb-4">
                03
              </div>
              <h3 className="text-sm font-bold text-zinc-950 mb-2 font-heading uppercase tracking-wide">
                LEARNING IS HARD TO VERIFY
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Course completion alone does not show whether an officer can apply what they learned.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-technical text-zinc-400">
                <span>VERIFICATION DEFICIT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Workflow Section */}
      <section id="how-it-works" className="py-16 sm:py-20 px-5 sm:px-10 lg:px-20 border-b border-zinc-200/90 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 02]</span>
            <span>SYSTEM WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-3">
            From Profile to Verified Competency
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-3xl leading-relaxed mb-10">
            A continuous intelligence loop that maps requirements, pinpoints gaps, and updates living competency records.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Step 01 */}
            <div className="terminal-card p-5 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-technical text-amber-800 font-bold">01 PROFILE</span>
                  <span className="w-2 h-2 rounded-full bg-zinc-300" />
                </div>
                <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Capture Officer Context</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Capture role, department, assignment, experience and learning history.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-technical text-zinc-500">
                MoSPI / NSO Cadre Mapping
              </div>
            </div>

            {/* Step 02 */}
            <div className="terminal-card p-5 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-technical text-amber-800 font-bold">02 ASSESS</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse" />
                </div>
                <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Diagnostic Evaluation</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Measure current competency against role-specific requirements.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-technical text-zinc-500">
                Self-Assessed vs Verified Scores
              </div>
            </div>

            {/* Step 03 */}
            <div className="terminal-card p-5 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-technical text-amber-800 font-bold">03 FIND THE GAP</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-subtle-pulse" />
                </div>
                <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Identify Vulnerabilities</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Identify the most important skills missing or at risk.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-technical text-zinc-500">
                Prioritized by Cadre Relevance
              </div>
            </div>

            {/* Step 04 */}
            <div className="terminal-card p-5 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-technical text-amber-800 font-bold">04 LEARN</span>
                  <span className="w-2 h-2 rounded-full bg-zinc-300" />
                </div>
                <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Targeted Curriculum</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Recommend relevant iGOT Karmayogi and NSSTA learning.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-technical text-zinc-500">
                Official Government Catalogues
              </div>
            </div>

            {/* Step 05 */}
            <div className="terminal-card p-5 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-technical text-amber-800 font-bold">05 VERIFY</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse" />
                </div>
                <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Source-Grounded Quizzes</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Generate grounded quizzes from training material and update competency evidence.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-technical text-zinc-500">
                Trainer Human-in-the-Loop Review
              </div>
            </div>

            {/* Step 06 */}
            <div className="terminal-card p-5 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-technical text-amber-800 font-bold">06 TRACK</span>
                  <span className="w-2 h-2 rounded-full bg-zinc-300" />
                </div>
                <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Living Skill Passport</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Maintain a living Skill Passport and readiness view.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-technical text-zinc-500">
                Decay Projections &amp; Readiness
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Intelligence Section */}
      <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-20 border-b border-zinc-200/90 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 03]</span>
            <span>CORE INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-8">
            Where the AI makes a difference
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: AI Readiness Projection */}
            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/80">
                      <TrendingDown className="w-4 h-4 text-amber-700" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      AI Readiness Projection
                    </h3>
                  </div>
                  <span className="text-[10px] font-technical text-zinc-400 font-bold">[ENGINE_DECAY]</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Estimate which verified skills may become at risk over time and surface timely refresher recommendations.
                </p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-lg border border-zinc-200 text-[11px] font-technical text-zinc-700 flex items-center justify-between">
                <span>RETENTION: 82% &rarr; 6 MOS: 68%</span>
                <span className="text-amber-800 font-semibold">[PROJECTED RISK]</span>
              </div>
            </div>

            {/* Card 2: Grounded AI Assessments */}
            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/80">
                      <FileCheck2 className="w-4 h-4 text-amber-700" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      Grounded AI Assessments
                    </h3>
                  </div>
                  <span className="text-[10px] font-technical text-zinc-400 font-bold">[ENGINE_QUIZ]</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Generate questions from uploaded training material with source and page-level evidence.
                </p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-lg border border-zinc-200 text-[11px] font-technical text-zinc-700 flex items-center justify-between">
                <span>EVIDENCE: NSSO Manual Vol IV, P.14</span>
                <span className="text-emerald-800 font-semibold">[CITED]</span>
              </div>
            </div>

            {/* Card 3: Next Best Skill */}
            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/80">
                      <Target className="w-4 h-4 text-amber-700" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      Next Best Skill
                    </h3>
                  </div>
                  <span className="text-[10px] font-technical text-zinc-400 font-bold">[ENGINE_RECOMMEND]</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Prioritize the single most relevant skill an officer should learn next based on role, gaps, learning history and risk.
                </p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-lg border border-zinc-200 text-[11px] font-technical text-zinc-700 flex items-center justify-between">
                <span>ACTION: High-Impact Gap Prioritization</span>
                <span className="text-blue-800 font-semibold">[RANKED]</span>
              </div>
            </div>

            {/* Card 4: Competency-Aware Assistant */}
            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-200/80">
                      <MessageSquare className="w-4 h-4 text-amber-700" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      Competency-Aware Assistant
                    </h3>
                  </div>
                  <span className="text-[10px] font-technical text-zinc-400 font-bold">[ENGINE_CHAT]</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Answer learning questions using the officer's role, competencies and approved learning material as context.
                </p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-lg border border-zinc-200 text-[11px] font-technical text-zinc-700 flex items-center justify-between">
                <span>CONTEXT: Official MoSPI Operational Rubrics</span>
                <span className="text-zinc-800 font-semibold">[ACTIVE]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Stakeholder Perspectives Section */}
      <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-20 border-b border-zinc-200/90 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 04]</span>
            <span>STAKEHOLDER ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-8">
            Tailored Experiences Across the Cadre
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* For Officers */}
            <div className="terminal-card p-6 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-technical uppercase text-amber-800 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200/80 rounded">
                    OFFICERS
                  </span>
                  <span className="text-[10px] font-technical text-zinc-400">JSO / SSO / ISS</span>
                </div>
                <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">
                  Personal Competency Trajectory
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  See your competency gaps, learning path, progress and verified skills.
                </p>
              </div>
              <button
                id="landing-open-officer-btn"
                onClick={() => onSelectRole('officer')}
                className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>OPEN OFFICER VIEW</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* For Trainers */}
            <div className="terminal-card p-6 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-technical uppercase text-amber-800 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200/80 rounded">
                    TRAINERS
                  </span>
                  <span className="text-[10px] font-technical text-zinc-400">NSSTA / FACULTY</span>
                </div>
                <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">
                  Grounded Quiz &amp; Verification
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Turn training material into source-grounded quizzes and review them before publishing.
                </p>
              </div>
              <button
                id="landing-open-trainer-btn"
                onClick={() => onSelectRole('trainer')}
                className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>OPEN TRAINER VIEW</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* For Administrators */}
            <div className="terminal-card p-6 rounded-xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-technical uppercase text-amber-800 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200/80 rounded">
                    ADMINISTRATORS
                  </span>
                  <span className="text-[10px] font-technical text-zinc-400">MoSPI / STATE DES</span>
                </div>
                <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">
                  Workforce &amp; Cadre Intelligence
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  See competency gaps, readiness and training needs across departments and cadres.
                </p>
              </div>
              <button
                id="landing-open-admin-btn"
                onClick={() => onSelectRole('admin')}
                className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>OPEN ADMIN VIEW</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Impact / Architectural Alignment Section */}
      <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-20 bg-[#FAF9F7] border-b border-zinc-200/90">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 05]</span>
            <span>READINESS ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-8">
            From Individual Learning to Workforce Readiness
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-technical text-amber-800 uppercase tracking-wider">
                  ONE PROFILE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-subtle-pulse" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">
                Role + domain + competency context
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Connects designation, posting, survey domain, and training history into an operational competency baseline.
              </p>
            </div>

            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-technical text-amber-800 uppercase tracking-wider">
                  ONE LEARNING LOOP
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-subtle-pulse" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">
                Assess &rarr; Learn &rarr; Verify &rarr; Update
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Seamless progression from diagnostic assessment to relevant iGOT/NSSTA curriculum and verified evaluation.
              </p>
            </div>

            <div className="terminal-card p-6 bg-white rounded-xl border border-zinc-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-technical text-amber-800 uppercase tracking-wider">
                  ONE WORKFORCE VIEW
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-subtle-pulse" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 font-heading mb-2">
                Individual competency &rarr; organisational readiness
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Aggregates verified skills across divisions to give administrators real-time visibility into statistical capacity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-zinc-950 text-white py-12 px-5 sm:px-10 lg:px-20 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-800 pb-8 mb-8">
          <BrandMark size="md" showTagline={true} inverted={true} />
          <div className="text-xs font-technical text-zinc-400 text-left md:text-right">
            <div className="font-semibold text-zinc-300 tracking-wide">
              AI-ENABLED COMPETENCY INTELLIGENCE FOR INDIA'S OFFICIAL STATISTICAL SYSTEM
            </div>
            <div className="text-amber-400 font-medium mt-1">
              Aligned with MoSPI Framework &amp; iGOT Karmayogi / NSSTA Standards
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-technical text-zinc-500 gap-4">
          <span>Ministry of Statistics and Programme Implementation (MoSPI) &amp; National Statistical Systems Training Academy (NSSTA).</span>
          <span className="font-technical text-zinc-400">COMPATIBLE WITH iGOT KARMAYOGI &amp; NSSTA TPAC PROTOCOLS</span>
        </div>
      </footer>
    </div>
  );
};
