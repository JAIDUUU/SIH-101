import React, { useState } from 'react';
import { BrandMark } from '../common/BrandMark';
import { Role } from '../../types';
import {
  Bell,
  Sparkles,
  LogOut,
  Home,
  KeyRound,
  UserPlus,
  LogIn,
  Menu,
  X,
  LayoutDashboard,
  UserCheck,
  BrainCircuit,
  TrendingDown,
  GitMerge,
  BookOpen,
  FileQuestion,
  CreditCard,
  Users2,
  Wand2,
  ListCheck,
  LineChart,
  Globe2,
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeView: string;
  onNavigate: (viewId: string) => void;
  onToggleSidebar?: () => void;
  onOpenAssistant: () => void;
  unreadCount: number;
  userName?: string;
  userDesignation?: string;
  isAuthenticated: boolean;
  onLogout: () => void;
  onGoToLogin: (role?: Role, mode?: 'signin' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  activeView,
  onNavigate,
  onOpenAssistant,
  unreadCount,
  userName = 'Statistical Officer',
  isAuthenticated,
  onLogout,
  onGoToLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // When clicking the brand mark:
  // If authenticated, navigate to personal role dashboard so user never accidentally lands on guest landing view
  const handleBrandClick = () => {
    setMobileMenuOpen(false);
    if (isAuthenticated) {
      if (currentRole === 'officer') {
        onNavigate('officer-dashboard');
      } else if (currentRole === 'trainer') {
        onNavigate('trainer-dashboard');
      } else if (currentRole === 'admin') {
        onNavigate('admin-workforce');
      }
    } else {
      onNavigate('landing');
    }
  };

  const handleNavClick = (viewId: string) => {
    setMobileMenuOpen(false);
    onNavigate(viewId);
  };

  // Mobile navigation links based on role
  const officerNavItems = [
    { id: 'officer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile-setup', label: 'My Profile Setup', icon: UserCheck },
    { id: 'competencies', label: 'Competency Intelligence', icon: BrainCircuit },
    { id: 'skill-decay', label: 'Skill Decay & Readiness', icon: TrendingDown, badge: 'At Risk' },
    { id: 'learning-path', label: 'Personalized Learning Path', icon: GitMerge },
    { id: 'courses', label: 'Course Catalogue', icon: BookOpen },
    { id: 'officer-quiz', label: 'Assessments & Live Quiz', icon: FileQuestion },
    { id: 'skill-passport', label: 'Digital Skill Passport', icon: CreditCard },
    { id: 'peer-learning', label: 'Peer Learning & Mentors', icon: Users2 },
  ];

  const trainerNavItems = [
    { id: 'trainer-dashboard', label: 'Trainer Dashboard', icon: LayoutDashboard },
    { id: 'quiz-generator', label: 'AI Quiz Generator', icon: Wand2, badge: 'Core AI' },
    { id: 'quiz-review', label: 'Generated Quiz Review', icon: ListCheck },
    { id: 'courses', label: 'Course Repository', icon: BookOpen },
  ];

  const adminNavItems = [
    { id: 'admin-workforce', label: 'Workforce Intelligence', icon: LayoutDashboard },
    { id: 'future-readiness', label: 'Future Skill Forecast', icon: LineChart, badge: '2026–28' },
    { id: 'regional-readiness', label: 'India Regional Readiness', icon: Globe2 },
    { id: 'courses', label: 'Official Curricula', icon: BookOpen },
  ];

  const currentNavItems =
    currentRole === 'officer'
      ? officerNavItems
      : currentRole === 'trainer'
      ? trainerNavItems
      : adminNavItems;

  const dashboardTargetView =
    currentRole === 'officer'
      ? 'officer-dashboard'
      : currentRole === 'trainer'
      ? 'trainer-dashboard'
      : 'admin-workforce';

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-zinc-200">
      {/* Primary Unified Navigation Bar */}
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Identity with Official MoSPI Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleBrandClick}
            className="text-left focus:outline-none cursor-pointer group flex items-center"
            title={isAuthenticated ? 'Go to Dashboard' : 'Return to Public Portal'}
          >
            <BrandMark size="sm" showTagline={false} />
          </button>

          <span className="hidden md:inline text-xs font-technical text-zinc-300">|</span>
          <span className="hidden lg:inline text-xs font-technical text-zinc-600 tracking-tight">
            MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION (MoSPI)
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* CASE 1: Login Screen */}
          {activeView === 'login' ? (
            <button
              onClick={() => onNavigate('landing')}
              className="text-xs font-technical uppercase tracking-wider text-zinc-700 hover:text-zinc-950 border border-zinc-300 px-3 py-1.5 transition-colors cursor-pointer"
            >
              ← Back to Portal
            </button>
          ) : isAuthenticated ? (
            /* CASE 2: Authenticated State (whether on dashboard, subview, or previewing landing page) */
            <>
              {/* If user is currently looking at public landing page, offer Return to Dashboard */}
              {activeView === 'landing' ? (
                <button
                  onClick={() => onNavigate(dashboardTargetView)}
                  className="px-3 py-1.5 bg-zinc-950 hover:bg-black text-amber-300 text-xs font-technical uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-amber-400" />
                  <span>Return to My Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('landing')}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-technical border border-zinc-300 text-zinc-600 hover:border-zinc-900 transition-colors cursor-pointer"
                  title="View Public Portal Landing"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Public Portal</span>
                </button>
              )}

              {/* Skill Sutra AI Assistant Button */}
              <button
                onClick={onOpenAssistant}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 border border-amber-500 font-technical text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                title="Open Skill Sutra AI Advisor"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-950 fill-zinc-950" />
                <span className="hidden sm:inline">AI Advisor</span>
              </button>

              {/* Notifications Trigger */}
              <button
                onClick={() => onNavigate('notifications')}
                className={`relative p-1.5 sm:p-2 border transition-colors cursor-pointer ${
                  activeView === 'notifications'
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-800 border-zinc-300 hover:border-zinc-900'
                }`}
                title="Notifications Center"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-technical font-bold flex items-center justify-center border border-zinc-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Persona Profile Pill (Desktop) */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-200">
                <span className="w-6 h-6 bg-zinc-900 text-amber-400 font-technical font-bold text-[10px] flex items-center justify-center border border-zinc-800">
                  {currentRole === 'officer' ? 'OF' : currentRole === 'trainer' ? 'TR' : 'AD'}
                </span>
                <span className="text-xs font-bold text-zinc-900 font-sans max-w-[120px] truncate">
                  {userName}
                </span>
              </div>

              {/* Sign Out Button (Desktop) */}
              <button
                onClick={onLogout}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-technical uppercase tracking-wider text-zinc-600 hover:text-zinc-950 border border-zinc-300 hover:border-zinc-900 transition-colors cursor-pointer"
                title="Sign Out of Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            </>
          ) : (
            /* CASE 3: Guest / Unauthenticated State */
            <div className="flex items-center gap-1.5 sm:gap-2 font-technical text-xs">
              <button
                onClick={() => onGoToLogin('officer', 'signin')}
                className="px-2.5 sm:px-3 py-1.5 uppercase tracking-wider text-zinc-900 border border-zinc-300 hover:border-zinc-900 bg-white transition-colors cursor-pointer font-semibold flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onGoToLogin('officer', 'register')}
                className="px-2.5 sm:px-3.5 py-1.5 uppercase tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Register</span>
              </button>

              <button
                onClick={() => onGoToLogin('trainer', 'signin')}
                className="hidden md:flex px-2 py-1.5 uppercase tracking-wider text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer items-center gap-1"
                title="Faculty & Admin Login"
              >
                <KeyRound className="w-3 h-3 text-zinc-500" />
                <span>Trainer / Admin</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button (Visible on screens < lg) */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 text-zinc-800 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 transition-colors cursor-pointer ml-1"
            title="Toggle Navigation Menu"
            aria-label="Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-300 bg-white shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* User Profile Header (if authenticated) */}
          {isAuthenticated && (
            <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 text-amber-400 font-technical font-bold text-xs flex items-center justify-center border border-zinc-800">
                  {currentRole === 'officer' ? 'OF' : currentRole === 'trainer' ? 'TR' : 'AD'}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 font-sans">{userName}</div>
                  <div className="text-[10px] font-technical text-zinc-600 uppercase tracking-wider">
                    {currentRole === 'officer'
                      ? 'OFFICER PORTAL'
                      : currentRole === 'trainer'
                      ? 'TRAINER / FACULTY'
                      : 'ADMINISTRATIVE SUITE'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="px-2.5 py-1.5 text-xs font-technical uppercase text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 max-h-[60vh] overflow-y-auto space-y-1">
            {isAuthenticated ? (
              <>
                <div className="text-[10px] font-technical uppercase font-semibold text-zinc-600 px-3 py-1">
                  PORTAL NAVIGATION
                </div>

                {currentNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 text-xs font-medium text-left transition-colors cursor-pointer rounded-xs ${
                        isActive
                          ? 'bg-zinc-950 text-white font-semibold'
                          : 'text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-600'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-technical px-1.5 py-0.5 bg-amber-400 text-black font-bold uppercase">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-zinc-200 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAssistant();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-xs font-technical font-bold uppercase bg-amber-400 text-zinc-950 border border-amber-500"
                  >
                    <Sparkles className="w-4 h-4 text-zinc-950" />
                    <span>Open AI Advisor</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('notifications')}
                    className="w-full flex items-center justify-between px-3 py-3 text-xs font-technical text-zinc-800 hover:bg-zinc-100"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-zinc-600" />
                      <span>Notifications & Alerts</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5">
                        {unreadCount} New
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNavClick('landing')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-technical text-zinc-600 hover:bg-zinc-100"
                  >
                    <Home className="w-4 h-4 text-zinc-500" />
                    <span>View Public Portal</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 p-2 font-technical">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToLogin('officer', 'signin');
                  }}
                  className="w-full py-3 bg-zinc-950 text-white text-xs font-bold uppercase flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>Officer Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToLogin('officer', 'register');
                  }}
                  className="w-full py-3 bg-amber-400 text-zinc-950 text-xs font-bold uppercase border border-amber-500 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-zinc-950" />
                  <span>Create Officer Account</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoToLogin('trainer', 'signin');
                  }}
                  className="w-full py-2.5 bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase border border-zinc-300 flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 text-zinc-600" />
                  <span>Trainer / Faculty Login</span>
                </button>

                <button
                  onClick={() => handleNavClick('courses')}
                  className="w-full py-2.5 text-zinc-700 text-xs text-center border border-zinc-200 mt-2 block"
                >
                  Browse iGOT Course Catalogue
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
