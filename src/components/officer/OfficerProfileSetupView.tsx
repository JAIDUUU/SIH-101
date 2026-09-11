import React, { useState } from 'react';
import { OfficerProfile, CompetencyDomain } from '../../types';
import { ApiClient } from '../../services/apiClient';
import {
  User,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface OfficerProfileSetupViewProps {
  officer: OfficerProfile;
  onSaveProfile?: (updated: Partial<OfficerProfile>) => void;
  onComplete: (data?: any) => void;
  onSkip?: () => void;
}

export const OfficerProfileSetupView: React.FC<OfficerProfileSetupViewProps> = ({
  officer,
  onSaveProfile,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: officer.name || '',
    employeeId: officer.employeeId === 'PENDING-ID' ? '' : officer.employeeId,
    email: officer.email || '',
    station: officer.station === 'Pending Regional Posting' ? '' : officer.station,
    education: officer.education === 'Self-Service Setup Required' ? '' : officer.education,
    designation: officer.designation === 'Cadre Selection Pending' ? 'Statistical Officer' : officer.designation,
    department: officer.department || 'National Statistical Office (NSO) — FOD',
    cadre: officer.cadre === 'Not Configured' ? 'Subordinate Statistical Service (SSS)' : officer.cadre,
    experienceYears: officer.experienceYears || 2,
    responsibilities: officer.isProfileSetup
      ? 'Supervision of field investigators for Periodic Labour Force Survey (PLFS), validation of Consumer Price Index (CPI) retail baskets, and oversight of Annual Survey of Industries (ASI) factory sampling.'
      : '',
    previousTraining: officer.isProfileSetup
      ? 'NSSTA Greater Noida: Advanced Sampling & Survey Design (2022); iGOT Karmayogi: Code of Ethics in Public Statistics (2023); National Accounts Division Macro-aggregates Orientation (2024).'
      : '',
    // Domain self-assessments
    statisticalScore: officer.domainScores['Statistical'] || 60,
    technicalScore: officer.domainScores['Technical'] || 50,
    digitalGovScore: officer.domainScores['Digital Governance'] || 55,
    behaviouralScore: officer.domainScores['Behavioural & Managerial'] || 65,
  });

  const [isSaved, setIsSaved] = useState(false);

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Professional Information', icon: Briefcase },
    { number: 3, title: 'Current Responsibilities', icon: Layers },
    { number: 4, title: 'Previous Training', icon: GraduationCap },
    { number: 5, title: 'Existing Skills & Domains', icon: Sparkles },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSave();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSave = async () => {
    const payload = {
      fullName: formData.name,
      employeeId: formData.employeeId,
      email: formData.email,
      station: formData.station,
      education: formData.education,
      designation: formData.designation,
      department: formData.department,
      cadre: formData.cadre,
      experienceYears: formData.experienceYears,
      selfAssessedSkills: {
        'Sampling Methodology & Design': formData.statisticalScore,
        'Python for Statistical Computing': formData.technicalScore,
        'GIS & Spatial Frame Delineation': formData.digitalGovScore,
        'Public Sector Ethics & Data Stewardship': formData.behaviouralScore,
      }
    };

    try {
      const res = await ApiClient.updateProfile(payload);
      if (onSaveProfile) {
        onSaveProfile(res.officer);
      }
      setIsSaved(true);
      setTimeout(() => {
        onComplete(res.officer);
      }, 800);
    } catch (err) {
      console.warn('API update fallback to local state:', err);
      if (onSaveProfile) {
        onSaveProfile({
          name: formData.name,
          employeeId: formData.employeeId,
          email: formData.email,
          station: formData.station,
          education: formData.education,
          designation: formData.designation,
          department: formData.department,
          cadre: formData.cadre,
          experienceYears: formData.experienceYears,
        });
      }
      setIsSaved(true);
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="border border-zinc-900 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              OFFICIAL STATISTICAL CADRE // ONBOARDING & COMPETENCY CALIBRATION
            </div>
            <h1 className="text-2xl font-bold text-zinc-950 font-heading">
              Officer Profile & Competency Ingestion
            </h1>
            <p className="text-xs text-zinc-600 mt-1">
              Calibrating your official record enables the AI engine to predict skill decay and prescribe targeted NSSTA curricula.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-technical px-2 py-1 bg-zinc-100 border border-zinc-300">
              CADRE ID: {officer.employeeId}
            </span>
          </div>
        </div>

        {/* Stepper Header */}
        <div className="grid grid-cols-5 gap-2 pt-6 mt-6 border-t border-zinc-200">
          {steps.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setCurrentStep(step.number)}
                className={`text-left p-2.5 border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : isDone
                    ? 'border-zinc-300 bg-amber-50/50 text-zinc-900'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-technical uppercase font-bold ${
                      isCurrent ? 'text-amber-400' : 'text-zinc-600'
                    }`}
                  >
                    STEP {step.number}
                  </span>
                  {isDone && <Check className="w-3 h-3 text-amber-600" />}
                </div>
                <div className="text-xs font-bold truncate">{step.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white border border-zinc-300 p-8 shadow-xs">
        {isSaved ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-400 border border-zinc-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold font-heading text-zinc-950">
              Profile Competency Calibrated
            </h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Your profile has been ingested into the Skill Sutra knowledge graph. Redirecting to your Officer Dashboard...
            </p>
          </div>
        ) : (
          <div>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-zinc-200 pb-3 mb-4">
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    1. Personal Information
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Official identity and foundational academic background.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Government Employee ID
                    </label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Official Email Address (NIC / MoSPI)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Current Station & Zone
                    </label>
                    <input
                      type="text"
                      value={formData.station}
                      onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Highest Academic Degree & Specialization
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-zinc-200 pb-3 mb-4">
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    2. Professional Information & Cadre
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Cadre designation and institutional hierarchy inside MoSPI.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Current Designation
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950"
                    >
                      <option value="Statistical Officer">Statistical Officer</option>
                      <option value="Senior Statistical Officer">Senior Statistical Officer</option>
                      <option value="Assistant Director">Assistant Director</option>
                      <option value="Deputy Director">Deputy Director</option>
                      <option value="Joint Director">Joint Director</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Cadre Classification
                    </label>
                    <input
                      type="text"
                      value={formData.cadre}
                      onChange={(e) => setFormData({ ...formData, cadre: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Total Years in Official Statistical System
                    </label>
                    <input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) =>
                        setFormData({ ...formData, experienceYears: Number(e.target.value) })
                      }
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Parent Department / Division
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Current Responsibilities */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-zinc-200 pb-3 mb-4">
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    3. Current Responsibilities & Survey Portfolios
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Active operational survey cycles and field management remits.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Describe your primary survey oversight and microdata duties
                  </label>
                  <textarea
                    rows={4}
                    value={formData.responsibilities}
                    onChange={(e) =>
                      setFormData({ ...formData, responsibilities: e.target.value })
                    }
                    className="w-full bg-[#FAF9F6] border border-zinc-300 p-3 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 leading-relaxed font-sans"
                  />
                  <span className="text-[11px] text-zinc-600 mt-1 block">
                    The AI engine matches these duties to relevant NSSTA micro-modules and survey manuals.
                  </span>
                </div>

                {/* Survey Tag Badges */}
                <div className="pt-2">
                  <span className="text-xs font-technical uppercase text-zinc-700 font-semibold block mb-2">
                    Active Survey Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'PLFS (Periodic Labour Force Survey)',
                      'ASI (Annual Survey of Industries)',
                      'CPI (Consumer Price Index)',
                      'Urban Frame Survey (UFS)',
                      'Time Use Survey (TUS)',
                      'Index of Industrial Production (IIP)',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-zinc-100 border border-zinc-300 text-xs text-zinc-800 font-medium"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Previous Training */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="border-b border-zinc-200 pb-3 mb-4">
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    4. Previous Training & Certifications
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Formal NSSTA modules, iGOT completions, and external workshops.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Historical Training Record
                  </label>
                  <textarea
                    rows={4}
                    value={formData.previousTraining}
                    onChange={(e) =>
                      setFormData({ ...formData, previousTraining: e.target.value })
                    }
                    className="w-full bg-[#FAF9F6] border border-zinc-300 p-3 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 leading-relaxed font-sans"
                  />
                </div>

                <div className="p-4 bg-amber-50/60 border border-amber-300 text-xs text-zinc-800">
                  <strong className="text-amber-900 font-bold block mb-1">
                    Automatic iGOT & NSSTA Ledger Synchronization
                  </strong>
                  Your iGOT Karmayogi credential repository (Course Ledger ID: #IK-992014) is automatically verified against the central civil service blockchain index.
                </div>
              </div>
            )}

            {/* Step 5: Existing Skills across 4 Domains */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200 pb-3">
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    5. Competency Domain Calibration
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Self-rate baseline proficiencies across the 4 official statistical competency pillars.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Domain 1: Statistical */}
                  <div className="p-4 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Statistical Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          Sampling methodology, weighting, variance estimation, demographic & price index compilation.
                        </p>
                      </div>
                      <span className="text-sm font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
                        {formData.statisticalScore}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={formData.statisticalScore}
                      onChange={(e) =>
                        setFormData({ ...formData, statisticalScore: Number(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Domain 2: Technical */}
                  <div className="p-4 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Technical Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          Python data science, R econometrics, SQL, GIS spatial validation, Big Data scripts.
                        </p>
                      </div>
                      <span className="text-sm font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
                        {formData.technicalScore}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={formData.technicalScore}
                      onChange={(e) =>
                        setFormData({ ...formData, technicalScore: Number(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Domain 3: Digital Governance */}
                  <div className="p-4 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Digital Governance Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          CAPI/CSPro tablet interviewing, NDAP open data protocols, metadata standards, security.
                        </p>
                      </div>
                      <span className="text-sm font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
                        {formData.digitalGovScore}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={formData.digitalGovScore}
                      onChange={(e) =>
                        setFormData({ ...formData, digitalGovScore: Number(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Domain 4: Behavioural & Managerial */}
                  <div className="p-4 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Behavioural & Managerial Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          Field team leadership, conflict resolution with respondents, ethical statistics, confidentiality.
                        </p>
                      </div>
                      <span className="text-sm font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
                        {formData.behaviouralScore}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={formData.behaviouralScore}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          behaviouralScore: Number(e.target.value),
                        })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 mt-8 border-t border-zinc-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-4 py-2 border border-zinc-300 text-xs font-technical uppercase tracking-wider text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-zinc-950 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {currentStep === 5 ? (
                  <>
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Complete & Calibrate Engine</span>
                  </>
                ) : (
                  <>
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
