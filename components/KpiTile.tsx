import React from 'react';

interface KpiTileProps {
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
  onClick?: () => void;
}

export const KpiTile: React.FC<KpiTileProps> = ({ label, value, trend, trendColor = 'text-green-400', onClick }) => {
  // Simple mocked sparkline for visual flair
  const isUp = trendColor.includes('green');
  const points = isUp 
    ? "5,15 15,12 25,18 35,10 45,14 55,8 65,5" 
    : "5,5 15,10 25,8 35,15 45,12 55,18 65,14";

  return (
    <button 
      onClick={onClick}
      className="bg-[#0c0e14] border border-white/5 px-5 py-4 rounded-2xl flex flex-col text-left hover:border-indigo-500/40 hover:bg-white/[0.02] transition-all group relative overflow-hidden shadow-lg"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase text-gray-500 font-black tracking-[0.15em] leading-none">{label}</span>
        <svg className="w-16 h-6 opacity-30 group-hover:opacity-60 transition-opacity" viewBox="0 0 70 20">
          <polyline
            fill="none"
            stroke={isUp ? "#10b981" : "#f59e0b"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
      <div className="flex items-baseline gap-2 mt-auto">
        <span className="text-2xl font-mono font-black text-white group-hover:text-indigo-200 tracking-tighter">{value}</span>
        {trend && <span className={`text-[10px] font-bold ${trendColor} bg-current/10 px-1.5 py-0.5 rounded`}>{trend}</span>}
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-500/0 group-hover:bg-indigo-500/40 transition-all" style={{ width: '100%' }} />
    </button>
  );
};