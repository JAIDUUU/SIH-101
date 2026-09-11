import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Play,
  Pause,
  Terminal,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  timeAgo: string;
  category: 'COMPETENCY' | 'QUIZ' | 'DECAY' | 'WORKFORCE';
  status: 'VERIFIED' | 'AT_RISK' | 'ACTION' | 'SYNC';
  cadre: string;
  title: string;
  detail: string;
  citation?: string;
  metric?: string;
}

const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: 'log-1',
    timestamp: '14:23:40',
    timeAgo: '2s ago',
    category: 'COMPETENCY',
    status: 'VERIFIED',
    cadre: 'JSO // FOD Lucknow',
    title: 'Competency Verified: Sampling Methodology (PLFS)',
    detail: 'Score recalibrated 72% → 86% via NSSTA Exit Assessment.',
    citation: 'NSSTA PLFS Manual Vol IV, Sec 3.2',
    metric: '+14% GAIN',
  },
  {
    id: 'log-2',
    timestamp: '14:23:18',
    timeAgo: '24s ago',
    category: 'DECAY',
    status: 'AT_RISK',
    cadre: 'SSO // NAD New Delhi',
    title: 'Decay Risk Flagged: ASI Structural Business Statistics',
    detail: 'Retention projected at 64% (210 days since last certified drill).',
    citation: 'ASI 2024–25 Schedule A',
    metric: 'REFRESHER DUE',
  },
  {
    id: 'log-3',
    timestamp: '14:22:50',
    timeAgo: '52s ago',
    category: 'QUIZ',
    status: 'ACTION',
    cadre: 'NSSTA // Faculty Faculty Desk',
    title: 'Grounded Quiz Extracted: CAPI Microdata Validation',
    detail: '10 Questions generated with page-level citations from official guidelines.',
    citation: 'CAPI Field Instructions Manual, Page 19',
    metric: 'DRAFT_REVIEW',
  },
  {
    id: 'log-4',
    timestamp: '14:22:12',
    timeAgo: '1m ago',
    category: 'COMPETENCY',
    status: 'ACTION',
    cadre: 'JSO // ESD Kolkata',
    title: 'Next Best Skill Selected: Python for Statistical ETL',
    detail: 'Curriculum pathway mapped to iGOT Course #3841 (Weight: 1.45×).',
    citation: 'iGOT Karmayogi Course ID: IG-8821',
    metric: 'RECOMMENDED',
  },
  {
    id: 'log-5',
    timestamp: '14:21:30',
    timeAgo: '2m ago',
    category: 'WORKFORCE',
    status: 'SYNC',
    cadre: 'State DES // Maharashtra',
    title: 'Workforce Readiness Matrix Synchronized',
    detail: 'Aggregated 142 field officers across Household & Price Statistics.',
    citation: 'MoSPI National Statistical Framework',
    metric: '78.4% READINESS',
  },
];

const STREAM_QUEUE: Omit<TelemetryLog, 'id' | 'timestamp' | 'timeAgo'>[] = [
  {
    category: 'COMPETENCY',
    status: 'VERIFIED',
    cadre: 'SSO // SDRD Kolkata',
    title: 'Competency Recalibrated: Price Statistics & CPI-IW',
    detail: 'Base year revision module verified. Gap closed by 18 points.',
    citation: 'MoSPI CPI Manual 2024, Page 42',
    metric: '+18% BENCHMARK',
  },
  {
    category: 'DECAY',
    status: 'AT_RISK',
    cadre: 'JSO // FOD Bangalore',
    title: 'Retention Alert: Urban Frame Survey (UFS) Digital Mapping',
    detail: 'Elapsed interval 190 days. Refresher drill scheduled.',
    citation: 'UFS Technical Circular 2023/11',
    metric: 'ALERT_ACTIVE',
  },
  {
    category: 'QUIZ',
    status: 'VERIFIED',
    cadre: 'NSSTA // Evaluation Wing',
    title: 'Assessment Published: National Accounts GVA Estimation',
    detail: 'Trainer approved 12 questions with verified source citations.',
    citation: 'SNA 2008 / MoSPI NAD Guidelines',
    metric: 'LIVE_DRILL',
  },
  {
    category: 'COMPETENCY',
    status: 'ACTION',
    cadre: 'Investigator // State DES UP',
    title: 'Skill Gap Identified: Stratified Random Sampling',
    detail: 'Cadre benchmark requires 80%. Current assessed score: 58%.',
    citation: 'State Statistical Cadre Rule 2022',
    metric: 'GAP -22%',
  },
];

