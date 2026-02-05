import React from 'react';
import { HVACSystem, HealthStatus } from '../types';
import { X, Wrench, FileText, Send, Zap } from 'lucide-react';

interface SystemDetailModalProps {
  system: HVACSystem;
  onClose: () => void;
  onGenerateReport: () => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ system, onClose, onGenerateReport }) => {
  const isCritical = system.metrics.heatingPower.status === HealthStatus.Critical || system.metrics.heatingPower.status === HealthStatus.Warning;
  
  // Enterprise Logic: Show buttons only if critical/warning
  const showSyncButtons = isCritical || system.insights.length > 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#09090b] border border-[#1f1f23] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#1f1f23] flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{system.address}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                system.metrics.heatingPower.status === 'Good' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {system.metrics.heatingPower.status}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{system.ownerName} • {system.systemType}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* AI Insights Section */}
          {system.insights.length > 0 && (
            <div className="space-y-3">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-4 h-4 text-purple-500" />
                 AI Detected Opportunities
               </h3>
               {system.insights.map((insight, idx) => (
                 <div key={idx} className={`p-4 rounded-xl border ${
                   insight.type === 'LEAD_GEN' ? 'bg-amber-500/5 border-amber-500/30' : 'bg-blue-500/5 border-blue-500/30'
                 }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-semibold ${insight.type === 'LEAD_GEN' ? 'text-amber-400' : 'text-blue-400'}`}>
                          {insight.title}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1">{insight.description}</p>
                      </div>
                      {insight.valueProp && (
                        <div className="bg-gray-900/50 px-3 py-1 rounded text-xs font-mono text-white border border-gray-700">
                          {insight.valueProp}
                        </div>
                      )}
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* Simple English Metrics Grid */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#121215] p-4 rounded-lg border border-[#1f1f23]">
                <p className="text-xs text-gray-500 mb-1">{system.metrics.heatingPower.simpleEnglishLabel}</p>
                <p className="text-xl font-semibold text-white">
                  {system.metrics.heatingPower.value}{system.metrics.heatingPower.unit}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">Tech: {system.metrics.heatingPower.technicalLabel}</p>
              </div>
              <div className="bg-[#121215] p-4 rounded-lg border border-[#1f1f23]">
                <p className="text-xs text-gray-500 mb-1">{system.metrics.systemBreathing.simpleEnglishLabel}</p>
                <p className="text-xl font-semibold text-white">
                  {system.metrics.systemBreathing.value}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">Tech: {system.metrics.systemBreathing.technicalLabel}</p>
              </div>
              <div className="bg-[#121215] p-4 rounded-lg border border-[#1f1f23]">
                <p className="text-xs text-gray-500 mb-1">Predicted Failure</p>
                <p className="text-xl font-semibold text-red-400">Jan 2027</p>
                <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                   <div className="bg-red-500 h-full w-[75%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer (The One-Click Workflow) */}
        <div className="p-6 bg-[#0c0c10] border-t border-[#1f1f23]">
           {showSyncButtons ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <button className="flex items-center justify-center gap-2 bg-[#1f1f23] hover:bg-[#2a2a30] text-white py-3 px-4 rounded-lg text-sm font-medium transition border border-transparent hover:border-gray-700">
                 <FileText className="w-4 h-4 text-green-400" />
                 Sync to Jobber
               </button>
               <button className="flex items-center justify-center gap-2 bg-[#1f1f23] hover:bg-[#2a2a30] text-white py-3 px-4 rounded-lg text-sm font-medium transition border border-transparent hover:border-gray-700">
                 <Wrench className="w-4 h-4 text-blue-400" />
                 Sync ServiceTitan
               </button>
               <button className="flex items-center justify-center gap-2 bg-[#1f1f23] hover:bg-[#2a2a30] text-white py-3 px-4 rounded-lg text-sm font-medium transition border border-transparent hover:border-gray-700">
                 <Send className="w-4 h-4 text-amber-400" />
                 Sync Housecall
               </button>
             </div>
           ) : (
             <button 
               onClick={onGenerateReport}
               className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
             >
               <FileText className="w-4 h-4" />
               View Home Health Certificate
             </button>
           )}
        </div>

      </div>
    </div>
  );
};