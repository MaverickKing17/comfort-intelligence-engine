import React, { useState } from 'react';
import { MOCK_SYSTEMS, MOCK_TRIAGE_QUEUE, MOCK_OPPORTUNITIES } from './constants';
import { SpotlightCard } from './components/SpotlightCard';
import { RadialGauge } from './components/RadialGauge';
import { GTAClusterMap } from './components/GTAClusterMap';
import { SystemDetailModal } from './components/SystemDetailModal';
import { HomeHealthCertificate } from './components/HomeHealthCertificate';
import { KpiTile } from './components/KpiTile';
import { HVACSystem } from './types';
import { Search, Bell, Menu, Activity, Zap, LayoutDashboard, ListFilter, TrendingUp, Settings, Wifi, Database, DollarSign, ArrowUpRight } from 'lucide-react';

type View = 'dashboard' | 'queue' | 'opportunities' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSystem, setSelectedSystem] = useState<HVACSystem | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const urgentLeads = MOCK_SYSTEMS.filter(s => s.insights.some(i => i.isUrgent));

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <KpiTile 
          label="Active Alerts" 
          value="12" 
          trend="+2 today" 
          trendColor="text-rose-400" 
          onClick={() => setCurrentView('queue')} 
        />
        <KpiTile 
          label="Dry Runs Prevented" 
          value="48" 
          trend="85% Success" 
        />
        <KpiTile 
          label="Leads Identified" 
          value="15" 
          trend="$42k Pipe" 
          onClick={() => setCurrentView('opportunities')} 
        />
        <KpiTile 
          label="Revenue at Risk" 
          value="$24.5k" 
          trend="Critical" 
          trendColor="text-amber-400" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 flex flex-col gap-6">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Priority Intelligence</h2>
              <div className="h-px bg-white/5 flex-1 mx-6"></div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase cursor-pointer hover:underline">View All Leads</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {urgentLeads.map(system => (
                <SpotlightCard 
                  key={system.id} 
                  goldGlow={true} 
                  className="group" 
                  onClick={() => setSelectedSystem(system)}
                  ariaLabel={`High-margin lead for ${system.address}. Click to view triage detail.`}
                  opensModal={true}
                >
                  <div className="p-7 h-full flex flex-col relative overflow-hidden">
                      {/* Floating Revenue Label */}
                      <div className="absolute top-0 right-0 p-6">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Est. Revenue</span>
                          <span className="text-xl font-black text-emerald-400 tracking-tighter">$8,500</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-6" aria-hidden="true">
                        <div className="p-1.5 bg-amber-500/20 rounded-lg">
                          <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                        </div>
                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.15em]">High-Margin Lead</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors tracking-tight">{system.address}</h3>
                        <p className="text-sm text-gray-400 mt-2 font-medium">{system.ownerName}</p>
                      </div>

                      <div className="mt-10 flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="block text-[10px] text-gray-600 font-black uppercase tracking-widest">Rebate Qualification</span>
                          <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-block uppercase tracking-wider">
                            $6,500 Certified
                          </div>
                        </div>
                        <button className="flex items-center gap-1.5 text-xs font-black text-indigo-400 uppercase tracking-widest group-hover:gap-3 transition-all">
                          Review <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                  </div>
                </SpotlightCard>
              ))}
              {MOCK_SYSTEMS.filter(s => s.insights.length === 0 || !s.insights[0].isUrgent).map(system => (
                  <SpotlightCard 
                    key={system.id} 
                    className="group" 
                    onClick={() => setSelectedSystem(system)}
                    ariaLabel={`Healthy system at ${system.address}. Click for live telemetry.`}
                    opensModal={true}
                  >
                    <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                       <RadialGauge value={98} label="System Health" status={system.metrics.heatingPower.status} size={100} />
                       <div className="mt-8">
                         <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors tracking-tight">{system.address}</h3>
                         <p className="text-xs text-gray-500 mt-1 uppercase font-black tracking-widest">Stable Performance</p>
                       </div>
                    </div>
                  </SpotlightCard>
              ))}
           </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="h-[380px] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
            <GTAClusterMap />
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-white/5">Toronto Grid Live</span>
            </div>
          </div>

          <SpotlightCard className="p-8 bg-gradient-to-br from-[#0c0e14] to-[#08090d]" ariaLabel="Market Pulse: High-density intelligence on GTA grid conditions.">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Market Pulse</h3>
               <Activity className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Grid Load</span>
                  <span className="text-sm font-bold text-white tracking-tight">Industrial Peak</span>
                </div>
                <span className="text-amber-400 font-black text-xs uppercase tracking-widest px-2 py-1 bg-amber-400/10 rounded-lg">High Demand</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Outside Temp</span>
                  <span className="text-sm font-bold text-white tracking-tight">Extreme Cold</span>
                </div>
                <span className="text-blue-400 font-black text-xs px-2 py-1 bg-blue-400/10 rounded-lg">-12°C Tonight</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
                Aggregated telemetry indicates a <span className="text-indigo-400 font-bold">12% increase</span> in emergency no-heat calls over the next 4 hours based on temperature drop.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );

  const renderQueue = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Triage Queue</h2>
          <p className="text-gray-400 text-sm font-medium mt-1">Priority anomalies requiring high-precision diagnostic review</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition shadow-lg"
          >
            <ListFilter className="w-4 h-4" /> Advanced Filter
          </button>
        </div>
      </header>
      <div className="bg-[#0c0e14] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Intelligence Profile</th>
              <th className="px-8 py-6">Anomalous Reason</th>
              <th className="px-8 py-6">AI Projection</th>
              <th className="px-8 py-6">Reliability</th>
              <th className="px-8 py-6 text-right pr-12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {MOCK_TRIAGE_QUEUE.map(item => (
              <tr 
                key={item.id} 
                className="hover:bg-white/[0.03] transition cursor-pointer group" 
                onClick={() => setSelectedSystem(MOCK_SYSTEMS[0])}
              >
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.status === 'Open' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <p className="font-bold text-white group-hover:text-indigo-200 transition-colors">Corporate Account</p>
                    <p className="text-[10px] text-gray-500 font-mono tracking-wider">TORONTO_GTA_{item.id.toUpperCase()}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-gray-300 font-medium">{item.reason}</span>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.suggestedOutcome === 'Dispatch' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                      <span className="text-white font-bold text-xs uppercase tracking-wider">{item.suggestedOutcome}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-black ${item.healthScore < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{item.healthScore}%</span>
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.healthScore < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${item.healthScore}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right pr-12">
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors">Start Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-white tracking-tighter">Lead Intelligence Pipeline</h2>
        <p className="text-gray-400 text-sm font-medium mt-1">High-value replacement scenarios derived from real-time thermodynamic modeling</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_OPPORTUNITIES.map(opp => (
          <SpotlightCard 
            key={opp.id} 
            className="p-8 group bg-gradient-to-br from-[#0c0e14] to-[#08090d] border border-white/5"
            ariaLabel={`Opportunity for ${opp.customerName} at ${opp.address}. Estimated revenue ${opp.estRevenue}.`}
          >
             <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] mb-1">Health Metric</span>
                  <span className={`text-xl font-mono font-black ${opp.healthScore < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{opp.healthScore}%</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] mb-1">Projected Revenue</span>
                  <span className="text-2xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors">${opp.estRevenue.toLocaleString()}</span>
                </div>
             </div>
             
             <div className="mb-10">
               <h3 className="font-black text-xl text-white tracking-tight group-hover:text-indigo-200 transition-colors">{opp.customerName}</h3>
               <p className="text-sm text-gray-500 font-medium mt-1">{opp.address}</p>
             </div>

             <div className="grid grid-cols-2 gap-6 mb-10 pt-6 border-t border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Asset Age</span>
                  <span className="text-sm text-gray-300 font-bold">{opp.systemAge} Years</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Contract Status</span>
                  <span className="text-sm text-indigo-400 font-bold uppercase tracking-wider">{opp.contractStatus}</span>
                </div>
             </div>
             
             <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5" aria-label={`Initialize executive reachout to ${opp.customerName}`}>Initialize Outreach</button>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl animate-in fade-in duration-700 space-y-12">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-white tracking-tighter">System Intelligence Core</h2>
        <p className="text-gray-400 text-sm font-medium mt-1">Enterprise-grade hardware protocols and 3rd-party API orchestration</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SpotlightCard className="p-10 bg-[#0c0e14] border-white/5" ariaLabel="Hardware Synchronization Settings">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
             <div className="p-2.5 bg-indigo-500/10 rounded-2xl">
               <Wifi className="w-6 h-6 text-indigo-400" />
             </div>
             <h3 className="font-black text-white uppercase tracking-widest text-sm">IOT Hardware Protocol</h3>
          </div>
          <div className="space-y-4">
            {['Ecobee Professional', 'Google Nest Ent.', 'Honeywell Lyric'].map(v => (
              <div key={v} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                <span className="text-sm font-bold text-gray-300">{v}</span>
                <button className="text-[10px] font-black uppercase tracking-widest bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">OAuth Uplink</button>
              </div>
            ))}
          </div>
        </SpotlightCard>
        
        <SpotlightCard className="p-10 bg-[#0c0e14] border-white/5" ariaLabel="Field Service Management Integrations">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
             <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
               <Database className="w-6 h-6 text-emerald-400" />
             </div>
             <h3 className="font-black text-white uppercase tracking-widest text-sm">ERP / FSM Orchestration</h3>
          </div>
          <div className="space-y-4">
            {['ServiceTitan Pro', 'Jobber Enterprise', 'FieldEdge'].map(v => (
              <div key={v} className="flex justify-between items-center p-4 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                <span className="text-sm font-bold text-gray-300">{v}</span>
                <button className="text-[10px] font-black uppercase tracking-widest bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-xl border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all">API Handshake</button>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050608] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[10%] w-[40%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full"></div>
      </div>

      <nav className="sticky top-0 z-40 bg-[#050608]/80 backdrop-blur-2xl border-b border-white/5 h-20 flex items-center justify-between px-10" role="navigation" aria-label="Main navigation">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500" aria-hidden="true">At</div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tighter leading-tight text-white">AMBIENT TWIN</span>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-tight">Intelligence OS</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-widest">
             <button onClick={() => setCurrentView('dashboard')} className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${currentView === 'dashboard' ? 'bg-white/5 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`} aria-current={currentView === 'dashboard' ? 'page' : undefined}>Dashboard</button>
             <button onClick={() => setCurrentView('queue')} className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${currentView === 'queue' ? 'bg-white/5 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`} aria-current={currentView === 'queue' ? 'page' : undefined}>Queue</button>
             <button onClick={() => setCurrentView('opportunities')} className={`px-5 py-2.5 rounded-xl transition-all duration-300 ${currentView === 'opportunities' ? 'bg-white/5 text-white shadow-inner' : 'text-gray-500 hover:text-gray-300'}`} aria-current={currentView === 'opportunities' ? 'page' : undefined}>Pipeline</button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-white/[0.03] border border-white/5 px-4 py-2 rounded-2xl">
             <Search className="w-4 h-4 text-gray-500 mr-3" />
             <input type="text" placeholder="Global Search..." className="bg-transparent text-xs font-bold text-gray-300 outline-none w-48 placeholder:text-gray-700 uppercase tracking-widest" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentView('settings')} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5 group" aria-label="Settings"><Settings className="w-5 h-5 text-gray-500 group-hover:text-white" /></button>
            <button className="p-3 hover:bg-white/5 rounded-2xl relative transition-all border border-transparent hover:border-white/5 group" aria-label="Notifications, 1 unread"><Bell className="w-5 h-5 text-gray-500 group-hover:text-white" /><span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050608]" aria-hidden="true"></span></button>
          </div>
        </div>
      </nav>

      <main className="p-10 max-w-[1600px] mx-auto pb-24">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'queue' && renderQueue()}
        {currentView === 'opportunities' && renderOpportunities()}
        {currentView === 'settings' && renderSettings()}
      </main>

      {selectedSystem && (
        <SystemDetailModal system={selectedSystem} onClose={() => setSelectedSystem(null)} onGenerateReport={() => setShowCertificate(true)} />
      )}
      {showCertificate && selectedSystem && <HomeHealthCertificate system={selectedSystem} onClose={() => setShowCertificate(false)} />}
    </div>
  );
};

export default App;