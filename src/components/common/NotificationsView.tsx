import React, { useState } from 'react';
import {
  Bell,
  Clock,
  BookOpen,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Check,
  ArrowRight,
} from 'lucide-react';

interface NotificationsViewProps {
  onNavigate: (viewId: string) => void;
}

interface NotificationItem {
  id: string;
  type: 'REFRESHER' | 'RECOMMENDATION' | 'PEER' | 'TEAM_ALERT';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionText: string;
  actionTarget: string;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'REFRESHER',
      title: 'Refresher due in 15 days',
      message:
        'Your verified accreditation in "Sampling Methodology & Design" (Score: 82%) will decay to 68% in the next quarterly audit cycle. Complete the 10-minute NSSTA diagnostic drill to renew certification.',
      time: '2 hours ago',
      isRead: false,
      actionText: 'Take Refresher Quiz Now',
      actionTarget: 'officer-quiz',
    },
    {
      id: 'notif-2',
      type: 'RECOMMENDATION',
      title: 'New course recommended',
      message:
        'AI Curriculum engine has mapped "Python for Statistical Analysis & NSSO Microdata Processing" (NSSTA TPAC, 18 Hours) to your primary gap. Match Confidence: 96%.',
      time: 'Yesterday',
      isRead: false,
      actionText: 'Enroll & Inspect Syllabus',
      actionTarget: 'courses',
    },
    {
      id: 'notif-3',
      type: 'PEER',
      title: 'Peer requested connection',
      message:
        'Dr. Ananya Deshmukh (Senior Statistical Officer, DQAD Kolkata) sent you a mentorship and study connection request regarding field sampling protocols.',
      time: '2 days ago',
      isRead: true,
      actionText: 'Review Peer Collaboration',
      actionTarget: 'peer-learning',
    },
    {
      id: 'notif-4',
      type: 'TEAM_ALERT',
      title: 'Team competency dropped',
      message:
        'Northern Zone Field Division (FOD) average score in "Automated Microdata Scripting" declined by -4.2% following the rollout of the 2026 CAPI tabular specifications.',
      time: '3 days ago',
      isRead: true,
      actionText: 'Inspect Regional Workforce Matrix',
      actionTarget: 'regional-readiness',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.isRead;
    if (activeFilter === 'Refresher') return n.type === 'REFRESHER';
    if (activeFilter === 'Peers') return n.type === 'PEER';
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              SYSTEM DISPATCHES // MOSPI CADRE TELEMETRY
            </div>
            <h1 className="text-2xl font-bold text-zinc-950 font-heading">
              Cadre Alerts & Curricular Notifications
            </h1>
            <p className="text-xs text-zinc-600 mt-0.5">
              Automated triggers based on competency decay horizons, peer inquiries, and regional shifts.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 text-xs font-technical uppercase font-bold transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-zinc-600" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-300 pb-3 font-technical text-xs">
        {['All', 'Unread', 'Refresher', 'Peers'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 uppercase tracking-wider transition-colors ${
              activeFilter === filter
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="space-y-4">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 bg-white border border-zinc-300 text-center text-xs text-zinc-500 font-technical">
            No dispatches matching filter criteria.
          </div>
        ) : (
          filteredNotifs.map((notif) => {
            const isUnread = !notif.isRead;

            let icon = <Bell className="w-4 h-4 text-zinc-500" />;
            let badgeBg = 'bg-zinc-100 text-zinc-800 border-zinc-300';

            if (notif.type === 'REFRESHER') {
              icon = <Clock className="w-4 h-4 text-amber-700" />;
              badgeBg = 'bg-amber-100 text-amber-950 border-amber-400';
            } else if (notif.type === 'RECOMMENDATION') {
              icon = <BookOpen className="w-4 h-4 text-emerald-700" />;
              badgeBg = 'bg-emerald-100 text-emerald-950 border-emerald-300';
            } else if (notif.type === 'PEER') {
              icon = <UserPlus className="w-4 h-4 text-blue-700" />;
              badgeBg = 'bg-blue-100 text-blue-950 border-blue-300';
            } else if (notif.type === 'TEAM_ALERT') {
              icon = <AlertTriangle className="w-4 h-4 text-rose-700" />;
              badgeBg = 'bg-rose-100 text-rose-950 border-rose-300';
            }

            return (
              <div
                key={notif.id}
                className={`p-5 bg-white border transition-colors shadow-xs ${
                  isUnread
                    ? 'border-2 border-amber-400 bg-[#FFFDF9]'
                    : 'border-zinc-300 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-zinc-100 border border-zinc-300 shrink-0 mt-0.5">
                      {icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-technical uppercase font-bold px-2 py-0.5 border ${badgeBg}`}
                        >
                          {notif.type.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-950 font-heading">
                          {notif.title}
                        </h3>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                        )}
                      </div>

                      <p className="text-xs text-zinc-700 font-sans leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="text-[10px] font-technical text-zinc-400 pt-1">
                        Dispatched {notif.time}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismiss(notif.id)}
                    className="text-zinc-400 hover:text-zinc-800 p-1 cursor-pointer shrink-0"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-end">
                  <button
                    onClick={() => onNavigate(notif.actionTarget)}
                    className="px-4 py-1.5 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{notif.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
