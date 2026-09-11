import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { PRIMARY_OFFICER, DEMO_SAMPLE_QUIZ } from './data/mockData';
import { ApiClient } from './services/apiClient';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SkillSutraAssistantModal } from './components/screens/SkillSutraAssistantModal';

// Views
import { LandingPageView } from './components/screens/LandingPageView';
import { LoginView } from './components/screens/LoginView';
import { OfficerProfileSetupView } from './components/officer/OfficerProfileSetupView';
import { OfficerDashboardView } from './components/officer/OfficerDashboardView';
import { CompetencyIntelligenceView } from './components/officer/CompetencyIntelligenceView';
import { SkillDecayView } from './components/officer/SkillDecayView';
import { LearningPathView } from './components/officer/LearningPathView';
import { CourseCatalogueView } from './components/officer/CourseCatalogueView';
import { OfficerQuizView } from './components/officer/OfficerQuizView';
import { SkillPassportView } from './components/officer/SkillPassportView';
import { PeerLearningView } from './components/officer/PeerLearningView';
import { TrainerDashboardView } from './components/trainer/TrainerDashboardView';
import { QuizGeneratorView } from './components/trainer/QuizGeneratorView';
import { QuizReviewView } from './components/trainer/QuizReviewView';
import { AdminWorkforceView } from './components/admin/AdminWorkforceView';
import { FutureWorkforceReadinessView } from './components/admin/FutureWorkforceReadinessView';
import { RegionalReadinessView } from './components/admin/RegionalReadinessView';
import { NotificationsView } from './components/common/NotificationsView';

