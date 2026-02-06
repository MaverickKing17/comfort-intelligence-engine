import React, { useState, useEffect } from 'react';
import { HVACSystem, HealthStatus } from '../types';
import { X, Wrench, FileText, Send, Zap, BrainCircuit, TrendingDown, Clock, CalendarCheck, Wifi, CheckCircle2, Phone, MessageSquare, ShieldAlert, Sparkles, ChevronRight, AlertTriangle, History, ArrowUpRight } from 'lucide-react';

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

  const handleViewTickets = (component: string) => {
    console.log(`Opening historical tickets for: ${component}`);
  };

  const getPredictiveMaintenance = () => {
    const isWorn = currentMetrics.heatingPower.status !== HealthStatus.Good;
    return [
      {
        id: 'pm_1',
        type: 'Flame Sensor Polishing',
        date: 'Oct 24, 2026',
        reason: 'Micro-amp jitter detected in ignition sequence',
        urgency: isWorn ? 'High' : 'Normal'
      },
      {
        id: 'pm_2',
        type: 'Inducer Draft Motor Audit',
        date: 'Dec 12, 2026',
        reason: 'Current draw trending 12% above seasonal baseline',
        urgency: 'Normal'
      }
    ];
  };

  const getFailurePredictions = () => {
    return [
      {
        id: 'fail_1',
        component: 'Heat Exchanger Core',
        predictedDate: 'February 18, 2026',
        severity: 'Critical',
        severityColor: 'text-rose-400',
        severityBg: 'bg-rose-400/10',
        confidence: '94%',
        ticketCount: 3
      },
      {
        id: 'fail_2',
        component: 'Capacitor - Blower Motor',
        predictedDate: 'March 05, 2026',
        severity: 'High',
        severityColor: 'text-amber-400',
        severityBg: 'bg-amber-400/10',
        confidence: '82%',
        ticketCount: 1
      }
    ];
  };

  const maintenanceForecast = getPredictiveMaintenance();
  const failureRisks = getFailurePredictions();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020305]/95 backdrop-blur-2xl p-4 md:p-8 animate-in fade-in duration-500"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#0a0c10] border border-white/10 w-full max-w-6xl rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh] relative">
        
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-emerald-500 to-rose-500 opacity-80" />

        {/* Header Section */}
        <header className="px-8 py-10 border-b border-white/5 flex justify-between items-start bg-gradient-to-b from-white/[0.03] to-transparent">
          <div>
            <div className="flex items-center gap-5 mb-3">
              <h2 id="modal-title" className="text-3xl font-black text-white tracking-tight">{system.address}</h2>
              <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg ${
                system.metrics.heatingPower.status === HealthStatus.Good 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {system.activeTriage?.suggestedOutcome || 'Monitoring'}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm font-semibold text-gray-400">
                <span className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div> 
                  {system.ownerName}
                </span>
                <span className="text-gray-700" aria-hidden="true">/</span>
                <span className="text-gray-300">{system.systemType}</span>
                <span className="text-gray-700" aria-hidden="true">/</span>
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Live Sync: {lastSynced.toLocaleTimeString()}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5 group"
            aria-label="Close triage detail"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Main Intelligence Engine Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-12 border-r border-white/5 bg-[#0a0c10]">
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Executive Summary Card */}
              <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/20 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
                    <ShieldAlert className="w-24 h-24 text-indigo-400" />
                 </div>
                 <div className="flex items-start gap-6">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                      <ShieldAlert className="w-6 h-6 text-indigo-400 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-[0.15em] mb-3">Remote Triage Protocol</h4>
                      <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                        Model confidence is <span className="text-indigo-300 font-bold">88.4%</span> for a <span className="text-indigo-300 font-bold underline decoration-indigo-500/50 underline-offset-4">Dry Run scenario</span>. 
                        No gas flow detected despite ignition sequence activation. Recommend verifying circuit breakers before field dispatch.
                      </p>
                    </div>
                 </div>
              </div>

              {/* Reliability Forecast Summary */}
              <div className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#12141a] to-[#0a0c10] relative overflow-hidden shadow-xl">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full"></div>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <BrainCircuit className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xs font-black text-gray-400 tracking-[0.25em] uppercase">Executive Forecast</h3>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em] mb-2">Critical Path</p>
                       <p className="text-xl text-white font-bold tracking-tight">Heat Exchanger Fatigue</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em] mb-2">Failure Probability</p>
                       <p className="text-3xl text-rose-500 font-mono font-black tracking-tighter">14 Days</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* AI Failure Risk Analysis */}
            <section className="space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <BrainCircuit className="w-4 h-4 text-rose-500" />
                    Anomaly Risk Analysis
                  </h3>
                  <span className="text-[10px] font-bold text-gray-600 font-mono uppercase">TORONTO-V2-ENGINE</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {failureRisks.map(risk => (
                    <div key={risk.id} className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-rose-500/40 transition-all group relative overflow-hidden">
                       <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                             <div className={`p-2.5 rounded-xl ${risk.severityBg} border border-white/5`}>
                                <AlertTriangle className={`w-5 h-5 ${risk.severityColor}`} />
                             </div>
                             <div>
                                <h4 className="text-base font-bold text-white tracking-tight">{risk.component}</h4>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${risk.severityColor}`}>
                                   {risk.severity} Level Threat
                                </span>
                             </div>
                          </div>
                          <button 
                            onClick={() => handleViewTickets(risk.component)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group/btn"
                            title="View historical logs"
                          >
                             <History className="w-4 h-4 text-gray-500 group-hover/btn:text-white transition-colors" />
                          </button>
                       </div>
                       
                       <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="space-y-1">
                             <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Failure Window</p>
                             <p className="text-sm text-gray-300 font-semibold">{risk.predictedDate}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Confidence</p>
                             <div className="flex items-center gap-2 justify-end">
                                <span className="text-lg text-white font-mono font-bold tracking-tighter">{risk.confidence}</span>
                                <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-rose-500" style={{ width: risk.confidence }}></div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* AI Predictive Maintenance */}
            <section className="space-y-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Proactive Management
                  </h3>
               </div>
               <div className="grid gap-4">
                  {maintenanceForecast.map(item => (
                    <div key={item.id} className="p-6 rounded-3xl border border-white/5 bg-gradient-to-r from-white/[0.01] to-transparent hover:border-emerald-500/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex items-center gap-5">
                          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-500/10">
                             <CalendarCheck className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">{item.type}</h4>
                             <p className="text-xs text-gray-500 font-medium">
                                {item.reason}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 ml-auto sm:ml-0">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 uppercase tracking-widest">
                             {item.date}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Live Performance Telemetry */}
            <section className="space-y-6">
               <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Real-Time Core Metrics</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[system.metrics.heatingPower, system.metrics.systemBreathing, system.metrics.efficiency].map((m, i) => (
                    <div key={i} className="bg-black/60 p-6 rounded-[2rem] border border-white/5 shadow-inner hover:border-white/20 transition-all group">
                       <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-4 group-hover:text-gray-400 transition-colors">{m.simpleEnglishLabel}</p>
                       <div className="flex items-center gap-3">
                         <p className="text-3xl font-mono font-black text-white group-hover:text-indigo-200 transition-colors">{m.value}{m.unit}</p>
                         <div className={`w-2.5 h-2.5 rounded-full ${m.status === HealthStatus.Good ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
                       </div>
                       <p className="text-[9px] text-gray-600 mt-4 font-bold uppercase tracking-tight opacity-50">{m.technicalLabel}</p>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Sidebar: Triage Script Panel */}
          <aside className="w-full lg:w-[420px] bg-[#08090d] p-10 overflow-y-auto space-y-10 flex flex-col border-l border-white/5">
             <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 id="checklist-heading" className="text-xs font-black text-gray-500 uppercase tracking-[0.25em] flex items-center gap-3">
                     <Clock className="w-4 h-4" /> Agent Triage Script
                  </h3>
                  <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-500 font-mono border border-white/5">v2.1</span>
                </div>
                
                <div 
                  className="space-y-4" 
                  role="group" 
                  aria-labelledby="checklist-heading"
                >
                   {[
                     { id: 'breaker', label: 'Circuit Breaker Sync', desc: 'Identify if circuit 12 (Furnace) has tripped' },
                     { id: 'filter', label: 'Static Pressure Check', desc: 'Confirm filter MERV rating and last swap' },
                     { id: 'mode', label: 'Interface Verification', desc: 'Ensure thermostat heat call matches staging' },
                     { id: 'setpoint', label: 'Delta Validation', desc: 'Verify setpoint offset > 5.5°C' }
                   ].map(item => (
                     <button 
                       key={item.id} 
                       onClick={() => toggleCheck(item.id)}
                       role="checkbox"
                       aria-checked={!!checklist[item.id]}
                       aria-labelledby={`label-${item.id}`}
                       aria-describedby={`desc-${item.id}`}
                       className={`w-full text-left p-6 rounded-3xl border transition-all group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                         checklist[item.id] 
                          ? 'bg-emerald-500/[0.03] border-emerald-500/30' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                       }`}
                     >
                        <div className="flex items-center justify-between mb-2">
                           <span 
                             id={`label-${item.id}`}
                             className={`text-sm font-bold tracking-tight transition-all ${checklist[item.id] ? 'text-emerald-500/60 line-through' : 'text-white group-hover:text-indigo-300'}`}
                           >
                             {item.label}
                           </span>
                           <CheckCircle2 className={`w-6 h-6 transition-all ${checklist[checklist[item.id] ? 'id' : 'id']} ${checklist[item.id] ? 'text-emerald-500 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-gray-800 group-hover:text-gray-600'}`} />
                        </div>
                        <p 
                          id={`desc-${item.id}`}
                          className={`text-xs leading-relaxed ${checklist[item.id] ? 'text-gray-700' : 'text-gray-500'} font-medium`}
                        >
                          {item.desc}
                        </p>
                     </button>
                   ))}
                </div>
             </div>

             {/* Action Console */}
             <div className="pt-10 border-t border-white/10 space-y-6">
                <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em]">Operational Console</h3>
                <div className="grid grid-cols-1 gap-4">
                   <button className="flex items-center justify-center gap-4 bg-indigo-600 text-white py-5 rounded-3xl text-xs font-black tracking-[0.2em] uppercase hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-600/20">
                      <Phone className="w-4 h-4" /> Initialize Voice Uplink
                   </button>
                   <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-white/[0.08] transition-all">
                        <MessageSquare className="w-4 h-4 text-indigo-400" /> SMS Link
                      </button>
                      <button className="flex items-center justify-center gap-3 bg-emerald-600/90 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-xl shadow-emerald-500/10">
                        <Wrench className="w-4 h-4" /> Dispatch AI
                      </button>
                   </div>
                   <button 
                     onClick={onGenerateReport}
                     className="w-full flex items-center justify-center gap-3 py-4 text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-[0.2em] border border-transparent hover:border-white/5 rounded-2xl mt-2"
                   >
                     <FileText className="w-4 h-4" /> Export Analytics Insight
                     <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                </div>
             </div>
          </aside>
        </div>

      </div>
    </div>
  );
};