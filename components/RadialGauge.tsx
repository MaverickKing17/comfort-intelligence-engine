import React from 'react';
import { HealthStatus } from '../types';

interface RadialGaugeProps {
  value: number; // 0 to 100
  label: string;
  status: HealthStatus;
  size?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({ value, label, status, size = 120 }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = '#10b981'; // Green
  let shadowColor = 'rgba(16, 185, 129, 0.5)';
  
  if (status === HealthStatus.Warning) {
    color = '#f59e0b'; // Amber
    shadowColor = 'rgba(245, 158, 11, 0.5)';
  } else if (status === HealthStatus.Critical) {
    color = '#ef4444'; // Red
    shadowColor = 'rgba(239, 68, 68, 0.5)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div style={{ width: size, height: size }} className="relative">
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background Circle */}
          <circle
            className="text-[#1f1f23]"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress Circle */}
          <circle
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ 
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0 0 4px ${shadowColor})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-2xl font-bold font-sans">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-2 font-medium tracking-wide uppercase">{label}</span>
    </div>
  );
};