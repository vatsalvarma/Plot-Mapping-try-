import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { FilterStatus } from '../types';
import { cn } from '../lib/utils';
import { Filter, CircleDot, CheckCircle2, Ban, Map } from 'lucide-react';

interface HUDProps {
  activeFilter: FilterStatus;
  setActiveFilter: (status: FilterStatus) => void;
}

// Ultra-premium staggered text with color pop
const PremiumText = ({ text, delay = 0, isActive }: { text: string, delay?: number, isActive: boolean }) => {
  return (
    <span className="flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(10px)', y: -20, scale: 0.2, rotateX: 90 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.6, delay: delay + (i * 0.04), type: 'spring', bounce: 0.6 }}
          className={cn("inline-block transition-all duration-500", isActive ? 'text-white' : '')}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

export function HUD({ activeFilter, setActiveFilter }: HUDProps) {
  const filters: { id: FilterStatus; label: string; icon: any; color: string; glow: string }[] = [
    { id: 'NONE', label: 'ALL PLOTS', icon: Map, color: 'text-white', glow: 'rgba(255,255,255,0.7)' },
    { id: 'ALL', label: 'STATUS', icon: Filter, color: 'text-white', glow: 'rgba(255,255,255,0.7)' },
    { id: 'AVAILABLE', label: 'AVAILABLE', icon: CheckCircle2, color: 'text-success', glow: 'rgba(74,222,128,0.9)' },
    { id: 'BOOKED', label: 'BOOKED', icon: CircleDot, color: 'text-warning', glow: 'rgba(250,204,21,0.9)' },
    { id: 'SOLD', label: 'SOLD', icon: Ban, color: 'text-danger', glow: 'rgba(248,113,113,0.9)' },
  ];

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-auto perspective-1000">
      
      {/* Extreme Glassmorphic Container with Mouse Spotlight & Gradient Border */}
      <motion.div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        initial={{ y: 250, opacity: 0, scale: 0.3, rotateX: 60 }}
        animate={{ y: [0, -15, 0], opacity: 1, scale: 1, rotateX: [0, 4, 0], rotateY: [0, -3, 0] }}
        transition={{ 
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotateX: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.8 },
          scale: { duration: 1.2, type: "spring", bounce: 0.6 }
        }}
        className="group relative bg-black/40 backdrop-blur-[60px] rounded-full p-2.5 flex items-center gap-3 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] border border-white/5 transition-colors duration-700"
      >
        {/* Animated Rotating Gradient Border */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_50%,rgba(255,255,255,0)_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 mix-blend-overlay"></div>
        <div className="absolute inset-[1px] bg-black/40 rounded-full backdrop-blur-xl -z-10"></div>
        
        {/* Mouse Tracking Spotlight */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 mix-blend-overlay"
          style={{
            background: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.25), transparent 100%)`
          }}
        />

        {/* Animated ambient noise texture inside the glass */}
        <div className="absolute inset-0 bg-noise opacity-[0.1] mix-blend-overlay pointer-events-none rounded-full animate-noise z-0"></div>
        
        {filters.map((filter, index) => {
          const isActive = activeFilter === filter.id;
          
          return (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, scale: 0, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring", bounce: 0.7 }}
              whileHover={{ scale: 1.15, y: -6, rotateZ: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setActiveFilter(isActive ? 'NONE' : filter.id)}
              className={cn(
                'relative px-5 py-3 rounded-full flex items-center gap-2.5 text-xs font-extrabold tracking-[0.2em] transition-all duration-300 z-10 overflow-hidden',
                isActive ? filter.color : 'text-white/40 hover:text-white'
              )}
            >
              {/* Ripple Effect Background on Active */}
              {isActive && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 rounded-full bg-white/15 border border-white/30 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    boxShadow: [
                      `0 0 15px ${filter.glow}, inset 0 0 10px ${filter.glow}`,
                      `0 0 35px ${filter.glow}, inset 0 0 20px ${filter.glow}`,
                      `0 0 15px ${filter.glow}, inset 0 0 10px ${filter.glow}`
                    ]
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    layout: { type: 'spring', bounce: 0.3, duration: 0.8 },
                    boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              )}
              
              <motion.span 
                className="relative z-10 flex items-center justify-center mix-blend-plus-lighter"
                initial={{ rotateY: 180, scale: 0, opacity: 0 }}
                animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring", bounce: 0.7 }}
                whileHover={{ rotateY: 180, scale: 1.2, transition: { duration: 0.4 } }}
              >
                <filter.icon size={16} className={cn("transition-all duration-500", isActive ? "scale-125 drop-shadow-[0_0_15px_currentColor]" : "group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]")} />
              </motion.span>
              
              <span className="relative z-10 flex items-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                <PremiumText text={filter.label} delay={0.7 + index * 0.1} isActive={isActive} />
              </span>

              {/* Click Ripple Pseudo Element */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 2, opacity: 0.2 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white rounded-full mix-blend-overlay pointer-events-none"
              />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
