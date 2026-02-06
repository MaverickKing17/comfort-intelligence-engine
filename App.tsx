import React, { useState } from 'react';
import { MOCK_SYSTEMS, MOCK_TRIAGE_QUEUE, MOCK_OPPORTUNITIES } from './constants';
import { SpotlightCard } from './components/SpotlightCard';
import { RadialGauge } from './components/RadialGauge';
import { GTAClusterMap } from './components/GTAClusterMap';
import { SystemDetailModal } from './components/SystemDetailModal';
import { HomeHealthCertificate } from './components/HomeHealthCertificate';
import { KpiTile } from './components/KpiTile';
import { HVACSystem } from './types';
import { Search, Bell, Activity, Zap, ListFilter, Settings, Wifi, Database, ArrowUpRight, Book, Radio, LayoutGrid, Layers, Palette, Upload, Check, Globe } from 'lucide-react';

type View = 'dashboard' | 'queue' | 'opportunities' | 'settings' | 'branding';

interface BrandConfig {
  companyName: string;
  tagline: string;
  primaryColor: string;
  logoUrl: string | null;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedSystem, setSelectedSystem] = useState<HVACSystem | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  
  // White Label State
  const [brand, setBrand] = useState<BrandConfig>({
    companyName: 'AMBIENT TWIN',
    tagline: 'Intelligence OS',
    primaryColor: '#0ea5e9', // Sky 500
    logoUrl: null
  });

  const urgentLead = MOCK_SYSTEMS.find(s => s.insights.some(i => i.isUrgent));
  const healthySystem = MOCK_SYSTEMS.find(s => !s.insights.some(i => i.isUrgent));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrand(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KpiTile label="ACTIVE ALERTS" value="12" trend="+2 today" trendColor="text-rose-400" onClick={() => setCurrentView('queue')} />
        <KpiTile label="DRY RUNS PREVENTED" value="48" trend="85% SUCCESS" trendColor="text-emerald-400" />
        <KpiTile label="LEADS IDENTIFIED" value="15" trend="$42K PIPE" trendColor="text-emerald-400" onClick={() => setCurrentView('opportunities')} />
        <KpiTile label="REVENUE AT RISK" value="$24.5k" trend="CRITICAL ITEMS" trendColor="text-amber-400" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em]">Priority Intelligence</h2>
          <div className="h-px w-64 bg-slate-800"></div>
        </div>
        <button onClick={() => setCurrentView('opportunities')} className="text-[11px] text-sky-400 font-bold uppercase tracking-widest hover:text-sky-300 transition-colors">View All Leads</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SpotlightCard goldGlow={true} className="h-full flex flex-col" onClick={() => urgentLead && setSelectedSystem(urgentLead)}>
          <div className="p-8 flex flex-col h-full space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/10 rounded-md border border-amber-500/20">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">High-Margin Lead</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Est. Revenue</span>
                <span className="text-2xl font-black text-emerald-400 tracking-tighter">$8,500</span>
              </div>
            </div>

            <div className="py-8">
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{urgentLead?.address}</h3>
              <p className="text-sm text-slate-400 mt-2 font-medium">{urgentLead?.ownerName}</p>
            </div>

            <div className="mt-auto pt-10 flex justify-between items-end border-t border-slate-800/50">
              <div className="space-y-4">
                <button className="text-[11px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                  View Triage Detail &rarr;
                </button>
                <div className="bg-slate-950/50 border border-slate-800 px-3 py-1.5 rounded-md inline-block">
                  <span className="text-amber-500/80 text-[10px] font-bold uppercase tracking-widest">Rebate Qualified</span>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="h-full flex flex-col" onClick={() => healthySystem && setSelectedSystem(healthySystem)}>
          <div className="p-10 flex flex-col items-center justify-center text-center h-full space-y-10">
            <RadialGauge value={98} label="HEALTH" status={healthySystem?.metrics.heatingPower.status || 'Good'} size={140} />
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{healthySystem?.address}</h3>
              <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-[0.2em]">Stable Performance</p>
            </div>
          </div>
        </SpotlightCard>

        <div className="flex flex-col gap-8">
          <div className="h-[320px] rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative bg-slate-950">
            <GTAClusterMap />
            <div className="absolute top-4 right-4">
               <span className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/80 uppercase tracking-widest border border-slate-800 shadow-sm">Toronto Grid Live</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-xl">
            <div className="flex items-center justify-between">
               <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Market Pulse</h3>
               <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-slate-400">Grid Load</span>
                <span className="text-sm font-bold text-amber-500 tracking-tight">Peak Demand</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-slate-400">Outside Temp</span>
                <span className="text-sm font-bold text-sky-400 tracking-tight">-12°C Tonight</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBranding = () => (
    <div className="max-w-5xl animate-in slide-in-from-bottom-4 duration-500 space-y-12 pb-20">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold text-white tracking-tighter">White Label Onboarding</h2>
        <p className="text-slate-400 text-sm font-medium">Configure your HVAC enterprise identity across the platform</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Configuration Panel */}
        <div className="space-y-8">
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
                <Palette className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Brand Identity</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Company Name</label>
                <input 
                  type="text" 
                  value={brand.companyName}
                  onChange={(e) => setBrand(prev => ({ ...prev, companyName: e.target.value.toUpperCase() }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-bold outline-none focus:border-sky-500 transition-all uppercase tracking-wider"
                  placeholder="ENTER COMPANY NAME"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Platform Tagline</label>
                <input 
                  type="text" 
                  value={brand.tagline}
                  onChange={(e) => setBrand(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium outline-none focus:border-sky-500 transition-all"
                  placeholder="Intelligence OS"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Primary Color</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={brand.primaryColor}
                      onChange={(e) => setBrand(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-400 uppercase">{brand.primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Region Control</label>
                  <div className="flex items-center gap-2 h-12">
                    <Globe className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-300">Toronto/GTA Core</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Upload className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Logo Assets</h3>
            </div>
            
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center group-hover:border-sky-500/40 group-hover:bg-slate-950/40 transition-all flex flex-col items-center gap-4">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt="Logo Preview" className="h-16 object-contain" />
                ) : (
                  <Upload className="w-10 h-10 text-slate-700" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Upload Brand Logo</p>
                  <p className="text-xs text-slate-500">SVG or PNG Preferred (Max 2MB)</p>
                </div>
              </div>
            </div>
          </section>

          <button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-6 rounded-2xl uppercase tracking-[0.2em] shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-4">
            <Check className="w-5 h-5" /> Save Branding Protocol
          </button>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-8 sticky top-36 h-fit">
          <div className="flex items-center gap-4">
             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Identity Preview</h3>
             <div className="h-px flex-1 bg-slate-800"></div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-elevated overflow-hidden p-2">
             <div className="bg-slate-900/50 rounded-[2rem] h-[500px] flex flex-col overflow-hidden">
                {/* Mock Nav Bar */}
                <div className="h-16 border-b border-slate-800 flex items-center px-8 justify-between bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: brand.primaryColor }}>
                      {brand.logoUrl ? <img src={brand.logoUrl} className="w-5 h-5 object-contain" /> : brand.companyName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white tracking-tighter">{brand.companyName}</span>
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{brand.tagline}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-4 h-4 rounded-full bg-slate-800" />
                    <div className="w-4 h-4 rounded-full bg-slate-800" />
                  </div>
                </div>

                {/* Mock Body */}
                <div className="p-8 space-y-6">
                   <div className="h-4 w-32 bg-slate-800 rounded-full" />
                   <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 space-y-4">
                         <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center">
                            <div className="w-10 h-1 text-white rounded-full" style={{ backgroundColor: brand.primaryColor }} />
                         </div>
                         <div className="h-2 w-12 bg-slate-800 rounded-full" />
                      </div>
                      <div className="h-32 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3" style={{ borderLeft: `4px solid ${brand.primaryColor}` }}>
                         <div className="h-3 w-20 bg-slate-800 rounded-full" />
                         <div className="h-2 w-full bg-slate-800 rounded-full" />
                         <div className="h-2 w-2/3 bg-slate-800 rounded-full" />
                         <div className="mt-auto h-2 w-10 rounded-full" style={{ backgroundColor: brand.primaryColor }} />
                      </div>
                   </div>
                </div>

                <div className="mt-auto p-8 border-t border-slate-800 text-center">
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Powered by Ambient Twin Intelligence</p>
                </div>
             </div>
          </div>
          
          <p className="text-xs text-slate-500 text-center px-12 leading-relaxed italic">
            "Your brand identity will be applied to all customer-facing reports, dispatch notifications, and technician dashboards."
          </p>
        </div>
      </div>
    </div>
  );

  const renderQueue = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tighter">Triage Queue</h2>
          <p className="text-slate-400 text-sm font-medium mt-2">Priority anomalies requiring high-precision diagnostic review</p>
        </div>
        <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-4 transition-all shadow-lg shadow-sky-600/20">
          <ListFilter className="w-5 h-5" /> Advanced Filter
        </button>
      </header>
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              <th className="px-10 py-6">Status</th>
              <th className="px-10 py-6">Intelligence Profile</th>
              <th className="px-10 py-6">Anomalous Reason</th>
              <th className="px-10 py-6 text-right pr-14">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {MOCK_TRIAGE_QUEUE.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition cursor-pointer group" onClick={() => setSelectedSystem(MOCK_SYSTEMS[0])}>
                <td className="px-10 py-8">
                  <span className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    item.status === 'Open' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-white group-hover:text-sky-400 transition-colors">Corporate Account</p>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{item.id}</p>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-slate-200 font-medium">{item.reason}</span>
                </td>
                <td className="px-10 py-8 text-right pr-14">
                  <button className="text-[11px] font-bold uppercase tracking-widest text-sky-400 hover:text-white transition-colors">Start Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30 overflow-x-hidden flex flex-col">
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-900 h-24 flex items-center justify-between px-12 shadow-2xl shadow-black/50" role="navigation">
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-sky-600/30 group-hover:scale-105 transition-all overflow-hidden"
              style={{ backgroundColor: brand.primaryColor }}
            >
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                brand.companyName.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tighter leading-tight text-white">{brand.companyName}</span>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] leading-tight" style={{ color: brand.primaryColor }}>{brand.tagline}</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
             <button onClick={() => setCurrentView('dashboard')} className={`px-6 py-3 rounded-lg transition-all ${currentView === 'dashboard' ? 'bg-slate-900 text-white border border-slate-800 shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}>Dashboard</button>
             <button onClick={() => setCurrentView('queue')} className={`px-6 py-3 rounded-lg transition-all ${currentView === 'queue' ? 'bg-slate-900 text-white border border-slate-800 shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}>Triage Queue</button>
             <button onClick={() => setCurrentView('opportunities')} className={`px-6 py-3 rounded-lg transition-all ${currentView === 'opportunities' ? 'bg-slate-900 text-white border border-slate-800 shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}>Opportunities</button>
             <button onClick={() => setCurrentView('branding')} className={`px-6 py-3 rounded-lg transition-all ${currentView === 'branding' ? 'bg-slate-900 text-white border border-slate-800 shadow-xl' : 'text-slate-500 hover:text-slate-200'} flex items-center gap-2`}>
                <Palette className="w-3.5 h-3.5" /> White Label
             </button>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-xl focus-within:border-sky-500/50 transition-all">
             <Search className="w-5 h-5 text-slate-500 mr-4" />
             <input type="text" placeholder="GLOBAL SEARCH..." className="bg-transparent text-[11px] font-bold text-white outline-none w-64 placeholder:text-slate-700 uppercase tracking-widest" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('settings')} className="p-4 hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800 group text-slate-500 hover:text-white"><Settings className="w-6 h-6" /></button>
            <button className="p-4 hover:bg-slate-900 rounded-xl relative transition-all border border-transparent hover:border-slate-800 group text-slate-500 hover:text-white"><Bell className="w-6 h-6" /><span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse"></span></button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <main className="p-12 flex-1 mx-auto max-w-[1700px] pb-32 relative z-10">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'queue' && renderQueue()}
          {currentView === 'opportunities' && <div>Opportunity List View</div>}
          {currentView === 'settings' && <div>Settings View</div>}
          {currentView === 'branding' && renderBranding()}
        </main>

        <aside className="fixed right-6 bottom-1/4 z-50 flex flex-col gap-4">
           {[Book, Radio, LayoutGrid, Layers].map((Icon, idx) => (
             <button key={idx} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform">
               <Icon className="w-5 h-5" />
             </button>
           ))}
        </aside>
      </div>

      {selectedSystem && (
        <SystemDetailModal system={selectedSystem} onClose={() => setSelectedSystem(null)} onGenerateReport={() => setShowCertificate(true)} />
      )}
      {showCertificate && selectedSystem && <HomeHealthCertificate system={selectedSystem} onClose={() => setShowCertificate(false)} />}
    </div>
  );
};

export default App;