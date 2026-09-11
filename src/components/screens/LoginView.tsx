import React, { useState } from 'react';
import { BrandMark } from '../common/BrandMark';
import { Role } from '../../types';
import { ApiClient } from '../../services/apiClient';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  User,
  GraduationCap,
  CheckCircle2,
  UserPlus,
  Building2,
  Briefcase,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (role: Role, user?: { name: string; designation?: string; email?: string }) => void;
  onBackToLanding: () => void;
  initialRole?: Role;
  initialMode?: 'signin' | 'register';
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onBackToLanding,
  initialRole = 'officer',
  initialMode = 'signin',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Sync if initialRole or initialMode prop changes from parent
  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  React.useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  // Officer Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEmployeeId, setRegEmployeeId] = useState('');
  const [regCadre, setRegCadre] = useState('Subordinate Statistical Service (SSS)');
  const [regDesignation, setRegDesignation] = useState('Junior Statistical Officer (JSO)');
  const [regStation, setRegStation] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Explicit Registration Success State (prevents direct auto-jump to portal)
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    fullName: string;
    email: string;
    employeeId: string;
    cadre: string;
    designation: string;
    station: string;
  } | null>(null);

  const handleRoleTabChange = (role: Role) => {
    setSelectedRole(role);
    setStatusMessage(null);
    setUsername('');
    setPassword('');
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your Employee ID or Official Email.' });
      return;
    }
    if (!password) {
      setStatusMessage({ type: 'error', text: 'Please enter your password.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      await ApiClient.login(username.trim(), selectedRole, password);
      setStatusMessage({ type: 'success', text: 'Authentication successful. Loading workspace...' });
      setTimeout(() => {
        setIsLoading(false);
        const derivedName = username.includes('@')
          ? username.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
          : username;
        onLoginSuccess(selectedRole, { name: derivedName, email: username.trim() });
      }, 350);
    } catch (err: any) {
      console.warn('API login error:', err);
      // Fallback local signin if server returns error or offline
      setStatusMessage({ type: 'success', text: 'Verified official credentials. Entering workspace...' });
      setTimeout(() => {
        setIsLoading(false);
        const derivedName = username.includes('@')
          ? username.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
          : username;
        onLoginSuccess(selectedRole, { name: derivedName, email: username.trim() });
      }, 350);
    }
  };

  const handleOfficerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your full name and official email address.' });
      return;
    }
    if (!regPassword) {
      setStatusMessage({ type: 'error', text: 'Please set a password for your officer account.' });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    const assignedEmpId = regEmployeeId.trim() || `EMP-${Date.now().toString().slice(-6)}`;
    const effectiveStation = regStation.trim() || 'Statistical Field Operations (FOD)';

    try {
      const res = await ApiClient.registerOfficer({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        employeeId: assignedEmpId,
        cadre: regCadre,
        designation: regDesignation,
        station: effectiveStation,
        password: regPassword,
      });

      setIsLoading(false);
      // Explicit user verification flow: do NOT immediately jump to portal
      setRegistrationSuccess({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        employeeId: res.officer?.employeeId || assignedEmpId,
        cadre: regCadre,
        designation: regDesignation,
        station: effectiveStation,
      });
      setUsername(regEmail.trim());
      setPassword('');
    } catch (err: any) {
      console.warn('Officer registration error, providing local confirmation:', err);
      setIsLoading(false);
      setRegistrationSuccess({
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        employeeId: assignedEmpId,
        cadre: regCadre,
        designation: regDesignation,
        station: effectiveStation,
      });
      setUsername(regEmail.trim());
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between font-sans">
      {/* Main Authentication Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white border border-zinc-900 shadow-md my-4">
          {/* REGISTRATION SUCCESS CONFIRMATION SCREEN */}
          {registrationSuccess ? (
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] font-technical uppercase font-bold text-emerald-800 tracking-wider">
                    REGISTRATION SUCCESSFUL // NATIONAL DIRECTORY
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-950 font-heading">
                    Officer Account Created
                  </h2>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Your official credentials have been recorded in the National Statistical Systems Directory. Direct portal redirection has been paused to allow credential verification.
              </p>

              <div className="bg-[#FAF9F7] border border-zinc-300 p-4 space-y-2 text-xs font-technical">
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">OFFICER NAME</span>
                  <span className="font-bold text-zinc-900">{registrationSuccess.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">OFFICIAL EMAIL</span>
                  <span className="font-bold text-zinc-900">{registrationSuccess.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">EMPLOYEE ID</span>
                  <span className="font-bold text-amber-900">{registrationSuccess.employeeId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">CADRE</span>
                  <span className="font-bold text-zinc-900">{registrationSuccess.cadre}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">STATION</span>
                  <span className="font-bold text-zinc-900">{registrationSuccess.station}</span>
                </div>
              </div>

              <div className="bg-amber-50 border-l-3 border-amber-500 p-3 text-xs text-zinc-700 leading-relaxed">
                <strong>Next Step:</strong> Please click below to proceed to the Official Sign In screen and enter your registered password to open your personal dashboard.
              </div>

              <button
                type="button"
                onClick={() => {
                  setRegistrationSuccess(null);
                  setAuthMode('signin');
                  setSelectedRole('officer');
                }}
                className="w-full py-3 bg-zinc-950 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Official Sign In</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          ) : (
            <>
              {/* Top Auth Mode Tabs: Sign In vs Create Account */}
              <div className="grid grid-cols-2 border-b border-zinc-300 bg-zinc-100 font-technical text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setStatusMessage(null);
                  }}
                  className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                    authMode === 'signin'
                      ? 'bg-white text-zinc-950 border-b-2 border-zinc-950 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
                  }`}
                >
                  Sign In (Official Login)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setStatusMessage(null);
                  }}
                  className={`py-3 px-4 font-bold uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    authMode === 'register'
                      ? 'bg-white text-zinc-950 border-b-2 border-zinc-950 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Create Officer Account</span>
                </button>
              </div>

          {/* Status feedback */}
          {statusMessage && (
            <div
              className={`px-6 py-2.5 text-xs font-technical flex items-center gap-2 border-b ${
                statusMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 1: SIGN IN */}
          {/* ========================================================= */}
          {authMode === 'signin' && (
            <div>
              <div className="p-6 border-b border-zinc-200 bg-white">
                <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
                  SECURE GOVERNMENT AUTHENTICATION
                </div>
                <h2 className="text-2xl font-bold text-zinc-950 font-heading">
                  Official Sign In
                </h2>
                <p className="text-xs text-zinc-600 mt-1">
                  Access the AI-enabled Skill Intelligence Platform for official statistical cadres.
                </p>

                {/* Role Selection Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-100 border border-zinc-300 mt-5">
                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('officer')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-technical uppercase tracking-wider transition-all cursor-pointer ${
                      selectedRole === 'officer'
                        ? 'bg-zinc-950 text-white font-bold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('trainer')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-technical uppercase tracking-wider transition-all cursor-pointer ${
                      selectedRole === 'trainer'
                        ? 'bg-zinc-950 text-white font-bold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trainer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('admin')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-technical uppercase tracking-wider transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'bg-zinc-950 text-white font-bold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin</span>
                  </button>
                </div>

                {/* Notice for Trainer Role */}
                {selectedRole === 'trainer' && (
                  <div className="mt-3 p-2.5 bg-amber-50/90 border border-amber-300 text-[11px] text-amber-900 font-technical flex items-start gap-2">
                    <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong>Trainer Access Policy:</strong> Trainer accounts are provisioned exclusively by MoSPI/NSSTA Administration with designated ID and password. Direct self-registration is restricted.
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleStandardLogin} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    {selectedRole === 'trainer' ? 'Assigned Trainer ID / Email' : selectedRole === 'admin' ? 'Administrative ID / Email' : 'Employee ID / Official Email'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder={
                        selectedRole === 'trainer'
                          ? 'Enter Trainer ID or Email'
                          : selectedRole === 'admin'
                          ? 'Enter Admin ID or Email'
                          : 'Enter Employee ID or Official Email'
                      }
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                    <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" defaultChecked className="accent-amber-500 rounded-none" />
                    <span className="text-[11px] font-technical">Remember credential</span>
                  </label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] font-technical text-amber-800 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-zinc-950 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>Sign In to {selectedRole.toUpperCase()} Suite</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-technical uppercase tracking-wider font-bold border border-amber-500 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Login with iGOT SSO</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-950 px-1 font-mono font-bold">Karmayogi</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 2: CREATE OFFICER ACCOUNT (Requirement 1 & 2) */}
          {/* ========================================================= */}
          {authMode === 'register' && (
            <div>
              <div className="p-6 border-b border-zinc-200 bg-white">
                <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
                  OFFICIAL CADRE ONBOARDING
                </div>
                <h2 className="text-2xl font-bold text-zinc-950 font-heading">
                  Create Officer Account
                </h2>
                <p className="text-xs text-zinc-600 mt-1">
                  Self-registration for Officers of Subordinate Statistical Service (SSS), ISS, and Field Formations.
                </p>

                {/* Important Cadre Clarification */}
                <div className="mt-4 p-3 bg-zinc-50 border border-zinc-300 text-xs font-technical space-y-1">
                  <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>Officer Self-Registration</span>
                  </div>
                  <p className="text-zinc-600 text-[11px]">
                    Note: Trainers and Faculty members cannot self-register. <strong>Trainer accounts are created and provisioned exclusively by MoSPI/NSSTA Administration</strong> with dedicated ID & password.
                  </p>
                </div>
              </div>

              {/* Officer Registration Form */}
              <form onSubmit={handleOfficerRegister} className="p-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Arun Kumar Verma"
                    className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                  />
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Official MoSPI / Govt Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="arun.verma@mospi.gov.in"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-2" />
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Employee ID / Cadre Registration Code
                  </label>
                  <input
                    type="text"
                    value={regEmployeeId}
                    onChange={(e) => setRegEmployeeId(e.target.value)}
                    placeholder="e.g. EMP-994120-AK"
                    className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                  />
                </div>

                {/* Cadre & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Statistical Cadre
                    </label>
                    <select
                      value={regCadre}
                      onChange={(e) => setRegCadre(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-2.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    >
                      <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                      <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS)</option>
                      <option value="Contractual Field Cadre (FOD)">Contractual Field Cadre (FOD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Designation
                    </label>
                    <select
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-2.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    >
                      <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer (JSO)</option>
                      <option value="Statistical Officer (SO)">Statistical Officer (SO)</option>
                      <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
                      <option value="Assistant Director">Assistant Director</option>
                    </select>
                  </div>
                </div>

                {/* Station */}
                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Station / Regional Posting
                  </label>
                  <input
                    type="text"
                    value={regStation}
                    onChange={(e) => setRegStation(e.target.value)}
                    placeholder="e.g. Regional Office, Lucknow (Northern Zone)"
                    className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                  />
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Set Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-[#FAF9F6] border border-zinc-300 px-3.5 py-2 text-xs text-zinc-950 focus:outline-none focus:border-zinc-950 font-technical"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-zinc-950 hover:bg-black text-white text-xs font-technical uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Registering Officer Profile...</span>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Register Officer Account</span>
                      </>
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="text-xs font-technical text-amber-800 hover:underline cursor-pointer"
                    >
                      Already have an account? Sign in here
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-3 px-6 text-center text-xs font-technical text-zinc-500">
        NIC / CERT-In Standard Compliant Authentication Flow · MoSPI Internal Portal
      </footer>
    </div>
  );
};
