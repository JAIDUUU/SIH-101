import React from 'react';
import { FileText, X, Bookmark, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SourceDocData {
  title: string;
  page: number;
  section: string;
  excerpt: string;
}

interface SourceCitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceDoc: SourceDocData | null;
}

export const SourceCitationModal: React.FC<SourceCitationModalProps> = ({
  isOpen,
  onClose,
  sourceDoc,
}) => {
  if (!isOpen || !sourceDoc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-zinc-900 shadow-2xl overflow-hidden">
        {/* Top Official Document Header */}
        <div className="bg-zinc-950 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 text-black flex items-center justify-center font-technical font-bold text-xs">
              DOC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-technical text-amber-400 tracking-wider">
                  Verified Curricular Source
                </span>
                <span className="text-[10px] bg-zinc-800 px-1.5 py-0.2 text-zinc-300 font-technical">
                  PAGE {sourceDoc.page}
                </span>
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-zinc-100">
                {sourceDoc.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close document viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Body Emulation */}
        <div className="p-8 bg-[#FAF9F6] text-zinc-900 max-h-[70vh] overflow-y-auto font-serif">
          {/* Document Header Stamp */}
          <div className="flex items-center justify-between border-b border-zinc-300 pb-3 mb-6 font-technical text-[11px] text-zinc-600">
            <span>NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)</span>
            <span>REPOSITORY REF: TPAC-2024-V4</span>
          </div>

          <div className="mb-4">
            <span className="text-xs font-technical font-bold text-zinc-900 uppercase tracking-widest block mb-1">
              {sourceDoc.section}
            </span>
            <div className="h-0.5 w-12 bg-amber-500 mb-4" />
          </div>

          {/* Context Paragraphs */}
          <p className="text-zinc-600 text-sm leading-relaxed mb-4">
            Statistical frameworks established under the guidance of the National Statistical Commission (NSC) 
            mandate explicit operational safeguards across both sampling and non-sampling phases of official field enumeration.
          </p>

          {/* Highlighted Official Excerpt */}
          <div className="my-6 p-5 bg-amber-50 border-l-4 border-amber-500 text-zinc-900 shadow-xs relative">
            <div className="flex items-center gap-2 text-xs font-technical text-amber-900 font-bold uppercase mb-2">
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              Direct Curricular Authority (Page {sourceDoc.page})
            </div>
            <p className="text-base text-zinc-950 font-medium italic leading-relaxed">
              {sourceDoc.excerpt}
            </p>
          </div>

          <p className="text-zinc-600 text-sm leading-relaxed mb-4">
            Subordinate officers are required to verify their survey scripts against these procedural axioms before 
            dispatching microdata bundles to the Central Processing Facility. Failure to adhere results in flagging during 
            automated DQAD consistency protocols.
          </p>

          {/* Verification Badge */}
          <div className="mt-8 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-technical text-zinc-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Cryptographically indexed by Skill Sutra Knowledge Graph</span>
            </div>
            <span className="text-[11px] text-zinc-500">ISO/IEC 27001 Certified Repo</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-zinc-100 px-6 py-3 border-t border-zinc-200 flex items-center justify-between">
          <span className="text-xs font-technical text-zinc-600">
            Source validated against official 2024-25 syllabus
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-medium tracking-wide transition-colors"
          >
            Return to Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
