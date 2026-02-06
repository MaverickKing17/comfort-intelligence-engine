import React, { useState, useEffect } from 'react';
import { HVACSystem, HealthStatus } from '../types';
import { X, Wrench, FileText, Send, Zap, BrainCircuit, TrendingDown, Clock, CalendarCheck, Wifi, CheckCircle2, Phone, MessageSquare, ShieldAlert } from 'lucide-react';

interface SystemDetailModalProps {
  system: HVACSystem;
  onClose: () => void;
  onGenerateReport: () => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ system, onClose, onGenerateReport }) => {
  const [currentMetrics, setCurrentMetrics] = useState(system.metrics);
  const [lastSynced, setLastSynced] = useState(new Date());
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    breaker: false,
    filter: false,
    mode: false,
    setpoint: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetrics(prev => ({
         ...prev,
         heatingPower: {
           ...prev.heatingPower,
           value: Math.max(0, Math.min(100, Math.round((prev.heatingPower.value + (Math.random() - 0.5) * 1.5) * 100) / 100)),
         }
      }));
      setLastSynced(new Date());
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const toggleCheck = (id: string) => setChecklist(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-4xl rounded-2xl shadow-premium overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header Summary */}
        <div className="p-6 border-b border-border flex justify-between items-start bg-black/20">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{system.address}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                system.metrics.heatingPower.status === 'Good' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {system.activeTriage?.suggestedOutcome || 'Monitoring'}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{system.ownerName} • {system.systemType}</span>
                <span className="text-xs font-mono opacity-50">Last sync: {lastSynced.toLocaleTimeString()}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 border-r border-border">
            
            {/* Suggested Action Block */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
               <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-indigo-200 font-bold text-sm">AI Recommendation: Likely Dry Run</h4>
                    <p className="text-xs text-indigo-300/80 mt-1">Thermostat is calling for heat, but output is 0. Outside temp is mild (12°C). Guide customer through breaker check before dispatching.</p>
                  </div>
               </div>
            </div>

            {/* AI Reliability Forecast */}
            <div className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-[#1e2330] to-[#151922] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
               <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Reliability Forecast</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <p className="text-[10px] uppercase text-gray-500 font-bold">Failure Point</p>
                     <p className="text-sm text-white font-semibold">Heat Exchanger</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] uppercase text-gray-500 font-bold">Timeline</p>
                     <p className="text-sm text-red-400 font-mono font-bold">Critical: &lt; 2 Weeks</p>
                  </div>
               </div>
            </div>

            {/* Live Telemetry */}
            <div className="grid grid-cols-3 gap-4">
               {[system.metrics.heatingPower, system.metrics.systemBreathing, system.metrics.efficiency].map((m, i) => (
                 <div key={i} className="bg-black/20 p-3 rounded-lg border border-border">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">{m.simpleEnglishLabel}</p>
                    <p className="text-lg font-bold text-white">{m.value}{m.unit}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Sidebar: Triage Script Panel */}
          <div className="w-full md:w-80 bg-black/10 p-6 overflow-y-auto space-y-6">
             <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Clock className="w-3 h-3" /> Triage Script
                </h3>
                <div className="space-y-4">
                   {[
                     { id: 'breaker', label: 'Check Breaker Panel' },
                     { id: 'filter', label: 'Check Air Filter' },
                     { id: 'mode', label: 'Verify Heat Mode' },
                     { id: 'setpoint', label: 'Verify Setpoint' }
                   ].map(item => (
                     <button 
                       key={item.id} 
                       onClick={() => toggleCheck(item.id)}
                       className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-white/5 transition group"
                     >
                        <span className={`text-sm ${checklist[item.id] ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{item.label}</span>
                        <CheckCircle2 className={`w-4 h-4 transition ${checklist[item.id] ? 'text-green-500' : 'text-gray-600 group-hover:text-gray-400'}`} />
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-6 border-t border-border">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Actions Toolbar</h3>
                <div className="grid grid-cols-1 gap-3">
                   <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-500 transition shadow-lg">
                      <Phone className="w-4 h-4" /> Call Customer
                   </button>
                   <button className="flex items-center justify-center gap-2 bg-white/5 border border-border text-white py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition">
                      <MessageSquare className="w-4 h-4" /> Send SMS
                   </button>
                   <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition">
                      <Wrench className="w-4 h-4" /> Book Dispatch
                   </button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};