import React from 'react';

interface KpiTileProps {
  label: string;
  value: string | number;
  trend?: string;
  trendColor?: string;
  onClick?: () => void;
}

export const KpiTile: React.FC<KpiTileProps> = ({ label, value, trend, trendColor = 'text-green-400', onClick }) => (
  <button 
    onClick={onClick}
    className="bg-[#0c0c10] border border-border px-4 py-3 rounded-xl flex flex-col text-left hover:border-indigo-500/50 transition-all group"
  >
    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-mono font-bold text-white group-hover:text-indigo-200">{value}</span>
      {trend && <span className={`text-[10px] font-bold ${trendColor}`}>{trend}</span>}
    </div>
  </button>
);