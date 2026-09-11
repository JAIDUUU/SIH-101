import React, { useState, useEffect } from 'react';
import {
  Users2,
  TrendingUp,
  AlertTriangle,
  Globe2,
  BarChart3,
  Building,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  KeyRound,
  UserPlus,
  Lock,
  GraduationCap,
  Shield,
  Search,
  Check,
  ExternalLink
} from 'lucide-react';
import { ApiClient } from '../../services/apiClient';

interface AdminWorkforceViewProps {
  onNavigate: (viewId: string) => void;
  onSwitchToTrainer?: (trainerId?: string) => void;
}

export const AdminWorkforceView: React.FC<AdminWorkforceViewProps> = ({
  onNavigate,
  onSwitchToTrainer,
}) => {
  const [activeTab, setActiveTab] = useState<'workforce' | 'trainers'>('workforce');
  const [selectedCadre, setSelectedCadre] = useState('All');

  // Trainer Provisioning Form State (Requirement 2)
  const [trainerId, setTrainerId] = useState('');
  const [trainerPassword, setTrainerPassword] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [trainerDept, setTrainerDept] = useState('National Statistical Systems Training Academy (NSSTA)');
  const [trainerSpecialization, setTrainerSpecialization] = useState('Sampling Design & NSSO Survey Methodology');
  const [isSubmittingTrainer, setIsSubmittingTrainer] = useState(false);
  const [provisionMessage, setProvisionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Live Trainers Roster
  const [trainersList, setTrainersList] = useState<Array<{
    id: string;
    name: string;
    email: string;
    department: string;
    specialization: string;
    createdAt: string;
    status: string;
  }>>([
    {
      id: 'TR-NSSTA-101',
      name: 'Dr. S. Rao',
      email: 'dr.srao@nssta.gov.in',
      department: 'National Statistical Systems Training Academy (NSSTA)',
      specialization: 'Sampling Design & Multi-Stage Stratification',
      createdAt: '2025-01-10T10:00:00Z',
      status: 'Active',
    }
  ]);

  const loadTrainers = async () => {
    try {
      const res = await ApiClient.getTrainers();
      if (res && res.trainers) {
        setTrainersList(res.trainers);
      }
    } catch (err) {
      console.warn('Could not load trainers from server:', err);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerId.trim() || !trainerPassword.trim()) {
      setProvisionMessage({ type: 'error', text: 'Trainer ID and Password are required to provision an account.' });
      return;
    }

    setIsSubmittingTrainer(true);
    setProvisionMessage(null);

    try {
      const res = await ApiClient.createTrainer({
        trainerId: trainerId.trim(),
        password: trainerPassword.trim(),
        trainerName: trainerName.trim() || 'NSSTA Faculty Member',
        department: trainerDept.trim(),
        specialization: trainerSpecialization.trim(),
      });

      setProvisionMessage({
        type: 'success',
        text: `Trainer account successfully generated for ID: "${trainerId.trim()}". The trainer can now sign in immediately using this ID and password.`
      });

      // Reset form
      setTrainerId('');
      setTrainerPassword('');
      setTrainerName('');
      loadTrainers();
    } catch (err: any) {
      console.warn('Create trainer error:', err);
      setProvisionMessage({
        type: 'error',
        text: err.message || 'Failed to create trainer account. ID may already exist.'
      });
    } finally {
      setIsSubmittingTrainer(false);
    }
  };

  const topGaps = [
    {
      skill: 'Python & Automated ETL Microdata Scripting',
      domain: 'Technical',
      cadreDeficit: '-38%',
      impactedOfficers: 1420,
      priority: 'CRITICAL',
    },
    {
      skill: 'GIS Spatial Demarcation & Geofencing (UFS)',
      domain: 'Technical / GIS',
      cadreDeficit: '-29%',
      impactedOfficers: 980,
      priority: 'HIGH',
    },
    {
      skill: 'Jackknife & Bootstrap Sampling Variance Calibration',
      domain: 'Statistical',
      cadreDeficit: '-22%',
      impactedOfficers: 740,
      priority: 'MODERATE',
    },
    {
      skill: 'CSPro / CAPI Logic Verification & API Sync',
      domain: 'Digital Governance',
      cadreDeficit: '-17%',
      impactedOfficers: 410,
      priority: 'MODERATE',
    },
  ];

  const roleReadiness = [
    { role: 'Junior Statistical Officer (JSO)', total: 2450, readyPercent: 84, status: 'Optimal' },
    { role: 'Statistical Officer (SO)', total: 1820, readyPercent: 68, status: 'Target Deficit' },
    { role: 'Senior Statistical Officer (SSO)', total: 940, readyPercent: 62, status: 'Pipeline Alert' },
    { role: 'Assistant / Deputy Director (ISS)', total: 420, readyPercent: 74, status: 'Optimal' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-technical uppercase tracking-widest text-amber-900 font-bold bg-amber-100 border border-amber-300 px-2 py-0.5">
                ADMINISTRATION & OVERSIGHT
              </span>
              <span className="text-xs font-technical text-zinc-500">
                MOSPI HUMAN CAPITAL COMMAND
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Official Statistical Workforce Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Strategic competency telemetry across 6,800+ Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) personnel, with administrative Trainer account management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('workforce')}
              className={`px-3.5 py-2 border text-xs font-technical uppercase font-bold transition-colors cursor-pointer ${
                activeTab === 'workforce'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              Workforce Intelligence
            </button>

            <button
              onClick={() => setActiveTab('trainers')}
              className={`px-3.5 py-2 border text-xs font-technical uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'trainers'
                  ? 'bg-amber-400 text-zinc-950 border-amber-500 shadow-xs'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Provision Trainers (ID & Pass)</span>
            </button>

            <button
              onClick={() => onNavigate('future-readiness')}
              className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-technical uppercase font-bold text-zinc-900 transition-colors cursor-pointer"
            >
              2026–2028 Horizon →
            </button>
            <button
              onClick={() => onNavigate('regional-readiness')}
              className="px-3.5 py-2 bg-zinc-950 hover:bg-black text-amber-400 border border-zinc-900 text-xs font-technical uppercase font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>India Regional Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WORKFORCE INTELLIGENCE (Macro metrics, skill gaps, role readiness) */}
      {/* ========================================================================= */}
      {activeTab === 'workforce' && (
        <>
          {/* 6 Macro Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* 1. Cadre Readiness */}
            <div className="p-4 bg-white border border-zinc-300">
              <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold block mb-1">
                CADRE READINESS
              </span>
              <div className="text-2xl font-bold text-zinc-950 font-heading">68.4%</div>
              <span className="text-[10px] font-technical text-emerald-700 font-semibold block mt-1">
                +3.2% vs FY24
              </span>
            </div>

            {/* 2. Coverage */}
            <div className="p-4 bg-white border border-zinc-300">
              <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold block mb-1">
                WORKFORCE COVERAGE
              </span>
              <div className="text-2xl font-bold text-zinc-950 font-heading">94.2%</div>
              <span className="text-[10px] font-technical text-zinc-500 block mt-1">
                6,420 Active Profiles
              </span>
            </div>

            {/* 3. Top Skill Gaps */}
            <div className="p-4 bg-white border border-zinc-300">
              <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold block mb-1">
                TOP SKILL GAP
              </span>
              <div className="text-lg font-bold text-zinc-950 font-heading truncate">Python ETL</div>
              <span className="text-[10px] font-technical text-amber-800 font-semibold block mt-1">
                -38% National Delta
              </span>
            </div>

            {/* 4. Role Readiness */}
            <div className="p-4 bg-white border border-zinc-300">
              <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold block mb-1">
                ROLE BENCHMARK
              </span>
              <div className="text-2xl font-bold text-zinc-950 font-heading">72.0%</div>
              <span className="text-[10px] font-technical text-zinc-500 block mt-1">
                Across 4 Cadre Tiers
              </span>
            </div>

            {/* 5. Future Readiness Index */}
            <div className="p-4 bg-white border border-zinc-300">
              <span className="text-[10px] font-technical uppercase text-zinc-500 font-bold block mb-1">
                FUTURE READINESS
              </span>
              <div className="text-2xl font-bold text-zinc-950 font-heading">61.8%</div>
              <span className="text-[10px] font-technical text-amber-800 font-semibold block mt-1">
                AI/ML & Cloud Scale
              </span>
            </div>

            {/* 6. Interventions Needed */}
            <div className="p-4 bg-amber-50 border border-amber-300">
              <span className="text-[10px] font-technical uppercase text-amber-900 font-bold block mb-1">
                INTERVENTIONS
              </span>
              <div className="text-2xl font-bold text-amber-950 font-heading">14 Sprints</div>
              <span className="text-[10px] font-technical text-amber-800 font-bold block mt-1">
                Urgent Refresher Calls
              </span>
            </div>
          </div>

          {/* Main Grid: Top Skill Gaps vs Role Readiness Benchmarks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left (7 cols): Top Skill Gaps Matrix */}
            <div className="lg:col-span-7 bg-white border border-zinc-300 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div>
                  <span className="text-[10px] font-technical uppercase font-bold text-zinc-500">
                    DEFICIT RANKING
                  </span>
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    Top National Skill Gaps & Deficit Vectors
                  </h3>
                </div>
                <span className="text-xs font-technical text-zinc-500">Ranked by Impact</span>
              </div>

              <div className="space-y-3">
                {topGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 border border-zinc-200 bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-400 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-zinc-900 text-amber-400 flex items-center justify-center font-technical text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-zinc-950 font-heading">
                          {gap.skill}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 font-sans">
                        Domain: {gap.domain} · Impacting ~{gap.impactedOfficers} field officers
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-technical text-xs">
                      <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1">
                        {gap.cadreDeficit} Deficit
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 font-bold uppercase ${
                          gap.priority === 'CRITICAL'
                            ? 'bg-rose-600 text-white'
                            : gap.priority === 'HIGH'
                            ? 'bg-amber-600 text-white'
                            : 'bg-zinc-700 text-white'
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right (5 cols): Cadre Role Readiness Breakdown */}
            <div className="lg:col-span-5 bg-white border border-zinc-300 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div>
                  <span className="text-[10px] font-technical uppercase font-bold text-zinc-500">
                    BENCHMARK TELEMETRY
                  </span>
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    Cadre Role Readiness Breakdown
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {roleReadiness.map((role, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-950 font-heading">{role.role}</span>
                      <span className="font-technical text-zinc-700">
                        {role.readyPercent}% ({role.total} Officers)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2 border border-zinc-200">
                      <div
                        className={`h-full ${
                          role.readyPercent >= 75
                            ? 'bg-emerald-600'
                            : role.readyPercent >= 65
                            ? 'bg-amber-500'
                            : 'bg-rose-600'
                        }`}
                        style={{ width: `${role.readyPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-technical text-zinc-500">
                      <span>Target Threshold: 80%</span>
                      <span
                        className={
                          role.status === 'Optimal'
                            ? 'text-emerald-700 font-semibold'
                            : 'text-amber-800 font-bold'
                        }
                      >
                        {role.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Nav Cards */}
              <div className="pt-4 border-t border-zinc-200 grid grid-cols-2 gap-2 text-xs font-technical">
                <div
                  onClick={() => onNavigate('regional-readiness')}
                  className="p-3 bg-zinc-50 border border-zinc-200 hover:border-zinc-900 cursor-pointer transition-colors"
                >
                  <MapPin className="w-4 h-4 text-amber-700 mb-1" />
                  <div className="font-bold text-zinc-950">Regional Zones</div>
                  <span className="text-[10px] text-zinc-500">North, West, South, East</span>
                </div>

                <div
                  onClick={() => onNavigate('future-readiness')}
                  className="p-3 bg-zinc-50 border border-zinc-200 hover:border-zinc-900 cursor-pointer transition-colors"
                >
                  <Calendar className="w-4 h-4 text-amber-700 mb-1" />
                  <div className="font-bold text-zinc-950">2026–2028 Horizon</div>
                  <span className="text-[10px] text-zinc-500">AI/ML & Cloud Ready</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FACULTY & TRAINER PROVISIONING (Requirement 2)                      */}
      {/* "trainer ka admin bna saka hn id and pass only"                          */}
      {/* ========================================================================= */}
      {activeTab === 'trainers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Fast Provisioning Form (ID & Password Only) */}
          <div className="lg:col-span-5 bg-white border border-zinc-900 p-6 shadow-xs space-y-4">
            <div className="border-b border-zinc-200 pb-3">
              <div className="text-[10px] font-technical uppercase tracking-wider text-amber-800 font-bold mb-1">
                ADMINISTRATIVE ACCESS CONTROL
              </div>
              <h2 className="text-xl font-bold text-zinc-950 font-heading flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>Provision Trainer Account</span>
              </h2>
              <p className="text-xs text-zinc-600 mt-1">
                Create authorized Trainer / Faculty credentials with <strong>ID and Password only</strong>. Trainers can immediately use these credentials to log in.
              </p>
            </div>

            {/* Notification alert */}
            {provisionMessage && (
              <div
                className={`p-3 text-xs font-technical border ${
                  provisionMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {provisionMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateTrainer} className="space-y-4">
              {/* Trainer ID (Mandatory) */}
              <div>
                <label className="block text-xs font-technical uppercase text-zinc-800 font-bold mb-1">
                  Trainer ID / Official Username *
                </label>
                <input
                  type="text"
                  required
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                  placeholder="e.g. dr.varun@nssta.gov.in or TR-NSSTA-402"
                  className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs font-technical text-zinc-950 focus:outline-none focus:border-zinc-950"
                />
                <span className="text-[10px] text-zinc-500 font-technical mt-0.5 block">
                  The trainer will use this exact ID to sign in.
                </span>
              </div>

              {/* Password (Mandatory) */}
              <div>
                <label className="block text-xs font-technical uppercase text-zinc-800 font-bold mb-1">
                  Assigned Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={trainerPassword}
                    onChange={(e) => setTrainerPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs font-technical text-zinc-950 focus:outline-none focus:border-zinc-950"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
                </div>
                <span className="text-[10px] text-zinc-500 font-technical mt-0.5 block">
                  Minimum 6 characters. Will be encrypted in MoSPI session vault.
                </span>
              </div>

              {/* Optional Name */}
              <div>
                <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                  Trainer Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  placeholder="e.g. Dr. Varun Sen"
                  className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs font-sans text-zinc-950 focus:outline-none focus:border-zinc-950"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                  Academy / Training Institution
                </label>
                <select
                  value={trainerDept}
                  onChange={(e) => setTrainerDept(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-technical text-zinc-950 focus:outline-none focus:border-zinc-950"
                >
                  <option value="National Statistical Systems Training Academy (NSSTA)">NSSTA Greater Noida</option>
                  <option value="MoSPI Training Division (New Delhi)">MoSPI Training Division (New Delhi)</option>
                  <option value="National Accounts Division (NAD) Faculty">NAD Macroeconomics Faculty</option>
                  <option value="FOD Field Cadre Training Cell">FOD Field Cadre Training Cell</option>
                </select>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                  Primary Specialization / Course Domain
                </label>
                <input
                  type="text"
                  value={trainerSpecialization}
                  onChange={(e) => setTrainerSpecialization(e.target.value)}
                  placeholder="e.g. Multi-Stage Sampling & PLFS Estimation"
                  className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs font-sans text-zinc-950 focus:outline-none focus:border-zinc-950"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingTrainer}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase tracking-wider font-bold border border-zinc-900 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isSubmittingTrainer ? (
                    <span>Provisioning Credentials...</span>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Provision Trainer Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column (7 cols): Active Faculty & Trainer Roster */}
          <div className="lg:col-span-7 bg-white border border-zinc-300 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <span className="text-[10px] font-technical uppercase font-bold text-zinc-500">
                  FACULTY ROSTER // PROVISIONED ACCESS
                </span>
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Active Trainer & Faculty Registry ({trainersList.length})
                </h3>
              </div>
              <span className="text-xs font-technical text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-semibold">
                All Active & Login-Enabled
              </span>
            </div>

            <div className="space-y-3">
              {trainersList.map((tr) => (
                <div
                  key={tr.id}
                  className="p-4 border border-zinc-200 bg-[#FAFAFA] hover:border-zinc-400 transition-colors space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-900 text-amber-400 flex items-center justify-center font-technical font-bold text-xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-950 font-heading">
                          {tr.name}
                        </h4>
                        <span className="text-[11px] font-technical text-zinc-600 block">
                          ID: <strong className="text-zinc-900">{tr.email}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-technical uppercase font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5">
                        {tr.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-sans text-zinc-600 bg-white p-2 border border-zinc-200">
                    <div><strong>Institution:</strong> {tr.department}</div>
                    <div><strong>Specialization:</strong> {tr.specialization}</div>
                    <div className="text-[10px] text-zinc-400 font-technical mt-1">
                      Provisioned: {new Date(tr.createdAt).toLocaleDateString()} · Access Mode: ID & Password Only
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note box */}
            <div className="p-3 bg-amber-50/70 border border-amber-300 text-xs font-technical text-amber-900 space-y-1">
              <strong>Security Protocol:</strong> Trainers created above can directly switch to the <em>Trainer Persona</em> on the bottom bar or sign out to the Login Screen and enter their assigned <em>ID & Password</em> to immediately access Quiz Authoring, Document AI, and Competency Verification suites.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
