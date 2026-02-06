import React, { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  onClick?: () => void;
  goldGlow?: boolean;
  ariaLabel?: string;
  opensModal?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({ 
  children, 
  className = "", 
  spotlightColor = "rgba(56, 189, 248, 0.12)",
  onClick,
  goldGlow = false,
  ariaLabel,
  opensModal = false
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const borderClass = goldGlow 
    ? "border-amber-500/60 shadow-[0_4px_30px_rgba(245,158,11,0.2)]" 
    : "border-slate-800 hover:border-sky-500/40 transition-all duration-300 shadow-xl";

  const isClickable = !!onClick;

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? "button" : "region"}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      aria-haspopup={opensModal ? "dialog" : undefined}
      className={`relative overflow-hidden bg-slate-900/90 backdrop-blur-xl rounded-3xl border ${borderClass} shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 ${isClickable ? 'cursor-pointer hover:shadow-sky-500/10' : ''} ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative h-full z-10">{children}</div>
    </div>
  );
};