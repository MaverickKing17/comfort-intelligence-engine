import React from 'react';
import { MapPin } from 'lucide-react';

export const GTAClusterMap: React.FC = () => {
  // A stylized abstract representation of GTA clusters
  const clusters = [
    { name: 'North York', count: 5, color: 'text-amber-500', top: '20%', left: '45%' },
    { name: 'Etobicoke', count: 2, color: 'text-green-500', top: '40%', left: '25%' },
    { name: 'Downtown', count: 8, color: 'text-red-500', top: '65%', left: '50%' },
    { name: 'Scarborough', count: 3, color: 'text-green-500', top: '35%', left: '70%' },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] bg-[#0c0c10] rounded-xl overflow-hidden">
      {/* Abstract Map Background Grid */}
      <div className="absolute inset-0" 
           style={{
             backgroundImage: 'radial-gradient(#1f1f23 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }} 
      />
      
      {/* Lake Ontario shape suggestion */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-blue-900/10 blur-xl"></div>

      {clusters.map((cluster, idx) => (
        <div 
          key={idx}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ top: cluster.top, left: cluster.left }}
        >
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-opacity-20 backdrop-blur-sm ${cluster.color.replace('text-', 'bg-')} animate-pulse`}>
            <MapPin className={`w-5 h-5 ${cluster.color}`} />
          </div>
          {/* Tooltip on hover */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-800 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-xl pointer-events-none">
            <span className="font-bold text-white block">{cluster.name} Cluster</span>
            <span className="text-gray-400">{cluster.count} systems struggling</span>
          </div>
        </div>
      ))}
      
      <div className="absolute top-4 left-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Live GTA Activity</h3>
        <p className="text-xs text-gray-600">Real-time localized failures</p>
      </div>
    </div>
  );
};