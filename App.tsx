import React, { useState } from 'react';
import { MOCK_SYSTEMS, MOCK_TRIAGE_QUEUE, MOCK_OPPORTUNITIES } from './constants';
import { SpotlightCard } from './components/SpotlightCard';
import { RadialGauge } from './components/RadialGauge';
import { GTAClusterMap } from './components/GTAClusterMap';
import { SystemDetailModal } from './components/SystemDetailModal';
import { HomeHealthCertificate } from './components/HomeHealthCertificate';
import { KpiTile } from './components/KpiTile';
import { HVACSystem } from './types';
import { Search, Bell, Menu, Activity, Zap, LayoutDashboard, ListFilter, TrendingUp, Settings, Wifi, Database } from 'lucide-react';

type View = 'dashboard' | 'queue' | 'opportunities' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSystem, setSelectedSystem] = useState<HVACSystem | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const urgentLeads = MOCK_SYSTEMS.filter(s => s.insights.some(i => i.isUrgent));

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiTile 
          label="Active Alerts" 
          value="12" 
          trend="+2 today" 
          trendColor="text-red-400" 
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
          trend="Critical Items" 
          trendColor="text-amber-400" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           {urgentLeads.map(system => (
             <SpotlightCard 
               key={system.id} 
               goldGlow={true} 
               className="cursor-pointer" 
               onClick={() => setSelectedSystem(system)}
               ariaLabel={`High-margin lead for ${system.address}. Click to view triage detail.`}
               opensModal={true}
             >
               <div className="p-5 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2" aria-hidden="true">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-amber-400 text-[10px] font-bold uppercase">High-Margin Lead</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{system.address}</h3>
                  <p className="text-xs text-gray-500 mt-1">{system.ownerName}</p>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs text-amber-500 font-medium">View Triage Detail →</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded">Rebate Qualified</span>
                  </div>
               </div>
             </SpotlightCard>
           ))}
           {MOCK_SYSTEMS.filter(s => s.insights.length === 0 || !s.insights[0].isUrgent).map(system => (
              <SpotlightCard 
                key={system.id} 
                className="cursor-pointer" 
                onClick={() => setSelectedSystem(system)}
                ariaLabel={`Healthy system at ${system.address}. Click for live telemetry.`}
                opensModal={true}
              >
                <div className="p-5 flex flex-col items-center justify-center text-center">
                   <RadialGauge value={98} label="Health" status={system.metrics.heatingPower.status} size={80} />
                   <h3 className="font-semibold text-white mt-4">{system.address}</h3>
                   <p className="text-xs text-gray-500 mt-1">Healthy System</p>
                </div>
              </SpotlightCard>
           ))}
        </div>
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="h-64"><GTAClusterMap /></div>
          <SpotlightCard className="p-6" ariaLabel="Market Pulse: Grid and weather impact statistics for the Greater Toronto Area.">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Market Pulse</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Grid Load</span>
                <span className="text-amber-400">Peak Demand</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Outside Temp</span>
                <span className="text-blue-400">-12°C Tonight</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );

  const renderQueue = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Triage Queue</h2>
          <p className="text-gray-400 text-sm">Priority calls pending triage decisions</p>
        </div>
        <div className="flex gap-2">
          <button 
            className="bg-white/5 border border-border px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition"
            aria-label="Filter triage queue"
          >
            <ListFilter className="w-4 h-4" /> Filter
          </button>
        </div>
      </header>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/20 border-b border-border text-[10px] text-gray-500 uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Suggested Outcome</th>
              <th className="px-6 py-4">Health</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {MOCK_TRIAGE_QUEUE.map(item => (
              <tr 
                key={item.id} 
                className="hover:bg-white/5 transition cursor-pointer group" 
                onClick={() => setSelectedSystem(MOCK_SYSTEMS[0])}
                aria-label={`Triage call for ${item.reason}. Suggested outcome: ${item.suggestedOutcome}. Click to open triage.`}
              >
                <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">{item.status}</span></td>
                <td className="px-6 py-4"><p className="font-semibold text-white">System Customer</p><p className="text-xs text-gray-500">Toronto, ON</p></td>
                <td className="px-6 py-4 text-gray-300">{item.reason}</td>
                <td className="px-6 py-4"><span className="text-indigo-400 font-medium">{item.suggestedOutcome}</span></td>
                <td className="px-6 py-4"><span className={item.healthScore < 50 ? 'text-red-400' : 'text-green-400'}>{item.healthScore}%</span></td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-400 hover:underline" aria-label={`Open triage for ${item.id}`}>Open Triage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white">Lead Pipeline</h2>
        <p className="text-gray-400 text-sm">High-margin replacement and agreement leads</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_OPPORTUNITIES.map(opp => (
          <SpotlightCard 
            key={opp.id} 
            className="p-6"
            ariaLabel={`Opportunity for ${opp.customerName} at ${opp.address}. Estimated revenue ${opp.estRevenue}.`}
          >
             <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Score: {opp.healthScore}</span>
                <span className="text-lg font-mono font-bold text-white">${opp.estRevenue}</span>
             </div>
             <h3 className="font-bold text-lg">{opp.customerName}</h3>
             <p className="text-sm text-gray-400 mb-4">{opp.address}</p>
             <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs"><span className="text-gray-500">System Age</span><span className="text-white">{opp.systemAge}y</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Contract</span><span className="text-indigo-400">{opp.contractStatus}</span></div>
             </div>
             <button className="w-full bg-white text-black py-2 rounded font-bold text-xs hover:bg-gray-200 transition" aria-label={`Email quote to ${opp.customerName}`}>Email Quote</button>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl animate-in fade-in duration-500 space-y-8">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-white">Settings & Integrations</h2>
        <p className="text-gray-400 text-sm">Configure hardware and software connections</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpotlightCard className="p-6" ariaLabel="Hardware Synchronization Settings">
          <div className="flex items-center gap-3 mb-6"><Wifi className="w-5 h-5 text-indigo-400" /><h3 className="font-bold">Hardware Sync</h3></div>
          <div className="space-y-4">
            {['Ecobee', 'Nest', 'Honeywell'].map(v => (
              <div key={v} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-border">
                <span className="text-sm">{v}</span>
                <button className="text-xs bg-indigo-600 px-3 py-1 rounded font-bold hover:bg-indigo-500 transition" aria-label={`Connect ${v} via OAuth`}>Connect OAuth</button>
              </div>
            ))}
          </div>
        </SpotlightCard>
        
        <SpotlightCard className="p-6" ariaLabel="Field Service Management Integrations">
          <div className="flex items-center gap-3 mb-6"><Database className="w-5 h-5 text-emerald-400" /><h3 className="font-bold">FSM Integration</h3></div>
          <div className="space-y-4">
            {['ServiceTitan', 'Jobber', 'Housecall Pro'].map(v => (
              <div key={v} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-border">
                <span className="text-sm">{v}</span>
                <button className="text-xs bg-emerald-600 px-3 py-1 rounded font-bold hover:bg-emerald-500 transition" aria-label={`Configure API for ${v}`}>Configure API</button>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-gray-100 font-sans selection:bg-white/20">
      <nav className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-6" role="navigation" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold" aria-hidden="true">At</div>
            <span className="font-bold tracking-tight">Ambient Twin</span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
             <button onClick={() => setCurrentView('dashboard')} className={`px-3 py-1.5 rounded-lg transition ${currentView === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`} aria-current={currentView === 'dashboard' ? 'page' : undefined}>Dashboard</button>
             <button onClick={() => setCurrentView('queue')} className={`px-3 py-1.5 rounded-lg transition ${currentView === 'queue' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`} aria-current={currentView === 'queue' ? 'page' : undefined}>Triage Queue</button>
             <button onClick={() => setCurrentView('opportunities')} className={`px-3 py-1.5 rounded-lg transition ${currentView === 'opportunities' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`} aria-current={currentView === 'opportunities' ? 'page' : undefined}>Opportunities</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('settings')} className="p-2 hover:bg-white/5 rounded-full transition" aria-label="Settings"><Settings className="w-5 h-5 text-gray-500" /></button>
          <button className="p-2 hover:bg-white/5 rounded-full relative transition" aria-label="Notifications, 1 unread"><Bell className="w-5 h-5 text-gray-500" /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-bg" aria-hidden="true"></span></button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
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