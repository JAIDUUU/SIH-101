import React from 'react';
import { CompetencyDomain } from '../../types';

interface RadarChartProps {
  domainScores: Record<CompetencyDomain, number>;
  targetScores?: Record<CompetencyDomain, number>;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  domainScores,
  targetScores = {
    'Statistical': 90,
    'Technical': 80,
    'Digital Governance': 85,
    'Behavioural & Managerial': 90,
  },
  size = 280,
}) => {
  const center = size / 2;
  const radius = size * 0.38;

  const domains: CompetencyDomain[] = [
    'Statistical',
    'Technical',
    'Digital Governance',
    'Behavioural & Managerial',
  ];

  // Coordinates calculation for 4 axes (North, East, South, West)
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for current scores
  const currentPoints = domains
    .map((domain, i) => {
      const { x, y } = getCoordinates(i, domainScores[domain]);
      return `${x},${y}`;
    })
    .join(' ');

  // Polygon points for target scores
  const targetPoints = domains
    .map((domain, i) => {
      const { x, y } = getCoordinates(i, targetScores[domain]);
      return `${x},${y}`;
    })
    .join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={size}
        height={size}
        className="overflow-visible"
        aria-label="Competency Radar Chart"
      >
        {/* Concentric grid circles / diamonds */}
        {gridLevels.map((lvl) => {
          const r = lvl * radius;
          return (
            <polygon
              key={lvl}
              points={`
                ${center},${center - r}
                ${center + r},${center}
                ${center},${center + r}
                ${center - r},${center}
              `}
              fill="none"
              stroke="#E4E4E7"
              strokeWidth="1"
              strokeDasharray={lvl === 1.0 ? '0' : '2,2'}
            />
          );
        })}

        {/* Axes lines */}
        {domains.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#D4D4D8"
              strokeWidth="1"
            />
          );
        })}

        {/* Target Polygon (Subtle dashed line) */}
        <polygon
          points={targetPoints}
          fill="none"
          stroke="#71717A"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />

        {/* Current Score Polygon (Gold filled accent with crisp black border) */}
        <polygon
          points={currentPoints}
          fill="rgba(245, 158, 11, 0.22)"
          stroke="#D97706"
          strokeWidth="2.5"
        />

        {/* Vertices and score bubbles */}
        {domains.map((domain, i) => {
          const { x, y } = getCoordinates(i, domainScores[domain]);
          return (
            <g key={domain}>
              <circle
                cx={x}
                cy={y}
                r={4.5}
                fill="#F59E0B"
                stroke="#18181B"
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* Labels positioned at the 4 poles */}
        {/* Top: Statistical */}
        <text
          x={center}
          y={center - radius - 16}
          textAnchor="middle"
          className="text-[11px] font-technical font-semibold fill-zinc-900 uppercase"
        >
          Statistical ({domainScores['Statistical']}%)
        </text>

        {/* Right: Technical */}
        <text
          x={center + radius + 12}
          y={center + 4}
          textAnchor="start"
          className="text-[11px] font-technical font-semibold fill-zinc-900 uppercase"
        >
          Technical ({domainScores['Technical']}%)
        </text>

        {/* Bottom: Digital Governance */}
        <text
          x={center}
          y={center + radius + 22}
          textAnchor="middle"
          className="text-[11px] font-technical font-semibold fill-zinc-900 uppercase"
        >
          Digital Gov ({domainScores['Digital Governance']}%)
        </text>

        {/* Left: Behavioural & Managerial */}
        <text
          x={center - radius - 12}
          y={center + 4}
          textAnchor="end"
          className="text-[11px] font-technical font-semibold fill-zinc-900 uppercase"
        >
          Behavioural ({domainScores['Behavioural & Managerial']}%)
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 text-xs font-technical text-zinc-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-amber-400/40 border border-amber-600 inline-block" />
          <span>Current Profile</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-0 border-t-2 border-dashed border-zinc-500 inline-block" />
          <span>Cadre Target</span>
        </div>
      </div>
    </div>
  );
};
