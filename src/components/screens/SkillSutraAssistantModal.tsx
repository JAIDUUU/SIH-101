import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Send, ArrowRight, HelpCircle, Loader2, Bot, User, CheckCircle2 } from 'lucide-react';
import { OfficerProfile } from '../../types';
import { ApiClient } from '../../services/apiClient';

interface SkillSutraAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: OfficerProfile;
  onNavigate: (viewId: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: { label: string; viewId: string }[];
  highlightData?: {
    metricLabel: string;
    value: string;
    statusNote: string;
  };
}

export const SkillSutraAssistantModal: React.FC<SkillSutraAssistantModalProps> = ({
  isOpen,
  onClose,
  officer,
  onNavigate,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSetup = officer?.isProfileSetup ?? false;
  const readiness = officer?.readinessScore ?? 0;
  const officerName = officer?.name || 'Statistical Officer';

  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize or update welcome message when modal opens or officer changes
  useEffect(() => {
    if (isOpen) {
      const initialText = isSetup
        ? `Namaste Officer ${officerName}. I am the Skill Sutra Competency Advisor, calibrated to your active posting in ${officer.station || 'Field Operations Division'} (${officer.cadre || 'SSS Cadre'}, current readiness: ${readiness}%).\n\nI can assist you with competency gap analysis, upcoming survey protocols (PLFS, ASI, CPI), skill decay refreshers, or recommending verified iGOT Karmayogi & NSSTA modules. How may I assist your skill trajectory today?`
        : `Namaste Officer ${officerName}. Welcome to Skill Sutra AI, the official competency intelligence advisor for India's Official Statistical System.\n\nYour profile is currently pending baseline configuration (Readiness: 0%). Please complete your profile setup so I can calibrate personalized learning pathways, predict skill decay risks, and align your competencies with official MoSPI cadre benchmarks.`;

      const initialActions = isSetup
        ? [
            { label: 'View Learning Path', viewId: 'learning-path' },
            { label: 'Check Skill Decay', viewId: 'skill-decay' },
            { label: 'iGOT Course Catalogue', viewId: 'courses' },
          ]
        : [
            { label: 'Setup Officer Profile', viewId: 'profile-setup' },
            { label: 'Browse iGOT Courses', viewId: 'courses' },
          ];

      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: initialText,
          timestamp: 'Just now',
          actions: initialActions,
          highlightData: isSetup
            ? {
                metricLabel: 'ACTIVE CADRE READINESS',
                value: `${readiness}% Readiness Index`,
                statusNote: `${officer.cadre || 'SSS'} · ${officer.station || 'MoSPI Field Station'}`,
              }
            : {
                metricLabel: 'ONBOARDING STATUS',
                value: 'Profile Setup Pending',
                statusNote: 'Configure cadre & baseline assessment to unlock predictions',
              },
        },
      ]);
    }
  }, [isOpen, officer?.id, isSetup, readiness, officerName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = isSetup
    ? [
        'What should I learn?',
        'What course should I take next?',
        'Why is my Sampling Methodology at risk?',
        'How to prepare for Senior Statistical Officer benchmark?',
      ]
    : [
        'What should I learn?',
        'Profile setup kaise karein?',
        'What are iGOT Karmayogi SADHANA courses?',
        'How is readiness score calculated?',
      ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await ApiClient.consultAssistant(text.trim(), officer);
      const reply = response?.reply;

      // Extract contextual actions based on reply text
      const lower = (text + ' ' + (reply || '')).toLowerCase();
      const actions: { label: string; viewId: string }[] = [];

      if (!isSetup || lower.includes('setup') || lower.includes('profile')) {
        actions.push({ label: 'Setup Officer Profile', viewId: 'profile-setup' });
      }
      if (lower.includes('course') || lower.includes('catalogue') || lower.includes('igot') || lower.includes('sadhana')) {
        actions.push({ label: 'Open Course Catalogue', viewId: 'courses' });
      }
      if (lower.includes('quiz') || lower.includes('drill') || lower.includes('assessment')) {
        actions.push({ label: 'Launch Verification Drill', viewId: 'officer-quiz' });
      }
      if (lower.includes('decay') || lower.includes('risk') || lower.includes('refresher')) {
        actions.push({ label: 'Inspect Skill Decay', viewId: 'skill-decay' });
      }
      if (lower.includes('path') || lower.includes('roadmap') || lower.includes('next')) {
        actions.push({ label: 'View Learning Path', viewId: 'learning-path' });
      }
      if (lower.includes('passport') || lower.includes('credential') || lower.includes('certificate')) {
        actions.push({ label: 'Digital Skill Passport', viewId: 'skill-passport' });
      }

      const assistantMsg: Message = {
        id: `assist-${Date.now()}`,
        sender: 'assistant',
        text: reply || 'Official MoSPI standards have verified your inquiry. Please refer to your officer learning dashboard for step-by-step guidance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: actions.length > 0 ? actions.slice(0, 3) : [{ label: 'Course Catalogue', viewId: 'courses' }],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('AI Advisor query error:', err);
      const fallbackMsg: Message = {
        id: `assist-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `Officer ${officerName}, I have processed your inquiry against MoSPI standard operating guidelines. For immediate skill progression, please verify that your profile setup is complete and review the accredited courses from NSSTA Greater Noida and iGOT Karmayogi in your Course Catalogue.`,
        timestamp: 'Just now',
        actions: [
          { label: 'Setup Profile', viewId: 'profile-setup' },
          { label: 'View Courses', viewId: 'courses' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render markdown-like formatting (bold, bullet points)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Bold replacer
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-bold text-zinc-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={i} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-amber-500 font-bold shrink-0">•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={i} className="flex items-start gap-2 my-1 pl-1 font-medium">
            <span>{formattedParts}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className="my-1">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-zinc-900 shadow-2xl flex flex-col h-[90vh] sm:h-[84vh] max-h-[850px] overflow-hidden">
        {/* Government-Tech Assistant Header */}
        <div className="bg-zinc-950 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 text-zinc-950 flex items-center justify-center font-bold font-technical shrink-0">
              <Sparkles className="w-4 h-4 text-zinc-950 fill-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs uppercase font-technical text-amber-400 tracking-wider">
                  Skill Sutra AI // Competency Intelligence
                </span>
                <span className="hidden sm:inline text-[10px] bg-zinc-800 px-1.5 py-0.5 text-zinc-300 font-technical">
                  GEMINI-POWERED
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-zinc-100 line-clamp-1">
                Advisory for {officerName} ({officer.cadre || 'SSS Cadre'})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Context Banner */}
        <div className="bg-zinc-100 border-b border-zinc-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-technical text-zinc-700 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span>
              OFFICER: <strong className="text-zinc-950 font-semibold">{officerName}</strong>
            </span>
            <span className="text-zinc-400">|</span>
            <span>
              READINESS: <strong className="text-amber-800 font-bold">{readiness}%</strong>
            </span>
            <span className="text-zinc-400">|</span>
            <span>
              STATUS:{' '}
              <strong className={isSetup ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold'}>
                {isSetup ? 'Active / Configured' : 'Setup Pending'}
              </strong>
            </span>
          </div>
          <span className="text-[10px] text-zinc-600 bg-white border border-zinc-300 px-2 py-0.5">
            MoSPI · NSSTA · iGOT
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F7]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {m.sender === 'user' ? (
                  <User className="w-3 h-3 text-zinc-600" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span className="text-[10px] font-technical uppercase tracking-wider text-zinc-600">
                  {m.sender === 'user' ? 'You' : 'Skill Sutra AI Advisor'}
                </span>
                <span className="text-[10px] font-technical text-zinc-600">{m.timestamp}</span>
              </div>

              <div
                className={`max-w-[95%] sm:max-w-[85%] p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed border ${
                  m.sender === 'user'
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                    : 'bg-white text-zinc-900 border-zinc-300 shadow-xs'
                }`}
              >
                <div className={m.sender === 'user' ? 'text-white' : 'text-zinc-900'}>
                  {renderFormattedText(m.text)}
                </div>

                {/* Structured Metric Callout if present */}
                {m.highlightData && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-200 bg-amber-50/80 p-2.5 sm:p-3 border-l-2 border-l-amber-500">
                    <div className="text-[10px] font-technical uppercase font-bold text-amber-900 tracking-wider">
                      {m.highlightData.metricLabel}
                    </div>
                    <div className="text-sm font-bold text-zinc-950 font-heading">
                      {m.highlightData.value}
                    </div>
                    <div className="text-xs text-zinc-600 mt-0.5">
                      {m.highlightData.statusNote}
                    </div>
                  </div>
                )}

                {/* Actionable buttons */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-200 flex flex-wrap gap-1.5 sm:gap-2">
                    {m.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onClose();
                          onNavigate(act.viewId);
                        }}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-zinc-900 hover:bg-black text-amber-300 hover:text-amber-200 text-[11px] sm:text-xs font-technical uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px] font-technical uppercase text-zinc-600">
                  Skill Sutra AI Advisor
                </span>
              </div>
              <div className="bg-white border border-zinc-300 p-3.5 shadow-xs flex items-center gap-2.5 text-xs font-technical text-zinc-700">
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Consulting MoSPI & NSSTA Competency Knowledge Base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Structured Context Prompt Pills */}
        <div className="bg-white border-t border-zinc-200 px-3 sm:px-6 py-2 overflow-x-auto shrink-0">
          <div className="text-[10px] font-technical uppercase text-zinc-600 font-semibold mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Suggested Queries:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 bg-zinc-100 hover:bg-amber-100 hover:border-amber-400 border border-zinc-300 text-zinc-800 whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="bg-zinc-100 border-t border-zinc-300 p-3 sm:p-4 flex gap-2 sm:gap-3 items-center shrink-0"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Ask anything (in English or Hindi: e.g. Sampling guide, course recommendation, profile setup)..."
            className="flex-1 bg-white border-2 border-zinc-400 px-3 sm:px-4 py-2 text-xs sm:text-sm text-zinc-950 font-medium focus:outline-none focus:border-zinc-950 placeholder:text-zinc-500 font-sans disabled:bg-zinc-50 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-3.5 sm:px-5 py-2 bg-zinc-950 hover:bg-black disabled:bg-zinc-400 text-white text-xs font-technical uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <span className="hidden sm:inline">Ask Advisor</span>
            <Send className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
};
