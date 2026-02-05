import React, { useState } from 'react';
import { MOCK_SYSTEMS } from './constants';
import { SpotlightCard } from './components/SpotlightCard';
import { RadialGauge } from './components/RadialGauge';
import { GTAClusterMap } from './components/GTAClusterMap';
import { SystemDetailModal } from './components/SystemDetailModal';
import { HomeHealthCertificate } from './components/HomeHealthCertificate';
import { HVACSystem } from './types';
import { Search, Bell, Menu, Activity, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<HVACSystem | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // Filter Logic examples
  const urgentLeads = MOCK_SYSTEMS.filter(s => s.insights.some(i => i.isUrgent));
  const nuisanceAlerts = MOCK_SYSTEMS.filter(s => s.insights.some(i => i.type === 'NUISANCE_FILTER'));

  return (
    <div className="min-h-screen bg-bg text-gray-100 font-sans selection:bg-white/20">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">At</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">Ambient Twin</span>
          <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-400 border border-white/5">v2.4 Beta</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-[#0c0c10] border border-border rounded-full px-4 py-1.5 w-64">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search by address..." 
              className="bg-transparent border-none outline-none text-sm text-gray-300 w-full placeholder-gray-600"
            />
          </div>
          <button className="relative p-2 hover:bg-white/5 rounded-full transition">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-bg"></span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full transition md:hidden">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header Stats */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="text-3xl font-bold text-white mb-2">Morning Triage</h1>
             <p className="text-gray-400">Toronto/GTA Market • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-[#0c0c10] border border-border px-4 py-2 rounded-lg flex flex-col">
                <span className="text-[10px] uppercase text-gray-500 font-bold">Active Alerts</span>
                <span className="text-xl font-mono font-medium text-white">12</span>
             </div>
             <div className="bg-[#0c0c10] border border-border px-4 py-2 rounded-lg flex flex-col">
                <span className="text-[10px] uppercase text-gray-500 font-bold">Est. Revenue</span>
                <span className="text-xl font-mono font-medium text-green-400">$24,500</span>
             </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Main Feed: 8 columns */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Lead Generation Cards (Gold Glow) */}
             {urgentLeads.map(system => (
               <SpotlightCard 
                  key={system.id} 
                  goldGlow={true}
                  className="cursor-pointer group"
                  onClick={() => setSelectedSystem(system)}
               >
                 <div className="p-5 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">High-Margin Lead</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-amber-100 transition">{system.address}</h3>
                      </div>
                      <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded font-mono">
                        {system.insights[0].valueProp}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div className="space-y-1">
                          <p className="text-xs text-gray-500">Heating Power</p>
                          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                             <div className="h-full bg-amber-500" style={{ width: `${system.metrics.heatingPower.value}%` }}></div>
                          </div>
                          <p className="text-xs text-right text-gray-400">{system.metrics.heatingPower.value}%</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs text-gray-500">System Age</p>
                          <p className="text-sm text-gray-200 font-medium">13 Years</p>
                          <p className="text-[10px] text-red-400">End of Life: Warning</p>
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                       <p className="text-xs text-gray-500">{system.ownerName}</p>
                       <span className="text-xs text-amber-500 font-medium hover:underline">View Opportunity →</span>
                    </div>
                 </div>
               </SpotlightCard>
             ))}

             {/* Nuisance Filter Cards */}
             {nuisanceAlerts.map(system => (
               <SpotlightCard 
                  key={system.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedSystem(system)}
               >
                 <div className="p-5 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Automated Triage</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">{system.address}</h3>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-200 font-medium mb-1">{system.insights[0].title}</p>
                      <p className="text-xs text-blue-300/70">{system.insights[0].description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                       <span>Metric: {system.metrics.heatingPower.value}% Power</span>
                       <span>Status: Dry Run?</span>
                    </div>
                 </div>
               </SpotlightCard>
             ))}

             {/* Standard System Cards */}
             {MOCK_SYSTEMS.filter(s => s.insights.length === 0).map(system => (
                <SpotlightCard 
                  key={system.id}
                  className="cursor-pointer group hover:border-gray-600"
                  onClick={() => setSelectedSystem(system)}
                >
                  <div className="p-5 h-full flex flex-col items-center justify-center text-center">
                     <div className="mb-4">
                       <RadialGauge 
                         value={typeof system.metrics.heatingPower.value === 'number' ? system.metrics.heatingPower.value : 0} 
                         label="Health" 
                         status={system.metrics.heatingPower.status} 
                         size={100}
                       />
                     </div>
                     <h3 className="font-semibold text-white">{system.address}</h3>
                     <p className="text-xs text-gray-500 mt-1">{system.metrics.systemBreathing.value} Breathing</p>
                  </div>
                </SpotlightCard>
             ))}
          </div>

          {/* Right Sidebar: 4 columns */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Map Widget */}
            <div className="h-64 md:h-80">
              <GTAClusterMap />
            </div>

            {/* Quick Actions / Insights Summary */}
            <SpotlightCard className="p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Market Pulse</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-sm text-gray-300">Gov. Rebates Active</span>
                  <span className="text-sm font-medium text-green-400">Yes (ON-2026)</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-sm text-gray-300">Avg. Grid Load</span>
                  <span className="text-sm font-medium text-amber-400">High (Peak)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Weather Impact</span>
                  <span className="text-sm font-medium text-blue-400">-12°C tonight</span>
                </div>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedSystem && (
        <SystemDetailModal 
          system={selectedSystem} 
          onClose={() => setSelectedSystem(null)} 
          onGenerateReport={() => {
            setShowCertificate(true);
            // Don't close system detail immediately for better UX flow, or handle as nested
          }}
        />
      )}

      {showCertificate && selectedSystem && (
        <HomeHealthCertificate 
          system={selectedSystem} 
          onClose={() => setShowCertificate(false)} 
        />
      )}
    </div>
  );
};

export default App;