import React from 'react';
import { Role } from '../../types';
import {
  LayoutDashboard,
  UserCheck,
  BrainCircuit,
  TrendingDown,
  GitMerge,
  BookOpen,
  FileQuestion,
  CreditCard,
  Users2,
  Bell,
  Settings,
  FolderArchive,
  Wand2,
  ListCheck,
  GraduationCap,
  BarChart3,
  Globe2,
  Building2,
  FileSpreadsheet,
  LineChart,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

interface SidebarProps {
  currentRole: Role;
  activeView: string;
  onNavigate: (viewId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeView,
  onNavigate,
  isOpen = true,
  onClose,
  unreadCount = 2,
}) => {
  const officerNav: NavItem[] = [
    { id: 'officer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile-setup', label: 'My Profile Setup', icon: UserCheck },
    { id: 'competencies', label: 'Competency Intelligence', icon: BrainCircuit },
    { id: 'skill-decay', label: 'Skill Decay & Readiness', icon: TrendingDown, badge: 'At Risk' },
    { id: 'learning-path', label: 'Personalized Learning Path', icon: GitMerge },
    { id: 'courses', label: 'Course Catalogue', icon: BookOpen },
    { id: 'officer-quiz', label: 'Assessments & Live Quiz', icon: FileQuestion },
    { id: 'skill-passport', label: 'Digital Skill Passport', icon: CreditCard },
    { id: 'peer-learning', label: 'Peer Learning & Mentors', icon: Users2 },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell, count: unreadCount },
  ];

  const trainerNav: NavItem[] = [
    { id: 'trainer-dashboard', label: 'Trainer Dashboard', icon: LayoutDashboard },
    { id: 'quiz-generator', label: 'AI Quiz Generator', icon: Wand2, badge: 'Core AI' },
    { id: 'quiz-review', label: 'Generated Quiz Review', icon: ListCheck },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell, count: unreadCount },
  ];

  const adminNav: NavItem[] = [
    { id: 'admin-workforce', label: 'Workforce Intelligence', icon: LayoutDashboard },
    { id: 'future-readiness', label: 'Future Skill Forecast', icon: LineChart, badge: '2026–28' },
    { id: 'regional-readiness', label: 'India / Regional Readiness', icon: Globe2 },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell, count: unreadCount },
  ];

  const items =
    currentRole === 'officer'
      ? officerNav
      : currentRole === 'trainer'
      ? trainerNav
      : adminNav;

  return (
    <aside className="hidden lg:flex w-64 bg-[#FFFFFF] border-r border-zinc-200 flex-col justify-between shrink-0 min-h-[calc(100vh-80px)]">
      <div className="py-4">
        {/* Role Header Badge */}
        <div className="px-5 mb-4">
          <div className="text-[10px] font-technical uppercase tracking-widest text-zinc-600 mb-1">
            PORTAL SCOPE
          </div>
          <div className="text-xs font-bold text-zinc-900 font-technical flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400 border border-amber-600 rounded-none inline-block" />
            <span>
              {currentRole === 'officer'
                ? 'OFFICER PORTAL'
                : currentRole === 'trainer'
                ? 'TRAINER / FACULTY'
                : 'ADMINISTRATIVE SUITE'}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-0.5 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                    : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-amber-400' : 'text-zinc-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-technical px-1.5 py-0.2 uppercase shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-technical font-bold px-1.5 py-0.2 shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-black'
                        : 'bg-zinc-900 text-white'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subtle Technical Footer inside Sidebar */}
      <div className="p-4 border-t border-zinc-200 bg-zinc-50/70 text-[11px] font-technical text-zinc-600">
        <div className="flex items-center justify-between mb-1">
          <span className="text-zinc-600">CADRE SYNC</span>
          <span className="text-emerald-700 font-semibold">ONLINE</span>
        </div>
        <div className="text-[10px] text-zinc-600 leading-tight">
          MoSPI Official Statistical Cadre Competency Standards 2025-26
        </div>
      </div>
    </aside>
  );
};
