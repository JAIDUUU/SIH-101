import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  inverted?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 'md',
  showTagline = false,
  inverted = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-sm tracking-wider font-bold',
    md: 'text-base tracking-[0.18em] font-extrabold',
    lg: 'text-2xl tracking-[0.2em] font-extrabold',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Original Geometric Government-Tech Mark: Interlocking Data Grid & Compass Motif */}
      <div
        className={`relative flex items-center justify-center ${iconSizes[size]} border ${
          inverted ? 'border-amber-400/80 bg-zinc-900' : 'border-zinc-900 bg-black'
        } shadow-xs`}
      >
        {/* Subtle geometric crosshair and gold center dot */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-zinc-700/60" />
          <div className="h-full w-px bg-zinc-700/60 absolute" />
        </div>
        <div className="relative z-10 w-2.5 h-2.5 bg-amber-400 rotate-45 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-zinc-900 border border-amber-400" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span
            className={`${titleSizes[size]} ${
              inverted ? 'text-white' : 'text-zinc-950'
            } uppercase font-heading`}
          >
            SKILL SUTRA
          </span>
          <span className="text-[10px] tracking-widest uppercase font-technical px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
            GOV.STAT
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-xs tracking-tight ${
              inverted ? 'text-zinc-400' : 'text-zinc-600'
            } font-medium mt-0.5`}
          >
            Right Skills. Smarter Learning. Stronger Workforce.
          </span>
        )}
      </div>
    </div>
  );
};
