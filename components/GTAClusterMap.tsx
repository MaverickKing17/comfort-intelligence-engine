import React, { useState, useRef } from 'react';
import { MapPin, Plus, Minus, Move, X, Activity, DollarSign, AlertTriangle } from 'lucide-react';

const CLUSTERS = [
  { 
    id: 'north-york', 
    name: 'North York Cluster', 
    count: 5, 
    color: 'text-amber-500', 
    bg: 'bg-amber-500',
    top: 20, 
    left: 45,
    stats: { critical: 2, revenue: '$8.2k', age: '12y' }
  },
  { 
    id: 'etobicoke', 
    name: 'Etobicoke Ind.', 
    count: 2, 
    color: 'text-green-500', 
    bg: 'bg-green-500',
    top: 40, 
    left: 25,
    stats: { critical: 0, revenue: '$1.5k', age: '4y' }
  },
  { 
    id: 'downtown', 
    name: 'Downtown Core', 
    count: 8, 
    color: 'text-red-500', 
    bg: 'bg-red-500',
    top: 65, 
    left: 50,
    stats: { critical: 5, revenue: '$14.5k', age: '15y' }
  },
  { 
    id: 'scarborough', 
    name: 'Scarborough Bluffs', 
    count: 3, 
    color: 'text-green-500', 
    bg: 'bg-green-500',
    top: 35, 
    left: 70,
    stats: { critical: 0, revenue: '$3.2k', age: '8y' }
  },
];

export const GTAClusterMap: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedCluster, setSelectedCluster] = useState<typeof CLUSTERS[0] | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if not clicking a cluster or control
    if ((e.target as HTMLElement).closest('.cluster-marker') || (e.target as HTMLElement).closest('.map-control')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
      // Simple zoom on wheel, check bound
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] bg-[#0c0c10] rounded-xl overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Map Content Layer */}
      <div 
        className="absolute inset-0 w-full h-full transition-transform duration-75"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Grid Background - scales with map */}
        <div className="absolute inset-[-100%] w-[300%] h-[300%]" 
             style={{
               backgroundImage: 'radial-gradient(#1f1f23 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               opacity: 0.5
             }} 
        />
        
        {/* Lake Ontario shape suggestion (Scaled) */}
        <div className="absolute bottom-[-20%] left-[-50%] right-[-50%] h-[40%] bg-blue-900/10 blur-[100px] rounded-[100%]"></div>

        {/* Clusters */}
        {CLUSTERS.map((cluster) => (
          <div 
            key={cluster.id}
            className="cluster-marker absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer hover:z-50"
            style={{ top: `${cluster.top}%`, left: `${cluster.left}%` }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCluster(cluster);
            }}
          >
            {/* Ripple Effect */}
            <div className={`absolute inset-0 rounded-full ${cluster.bg} opacity-20 animate-ping`}></div>
            
            {/* Marker */}
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0c0c10] border-2 ${cluster.color.replace('text-', 'border-')} shadow-[0_0_15px_currentColor] ${cluster.color} transition-transform hover:scale-125`}>
              <MapPin className="w-4 h-4 fill-current" />
            </div>

            {/* Label (Only visible on hover or low zoom if we wanted logic, keeping simple hover for now) */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur border border-gray-800 text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {cluster.name}
            </div>
          </div>
        ))}
      </div>

      {/* UI Overlay Layer (Static) */}
      
      {/* Title */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Move className="w-3 h-3" /> Live Grid
        </h3>
        <p className="text-xs text-gray-600">Pan & Zoom Enabled</p>
      </div>

      {/* Controls */}
      <div className="map-control absolute bottom-4 left-4 flex gap-2">
         <button onClick={() => handleZoom(-0.2)} className="bg-[#1f1f23] hover:bg-gray-800 text-white p-2 rounded-lg border border-gray-700 transition">
            <Minus className="w-4 h-4" />
         </button>
         <button onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="bg-[#1f1f23] hover:bg-gray-800 text-white px-3 rounded-lg border border-gray-700 text-xs font-mono transition">
            RESET
         </button>
         <button onClick={() => handleZoom(0.2)} className="bg-[#1f1f23] hover:bg-gray-800 text-white p-2 rounded-lg border border-gray-700 transition">
            <Plus className="w-4 h-4" />
         </button>
      </div>

      {/* Selected Cluster Info Card */}
      {selectedCluster && (
        <div className="map-control absolute top-4 right-4 w-64 bg-[#09090b]/95 backdrop-blur-md border border-[#1f1f23] rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-right-8 duration-200">
           <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className={`font-bold text-sm ${selectedCluster.color}`}>{selectedCluster.name}</h4>
                <p className="text-xs text-gray-500">{selectedCluster.count} Active Systems</p>
              </div>
              <button onClick={() => setSelectedCluster(null)} className="hover:bg-white/10 p-1 rounded-full transition">
                 <X className="w-4 h-4 text-gray-400" />
              </button>
           </div>
           
           <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                 <div className="flex items-center gap-2 text-xs text-gray-300">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span>Critical</span>
                 </div>
                 <span className="text-sm font-mono font-bold text-white">{selectedCluster.stats.critical}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                 <div className="flex items-center gap-2 text-xs text-gray-300">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    <span>Opportunity</span>
                 </div>
                 <span className="text-sm font-mono font-bold text-green-400">{selectedCluster.stats.revenue}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                 <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span>Avg Age</span>
                 </div>
                 <span className="text-sm font-mono font-bold text-white">{selectedCluster.stats.age}</span>
              </div>
           </div>

           <button className="w-full mt-3 bg-white text-black text-xs font-bold py-2 rounded hover:bg-gray-200 transition">
              Dispatch Technician
           </button>
        </div>
      )}
    </div>
  );
};