export const LiveTelemetryTerminal: React.FC = () => {
  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COMPETENCY' | 'QUIZ' | 'DECAY' | 'WORKFORCE'>('ALL');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<TelemetryLog | null>(null);

  // Micro typewriter for the newest incoming item
  const [typewriterText, setTypewriterText] = useState<string>('');
  const [typewriterTarget, setTypewriterTarget] = useState<string>('SYSTEM READY // Live Telemetry Stream Synchronized with MoSPI Cadre...');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Metrics that subtly tick
  const [drillCount, setDrillCount] = useState<number>(1420);
  const [syncRate, setSyncRate] = useState<string>('99.98%');

  const streamIndexRef = useRef<number>(0);

  // Typewriter effect
  useEffect(() => {
    let charIndex = 0;
    setTypewriterText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (charIndex <= typewriterTarget.length) {
        setTypewriterText(typewriterTarget.slice(0, charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [typewriterTarget]);

  // Periodic simulated live stream arrivals
  useEffect(() => {
    if (!isLive) return;

    const streamInterval = setInterval(() => {
      const nextTemplate = STREAM_QUEUE[streamIndexRef.current % STREAM_QUEUE.length];
      streamIndexRef.current++;

      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];

      const newLog: TelemetryLog = {
        id: `stream-${Date.now()}`,
        timestamp: timeString,
        timeAgo: 'Just now',
        ...nextTemplate,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
      setTypewriterTarget(`EVENT [${newLog.cadre}]: ${newLog.title} — ${newLog.metric || 'OK'}`);

      // Subtly increment the drill counter
      setDrillCount((prev) => prev + 1);
      setSyncRate((99.96 + Math.random() * 0.03).toFixed(2) + '%');
    }, 9000);

    return () => clearInterval(streamInterval);
  }, [isLive]);

  const filteredLogs = activeFilter === 'ALL'
    ? logs
    : logs.filter((l) => l.category === activeFilter);

  const getStatusBadge = (status: TelemetryLog['status']) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-technical font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-subtle-pulse" />
            ✓ VERIFIED
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-technical font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-subtle-pulse" />
            ⚠ AT RISK
          </span>
        );
      case 'ACTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-technical font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Zap className="w-2.5 h-2.5 text-blue-600" />
            NEXT STEP
          </span>
        );
      case 'SYNC':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-technical font-semibold bg-zinc-100 text-zinc-800 border border-zinc-300">
            <Radio className="w-2.5 h-2.5 text-zinc-600 animate-subtle-pulse" />
            SYNCHRONIZED
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-zinc-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden font-sans">
      {/* 1. Terminal Window Header */}
      <div className="px-4 py-3 bg-[#F6F7F9] border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Window Controls + Terminal Prompt */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block border border-zinc-400/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block border border-zinc-400/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block border border-zinc-400/40" />
          </div>
          <div className="h-3.5 w-px bg-zinc-300" />
          <div className="flex items-center gap-2 text-xs font-technical text-zinc-700">
            <Terminal className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-semibold text-zinc-900">skill-sutra@mospi:</span>
            <span className="text-zinc-500">~/telemetry/live-competency-stream</span>
          </div>
        </div>

        {/* Right: Live Status & Controls */}
        <div className="flex items-center gap-3 text-xs font-technical">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-md border border-zinc-200 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-beacon-green' : 'bg-zinc-400'}`} />
            <span className="font-bold text-zinc-800">{isLive ? 'STREAM: ACTIVE' : 'STREAM: PAUSED'}</span>
            <span className="text-zinc-400">|</span>
            <span className="text-zinc-600">{syncRate} GATEWAY</span>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            className="px-2.5 py-1 bg-white hover:bg-zinc-100 rounded-md border border-zinc-200 text-zinc-700 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isLive ? 'Pause live stream' : 'Resume live stream'}
          >
            {isLive ? (
              <>
                <Pause className="w-3 h-3 text-zinc-600" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-700" />
                <span>RESUME</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Real-time Telemetry Typewriter Banner */}
      <div className="px-4 py-2.5 bg-[#FAF9F7] border-b border-zinc-200/80 flex items-center justify-between text-xs font-technical text-zinc-800 overflow-hidden">
        <div className="flex items-center gap-2 truncate pr-4">
          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-900 font-bold text-[10px] uppercase tracking-wider shrink-0">
            TELEMETRY
          </span>
          <span className="text-zinc-500 shrink-0">$</span>
          <span className="truncate text-zinc-800 font-medium">
            {typewriterText}
            <span className="inline-block w-1.5 h-3 bg-amber-600 animate-terminal-blink align-middle ml-1" />
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-zinc-500 shrink-0 font-technical">
          <span>VERIFIED DRILLS: <strong className="text-zinc-900 font-bold">{drillCount.toLocaleString()}</strong></span>
          <span>SYSTEM CADRES: <strong className="text-zinc-900 font-bold">JSO / SSO / ISS</strong></span>
        </div>
      </div>

      {/* 3. Stream Filter Pills */}
      <div className="px-4 py-2 bg-white border-b border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs font-technical">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {(['ALL', 'COMPETENCY', 'QUIZ', 'DECAY', 'WORKFORCE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {filter === 'ALL' ? 'ALL EVENTS' : filter}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-zinc-400 font-technical">
          Showing {filteredLogs.length} live records
        </span>
      </div>

      {/* 4. Stream Rows (Interactive + Monospace + Micro-hover) */}
      <div className="divide-y divide-zinc-100 max-h-[380px] overflow-y-auto">
        {filteredLogs.map((log, index) => {
          const isSelected = selectedLog?.id === log.id;
          return (
            <div
              key={log.id}
              onClick={() => setSelectedLog(isSelected ? null : log)}
              className={`group px-4 py-3 cursor-pointer transition-all duration-150 animate-row-enter ${
                isSelected
                  ? 'bg-amber-50/50 border-l-2 border-l-amber-600'
                  : 'hover:bg-zinc-50/90 hover:pl-4.5'
              }`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                {/* Status + Cadre + Timestamp */}
                <div className="flex items-center flex-wrap gap-2">
                  {getStatusBadge(log.status)}
                  <span className="text-xs font-technical font-bold text-zinc-900 group-hover:text-amber-900 transition-colors">
                    {log.cadre}
                  </span>
                  <span className="text-[11px] font-technical text-zinc-400">
                    [{log.timestamp}]
                  </span>
                </div>

                {/* Metric / Category Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {log.metric && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-technical font-bold bg-zinc-100 text-zinc-700 border border-zinc-200 group-hover:bg-white transition-colors">
                      {log.metric}
                    </span>
                  )}
                  <span className="text-[10px] font-technical text-zinc-400">
                    {log.timeAgo}
                  </span>
                </div>
              </div>

              {/* Event Title & Summary */}
              <div className="text-xs font-semibold text-zinc-900 font-heading mb-0.5 group-hover:text-zinc-950 transition-colors">
                {log.title}
              </div>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                {log.detail}
              </p>

              {/* Provenance & Source Citation footnote */}
              {log.citation && (
                <div className="mt-2 flex items-center justify-between text-[11px] font-technical text-zinc-500 pt-1.5 border-t border-zinc-100/80">
                  <span className="flex items-center gap-1.5 text-zinc-500 group-hover:text-amber-800 transition-colors">
                    <ShieldCheck className="w-3 h-3 text-amber-700 shrink-0" />
                    <span>REF: {log.citation}</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Inline Inspection Drawer when a row is clicked */}
      {selectedLog && (
        <div className="p-4 bg-[#FAF9F7] border-t border-zinc-200 animate-row-enter">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[10px] font-technical uppercase text-amber-800 font-bold px-2 py-0.5 bg-amber-100/70 rounded">
                AUDIT TELEMETRY PROVENANCE
              </span>
              <h4 className="text-sm font-bold text-zinc-950 font-heading mt-1">
                {selectedLog.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-xs font-technical text-zinc-500 hover:text-zinc-900 px-2 py-1 rounded border border-zinc-300 bg-white cursor-pointer"
            >
              CLOSE [ESC]
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-technical pt-2 border-t border-zinc-200/80">
            <div>
              <span className="text-zinc-400 block text-[10px]">CADRE &amp; STATION:</span>
              <span className="font-semibold text-zinc-800">{selectedLog.cadre}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px]">OFFICIAL CITATION:</span>
              <span className="font-semibold text-zinc-800">{selectedLog.citation || 'MoSPI Guidelines'}</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px]">VERIFICATION ENGINE:</span>
              <span className="font-semibold text-emerald-800">NSSTA Protocol v2.4 (Passed)</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. Footer Status Strip */}
      <div className="px-4 py-2 bg-[#F6F7F9] border-t border-zinc-200 flex flex-wrap items-center justify-between text-[11px] font-technical text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-subtle-pulse" />
          <span>ALIGNED WITH MoSPI SSS &amp; ISS CADRE COMPETENCY MATRICES</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LATENCY: 42ms</span>
          <span>SECURITY: SECURE ADAPTER LAYER</span>
        </div>
      </div>
    </div>
  );
};
