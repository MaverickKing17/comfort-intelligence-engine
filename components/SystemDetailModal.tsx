import React from 'react';
import { HVACSystem, HealthStatus } from '../types';
import { X, Wrench, FileText, Send, Zap, BrainCircuit, TrendingDown, Clock, AlertOctagon } from 'lucide-react';

interface SystemDetailModalProps {
  system: HVACSystem;
  onClose: () => void;
  onGenerateReport: () => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ system, onClose, onGenerateReport }) => {
  const isCritical = system.metrics.heatingPower.status === HealthStatus.Critical || system.metrics.heatingPower.status === HealthStatus.Warning;
  
  // Enterprise Logic: Show buttons only if critical/warning
  const showSyncButtons = isCritical || system.insights.length > 0;

  // Mock Prediction Logic based on health
  const getPrediction = () => {
    if (system.metrics.heatingPower.status === HealthStatus.Critical) {
      return {
        component: "Heat Exchanger",
        timeframe: "Immediate (< 48 hrs)",
        probability: 92,
        severity: "Critical",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
      };
    } else if (system.metrics.heatingPower.status === HealthStatus.Warning) {
      return {
        component: "Blower Motor",
        timeframe: "3 - 6 Months",
        probability: 78,
        severity: "Moderate",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20"
      };
    }
    return {
      component: "Routine Wear",
      timeframe: "2+ Years",
      probability: 98,
      severity: "Low",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    };
  };

  const prediction = getPrediction();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-premium overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-start bg-black/20">
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
          
          {/* AI Predictive Analysis (New Section) */}
          <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-br from-[#1e2330] to-[#151922]">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="p-5 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                    <BrainCircuit className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">AI Reliability Forecast</h3>
                    <p className="text-[10px] text-indigo-300">Model Confidence: {prediction.probability}%</p>
                  </div>
                </div>
                {prediction.severity !== 'Low' && (
                  <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-xs font-medium text-red-400">
                    <TrendingDown className="w-3 h-3" />
                    <span>Risk Detected</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                   <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Predicted Failure Point</p>
                   <p className="text-lg font-semibold text-white">{prediction.component}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase text-gray-500 font-bold mb-1">Estimated Timeline</p>
                   <p className={`text-lg font-mono font-bold ${prediction.color}`}>{prediction.timeframe}</p>
                </div>
              </div>

              {/* Timeline Visualization */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                  <span>Today</span>
                  <span>1 Month</span>
                  <span>6 Months</span>
                  <span>1 Year</span>
                </div>
                <div className="h-2.5 w-full bg-[#0b0f19] rounded-full overflow-hidden relative border border-white/5">
                   {/* Danger Zone Gradient */}
                   <div className={`absolute top-0 bottom-0 right-0 w-[60%] bg-gradient-to-l from-red-500/50 to-transparent`}></div>
                   {/* Marker */}
                   <div 
                     className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10 transition-all duration-1000"
                     style={{ 
                       left: prediction.severity === 'Critical' ? '5%' : prediction.severity === 'Moderate' ? '30%' : '90%' 
                     }}
                   ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  <span className="text-indigo-400 font-semibold">Insight:</span> {prediction.severity === 'Critical' 
                    ? "Severe airflow restriction is causing the heat exchanger to overheat. Failure is imminent."
                    : prediction.severity === 'Moderate'
                    ? "Motor bearings are showing signs of wear. Efficiency is degrading."
                    : "System is operating within normal parameters. Routine maintenance recommended."}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insights Section (Existing) */}
          {system.insights.length > 0 && (
            <div className="space-y-3">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-3 h-3 text-amber-500" />
                 Active Opportunities
               </h3>
               {system.insights.map((insight, idx) => (
                 <div key={idx} className={`p-4 rounded-xl border ${
                   insight.type === 'LEAD_GEN' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'
                 }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-semibold text-sm ${insight.type === 'LEAD_GEN' ? 'text-amber-400' : 'text-blue-400'}`}>
                          {insight.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                      </div>
                      {insight.valueProp && (
                        <div className="bg-black/40 px-2 py-1 rounded text-[10px] font-mono text-white border border-gray-700">
                          {insight.valueProp}
                        </div>
                      )}
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* Vital Signs Grid */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Live Telemetry</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#0b0f19] p-4 rounded-lg border border-border hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-500">{system.metrics.heatingPower.simpleEnglishLabel}</p>
                  <ActivityIndicator status={system.metrics.heatingPower.status} />
                </div>
                <p className="text-xl font-semibold text-white">
                  {system.metrics.heatingPower.value}{system.metrics.heatingPower.unit}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">{system.metrics.heatingPower.technicalLabel}</p>
              </div>

              <div className="bg-[#0b0f19] p-4 rounded-lg border border-border hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-500">{system.metrics.systemBreathing.simpleEnglishLabel}</p>
                  <ActivityIndicator status={system.metrics.systemBreathing.status} />
                </div>
                <p className="text-xl font-semibold text-white">
                  {system.metrics.systemBreathing.value}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">{system.metrics.systemBreathing.technicalLabel}</p>
              </div>

              <div className="bg-[#0b0f19] p-4 rounded-lg border border-border hover:border-gray-600 transition">
                 <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-500">Fuel Economy</p>
                  <ActivityIndicator status={system.metrics.efficiency.status} />
                </div>
                <p className="text-xl font-semibold text-white">
                  {system.metrics.efficiency.value}%
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">AFUE Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-[#0b0f19] border-t border-border">
           {showSyncButtons ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <button className="flex items-center justify-center gap-2 bg-[#151b2b] hover:bg-[#1e2538] text-white py-3 px-4 rounded-lg text-xs font-medium transition border border-border hover:border-gray-500 shadow-lg">
                 <FileText className="w-3 h-3 text-green-400" />
                 Sync to Jobber
               </button>
               <button className="flex items-center justify-center gap-2 bg-[#151b2b] hover:bg-[#1e2538] text-white py-3 px-4 rounded-lg text-xs font-medium transition border border-border hover:border-gray-500 shadow-lg">
                 <Wrench className="w-3 h-3 text-blue-400" />
                 Sync ServiceTitan
               </button>
               <button className="flex items-center justify-center gap-2 bg-[#151b2b] hover:bg-[#1e2538] text-white py-3 px-4 rounded-lg text-xs font-medium transition border border-border hover:border-gray-500 shadow-lg">
                 <Send className="w-3 h-3 text-amber-400" />
                 Sync Housecall
               </button>
             </div>
           ) : (
             <button 
               onClick={onGenerateReport}
               className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-lg text-sm font-bold hover:bg-gray-200 transition shadow-glow"
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

// Helper for status dots
const ActivityIndicator = ({ status }: { status: string }) => {
  const color = status === 'Good' ? 'bg-green-500' : status === 'Warning' ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`}></span>
    </div>
  );
};