const SESSION_STORAGE_KEYS = {
  IS_AUTH: 'skillsutra_auth_status',
  AUTH_ROLE: 'skillsutra_auth_role',
  CURRENT_ROLE: 'skillsutra_current_role',
  ACTIVE_VIEW: 'skillsutra_active_view',
  USER_DATA: 'skillsutra_user_data',
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SESSION_STORAGE_KEYS.IS_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [authenticatedRole, setAuthenticatedRole] = useState<UserRole | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEYS.AUTH_ROLE);
      if (saved === 'officer' || saved === 'trainer' || saved === 'admin') return saved as UserRole;
      return null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEYS.CURRENT_ROLE);
      if (saved === 'officer' || saved === 'trainer' || saved === 'admin') return saved as UserRole;
      return 'officer';
    } catch {
      return 'officer';
    }
  });

  const [activeView, setActiveView] = useState<string>(() => {
    try {
      const isAuth = localStorage.getItem(SESSION_STORAGE_KEYS.IS_AUTH) === 'true';
      const saved = localStorage.getItem(SESSION_STORAGE_KEYS.ACTIVE_VIEW);
      if (isAuth && saved && saved !== 'login') {
        return saved;
      }
      return 'landing';
    } catch {
      return 'landing';
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(2);

  // Authentication State for routing to login
  const [loginTargetRole, setLoginTargetRole] = useState<UserRole>('officer');
  const [loginTargetMode, setLoginTargetMode] = useState<'signin' | 'register'>('signin');

  // Dynamic Officer Profile State (updated when quizzes are passed or profile is edited)
  const [officerProfile, setOfficerProfile] = useState(PRIMARY_OFFICER);
  const [currentQuiz, setCurrentQuiz] = useState(DEMO_SAMPLE_QUIZ);

  // Restore cached user profile if present
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem(SESSION_STORAGE_KEYS.USER_DATA);
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && savedUser.name) {
          setOfficerProfile((prev) => ({
            ...prev,
            name: savedUser.name,
            designation: savedUser.designation || prev.designation,
          }));
        }
      }
    } catch {}
  }, []);

  // Sync initial state from backend
  useEffect(() => {
    ApiClient.getProfile()
      .then((res) => {
        if (res && res.officer) setOfficerProfile(res.officer);
      })
      .catch((err) => console.warn('Could not sync profile from server:', err));

    ApiClient.getCurrentQuiz()
      .then((q) => {
        if (q) setCurrentQuiz(q);
      })
      .catch((err) => console.warn('Could not sync quiz from server:', err));
  }, []);

  // Handler to navigate directly to Login with a role and mode
  const handleGoToLogin = (role: UserRole = 'officer', mode: 'signin' | 'register' = 'signin') => {
    setLoginTargetRole(role);
    setLoginTargetMode(mode);
    setActiveView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for Role Change / Cadre Selection
  // Enforces authentication: If user is not authenticated for that role, redirects to Login!
  const handleRoleChange = (role: UserRole) => {
    if (!isAuthenticated || authenticatedRole !== role) {
      handleGoToLogin(role, 'signin');
    } else {
      setCurrentRole(role);
      if (role === 'officer') {
        setActiveView('officer-dashboard');
      } else if (role === 'trainer') {
        setActiveView('trainer-dashboard');
      } else if (role === 'admin') {
        setActiveView('admin-workforce');
      }
    }
  };

  // Handler on successful Login or Account Creation
  const handleLoginSuccess = (
    role: UserRole,
    user?: { name: string; designation?: string; email?: string; isProfileSetup?: boolean }
  ) => {
    setIsAuthenticated(true);
    setAuthenticatedRole(role);
    setCurrentRole(role);

    try {
      localStorage.setItem(SESSION_STORAGE_KEYS.IS_AUTH, 'true');
      localStorage.setItem(SESSION_STORAGE_KEYS.AUTH_ROLE, role);
      localStorage.setItem(SESSION_STORAGE_KEYS.CURRENT_ROLE, role);
      if (user) {
        localStorage.setItem(SESSION_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
    } catch (e) {
      console.warn('Could not save session to localStorage:', e);
    }

    const isSetup = user?.isProfileSetup ?? (user?.email === 'rajesh.kumar@mospi.gov.in');

    if (role === 'officer') {
      if (!isSetup) {
        // Reset to unconfigured officer state
        setOfficerProfile((prev) => ({
          ...prev,
          name: user?.name || prev.name,
          email: user?.email || prev.email,
          isProfileSetup: false,
          readinessScore: 0,
          domainScores: {
            'Statistical': 0,
            'Technical': 0,
            'Digital Governance': 0,
            'Behavioural & Managerial': 0,
          },
          atRiskSkills: [],
          completedCoursesCount: 0,
          assessmentsCompleted: 0,
          verifiedCredentialsCount: 0,
          activeCourses: [],
          competencies: [],
        }));
      } else {
        if (user && user.name) {
          setOfficerProfile((prev) => ({
            ...prev,
            name: user.name,
            email: user.email || prev.email,
            designation: user.designation || prev.designation,
          }));
        }
      }
    }

    const targetView =
      role === 'officer'
        ? (!isSetup ? 'profile-setup' : 'officer-dashboard')
        : role === 'trainer'
        ? 'trainer-dashboard'
        : 'admin-workforce';

    setActiveView(targetView);
    try {
      localStorage.setItem(SESSION_STORAGE_KEYS.ACTIVE_VIEW, targetView);
    } catch {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for Sign Out / Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthenticatedRole(null);
    setActiveView('landing');

    try {
      localStorage.removeItem(SESSION_STORAGE_KEYS.IS_AUTH);
      localStorage.removeItem(SESSION_STORAGE_KEYS.AUTH_ROLE);
      localStorage.removeItem(SESSION_STORAGE_KEYS.CURRENT_ROLE);
      localStorage.removeItem(SESSION_STORAGE_KEYS.ACTIVE_VIEW);
      localStorage.removeItem(SESSION_STORAGE_KEYS.USER_DATA);
    } catch (e) {
      console.warn('Could not remove session from localStorage:', e);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for navigation from any screen
  const handleNavigate = (viewId: string) => {
    // Guard protected screens if user is not authenticated
    if (
      !isAuthenticated &&
      viewId !== 'landing' &&
      viewId !== 'login' &&
      viewId !== 'courses'
    ) {
      handleGoToLogin(currentRole, 'signin');
      return;
    }
    setActiveView(viewId);
    if (isAuthenticated && viewId !== 'login') {
      try {
        localStorage.setItem(SESSION_STORAGE_KEYS.ACTIVE_VIEW, viewId);
      } catch {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for Quiz Completion & Competency Updates
  const handleQuizComplete = (
    score: number,
    updatedComps: { name: string; oldScore: number; newScore: number }[]
  ) => {
    setOfficerProfile((prev) => {
      const updatedList = prev.competencies.map((comp) => {
        const found = updatedComps.find((u) => u.name === comp.name);
        if (found) {
          return {
            ...comp,
            currentScore: found.newScore,
            verification: 'SYSTEM-VERIFIED' as const,
            evidence: `Validated in NSSTA Official Verification Drill (${new Date().toLocaleDateString()})`,
          };
        }
        return comp;
      });

      // Recalculate readiness
      const total = updatedList.reduce((acc, c) => acc + c.currentScore, 0);
      const newReadiness = Math.round(total / updatedList.length);

      return {
        ...prev,
        competencies: updatedList,
        readinessScore: Math.min(100, Math.max(newReadiness, prev.readinessScore + 2)),
        verifiedCredentialsCount: prev.verifiedCredentialsCount + 1,
      };
    });

    // Also refresh latest verified profile from backend
    ApiClient.getProfile()
      .then((res) => {
        if (res && res.officer) setOfficerProfile(res.officer);
      })
      .catch((err) => console.warn('Profile refresh fallback:', err));
  };

  // Handler for Profile Onboarding Complete
  const handleProfileSetupComplete = (data: any) => {
    if (data && data.name && data.competencies) {
      setOfficerProfile({ ...data, isProfileSetup: true });
    } else {
      setOfficerProfile((prev) => ({
        ...prev,
        isProfileSetup: true,
        name: data?.fullName || prev.name,
        designation: data?.designation || prev.designation,
        cadre: data?.cadre || prev.cadre,
        department: data?.department || prev.department,
        station: data?.station || prev.station,
        experienceYears: data?.experienceYears || prev.experienceYears,
      }));
    }
    setActiveView('officer-dashboard');
    try {
      localStorage.setItem(SESSION_STORAGE_KEYS.ACTIVE_VIEW, 'officer-dashboard');
    } catch {}
  };

  // Handler for Publishing Quiz in Trainer View
  const handlePublishQuiz = (quizId: string) => {
    setCurrentQuiz((prev) => ({ ...prev, status: 'Published' }));
  };

  // Determine if full-screen mode (without global sidebar/navbar or with custom navbar)
  const isFullScreenView = activeView === 'landing' || activeView === 'login';

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-950 font-sans selection:bg-amber-300 selection:text-zinc-950">
      {/* Skill Sutra AI Assistant Modal */}
      <SkillSutraAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        officer={officerProfile}
        onNavigate={handleNavigate}
      />

      {/* Global Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeView={activeView}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        unreadCount={unreadNotificationsCount}
        userName={officerProfile.name}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onGoToLogin={handleGoToLogin}
      />

      {/* Screen Rendering Area */}
      {isFullScreenView ? (
        <main className="w-full">
          {activeView === 'landing' && (
            <LandingPageView
              onGetStarted={() => handleGoToLogin('officer', 'signin')}
              onExplore={() => {
                const el = document.querySelector('section:nth-of-type(2)');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleNavigate('courses');
              }}
              onSelectRole={(role) => handleRoleChange(role)}
            />
          )}

          {activeView === 'login' && (
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onBackToLanding={() => setActiveView('landing')}
              initialRole={loginTargetRole}
              initialMode={loginTargetMode}
            />
          )}
        </main>
      ) : (
        <div className="flex w-full min-h-[calc(100vh-64px)] overflow-x-hidden">
          {/* Responsive Role-Based Sidebar */}
          <Sidebar
            currentRole={currentRole}
            activeView={activeView}
            onNavigate={handleNavigate}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Main App Workspace Canvas */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden transition-all">
            {/* Breadcrumb / View Status Indicator */}
            <div className="mb-6 flex items-center justify-between text-xs font-technical text-zinc-500 border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="uppercase font-bold text-zinc-900">
                  {currentRole.toUpperCase()} PORTAL
                </span>
                <span>/</span>
                <span className="text-amber-800 uppercase font-semibold">
                  {activeView.replace(/-/g, ' ')}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <span className="text-[11px] text-zinc-400">
                  SESSION ID: <strong>MOSPI-PROD-2026</strong>
                </span>
                <button
                  onClick={() => setIsAssistantOpen(true)}
                  className="text-amber-800 hover:text-amber-950 font-bold uppercase underline cursor-pointer"
                >
                  AI Consultation
                </button>
              </div>
            </div>

            {/* Officer Workflow Screens */}
            {activeView === 'profile-setup' && (
              <OfficerProfileSetupView
                officer={officerProfile}
                onComplete={handleProfileSetupComplete}
                onSkip={() => setActiveView('officer-dashboard')}
              />
            )}

            {activeView === 'officer-dashboard' && (
              <OfficerDashboardView
                officer={officerProfile}
                onNavigate={handleNavigate}
                onOpenAssistant={() => setIsAssistantOpen(true)}
              />
            )}

            {activeView === 'competencies' && (
              <CompetencyIntelligenceView
                officer={officerProfile}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'skill-decay' && (
              <SkillDecayView
                officer={officerProfile}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'learning-path' && (
              <LearningPathView
                officer={officerProfile}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'courses' && (
              <CourseCatalogueView onNavigate={handleNavigate} />
            )}

            {activeView === 'officer-quiz' && (
              <OfficerQuizView
                quiz={currentQuiz}
                officer={officerProfile}
                onQuizComplete={handleQuizComplete}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'skill-passport' && (
              <SkillPassportView
                officer={officerProfile}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'peer-learning' && (
              <PeerLearningView
                officer={officerProfile}
                onNavigate={handleNavigate}
              />
            )}

            {/* Trainer Workflow Screens */}
            {activeView === 'trainer-dashboard' && (
              <TrainerDashboardView onNavigate={handleNavigate} />
            )}

            {activeView === 'quiz-generator' && (
              <QuizGeneratorView
                onNavigate={handleNavigate}
                onGeneratedComplete={(newQuiz) => {
                  if (newQuiz) setCurrentQuiz(newQuiz);
                  handleNavigate('quiz-review');
                }}
              />
            )}

            {activeView === 'quiz-review' && (
              <QuizReviewView
                quiz={currentQuiz}
                onNavigate={handleNavigate}
                onPublishQuiz={handlePublishQuiz}
              />
            )}

            {/* Admin Workflow Screens */}
            {activeView === 'admin-workforce' && (
              <AdminWorkforceView onNavigate={handleNavigate} />
            )}

            {activeView === 'future-readiness' && (
              <FutureWorkforceReadinessView onNavigate={handleNavigate} />
            )}

            {activeView === 'regional-readiness' && (
              <RegionalReadinessView onNavigate={handleNavigate} />
            )}

            {/* Cross-Cutting Notifications Screen */}
            {activeView === 'notifications' && (
              <NotificationsView onNavigate={handleNavigate} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
