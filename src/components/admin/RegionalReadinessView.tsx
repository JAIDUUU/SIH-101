import React, { useState } from 'react';
import {
  MapPin,
  Globe2,
  TrendingUp,
  AlertTriangle,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface RegionalReadinessViewProps {
  onNavigate: (viewId: string) => void;
}

interface RegionalZone {
  id: string;
  name: string;
  hq: string;
  officersCount: number;
  score: number;
  topGap: string;
  intervention: string;
  priority: 'High' | 'Moderate' | 'Critical' | 'Optimal';
}

export const RegionalReadinessView: React.FC<RegionalReadinessViewProps> = ({
  onNavigate,
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('all');

  const zones: RegionalZone[] = [
    {
      id: 'north',
      name: 'Northern Zone',
      hq: 'New Delhi · Lucknow · Chandigarh',
      officersCount: 1680,
      score: 72,
      topGap: 'Python & Automated ETL Microdata Processing',
      intervention: 'NSSTA Greater Noida 5-Day Intensive Lab on Pandas & Survey Microdata',
      priority: 'Moderate',
    },
    {
      id: 'west',
      name: 'Western Zone',
      hq: 'Mumbai · Ahmedabad · Nagpur',
      officersCount: 1340,
      score: 76,
      topGap: 'High-Frequency Financial & Corporate Stream Ingestion',
      intervention: 'ASI Data Stream Modernization & MCA-21 Integration Clinic',
      priority: 'Optimal',
    },
    {
      id: 'south',
      name: 'Southern Zone',
      hq: 'Bengaluru · Chennai · Hyderabad · Kochi',
      officersCount: 1520,
      score: 79,
      topGap: 'Spatial GIS Geocoding & High-Resolution Satellite Demarcation',
      intervention: 'Advanced ISRO Bhuvan Spatial Registry Certification for FOD Staff',
      priority: 'Optimal',
    },
    {
      id: 'east',
      name: 'Eastern Zone',
      hq: 'Kolkata · Bhubaneswar · Patna',
      officersCount: 1140,
      score: 64,
      topGap: 'CSPro / CAPI Digital Field Enumeration & Validation Rules',
      intervention: 'Mobile Data Collection Tablet Hardware & Logic Verification Drive',
      priority: 'High',
    },
    {
      id: 'northeast',
      name: 'North Eastern Zone',
      hq: 'Guwahati · Shillong · Agartala',
      officersCount: 480,
      score: 58,
      topGap: 'Multi-Stage Sampling Frame Updates in Hill Tracts',
      intervention: 'Special Sub-Himalayan Survey Deployment & Mobile Master Trainer Camps',
      priority: 'Critical',
    },
    {
      id: 'central',
      name: 'Central Zone',
      hq: 'Bhopal · Raipur · Jabalpur',
      officersCount: 640,
      score: 67,
      topGap: 'CPI Perishable Price Imputation & Rural Price Relative Rules',
      intervention: 'Price Collection Protocol Refresher Drill & Market Survey Validation',
      priority: 'Moderate',
    },
  ];

  const filteredZones =
    selectedZoneId === 'all'
      ? zones
      : zones.filter((z) => z.id === selectedZoneId);

  const nationalAvg = Math.round(
    zones.reduce((acc, z) => acc + z.score, 0) / zones.length
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-900 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-technical uppercase tracking-widest text-amber-800 font-bold mb-1">
              GEOGRAPHIC CAPABILITY MAPPING // 6 ADMINISTRATIVE ZONES
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 font-heading">
              India Regional Statistical Readiness
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl font-sans">
              Zonal diagnostic breakdown across National Sample Survey Office (NSSO) Field Operations Division (FOD) regional directorates.
            </p>
          </div>

          <div className="flex items-center gap-3 font-technical text-xs">
            <div className="p-3 bg-zinc-50 border border-zinc-300 text-center">
              <span className="text-[10px] text-zinc-500 uppercase block">NATIONAL AVERAGE</span>
              <span className="text-xl font-bold text-zinc-950 font-heading">{nationalAvg}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Filter Bar */}
      <div className="bg-white border border-zinc-300 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-technical uppercase font-bold text-zinc-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Select Zone:
          </span>
          <button
            onClick={() => setSelectedZoneId('all')}
            className={`px-3 py-1.5 text-xs font-technical uppercase tracking-wider transition-colors ${
              selectedZoneId === 'all'
                ? 'bg-zinc-950 text-white font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
            }`}
          >
            All 6 Zones
          </button>
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`px-3 py-1.5 text-xs font-technical uppercase tracking-wider transition-colors ${
                selectedZoneId === zone.id
                  ? 'bg-zinc-950 text-white font-bold'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        <span className="text-xs font-technical text-zinc-500">
          Showing {filteredZones.length} of 6 Zones
        </span>
      </div>

      {/* Regional Zone Grid (All 6 Zones - Exact prompt requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredZones.map((zone) => {
          return (
            <div
              key={zone.id}
              className="bg-white border border-zinc-300 p-6 flex flex-col justify-between hover:border-zinc-900 transition-colors shadow-xs group"
            >
              <div className="space-y-4">
                {/* Zone Name & Score Header */}
                <div className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-3">
                  <div>
                    <span className="text-[10px] font-technical uppercase font-bold text-zinc-500 block">
                      {zone.hq}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-950 font-heading group-hover:text-amber-900 transition-colors">
                      {zone.name}
                    </h3>
                    <span className="text-xs font-technical text-zinc-500">
                      {zone.officersCount} Field Officers
                    </span>
                  </div>

                  <div className="text-right font-technical">
                    <span className="text-[10px] text-zinc-500 uppercase block">ZONE SCORE</span>
                    <span className="text-2xl font-bold text-zinc-950 font-heading">
                      {zone.score}%
                    </span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-zinc-100 h-2 border border-zinc-200">
                  <div
                    className={`h-full ${
                      zone.score >= 75
                        ? 'bg-emerald-600'
                        : zone.score >= 65
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                    }`}
                    style={{ width: `${zone.score}%` }}
                  />
                </div>

                {/* Top Gap (Exact requirement) */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-[10px] font-technical uppercase font-bold text-amber-900 block">
                    TOP CADRE GAP:
                  </span>
                  <div className="text-xs font-bold text-zinc-950 font-heading">
                    {zone.topGap}
                  </div>
                </div>

                {/* Recommended Intervention (Exact requirement) */}
                <div className="p-3 bg-amber-50/70 border-l-3 border-l-amber-500 border border-zinc-200 space-y-1">
                  <span className="text-[10px] font-technical uppercase font-bold text-amber-900 block">
                    RECOMMENDED INTERVENTION:
                  </span>
                  <p className="text-xs text-zinc-700 font-sans leading-relaxed">
                    {zone.intervention}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-zinc-200 flex items-center justify-between">
                <span
                  className={`text-[9px] font-technical font-bold uppercase px-2 py-0.5 border ${
                    zone.priority === 'Critical'
                      ? 'bg-rose-100 text-rose-950 border-rose-300'
                      : zone.priority === 'High'
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                  }`}
                >
                  {zone.priority} Priority
                </span>

                <button
                  onClick={() => onNavigate('quiz-generator')}
                  className="px-3 py-1.5 bg-zinc-950 hover:bg-black text-amber-400 text-xs font-technical uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Dispatch Drills</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
