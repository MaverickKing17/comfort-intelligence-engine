import React, { useState, useEffect } from 'react';
import { HVACSystem, HealthStatus } from '../types';
import { X, Wrench, FileText, Send, Zap, BrainCircuit, TrendingDown, Clock, CalendarCheck, Wifi, RefreshCw } from 'lucide-react';

interface SystemDetailModalProps {
  system: HVACSystem;
  onClose: () => void;
  onGenerateReport: () => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ system, onClose, onGenerateReport }) => {
  // Local state for real-time simulation
  const [currentMetrics, setCurrentMetrics] = useState(system.metrics);
  const [isLive, setIsLive] = useState(true);
  const [lastSynced, setLastSynced] = useState(new Date());

  // Real-time sync effect
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setCurrentMetrics(prev => {
        // Helper to randomize number slightly to simulate sensor noise/live readings
        const fluctuate = (val: number | string, magnitude: number = 0.5) => {
            if (typeof val === 'string') return val;
            const change = (Math.random() - 0.5) * magnitude;
            return Math.max(0, Math.min(100, Math.round((val + change) * 100) / 100));
        };

        return {
           ...prev,
           heatingPower: {
             ...prev.heatingPower,
             value: fluctuate(prev.heatingPower.value, 1.5),
             // Randomly flip trend occasionally
             trend: Math.random() > 0.9 ? (Math.random() > 0.5 ? 'up' : 'down') : prev.heatingPower.trend
           },
           efficiency: {
             ...prev.efficiency,
             value: fluctuate(prev.efficiency.value, 0.2)
           },
           systemBreathing: prev.systemBreathing // Keep string values stable
        };
      });
      setLastSynced(new Date());
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  const isCritical = currentMetrics.heatingPower.status === HealthStatus.Critical || currentMetrics.heatingPower.status === HealthStatus.Warning;
  
  // Enterprise Logic: Show buttons only if critical/warning
  const showSyncButtons = isCritical || system.insights.length > 0;

  // Mock Prediction Logic based on health
  const getPrediction = () => {
    if (currentMetrics.heatingPower.status === HealthStatus.Critical) {
      return {
        component: "Heat Exchanger",
        timeframe: "Immediate (< 48 hrs)",
        probability: 92,
        severity: "Critical",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20"
      };
    } else if (currentMetrics.heatingPower.status === HealthStatus.Warning) {
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

  // Mock Maintenance Schedule
  const getMaintenanceSchedule = () => {
    // Generate dates based on current date
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const nextSeason = new Date(today);
    nextSeason.setMonth(today.getMonth() + 4);

    return [
      {
        id: 1,
        task: "MERV-11 Filter Replacement",
        reason: "High static pressure trend detected",
        date: nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        urgency: currentMetrics.systemBreathing.status === HealthStatus.Warning ? "High" : "Normal",
        icon: "filter"
      },
      {
        id: 2,
        task: "Flame Sensor Calibration",
        reason: "Micro-amp reading fluctuation",
        date: nextSeason.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        urgency: "Normal",
        icon: "sensor"
      }
    ];
  };

  const maintenanceTasks = getMaintenanceSchedule();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-premium overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-start bg-black/20">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{system.address}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                currentMetrics.heatingPower.status === 'Good' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {currentMetrics.heatingPower.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{system.ownerName} • {system.systemType}</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </div>
                    LIVE SYNC
                </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-500 hidden sm:block">
                Last update: {lastSynced.toLocaleTimeString()}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* AI Predictive Analysis (Reliability) */}
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
                <div className="h-2.5 w-full bg-[#111827] rounded-full overflow-hidden relative border border-white/5">
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

          {/* AI Maintenance Schedule (New Section) */}
          <div className="rounded-xl border border-border bg-[#18202f] overflow-hidden">
             <div className="p-4 border-b border-border bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <CalendarCheck className="w-4 h-4 text-emerald-400" />
                   <h3 className="text-sm font-bold text-white tracking-wide">Predictive Maintenance</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">
                   Auto-Scheduled
                </span>
             </div>
             <div className="p-4 space-y-4">
                {maintenanceTasks.map(task => (
                   <div key={task.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                            task.urgency === 'High' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-[#1f2536] border-border text-gray-400'
                         }`}>
                            {task.icon === 'filter' ? <Wrench className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                         </div>
                         <div>
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition">{task.task}</p>
                            <p className="text-xs text-gray-500">{task.reason}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-sm font-mono font-bold ${task.urgency === 'High' ? 'text-amber-400' : 'text-gray-300'}`}>
                            {task.date}
                         </p>
                         {task.urgency === 'High' && (
                            <p className="text-[10px] text-amber-500 animate-pulse">Action Required</p>
                         )}
                      </div>
                   </div>
                ))}
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
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Telemetry</h3>
                <div className="flex items-center gap-1 text-[10px] text-green-500">
                    <Wifi className="w-3 h-3" />
                    <span>Stream Stable</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#111827] p-4 rounded-lg border border-border hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-500">{currentMetrics.heatingPower.simpleEnglishLabel}</p>
                  <ActivityIndicator status={currentMetrics.heatingPower.status} />
                </div>
                <div className="flex items-baseline gap-1">
                    <p className="text-xl font-semibold text-white">
                    {currentMetrics.heatingPower.value}{currentMetrics.heatingPower.unit}
                    </p>
                    {currentMetrics.heatingPower.trend && (
                        <span className={`text-[10px] ${currentMetrics.heatingPower.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {currentMetrics.heatingPower.trend === 'up' ? '↑' : '↓'}
                        </span>
                    )}
                </div>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">{currentMetrics.heatingPower.technicalLabel}</p>
              </div>

              <div className="bg-[#111827] p-4 rounded-lg border border-border hover:border-gray-600 transition">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-500">{currentMetrics.systemBreathing.simpleEnglishLabel}</p>
                  <ActivityIndicator status={currentMetrics.systemBreathing.status} />
                </div>
                <p className="text-xl font-semibold text-white">
                  {currentMetrics.systemBreathing.value}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">{currentMetrics.systemBreathing.technicalLabel}</p>
              </div>

              <div className="bg-[#111827] p-4 rounded-lg border border-border hover:border-gray-600 transition">
                 <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-500">Fuel Economy</p>
                  <ActivityIndicator status={currentMetrics.efficiency.status} />
                </div>
                <p className="text-xl font-semibold text-white">
                  {currentMetrics.efficiency.value}%
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">AFUE Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-[#111827] border-t border-border">
           {showSyncButtons ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <button className="flex items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#374151] text-white py-3 px-4 rounded-lg text-xs font-medium transition border border-border hover:border-gray-500 shadow-lg">
                 <FileText className="w-3 h-3 text-green-400" />
                 Sync to Jobber
               </button>
               <button className="flex items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#374151] text-white py-3 px-4 rounded-lg text-xs font-medium transition border border-border hover:border-gray-500 shadow-lg">
                 <Wrench className="w-3 h-3 text-blue-400" />
                 Sync ServiceTitan
               </button>
               <button className="flex items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#374151] text-white py-3 px-4 rounded-lg text-xs font-medium transition border border-border hover:border-gray-500 shadow-lg">
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