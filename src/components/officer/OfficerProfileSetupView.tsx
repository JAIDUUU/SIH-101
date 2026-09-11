import React, { useState, useMemo } from 'react';
import { OfficerProfile } from '../../types';
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
  Building2,
  ExternalLink,
  Info,
  AlertCircle,
} from 'lucide-react';
import {
  CENTRAL_STATISTICAL_ORGANIZATIONS,
  STATE_UT_STATISTICAL_ORGANIZATIONS,
  STATE_UT_NAMES,
  STATISTICAL_DESIGNATIONS,
  STATISTICAL_DOMAINS,
  TECHNICAL_COMPETENCIES,
  TRAINING_ORGANIZATIONS,
  GovernanceTier,
  getOrCreateStateOrganization,
} from '../../data/statisticalMasterData';

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
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Dynamic Cascade State: Central/State/UT -> Organization -> Department -> Designation -> Statistical Domain -> Skills
  const initialTier: GovernanceTier = officer.governanceLevel || 'Central Government';
  const [governanceTier, setGovernanceTier] = useState<GovernanceTier>(initialTier);

  const initialStation = officer.station && officer.station !== 'Pending Regional Posting' ? officer.station : 'New Delhi';
  const initialMatchedState = STATE_UT_NAMES.find(s => initialStation.toLowerCase().includes(s.toLowerCase())) || 'Uttar Pradesh';
  const [stateOrUt, setStateOrUt] = useState<string>(initialMatchedState);

  // Derive organizations based on Governance Tier and State/UT
  const availableOrgs = useMemo(() => {
    if (governanceTier === 'Central Government') {
      return CENTRAL_STATISTICAL_ORGANIZATIONS;
    }
    const matchingSpecific = STATE_UT_STATISTICAL_ORGANIZATIONS.filter(
      (o) => o.tier === governanceTier && o.stateOrUt?.toLowerCase() === stateOrUt.toLowerCase()
    );
    if (matchingSpecific.length > 0) return matchingSpecific;
    return [getOrCreateStateOrganization(stateOrUt, governanceTier)];
  }, [governanceTier, stateOrUt]);

  // Selected Organization
  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => {
    if (officer.organization) {
      const match = availableOrgs.find((o) => o.name === officer.organization || o.id === officer.organization);
      if (match) return match.id;
    }
    return availableOrgs[0]?.id || 'mospi-nso';
  });

  const currentOrg = useMemo(() => {
    return availableOrgs.find((o) => o.id === selectedOrgId) || availableOrgs[0] || CENTRAL_STATISTICAL_ORGANIZATIONS[0];
  }, [availableOrgs, selectedOrgId]);

  // Filter Designations by Tier
  const availableDesignations = useMemo(() => {
    return STATISTICAL_DESIGNATIONS.filter((d) => d.applicableTiers.includes(governanceTier));
  }, [governanceTier]);

  // Selected Statistical Domain object
  const initialDomainName = officer.statisticalDomain || 'Household Surveys';
  const [selectedDomainName, setSelectedDomainName] = useState<string>(initialDomainName);

  const currentDomain = useMemo(() => {
    return STATISTICAL_DOMAINS.find((d) => d.name === selectedDomainName) || STATISTICAL_DOMAINS[0];
  }, [selectedDomainName]);

  // Selected Technical Skills
  const initialSkills = officer.selectedSkills && officer.selectedSkills.length > 0
    ? officer.selectedSkills
    : ['Python', 'SQL', 'Excel', 'Data Visualization'];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);

  // Selected Training Organization
  const [trainingOrgId, setTrainingOrgId] = useState<string>(() => {
    if (officer.trainingOrg) {
      const match = TRAINING_ORGANIZATIONS.find(t => t.name === officer.trainingOrg || t.id === officer.trainingOrg);
      if (match) return match.id;
    }
    return 'train-nssta';
  });

  const currentTrainingOrg = useMemo(() => {
    return TRAINING_ORGANIZATIONS.find(t => t.id === trainingOrgId) || TRAINING_ORGANIZATIONS[0];
  }, [trainingOrgId]);

  // Active Focus Areas / Survey Tags
  const [activeFocusTags, setActiveFocusTags] = useState<string[]>(() => {
    return currentDomain.coreSurveysOrFrameworks;
  });

  // Master Form Data
  const [formData, setFormData] = useState({
    name: officer.name || '',
    employeeId: officer.employeeId === 'PENDING-ID' ? '' : officer.employeeId,
    email: officer.email || '',
    station: initialStation,
    education: officer.education === 'Self-Service Setup Required' ? 'M.Sc. Statistics / Econometrics' : officer.education,
    designation: officer.designation === 'Cadre Selection Pending' ? 'Junior Statistical Officer (JSO)' : officer.designation,
    department: officer.department || currentOrg.departments[0]?.name || 'Field Operations Division (FOD)',
    cadre: officer.cadre === 'Not Configured' ? (currentOrg.cadres[0] || 'Subordinate Statistical Service (SSS)') : officer.cadre,
    experienceYears: officer.experienceYears || 3,
    responsibilities: officer.isProfileSetup
      ? 'Supervision of field investigators for Periodic Labour Force Survey (PLFS), validation of Consumer Price Index (CPI) retail baskets, and oversight of Annual Survey of Industries (ASI) factory sampling.'
      : `Official responsibilities in ${currentDomain.name} domain, including data collection verification, sampling unit inspection, and survey schedule scrutiny.`,
    previousTraining: officer.isProfileSetup
      ? 'NSSTA Greater Noida: Advanced Sampling & Survey Design (2022); iGOT Karmayogi: Code of Ethics in Public Statistics (2023); National Accounts Division Macro-aggregates Orientation (2024).'
      : 'NSSTA Greater Noida: Foundation Course in Official Statistics; iGOT Karmayogi: Data Analytics in Governance.',
    // Domain self-assessments
    statisticalScore: officer.domainScores['Statistical'] || 68,
    technicalScore: officer.domainScores['Technical'] || 58,
    digitalGovScore: officer.domainScores['Digital Governance'] || 62,
    behaviouralScore: officer.domainScores['Behavioural & Managerial'] || 70,
  });

  const [isSaved, setIsSaved] = useState(false);

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Professional & Cadre', icon: Briefcase },
    { number: 3, title: 'Domain & Surveys', icon: Layers },
    { number: 4, title: 'Training & Academy', icon: GraduationCap },
    { number: 5, title: 'Skills & Competencies', icon: Sparkles },
  ];

  // Dynamic Tier Change Handler
  const handleTierChange = (newTier: GovernanceTier) => {
    setGovernanceTier(newTier);
    let newOrgs = CENTRAL_STATISTICAL_ORGANIZATIONS;
    if (newTier !== 'Central Government') {
      const specific = STATE_UT_STATISTICAL_ORGANIZATIONS.filter(
        (o) => o.tier === newTier && o.stateOrUt?.toLowerCase() === stateOrUt.toLowerCase()
      );
      newOrgs = specific.length > 0 ? specific : [getOrCreateStateOrganization(stateOrUt, newTier)];
    }
    const defaultOrg = newOrgs[0];
    setSelectedOrgId(defaultOrg.id);
    const newDesignations = STATISTICAL_DESIGNATIONS.filter((d) => d.applicableTiers.includes(newTier));

    setFormData((prev) => ({
      ...prev,
      department: defaultOrg.departments[0]?.name || prev.department,
      cadre: defaultOrg.cadres[0] || prev.cadre,
      designation: newDesignations.some(d => d.title === prev.designation)
        ? prev.designation
        : (newDesignations[0]?.title || prev.designation),
    }));
  };

  // Dynamic State/UT Change Handler
  const handleStateUtChange = (newState: string) => {
    setStateOrUt(newState);
    const specific = STATE_UT_STATISTICAL_ORGANIZATIONS.filter(
      (o) => o.tier === governanceTier && o.stateOrUt?.toLowerCase() === newState.toLowerCase()
    );
    const newOrgs = specific.length > 0 ? specific : [getOrCreateStateOrganization(newState, governanceTier)];
    const defaultOrg = newOrgs[0];
    setSelectedOrgId(defaultOrg.id);

    setFormData((prev) => ({
      ...prev,
      station: `${newState} Directorate`,
      department: defaultOrg.departments[0]?.name || prev.department,
      cadre: defaultOrg.cadres[0] || prev.cadre,
    }));
  };

  // Dynamic Organization Change Handler
  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    const org = availableOrgs.find((o) => o.id === orgId) || availableOrgs[0];
    setFormData((prev) => ({
      ...prev,
      department: org.departments[0]?.name || prev.department,
      cadre: org.cadres[0] || prev.cadre,
    }));
  };

  // Dynamic Statistical Domain Change Handler
  const handleDomainChange = (domainName: string) => {
    setSelectedDomainName(domainName);
    const dom = STATISTICAL_DOMAINS.find((d) => d.name === domainName);
    if (dom) {
      setActiveFocusTags(dom.coreSurveysOrFrameworks);
    }
  };

  // Toggle Technical Competency
  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const exists = prev.includes(skillName);
      const updated = exists ? prev.filter((s) => s !== skillName) : [...prev, skillName];
      // Auto-tune technical score baseline according to count of competencies
      const baseTechnical = Math.min(95, Math.max(40, 35 + updated.length * 5));
      setFormData((f) => ({ ...f, technicalScore: baseTechnical }));
      return updated;
    });
  };

  // Toggle Focus Area Tag
  const toggleFocusTag = (tag: string) => {
    setActiveFocusTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validateCurrentStep = (): boolean => {
    setValidationError(null);
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setValidationError('Please enter your Full Name in Step 1.');
        return false;
      }
      if (!formData.email.trim()) {
        setValidationError('Please enter your Official Email in Step 1.');
        return false;
      }
      if (!formData.employeeId.trim()) {
        setValidationError('Please enter your Employee ID in Step 1.');
        return false;
      }
      if (!formData.designation.trim()) {
        setValidationError('Please select or enter your Designation in Step 1.');
        return false;
      }
      if (!formData.station.trim()) {
        setValidationError('Please specify your Station / Posting Station in Step 1.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!governanceTier) {
        setValidationError('Please select your Governance Level in Step 2.');
        return false;
      }
      if (!currentOrg || !currentOrg.name) {
        setValidationError('Please select your Parent Organization in Step 2.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!selectedDomainName) {
        setValidationError('Please select your Primary Statistical Domain in Step 3.');
        return false;
      }
    } else if (currentStep === 4) {
      if (!trainingOrgId) {
        setValidationError('Please select your Primary Training Academy in Step 4.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setMaxUnlockedStep((prev) => Math.max(prev, nextStep));
      setCurrentStep(nextStep);
      setValidationError(null);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } else {
      handleFinalSave();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setValidationError(null);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
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
      governanceLevel: governanceTier,
      organization: currentOrg.name,
      statisticalDomain: selectedDomainName,
      selectedSkills: selectedSkills,
      trainingOrg: currentTrainingOrg.name,
      selfAssessedSkills: {
        Statistical: formData.statisticalScore,
        Technical: formData.technicalScore,
        'Digital Governance': formData.digitalGovScore,
        'Behavioural & Managerial': formData.behaviouralScore,
        ...selectedSkills.reduce((acc, skill) => {
          acc[skill] = formData.technicalScore;
          return acc;
        }, {} as Record<string, number>),
      },
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
          governanceLevel: governanceTier,
          organization: currentOrg.name,
          statisticalDomain: selectedDomainName,
          selectedSkills: selectedSkills,
          trainingOrg: currentTrainingOrg.name,
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
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-technical uppercase font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5">
                MoSPI // Official Statistical System
              </span>
              <span className="text-xs font-technical text-zinc-500">
                Master Data Integrated Cadre Calibration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 font-heading">
              Official Profile & Competency Calibration
            </h2>
            <p className="text-xs text-zinc-600 max-w-xl font-sans mt-0.5">
              Select your position across India&apos;s Central, State, and District Statistical hierarchy to calibrate AI-guided iGOT & NSSTA learning pathways.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-technical text-zinc-500">HIERARCHY PROGRESS</div>
            <div className="text-2xl font-bold font-technical text-zinc-950">
              {currentStep} <span className="text-zinc-400 font-normal">/ 5</span>
            </div>
          </div>
        </div>

        {/* Dynamic Stepper Bar */}
        <div className="grid grid-cols-5 gap-2 pt-6 mt-6 border-t border-zinc-200">
          {steps.map((step) => {
            const isDone = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isUnlocked = step.number <= maxUnlockedStep;
            return (
              <button
                key={step.number}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    setCurrentStep(step.number);
                    setValidationError(null);
                  }
                }}
                className={`text-left p-2.5 border transition-all ${
                  isCurrent
                    ? 'border-zinc-950 bg-zinc-950 text-white cursor-pointer shadow-xs'
                    : isDone
                    ? 'border-zinc-300 bg-amber-50/50 text-zinc-900 hover:border-zinc-400 cursor-pointer'
                    : isUnlocked
                    ? 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 cursor-pointer'
                    : 'border-zinc-200 bg-zinc-100/70 text-zinc-400 cursor-not-allowed opacity-60'
                }`}
                title={!isUnlocked ? `Complete Step ${currentStep} first to unlock Step ${step.number}` : ''}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-technical uppercase font-bold ${
                      isCurrent ? 'text-amber-400' : isUnlocked ? 'text-zinc-600' : 'text-zinc-400'
                    }`}
                  >
                    STEP {step.number}
                  </span>
                  {isDone ? (
                    <Check className="w-3 h-3 text-amber-600" />
                  ) : !isUnlocked ? (
                    <span className="text-[9px] text-zinc-400 font-mono">LOCKED</span>
                  ) : null}
                </div>
                <div className="text-xs font-bold truncate">{step.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Validation Alert */}
      {validationError && (
        <div className="p-3.5 bg-rose-50 border-2 border-rose-400 text-xs text-rose-950 font-technical flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span><strong>Validation Required:</strong> {validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-rose-700 hover:text-rose-900 font-bold uppercase text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Step Contents */}
      <div className="bg-white border border-zinc-300 p-8 shadow-xs">
        {isSaved ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-400 border border-zinc-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold font-heading text-zinc-950">
              Profile & Cadre Hierarchy Calibrated
            </h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Your profile has been synchronized with the India-wide Official Statistical System master dataset. Redirecting to your Officer Dashboard...
            </p>
          </div>
        ) : (
          <div>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-zinc-200 pb-3 mb-4">
                  <h3 className="text-base font-bold text-zinc-950 font-heading">
                    1. Personal Information & Official Identity
                  </h3>
                  <p className="text-xs text-zinc-600">
                    Official identity and foundational academic credentials in statistics/data science.
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
                      placeholder="e.g., Rajesh Kumar"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Government Employee ID / SPARROW ID
                    </label>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="e.g., GOI-STAT-2024-998"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Official Email Address (NIC / MoSPI / State Gov)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., rajesh.kumar@mospi.gov.in"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Current Station & Regional Posting
                    </label>
                    <input
                      type="text"
                      value={formData.station}
                      onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                      placeholder="e.g., New Delhi (Central HQ) or Lucknow Regional Office"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Highest Academic Degree & Statistical Specialization
                    </label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g., M.Sc. Statistics (Sampling & Probability Theory), University of Delhi"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information & Cadre Hierarchy (Central/State/UT -> Org -> Dept -> Designation) */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="border-b border-zinc-200 pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      2. Official Statistical System Hierarchy
                    </h3>
                    <span className="text-[10px] font-technical uppercase bg-zinc-100 text-zinc-700 px-2 py-0.5 border border-zinc-300">
                      Dynamic Master Data
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Cascade: Central/State/UT → Statistical Organization → Department/Division → Official Cadre Designation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tier 1: Governance Level */}
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Governance Tier <span className="text-amber-700 font-bold">*</span>
                    </label>
                    <select
                      value={governanceTier}
                      onChange={(e) => handleTierChange(e.target.value as GovernanceTier)}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    >
                      <option value="Central Government">Central Government (MoSPI / Central Ministries)</option>
                      <option value="State Government">State Government (Directorates of Economics & Statistics / DSOs)</option>
                      <option value="Union Territory">Union Territory (Planning & Statistics Departments)</option>
                    </select>
                  </div>

                  {/* Tier 1b: State / UT Selection (Active when Tier is State/UT) */}
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      {governanceTier === 'Central Government' ? 'State / Region of Primary Posting' : 'State / Union Territory Selection'}
                    </label>
                    <select
                      value={stateOrUt}
                      onChange={(e) => handleStateUtChange(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    >
                      {STATE_UT_NAMES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tier 2: Statistical Organization */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Statistical Organization <span className="text-amber-700 font-bold">*</span>
                    </label>
                    <select
                      value={selectedOrgId}
                      onChange={(e) => handleOrgChange(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    >
                      {availableOrgs.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} ({org.shortCode})
                        </option>
                      ))}
                    </select>
                    <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>Headquarters: {currentOrg.headquarters}</span>
                    </div>
                  </div>

                  {/* Tier 3: Parent Department / Division / Cell */}
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Parent Department / Division / Office <span className="text-amber-700 font-bold">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    >
                      {currentOrg.departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                    {/* Department description preview */}
                    {(() => {
                      const activeDept = currentOrg.departments.find(d => d.name === formData.department);
                      return activeDept ? (
                        <p className="text-[11px] text-zinc-500 mt-1 leading-snug">
                          {activeDept.description}
                        </p>
                      ) : null;
                    })()}
                  </div>

                  {/* Tier 4: Cadre Classification */}
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Cadre Classification <span className="text-amber-700 font-bold">*</span>
                    </label>
                    <select
                      value={formData.cadre}
                      onChange={(e) => setFormData({ ...formData, cadre: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    >
                      {currentOrg.cadres.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tier 5: Current Designation */}
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Current Designation <span className="text-amber-700 font-bold">*</span>
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                    >
                      {availableDesignations.map((desig) => (
                        <option key={desig.id} value={desig.title}>
                          {desig.title} — {desig.group}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total Years in Service */}
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Total Years in Official Statistical System
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={formData.experienceYears}
                      onChange={(e) =>
                        setFormData({ ...formData, experienceYears: Number(e.target.value) })
                      }
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Statistical Domain & Survey Portfolios */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="border-b border-zinc-200 pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      3. Statistical Domain & Survey Remits
                    </h3>
                    <span className="text-[10px] font-technical uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5">
                      20 Official Statistical Domains
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Align your primary domain of expertise to activate tailored course recommendations and skill gap diagnostic tools.
                  </p>
                </div>

                {/* Statistical Domain Selector */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Primary Statistical Domain <span className="text-amber-700 font-bold">*</span>
                  </label>
                  <select
                    value={selectedDomainName}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                  >
                    {STATISTICAL_DOMAINS.map((dom) => (
                      <option key={dom.id} value={dom.name}>
                        {dom.name} ({dom.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Domain Overview Callout */}
                <div className="p-4 bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-zinc-950 font-heading">
                      {currentDomain.name}
                    </span>
                    <span className="text-[10px] font-technical uppercase text-zinc-600 bg-white border border-zinc-300 px-2 py-0.5">
                      Category: {currentDomain.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed font-sans mb-3">
                    {currentDomain.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-200">
                    <span className="text-[11px] font-technical uppercase text-zinc-600 block mb-1.5 font-semibold">
                      Core Official Frameworks / Focus Surveys:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentDomain.coreSurveysOrFrameworks.map((framework) => {
                        const isSelected = activeFocusTags.includes(framework);
                        return (
                          <button
                            key={framework}
                            type="button"
                            onClick={() => toggleFocusTag(framework)}
                            className={`px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-amber-100 border-amber-400 text-amber-950'
                                : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {framework}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Operational Remit Description */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Describe your operational survey oversight and data duties
                  </label>
                  <textarea
                    rows={3}
                    value={formData.responsibilities}
                    onChange={(e) =>
                      setFormData({ ...formData, responsibilities: e.target.value })
                    }
                    className="w-full bg-[#FAF9F6] border border-zinc-300 p-3 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 leading-relaxed font-sans"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    The recommendation engine matches these operational duties to relevant NSSTA micro-modules and iGOT competencies.
                  </span>
                </div>
              </div>
            )}

            {/* Step 4: Previous Training & Training Organization */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="border-b border-zinc-200 pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      4. Training History & Academy Integration
                    </h3>
                    <span className="text-[10px] font-technical uppercase bg-zinc-100 text-zinc-700 border border-zinc-300 px-2 py-0.5">
                      NSSTA & iGOT Integrated
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Record apex training academies, iGOT completions, and certified civil service workshops.
                  </p>
                </div>

                {/* Primary Training Academy / Platform Selector */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Primary Statistical Training Academy / System <span className="text-amber-700 font-bold">*</span>
                  </label>
                  <select
                    value={trainingOrgId}
                    onChange={(e) => setTrainingOrgId(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 font-sans"
                  >
                    {TRAINING_ORGANIZATIONS.map((to) => (
                      <option key={to.id} value={to.id}>
                        {to.name} ({to.shortCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Training Academy Overview */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-zinc-950 font-heading">
                      {currentTrainingOrg.name}
                    </div>
                    <a
                      href={currentTrainingOrg.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-technical text-amber-700 hover:text-amber-900 flex items-center gap-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-zinc-700 font-sans leading-relaxed">
                    {currentTrainingOrg.description}
                  </p>
                  <div className="text-[11px] font-technical text-zinc-500">
                    Location: {currentTrainingOrg.location}
                  </div>
                </div>

                {/* Training Record Textarea */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Historical Training & Modules Completed
                  </label>
                  <textarea
                    rows={3}
                    value={formData.previousTraining}
                    onChange={(e) =>
                      setFormData({ ...formData, previousTraining: e.target.value })
                    }
                    className="w-full bg-[#FAF9F6] border border-zinc-300 p-3 text-xs font-medium text-zinc-950 focus:outline-none focus:border-zinc-950 leading-relaxed font-sans"
                  />
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-300 text-xs text-zinc-800 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-950 font-bold block mb-0.5">
                      iGOT Karmayogi & NSSTA Central Synchronization
                    </strong>
                    Completed courses from SADHANA Saptah and NSSTA TPAC modules are automatically synchronized into your Official Skill Passport.
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Technical Competencies Selection & Competency Pillars */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200 pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-950 font-heading">
                      5. Technical Competencies & Pillar Calibration
                    </h3>
                    <span className="text-[10px] font-technical uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5">
                      14 Technical Competencies
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Select your active software/tools and calibrate baseline proficiencies across the 4 official statistical competency pillars.
                  </p>
                </div>

                {/* Domain-Calibrated Skills Guidance Box */}
                <div className="p-4 bg-amber-50/90 border-2 border-amber-400 space-y-2 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-technical uppercase font-bold text-amber-950 bg-amber-200 border border-amber-400 px-2 py-0.5">
                        DOMAIN-GROUNDED TECHNICAL SKILLS
                      </span>
                      <span className="text-xs font-technical text-amber-900 font-semibold">
                        Domain: {selectedDomainName} · Cadre: {formData.cadre}
                      </span>
                    </div>
                    <span className="text-xs font-technical text-zinc-600">
                      {selectedSkills.length} of {TECHNICAL_COMPETENCIES.length} Acquired
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-950 font-heading">
                    Which of these technical tools & competencies do you currently know or use?
                  </h4>
                  <p className="text-xs text-zinc-700 font-sans leading-relaxed">
                    The skills below have been dynamically populated for your domain (<strong>{selectedDomainName}</strong>). Select the tools you currently possess or use. Any unselected tools will be automatically mapped as your <strong>Skill Gaps</strong> to generate your tailored iGOT Karmayogi & NSSTA learning pathway.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const domainRecs = TECHNICAL_COMPETENCIES.filter(c => {
                          const name = c.name.toLowerCase();
                          const d = selectedDomainName.toLowerCase();
                          if (d.includes('household') || d.includes('survey')) {
                            return name.includes('capi') || name.includes('survey') || name.includes('sampling') || name.includes('excel') || name.includes('r ');
                          }
                          if (d.includes('price') || d.includes('index')) {
                            return name.includes('index') || name.includes('excel') || name.includes('survey') || name.includes('r ');
                          }
                          if (d.includes('national account') || d.includes('macro')) {
                            return name.includes('national') || name.includes('excel') || name.includes('time series') || name.includes('r ');
                          }
                          return true;
                        }).map(c => c.name);
                        setSelectedSkills(Array.from(new Set([...selectedSkills, ...domainRecs])));
                      }}
                      className="text-[11px] font-technical bg-white border border-amber-300 text-amber-950 px-2.5 py-1 hover:bg-amber-100 cursor-pointer font-semibold"
                    >
                      + Select Recommended for {selectedDomainName}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSkills([])}
                      className="text-[11px] font-technical bg-white border border-zinc-300 text-zinc-600 px-2.5 py-1 hover:bg-zinc-100 cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                {/* 14 Technical Competencies Multi-Select Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold">
                      Technical Competencies & Computing Tools ({selectedSkills.length} Selected)
                    </label>
                    <span className="text-[11px] font-technical text-amber-900 font-semibold">
                      ★ = Recommended for {selectedDomainName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {TECHNICAL_COMPETENCIES.map((comp) => {
                      const isSelected = selectedSkills.includes(comp.name);
                      const isRecommended = (() => {
                        const name = comp.name.toLowerCase();
                        const d = selectedDomainName.toLowerCase();
                        if (d.includes('household') || d.includes('survey') || d.includes('field') || d.includes('labour')) {
                          return name.includes('capi') || name.includes('survey') || name.includes('sampling') || name.includes('excel') || name.includes('r ');
                        }
                        if (d.includes('price') || d.includes('index')) {
                          return name.includes('index') || name.includes('excel') || name.includes('survey') || name.includes('sql');
                        }
                        if (d.includes('national') || d.includes('macro')) {
                          return name.includes('national') || name.includes('excel') || name.includes('time series') || name.includes('r ');
                        }
                        return true;
                      })();

                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => toggleSkill(comp.name)}
                          className={`p-2.5 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-zinc-950 shadow-xs ring-1 ring-amber-400/50'
                              : 'bg-[#FAF9F6] border-zinc-300 text-zinc-700 hover:border-zinc-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold font-heading flex items-center gap-1">
                              {comp.name}
                              {isRecommended && <span className="text-amber-700 text-[10px] font-bold" title="Recommended for your domain">★</span>}
                            </span>
                            <span
                              className={`w-4 h-4 flex items-center justify-center border text-[10px] ${
                                isSelected ? 'bg-amber-500 border-amber-600 text-black font-bold' : 'border-zinc-300 bg-white text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[10px]">
                            <span className="text-zinc-500 truncate">
                              {comp.associatedTools.slice(0, 2).join(', ')}
                            </span>
                            {isSelected ? (
                              <span className="text-emerald-700 font-technical font-semibold">ACQUIRED</span>
                            ) : (
                              <span className="text-amber-800 font-technical">GAP DEFICIT</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4 Competency Domain Calibration Sliders */}
                <div className="space-y-4 pt-2">
                  <span className="block text-xs font-technical uppercase text-zinc-700 font-semibold">
                    Competency Domain Pillar Self-Rating
                  </span>

                  {/* Domain 1: Statistical */}
                  <div className="p-3.5 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Statistical Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          Sampling methodology, weighting, variance estimation, demographic & price index compilation.
                        </p>
                      </div>
                      <span className="text-xs font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
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
                  <div className="p-3.5 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Technical Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          Python, R, SQL, Stata, SPSS, SAS, Excel, Data Viz, APIs, AI/ML, Cloud.
                        </p>
                      </div>
                      <span className="text-xs font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
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
                  <div className="p-3.5 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Digital Governance Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          CAPI/CSPro interviewing, open data protocols, DPDP compliance, metadata standards.
                        </p>
                      </div>
                      <span className="text-xs font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
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
                  <div className="p-3.5 bg-[#FAF9F6] border border-zinc-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-zinc-950 font-heading uppercase">
                          Behavioural & Managerial Domain
                        </span>
                        <p className="text-[11px] text-zinc-600">
                          Field supervision, respondent relations, ethical data stewardship, team leadership.
                        </p>
                      </div>
                      <span className="text-xs font-bold font-technical text-amber-800 bg-amber-100 px-2 py-0.5 border border-amber-300">
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
                className="px-4 py-2 border border-zinc-300 text-xs font-technical uppercase tracking-wider text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
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
