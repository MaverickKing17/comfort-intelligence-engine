import React, { useState, useEffect } from 'react';
import { HVACSystem, HealthStatus } from '../types';
import { X, Wrench, FileText, Zap, BrainCircuit, Clock, CalendarCheck, CheckCircle2, Phone, MessageSquare, ShieldAlert, Sparkles, ChevronRight, AlertTriangle, History, ArrowUpRight } from 'lucide-react';

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

  const failureRisks = [
    {
      id: 'fail_1',
      component: 'Heat Exchanger Core',
      predictedDate: 'February 18, 2026',
      severity: 'Critical',
      severityColor: 'text-rose-400',
      severityBg: 'bg-rose-500/10',
      confidence: '94%',
    },
    {
      id: 'fail_2',
      component: 'Blower Capacitor',
      predictedDate: 'March 05, 2026',
      severity: 'High',
      severityColor: 'text-amber-400',
      severityBg: 'bg-amber-500/10',
      confidence: '82%',
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl rounded-[2.5rem] shadow-elevated overflow-hidden flex flex-col max-h-[92vh] relative">
        
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-600" />

        <header className="px-12 py-12 border-b border-slate-800 flex justify-between items-start bg-slate-800/50">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <h2 className="text-4xl font-bold text-white tracking-tighter">{system.address}</h2>
              <span className={`px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest shadow-lg ${
                system.metrics.heatingPower.status === HealthStatus.Good 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-rose-600 text-white'
              }`}>
                {system.activeTriage?.suggestedOutcome || 'Monitoring'}
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm font-bold text-slate-400">
                <span className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div> 
                  {system.ownerName}
                </span>
                <span className="text-slate-700" aria-hidden="true">|</span>
                <span className="text-slate-300 uppercase tracking-widest">{system.systemType}</span>
                <span className="text-slate-700" aria-hidden="true">|</span>
                <span className="font-mono text-xs text-slate-500">Live Sync: {lastSynced.toLocaleTimeString()}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700 shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-slate-900">
          <div className="flex-1 overflow-y-auto p-12 space-y-16 border-r border-slate-800 bg-slate-900/40">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="p-10 rounded-3xl bg-sky-500/5 border border-sky-500/20 relative overflow-hidden group">
                 <div className="flex items-start gap-8">
                    <div className="p-5 bg-sky-500/10 rounded-2xl border border-sky-500/20 shadow-inner text-sky-400">
                      <ShieldAlert className="w-8 h-8 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-sky-300 font-bold text-[11px] uppercase tracking-widest mb-4">Remote Triage Protocol</h4>
                      <p className="text-base text-slate-300 leading-relaxed font-medium">
                        Model confidence is <span className="text-white font-bold">88.4%</span> for a <span className="text-white font-bold underline decoration-sky-500 underline-offset-4">Dry Run scenario</span>. 
                        No gas flow detected. Verify breaker 12 before field dispatch.
                      </p>
                    </div>
                 </div>
              </div>

              <div className="p-10 rounded-3xl border border-slate-700 bg-slate-800/40 relative overflow-hidden shadow-sm">
                 <div className="flex items-center gap-5 mb-10">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-200">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">Executive Forecast</h3>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-3">Critical Path</p>
                       <p className="text-2xl text-white font-bold tracking-tighter">Heat Exchanger Core</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-3">Failure Window</p>
                       <p className="text-4xl text-rose-400 font-bold tracking-tighter">14 Days</p>
                    </div>
                 </div>
              </div>
            </div>

            <section className="space-y-8">
               <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-4">
                 <AlertTriangle className="w-5 h-5 text-rose-400" />
                 Anomaly Risk Analysis
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {failureRisks.map(risk => (
                    <div key={risk.id} className="p-8 rounded-3xl border border-slate-700 hover:border-sky-500/30 hover:bg-slate-800/60 transition-all group shadow-sm bg-slate-800/20">
                       <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-5">
                             <div className={`p-3 rounded-xl ${risk.severityBg} border border-slate-700`}>
                                <AlertTriangle className={`w-6 h-6 ${risk.severityColor}`} />
                             </div>
                             <div>
                                <h4 className="text-lg font-bold text-white tracking-tight">{risk.component}</h4>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${risk.severityColor}`}>
                                   {risk.severity} Risk Profile
                                </span>
                             </div>
                          </div>
                          <button className="p-3 bg-slate-900 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 text-slate-400 hover:text-white">
                             <History className="w-5 h-5" />
                          </button>
                       </div>
                       <div className="flex items-center justify-between pt-8 border-t border-slate-800">
                          <div>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Predicted</p>
                             <p className="text-sm text-white font-bold">{risk.predictedDate}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Confidence</p>
                             <span className="text-xl text-white font-bold">{risk.confidence}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          <aside className="w-full lg:w-[460px] bg-slate-800/30 p-12 overflow-y-auto space-y-12 flex flex-col border-l border-slate-800">
             <div className="flex-1 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-4">
                     <Clock className="w-5 h-5" /> Triage Script
                  </h3>
                  <span className="px-3 py-1 bg-slate-900 rounded-lg text-[10px] text-slate-400 font-bold border border-slate-700">V2.1</span>
                </div>
                
                <div className="space-y-4">
                   {[
                     { id: 'breaker', label: 'Circuit Breaker Sync', desc: 'Confirm status of circuit 12 (Service Panel)' },
                     { id: 'filter', label: 'Static Pressure Check', desc: 'Ask about MERV rating and last swap date' },
                     { id: 'mode', label: 'Interface Protocol', desc: 'Ensure therm. heat call aligns with staging' }
                   ].map(item => (
                     <button 
                       key={item.id} 
                       onClick={() => toggleCheck(item.id)}
                       className={`w-full text-left p-8 rounded-3xl border transition-all ${
                         checklist[item.id] 
                          ? 'bg-emerald-500/10 border-emerald-500/40' 
                          : 'bg-slate-900/40 border-slate-700 hover:border-sky-500/40 shadow-sm'
                       }`}
                     >
                        <div className="flex items-center justify-between mb-3">
                           <span className={`text-base font-bold tracking-tight ${checklist[item.id] ? 'text-emerald-400 line-through opacity-50' : 'text-white'}`}>
                             {item.label}
                           </span>
                           <CheckCircle2 className={`w-6 h-6 ${checklist[item.id] ? 'text-emerald-500' : 'text-slate-700'}`} />
                        </div>
                        <p className={`text-xs font-medium ${checklist[item.id] ? 'text-emerald-400/50' : 'text-slate-500'}`}>
                          {item.desc}
                        </p>
                     </button>
                   ))}
                </div>
             </div>

             <div className="pt-12 border-t border-slate-800 space-y-6">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Operation Console</h3>
                <div className="grid grid-cols-1 gap-4">
                   <button className="flex items-center justify-center gap-5 bg-sky-600 text-white py-6 rounded-2xl text-[11px] font-bold tracking-widest uppercase hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/30">
                      <Phone className="w-5 h-5" /> Initialize Uplink
                   </button>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-4 bg-slate-800 border border-slate-700 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all">
                        SMS
                      </button>
                      <button className="flex items-center justify-center gap-4 bg-emerald-600 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10">
                        Dispatch
                      </button>
                   </div>
                   <button onClick={onGenerateReport} className="w-full flex items-center justify-center gap-4 py-5 text-[10px] font-bold text-slate-500 hover:text-sky-400 transition-all uppercase tracking-widest border border-dashed border-slate-700 hover:border-sky-500/40 rounded-2xl">
                     <FileText className="w-5 h-5" /> Analytics Export
                   </button>
                </div>
             </div>
          </aside>
        </div>

      </div>
    </div>
  );
};