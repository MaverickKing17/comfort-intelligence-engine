import React from 'react';
import { HVACSystem } from '../types';
import { X, Printer, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HomeHealthCertificateProps {
  system: HVACSystem;
  onClose: () => void;
}

export const HomeHealthCertificate: React.FC<HomeHealthCertificateProps> = ({ system, onClose }) => {
  // Simple grade logic
  const getGrade = () => {
    if (system.metrics.heatingPower.value > 90) return 'A';
    if (system.metrics.heatingPower.value > 70) return 'B';
    if (system.metrics.heatingPower.value > 50) return 'C';
    return 'D';
  };

  const grade = getGrade();
  const gradeColor = grade === 'A' ? 'text-green-500' : grade === 'B' ? 'text-blue-500' : 'text-amber-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white text-black w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Home Health Certificate™</h2>
            <p className="text-sm text-gray-500">Certified by Ambient Twin Intelligence</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Property</p>
              <h3 className="text-lg font-semibold">{system.address}</h3>
              <p className="text-gray-500 text-sm">{system.ownerName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Overall Grade</p>
              <div className={`text-6xl font-black ${gradeColor}`}>{grade}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="w-4 h-4 text-green-600" />
                 <span className="text-sm font-semibold">Heating Health</span>
               </div>
               <p className="text-2xl font-bold">{system.metrics.heatingPower.value}%</p>
               <p className="text-xs text-gray-500">of original capacity</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
               <div className="flex items-center gap-2 mb-2">
                 <AlertTriangle className="w-4 h-4 text-amber-600" />
                 <span className="text-sm font-semibold">Projected Life</span>
               </div>
               <p className="text-2xl font-bold">2.5 Yrs</p>
               <p className="text-xs text-gray-500">remaining estimate</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">Comfort Analysis</h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Airflow Quality</span>
              <span className="font-medium text-gray-900">{system.metrics.systemBreathing.value}</span>
            </div>
             <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Energy Efficiency</span>
              <span className="font-medium text-gray-900">{system.metrics.efficiency.value}%</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Generated {new Date().toLocaleDateString()}
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium text-sm">
            <Printer className="w-4 h-4" />
            Print for Realtor
          </button>
        </div>
      </div>
    </div>
  );
};