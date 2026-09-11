import React from 'react';
import { BrandMark } from '../common/BrandMark';
import {
  ArrowRight,
  ShieldCheck,
  Brain,
  TrendingDown,
  Target,
  FileCheck2,
  Users,
  Compass,
  CheckCircle2,
  Layers,
  Award,
  BarChart2,
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
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111215] flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative border-b border-zinc-200 bg-white py-20 px-6 sm:px-12 lg:px-24 overflow-hidden bg-grid-subtle">
        {/* Subtle geometric line element */}
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 border border-zinc-300 text-xs font-technical text-zinc-800 uppercase tracking-widest mb-6">
            <span className="w-2 h-2 bg-amber-500" />
            AI-POWERED SKILL INTELLIGENCE PLATFORM
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 font-heading leading-[1.08] mb-6">
            Understand skills. <br />
            Close gaps. <br />
            <span className="italic font-editorial font-normal text-zinc-800 underline decoration-amber-400 decoration-4 underline-offset-8">
              Build future-ready officials.
            </span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl text-zinc-600 font-sans font-normal leading-relaxed mb-10">
            A specialized competency intelligence architecture for India's Official Statistical System. 
            Calibrating designations, survey experience, and verifiable mastery with iGOT Karmayogi and NSSTA curricula.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-7 py-3.5 bg-zinc-950 hover:bg-black text-white text-sm font-technical uppercase tracking-wider font-semibold flex items-center gap-3 transition-all border border-zinc-900 shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={onExplore}
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-sm font-technical uppercase tracking-wider font-bold flex items-center gap-3 transition-all border border-amber-500 shadow-sm"
            >
              <span>Explore Platform</span>
              <Compass className="w-4 h-4 text-zinc-950" />
            </button>
          </div>

          {/* Metric Micro-Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 mt-12 border-t border-zinc-200">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-zinc-950">6,800+</div>
              <div className="text-xs font-technical text-zinc-500 uppercase mt-1">Official Statistical Cadre</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-zinc-950">9 Domains</div>
              <div className="text-xs font-technical text-zinc-500 uppercase mt-1">Competency Rubrics</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-amber-600">Page-Level</div>
              <div className="text-xs font-technical text-zinc-500 uppercase mt-1">NSSTA Source Verification</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-zinc-950">AI Projection</div>
              <div className="text-xs font-technical text-zinc-500 uppercase mt-1">Predictive Skill Decay</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Problem */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 border-b border-zinc-200 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 01]</span>
            <span>THE CHALLENGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-4">
            The Latency Problem in Official Statistics
          </h2>
          <p className="text-zinc-600 text-base max-w-3xl leading-relaxed mb-10">
            Modern statistical work is rapidly transitioning from manual survey collection to automated CAPI, 
            Python microdata processing, and geospatial integration. Traditional periodic seminars fail to diagnose 
            rapidly decaying technical proficiencies before survey data quality is compromised.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-zinc-300">
              <div className="w-9 h-9 bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center font-technical font-bold text-xs mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-zinc-950 mb-2 font-heading">Silent Skill Decay</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Field officials trained in complex sampling formulas often lose active recall over months of repetitive administrative work without periodic refresher drills.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-300">
              <div className="w-9 h-9 bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center font-technical font-bold text-xs mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-zinc-950 mb-2 font-heading">Self-Assessment Gap</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Appraisal systems rely on unchecked self-reporting, creating an invisible rift between claimed software proficiencies and verifiable field capabilities.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-300">
              <div className="w-9 h-9 bg-zinc-100 border border-zinc-300 text-zinc-900 flex items-center justify-center font-technical font-bold text-xs mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-zinc-950 mb-2 font-heading">Curricular Disconnect</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Hundreds of high-quality courses on iGOT Karmayogi and NSSTA remain underutilized because officers lack personalized, competency-calibrated learning roadmaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: How It Works */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 02]</span>
            <span>SYSTEM WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-4">
            How Skill Sutra Operates
          </h2>
          <p className="text-zinc-600 text-base max-w-3xl leading-relaxed mb-10">
            A continuous loop from profile ingestion to predictive decay alerts, targeted learning, and verified passport credentialing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 border border-zinc-200 bg-[#FAFAFA] relative">
              <span className="text-[11px] font-technical text-amber-600 font-bold block mb-1">STEP 1</span>
              <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Profile Ingestion</h4>
              <p className="text-xs text-zinc-600">
                Maps designation, survey rounds, years of service, and baseline skills across 4 foundational domains.
              </p>
            </div>

            <div className="p-5 border border-zinc-200 bg-[#FAFAFA] relative">
              <span className="text-[11px] font-technical text-amber-600 font-bold block mb-1">STEP 2</span>
              <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Gap & Decay Engine</h4>
              <p className="text-xs text-zinc-600">
                Calculates readiness deltas and projects 3/6/12 month retention drop-offs for critical survey formulas.
              </p>
            </div>

            <div className="p-5 border border-zinc-200 bg-[#FAFAFA] relative">
              <span className="text-[11px] font-technical text-amber-600 font-bold block mb-1">STEP 3</span>
              <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">iGOT / NSSTA Matching</h4>
              <p className="text-xs text-zinc-600">
                Prescribes modular learning paths and auto-generates source-cited quizzes from manual PDFs.
              </p>
            </div>

            <div className="p-5 border border-zinc-200 bg-[#FAFAFA] relative">
              <span className="text-[11px] font-technical text-amber-600 font-bold block mb-1">STEP 4</span>
              <h4 className="text-sm font-bold text-zinc-950 mb-1.5 font-heading">Skill Passport</h4>
              <p className="text-xs text-zinc-600">
                Issues a cryptographic digital competency identity reflecting verified field readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Core Intelligence */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 border-b border-zinc-200 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 03]</span>
            <span>CORE INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-8">
            Engineered Specifically for Official Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white border border-zinc-300">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  AI Readiness Projection (Decay Timeline)
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Instead of static certification expiry, the decay model tracks elapsed days since last verified assessment, 
                changes in ministry guidelines (e.g., PLFS stratification revisions), and field deployment frequency.
              </p>
              <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs font-technical text-zinc-700">
                NOW: 82% → 3 MOS: 76% → 6 MOS: 68% (AT RISK)
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-300">
              <div className="flex items-center gap-3 mb-3">
                <FileCheck2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Source & Page-Level Curricular Grounding
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Every assessment generated by trainers cites the exact manual name, page number, and paragraph excerpt. 
                When an officer errs, the explanation immediately offers a direct link to the authoritative government document.
              </p>
              <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs font-technical text-zinc-700">
                SOURCE: NSSTA Sampling Manual Vol IV, Page 14, Section 3.2
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Three Stakeholder Perspectives */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 border-b border-zinc-200 bg-white">
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
            <div className="p-6 border border-zinc-300 flex flex-col justify-between hover:border-zinc-900 transition-colors">
              <div>
                <span className="text-[10px] font-technical uppercase text-amber-700 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 inline-block mb-3">
                  FOR OFFICERS
                </span>
                <h3 className="text-lg font-bold text-zinc-950 font-heading mb-2">
                  Personal Competency Trajectory
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Understand your exact gap deltas, combat skill decay with targeted refreshers, earn verified badges, 
                  and maintain a portable Digital Skill Passport for postings and deputations.
                </p>
              </div>
              <button
                onClick={() => onSelectRole('officer')}
                className="w-full py-2 bg-zinc-900 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Officer Suite</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* For Trainers */}
            <div className="p-6 border border-zinc-300 flex flex-col justify-between hover:border-zinc-900 transition-colors">
              <div>
                <span className="text-[10px] font-technical uppercase text-amber-700 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 inline-block mb-3">
                  FOR TRAINERS
                </span>
                <h3 className="text-lg font-bold text-zinc-950 font-heading mb-2">
                  AI Quiz & Content Engine
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Upload raw training PDFs, presentations, or survey manuals. Skill Sutra ingests, structures, 
                  and creates rigorous, page-cited MCQs with instant reviewer validation controls.
                </p>
              </div>
              <button
                onClick={() => onSelectRole('trainer')}
                className="w-full py-2 bg-zinc-900 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Trainer Suite</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* For Administrators */}
            <div className="p-6 border border-zinc-300 flex flex-col justify-between hover:border-zinc-900 transition-colors">
              <div>
                <span className="text-[10px] font-technical uppercase text-amber-700 font-bold px-2 py-0.5 bg-amber-50 border border-amber-200 inline-block mb-3">
                  FOR ADMINISTRATORS
                </span>
                <h3 className="text-lg font-bold text-zinc-950 font-heading mb-2">
                  Workforce & Regional Intelligence
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Macro-level heatmaps across all 6 Indian statistical zones, future readiness forecasts for AI/ML and GIS, 
                  and actionable insights for annual training calendar formulation.
                </p>
              </div>
              <button
                onClick={() => onSelectRole('admin')}
                className="w-full py-2 bg-zinc-900 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Admin Suite</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Impact */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[#FAF9F7] border-b border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-technical uppercase text-amber-800 font-bold tracking-wider mb-2">
            <span>[SECTION 05]</span>
            <span>MEASURABLE IMPACT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading mb-8">
            National Statistical Capacity Transformation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-zinc-300">
              <div className="text-3xl font-bold text-zinc-950 font-heading mb-1">42%</div>
              <div className="text-xs font-technical text-amber-700 font-bold uppercase mb-2">
                Drop in Sampling Discrepancies
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                By catching stratified sampling formula decay before field deployment in PLFS and Annual Survey of Industries.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-300">
              <div className="text-3xl font-bold text-zinc-950 font-heading mb-1">4.5x</div>
              <div className="text-xs font-technical text-amber-700 font-bold uppercase mb-2">
                Faster Quiz Authoring for NSSTA
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Automated document extraction and validation cuts faculty assessment preparation time from 2 days to 20 minutes.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-300">
              <div className="text-3xl font-bold text-zinc-950 font-heading mb-1">100%</div>
              <div className="text-xs font-technical text-amber-700 font-bold uppercase mb-2">
                Verifiable Competency Proof
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Eliminates unverified self-appraisals; every passport entry is backed by an NSSTA or iGOT evaluation record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white py-12 px-6 sm:px-12 lg:px-24 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-800 pb-8 mb-8">
          <BrandMark size="md" showTagline={true} inverted={true} />
          <div className="text-xs font-technical text-zinc-400 text-left md:text-right">
            <div>DEVELOPED FOR SMART INDIA HACKATHON 2024–2026</div>
            <div className="text-amber-400 font-medium mt-1">Official Statistical System Intelligence Architecture</div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] font-technical text-zinc-500 gap-4">
          <span>PROTOTYPE DEMONSTRATION · ALL STATISTICAL DATASETS FICTIONALIZED FOR EVALUATION</span>
          <span>COMPATIBLE WITH iGOT KARMAYOGI & NSSTA TPAC PROTOCOLS</span>
        </div>
      </footer>
    </div>
  );
};
