import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlotData } from '../types';
import { X, ArrowRight, Map, Compass, Trees, Box, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';

interface DetailsDrawerProps {
  plot: PlotData | null;
  onClose: () => void;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

const TypewriterText = ({ text, delay = 0, className = '' }: { text: string, delay?: number, className?: string }) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(4px)', x: -2 }}
          animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
          transition={{ duration: 0.3, delay: delay + (i * 0.03) }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const TypewriterParagraph = ({ text, delay = 0, className = '' }: { text: string, delay?: number, className?: string }) => {
  return (
    <p className={className}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(4px)', y: 2 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.4, delay: delay + (i * 0.06) }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

const getNormalizedPoints = (pointsString: string) => {
  const coords = pointsString.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });

  const minX = Math.min(...coords.map(c => c.x));
  const maxX = Math.max(...coords.map(c => c.x));
  const minY = Math.min(...coords.map(c => c.y));
  const maxY = Math.max(...coords.map(c => c.y));

  const width = maxX - minX;
  const height = maxY - minY;

  const scale = Math.min(80 / width, 80 / height);

  const offsetX = (100 - (width * scale)) / 2;
  const offsetY = (100 - (height * scale)) / 2;

  return coords.map(c => {
    const nx = (c.x - minX) * scale + offsetX;
    const ny = (c.y - minY) * scale + offsetY;
    return { nx, ny };
  });
};

export function DetailsDrawer({ plot, onClose }: DetailsDrawerProps) {
  
  const shapePoints = plot ? getNormalizedPoints(plot.points) : [];
  const polygonString = shapePoints.map(p => `${p.nx},${p.ny}`).join(' ');

  const [, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <AnimatePresence>
      {plot && (
        <>
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(2px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            initial={{ x: '100%', opacity: 0, rotateY: 5 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            exit={{ x: '100%', opacity: 0, rotateY: 5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[320px] bg-black border-l border-white/10 shadow-[-40px_0_80px_rgba(0,0,0,0.9)] z-50 flex flex-col overflow-hidden"
          >
            {/* Reflective Gloss Black Sheen / Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-70 pointer-events-none mix-blend-overlay z-0"></div>
            
            {/* Curved glass reflection line */}
            <div className="absolute -left-[50%] top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg] pointer-events-none z-0"></div>
            
            {/* Deep inner shadow for polished edge */}
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_1px_0_1px_rgba(255,255,255,0.1)] pointer-events-none z-0"></div>

            {/* Subtle ambient noise */}
            <div className="absolute inset-0 bg-noise opacity-[0.15] mix-blend-overlay pointer-events-none z-0"></div>
            {/* Animated glowing orb behind content */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1], 
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4" 
            />

            {/* Header Section */}
            <div className="p-5 pb-0 relative z-10 flex-shrink-0">
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 transition-all duration-300 group overflow-hidden"
              >
                <X size={14} className="text-white group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
              </button>

              <motion.div variants={staggerContainer} initial="hidden" animate="show" exit="exit">
                
                {/* Logo Draw Animation + Status Badge side by side */}
                <motion.div variants={itemAnim} className="flex items-center gap-3 mb-3">
                  <svg width="24" height="24" viewBox="0 0 100 100" className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                      d="M 50 15 L 85 85 L 15 85 Z" 
                      fill="none" 
                      stroke="#D4AF37" 
                      strokeWidth="4" 
                    />
                    <motion.circle 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
                      cx="50" cy="65" r="8" fill="#fff" 
                    />
                  </svg>

                  <div className={cn(
                    "px-2.5 py-1 rounded-full border text-[8px] font-bold tracking-[0.2em] flex items-center shadow-md backdrop-blur-sm cursor-default",
                    plot.status === 'AVAILABLE' ? 'border-success/50 text-success bg-success/10' :
                    plot.status === 'BOOKED' ? 'border-warning/50 text-warning bg-warning/10' :
                    'border-danger/50 text-danger bg-danger/10'
                  )}>
                    <motion.span 
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"
                    />
                    {plot.status}
                  </div>
                </motion.div>

                {/* Typewriter Title */}
                <motion.h2 variants={itemAnim} className="text-2xl font-display font-light text-white mb-1 leading-tight">
                  <TypewriterText text="Serene Acres" delay={0.4} /> <br/>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-accent/50 bg-[length:200%_auto] animate-gradient">
                    <TypewriterText text={`Plot ${plot.number}`} delay={1.0} />
                  </span>
                </motion.h2>
                <motion.p variants={itemAnim} className="text-white/60 font-medium text-[10px] flex items-center gap-1.5">
                  <Map size={12} className="text-accent" /> <TypewriterText text="Hoskote Highway, Bangalore" delay={1.2} />
                </motion.p>
              </motion.div>
            </div>

            {/* Content Section */}
            <motion.div 
              variants={staggerContainer} 
              initial="hidden" 
              animate="show" 
              exit="exit"
              className="p-5 pt-3 flex-1 flex flex-col gap-3 relative z-10 overflow-y-auto no-scrollbar"
            >
              {/* Dynamic Accurate Plot Shape View */}
              <motion.div variants={itemAnim} className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/50 rounded-2xl -z-10 blur-xl group-hover:blur-2xl transition-all duration-700" />
                
                {/* Extreme Deep Glassmorphism for the Map Box */}
                <div className="bg-black/40 backdrop-blur-[40px] rounded-2xl p-4 border border-white/20 relative overflow-hidden group-hover:border-white/30 transition-colors duration-500 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)]">
                  <div className="absolute inset-0 bg-noise opacity-[0.08] mix-blend-overlay pointer-events-none animate-noise" />
                  
                  <div className="h-28 flex items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                      <motion.polygon 
                        initial={{ pathLength: 0, fillOpacity: 0 }}
                        animate={{ pathLength: 1, fillOpacity: 0.2 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                        points={polygonString} 
                        className={cn(
                          "stroke-current stroke-[2px]",
                          plot.status === 'AVAILABLE' ? 'text-success fill-success' :
                          plot.status === 'BOOKED' ? 'text-warning fill-warning' : 'text-danger fill-danger'
                        )}
                        strokeLinejoin="round"
                      />
                      
                      {/* Dynamic corner nodes based on actual shape */}
                      {shapePoints.map((point, i) => (
                        <motion.circle 
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.8, 1] }}
                          transition={{ delay: 1.5 + (i * 0.1), duration: 2, repeat: Infinity }}
                          cx={point.nx} cy={point.ny} r="1.5" 
                          className="fill-white drop-shadow-[0_0_5px_rgba(255,255,255,1)]" 
                        />
                      ))}
                      
                      {/* Floating Compass Details around the box boundaries */}
                      <motion.text animate={{ y: [0, -0.5, 0] }} transition={{ duration: 3, repeat: Infinity }} x="50" y="-3" textAnchor="middle" className="text-[4px] fill-white/80 font-bold tracking-wider">N {plot.dimensions.n}</motion.text>
                      <motion.text animate={{ y: [0, 0.5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} x="50" y="103" textAnchor="middle" className="text-[4px] fill-white/80 font-bold tracking-wider">S {plot.dimensions.s}</motion.text>
                      <motion.text animate={{ x: [0, -0.5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} x="-2" y="50" textAnchor="end" dominantBaseline="middle" className="text-[4px] fill-white/80 font-bold tracking-wider">W {plot.dimensions.w}</motion.text>
                      <motion.text animate={{ x: [0, 0.5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} x="102" y="40" textAnchor="start" dominantBaseline="middle" className="text-[4px] fill-white/80 font-bold tracking-wider">E {plot.dimensions.e}</motion.text>
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Super Detailed Stats Grid */}
              <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                {[
                  { icon: Box, label: 'AREA', value: plot.area },
                  { icon: Wallet, label: 'PRICE', value: plot.price },
                  { icon: Trees, label: 'TOPOGRAPHY', value: 'Flat Terrain' },
                  { icon: Compass, label: 'FACING', value: 'East-North' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    variants={itemAnim}
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 transition-all duration-300 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]"
                  >
                    <div className="text-white/50 text-[8px] font-bold tracking-[0.2em] mb-1 flex items-center gap-1.5">
                      <stat.icon size={10} className="text-accent" /> <TypewriterText text={stat.label} delay={1.5 + (i * 0.1)} />
                    </div>
                    <div className="text-sm font-display font-medium text-white/90">
                      <TypewriterText text={stat.value} delay={1.8 + (i * 0.1)} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Plot Description */}
              <motion.div variants={itemAnim} className="bg-white/5 border border-white/5 rounded-xl p-4 flex-shrink-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <TypewriterParagraph 
                  text="Nestled in the most sought-after sector of the community, this premium east-facing plot offers stunning sunrise views and perfectly leveled terrain. It is fully zoned for residential development and ready for your architectural masterpiece." 
                  delay={2.0} 
                  className="text-white/60 text-[11px] leading-relaxed font-medium" 
                />
              </motion.div>

              {/* Action Button */}
              <motion.div variants={itemAnim} className="mt-auto pt-2 pb-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-white text-black font-bold text-[11px] uppercase tracking-wider hover:bg-accent hover:text-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Return to Overview
                    <ArrowRight className="group-hover:translate-x-1.5 transition-transform duration-500" size={14} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                </motion.button>
              </motion.div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
