import React from 'react';
import { HealthStatus } from '../types';

interface RadialGaugeProps {
  value: number; // 0 to 100
  label: string;
  status: HealthStatus;
  size?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({ value, label, status, size = 120 }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = '#10b981'; // Green
  let shadowColor = 'rgba(16, 185, 129, 0.6)';
  
  if (status === HealthStatus.Warning) {
    color = '#f59e0b'; // Amber
    shadowColor = 'rgba(245, 158, 11, 0.6)';
  } else if (status === HealthStatus.Critical) {
    color = '#ef4444'; // Red
    shadowColor = 'rgba(239, 68, 68, 0.6)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative group">
      <div style={{ width: size, height: size }} className="relative">
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-slate-900"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ 
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${shadowColor})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tracking-tighter drop-shadow-lg">{value}%</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">{label}</span>
        <div className={`h-1.5 w-10 rounded-full mt-2 bg-slate-900`}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 8px ${shadowColor}` }}></div>
        </div>
      </div>
    </div>
  );
};