import React, { useState } from 'react';
import { MOCK_PEERS } from '../../data/mockData';
import { PeerOfficer, OfficerProfile } from '../../types';
import {
  Users2,
  Sparkles,
  MessageSquare,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Shield,
  HelpCircle,
  X,
  Send,
} from 'lucide-react';

interface PeerLearningViewProps {
  officer: OfficerProfile;
  onNavigate: (viewId: string) => void;
}

export const PeerLearningView: React.FC<PeerLearningViewProps> = ({
  officer,
  onNavigate,
}) => {
  const [connectedPeers, setConnectedPeers] = useState<{ [id: string]: boolean }>({
    'peer-1': true,
  });
  const [guidanceModalPeer, setGuidanceModalPeer] = useState<PeerOfficer | null>(null);
  const [guidanceNote, setGuidanceNote] = useState('');
  const [guidanceSentStatus, setGuidanceSentStatus] = useState(false);

  const handleToggleConnect = (peerId: string) => {
    setConnectedPeers((prev) => ({
      ...prev,
      [peerId]: !prev[peerId],
    }));
  };

  const handleOpenGuidance = (peer: PeerOfficer) => {
    setGuidanceModalPeer(peer);
    setGuidanceNote(
      `Respected ${peer.name},\n\nI am Rajesh Kumar (Statistical Officer, FOD Lucknow). I observed your verified expertise in ${peer.expertiseArea}. I would appreciate 20 minutes of peer guidance on our upcoming survey sprint.`
    );
    setGuidanceSentStatus(false);
  };

  const handleSendGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    setGuidanceSentStatus(true);
    setTimeout(() => {
      setGuidanceModalPeer(null);
      setGuidanceSentStatus(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Guidance Modal */}
      {guidanceModalPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white border border-zinc-900 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-technical uppercase font-bold text-amber-800 tracking-wider block">
                  PEER COLLABORATION DISPATCH
                </span>
                <h3 className="text-base font-bold text-zinc-950 font-heading">
                  Request Guidance from {guidanceModalPeer.name}
                </h3>
              </div>
              <button
                onClick={() => setGuidanceModalPeer(null)}
                className="p-1 text-zinc-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {guidanceSentStatus ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-zinc-950 font-heading">
                  Guidance Request Dispatched
                </h4>
                <p className="text-xs text-zinc-600">
                  Notification routed to {guidanceModalPeer.name}'s MoSPI intra-network terminal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendGuidance} className="space-y-4">
                <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
                  <strong>Cadre Synergy Note:</strong> {guidanceModalPeer.complementaryReason}
                </div>

                <div>
                  <label className="block text-xs font-technical uppercase text-zinc-700 font-semibold mb-1">
                    Message to Official
                  </label>
                  <textarea
                    rows={4}
                    value={guidanceNote}
                    onChange={(e) => setGuidanceNote(e.target.value)}
                    required
                    className="w-full bg-[#FAF9F6] border border-zinc-300 p-3 text-xs font-sans text-zinc-950 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setGuidanceModalPeer(null)}
                    className="px-4 py-2 border border-zinc-300 text-xs font-technical uppercase text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Send Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              RECIPROCAL CADRE KNOWLEDGE EXCHANGE // COMPLEMENTARY GRAPH
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              Peer Learning & Mentorship Network
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Algorithmic matchmaking pairing your mastery in field sampling operations with specialists in Python, GIS spatial analysis, and macroeconomic modeling.
            </p>
          </div>

          <div className="flex items-center gap-2 font-technical text-xs">
            <span className="px-3 py-1.5 bg-zinc-100 border border-zinc-300 text-zinc-800">
              NETWORK: <strong>6,800+ Official Statistical Cadre</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Peer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PEERS.map((peer) => {
          const isConnected = connectedPeers[peer.id];

          return (
            <div
              key={peer.id}
              className="bg-white border border-zinc-300 p-6 flex flex-col justify-between hover:border-zinc-900 transition-colors shadow-xs"
            >
              <div className="space-y-4">
                {/* Top Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-zinc-900 text-amber-400 flex items-center justify-center font-technical font-bold text-sm shrink-0 border border-zinc-700">
                      {peer.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-950 font-heading">
                        {peer.name}
                      </h3>
                      <div className="text-xs font-semibold text-zinc-700">
                        {peer.designation}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {peer.department} · {peer.station}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-technical font-bold text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300 shrink-0">
                    {peer.matchScore}% MATCH
                  </span>
                </div>

                {/* Primary Expertise & Status */}
                <div className="p-2.5 bg-[#FAF9F6] border border-zinc-200 text-xs">
                  <div className="flex items-center justify-between font-technical text-[10px] text-zinc-500 mb-1">
                    <span className="uppercase font-bold text-amber-900">CORE EXPERTISE PILLAR</span>
                    <span className="text-emerald-700 font-semibold">● {peer.activeStatus}</span>
                  </div>
                  <div className="font-bold text-zinc-950 text-xs font-heading">
                    {peer.expertiseArea}
                  </div>
                </div>

                {/* Why Recommended? (Explicit requirement) */}
                <div className="p-3 bg-amber-50/60 border-l-3 border-l-amber-500 border border-zinc-200 text-xs text-zinc-800">
                  <span className="text-[10px] font-technical uppercase font-bold text-amber-900 block mb-1">
                    WHY RECOMMENDED?
                  </span>
                  <p className="leading-relaxed font-sans text-zinc-700">
                    {peer.complementaryReason}
                  </p>
                </div>

                {/* Key Skills Tags */}
                <div>
                  <span className="text-[10px] font-technical uppercase text-zinc-500 font-semibold block mb-1">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {peer.keySkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Connect & Request Guidance (Explicit requirement) */}
              <div className="pt-5 mt-4 border-t border-zinc-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleConnect(peer.id)}
                  className={`px-4 py-2 border text-xs font-technical uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isConnected
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                      : 'bg-white border-zinc-300 text-zinc-800 hover:border-zinc-900'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Connect</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenGuidance(peer)}
                  className="px-4 py-2 bg-zinc-950 hover:bg-black text-amber-400 border border-zinc-900 text-xs font-technical uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Guidance</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
