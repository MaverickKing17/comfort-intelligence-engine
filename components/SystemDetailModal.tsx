import React, { useState, useEffect } from 'react';
import { HVACSystem, HealthStatus } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { X, Wrench, FileText, Zap, BrainCircuit, Clock, CalendarCheck, CheckCircle2, Phone, MessageSquare, ShieldAlert, Sparkles, ChevronRight, AlertTriangle, History, ArrowUpRight, Loader2, Target } from 'lucide-react';

interface SystemDetailModalProps {
  system: HVACSystem;
  onClose: () => void;
  onGenerateReport: () => void;
}

interface AIPrediction {
  predictionDate: string;
  maintenanceType: string;
  reasoning: string;
  confidenceScore: number;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ system, onClose, onGenerateReport }) => {
  const [currentMetrics, setCurrentMetrics] = useState(system.metrics);
  const [lastSynced, setLastSynced] = useState(new Date());
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    breaker: false,
    filter: false,
    mode: false,
    setpoint: false,
  });

  const runAIPrediction = async () => {
    setIsPredicting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perform an expert HVAC diagnostic forecast for this specific system:
          Address: ${system.address}
          Type: ${system.systemType}
          Installation Date: ${system.installDate}
          Current Performance Metrics: ${JSON.stringify(currentMetrics)}
          
          Identify the most likely next major component failure or required maintenance. 
          Be specific (e.g., 'Capacitor Replacement', 'Refrigerant Charge Adjustment'). 
          Provide a realistic estimated date within the next 24 months.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictionDate: { type: Type.STRING, description: "Predicted maintenance date (e.g. October 15, 2026)" },
              maintenanceType: { type: Type.STRING, description: "Technical name of the maintenance/repair task" },
              reasoning: { type: Type.STRING, description: "Detailed AI reasoning based on age and telemetry" },
              confidenceScore: { type: Type.NUMBER, description: "AI confidence score from 0 to 100" }
            },
            required: ["predictionDate", "maintenanceType", "reasoning", "confidenceScore"]
          }
        }
      });
      
      const text = response.text;
      if (text) {
        setAiPrediction(JSON.parse(text));
      }
    } catch (error) {
      console.error("AI Prediction failed:", error);
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    runAIPrediction();
    
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
            
            {/* AI PREDICTION SECTION */}
            <section className="space-y-8 animate-in slide-in-from-top-4 duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    AI Maintenance Forecast
                  </h3>
                  <button 
                    onClick={runAIPrediction}
                    disabled={isPredicting}
                    className="text-[10px] text-slate-500 hover:text-sky-400 font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    {isPredicting ? <Loader2 className="w-3 h-3 animate-spin" /> : <History className="w-3 h-3" />}
                    Refresh Forecast
                  </button>
               </div>

               <div className={`relative overflow-hidden p-10 rounded-[2rem] border transition-all duration-700 ${isPredicting ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-950/80 border-sky-500/20 shadow-[0_0_40px_rgba(56,189,248,0.05)]'}`}>
                  {isPredicting ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-6">
                       <BrainCircuit className="w-12 h-12 text-sky-500 animate-pulse" />
                       <div className="space-y-2 text-center">
                         <p className="text-white font-bold tracking-tight">Synthesizing Telemetry...</p>
                         <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Evaluating wear patterns and install age</p>
                       </div>
                    </div>
                  ) : aiPrediction ? (
                    <div className="flex flex-col md:flex-row gap-12">
                       <div className="flex-1 space-y-8">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                                <CalendarCheck className="w-8 h-8 text-sky-400" />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Projected Event Date</p>
                                <h4 className="text-3xl font-black text-white tracking-tighter">{aiPrediction.predictionDate}</h4>
                             </div>
                          </div>
                          
                          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                             <h5 className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mb-3">Diagnostic Analysis</h5>
                             <p className="text-sm text-slate-200 leading-relaxed font-medium">{aiPrediction.reasoning}</p>
                          </div>
                       </div>

                       <div className="w-full md:w-64 space-y-8">
                          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Maintenance Task</p>
                             <p className="text-lg font-bold text-white tracking-tight">{aiPrediction.maintenanceType}</p>
                          </div>
                          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                             <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confidence</span>
                                <span className="text-xs font-bold text-emerald-400">{aiPrediction.confidenceScore}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" 
                                  style={{ width: `${aiPrediction.confidenceScore}%` }}
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-500 text-sm font-medium">Predictive diagnostics offline. Run refresh to initialize.</p>
                    </div>
                  )}
               </div>
            </section>

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
                    <h3 className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">Legacy Risk Profile</h3>
                 </div>
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-3">Critical Path</p>
                       <p className="text-2xl text-white font-bold tracking-tighter">Heat Exchanger Core</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-3">Historical Failure Window</p>
                       <p className="text-4xl text-rose-400 font-bold tracking-tighter">14 Days</p>
                    </div>
                 </div>
              </div>
            </div>
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