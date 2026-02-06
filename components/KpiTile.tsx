import React from 'react';

interface KpiTileProps {
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
  onClick?: () => void;
}

export const KpiTile: React.FC<KpiTileProps> = ({ label, value, trend, trendColor = 'text-emerald-400', onClick }) => {
  const isUp = trendColor.includes('emerald') || trendColor.includes('green') || trendColor.includes('sky');
  const points = isUp 
    ? "5,15 15,12 25,18 35,10 45,14 55,8 65,5" 
    : "5,5 15,10 25,8 35,15 45,12 55,18 65,14";

  return (
    <button 
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 px-8 py-8 rounded-3xl flex flex-col text-left hover:border-sky-500/40 hover:bg-slate-800/80 transition-all group relative overflow-hidden shadow-2xl"
    >
      <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-[0.2em] leading-none">{label}</span>
        <svg className="w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 70 20">
          <polyline
            fill="none"
            stroke={trendColor.includes('rose') ? "#fb7185" : trendColor.includes('amber') ? "#fbbf24" : "#38bdf8"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
      <div className="flex items-baseline gap-3 mt-auto">
        <span className="text-3xl font-bold text-white group-hover:text-sky-400 transition-colors tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 uppercase tracking-widest ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 h-[3px] bg-sky-500 opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ width: '100%' }} />
    </button>
  );
};