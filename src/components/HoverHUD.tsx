import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlotData } from '../types';
import { Compass, Box, Wallet, Ruler } from 'lucide-react';

interface HoverHUDProps {
  plot: PlotData | null;
}

const hudStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

const hudItem = {
  hidden: { opacity: 0, x: -60, scale: 0.8, rotateX: 20 },
  show: { opacity: 1, x: 0, scale: 1, rotateX: 0, transition: { type: 'spring' as const, damping: 18, stiffness: 200 } },
  exit: { opacity: 0, x: -40, scale: 0.9, transition: { duration: 0.3 } }
};

const CardWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <motion.div variants={hudItem} className="relative group perspective-1000">
    <div className={`bg-black/40 backdrop-blur-[60px] rounded-3xl px-5 py-3.5 border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:bg-black/50 ${className}`}>
      {/* Animated Rotating Gradient Border */}
      <div className="absolute inset-0 rounded-3xl bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 mix-blend-overlay"></div>
      <div className="absolute inset-[1px] bg-black/40 rounded-3xl backdrop-blur-xl -z-10"></div>
      
      {/* Ambient noise */}
      <div className="absolute inset-0 bg-noise opacity-[0.1] mix-blend-overlay pointer-events-none rounded-3xl animate-noise z-0"></div>
      
      <div className="relative z-10">{children}</div>
    </div>
  </motion.div>
);

export function HoverHUD({ plot }: HoverHUDProps) {
  return (
    <div className="absolute left-10 top-32 z-30 pointer-events-none flex flex-col gap-4">
      <AnimatePresence mode="wait">
        {plot && (
          <motion.div
            key="hover-hud"
            variants={hudStagger}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-2.5 w-[340px]"
          >
            {/* CARD 1: IDENTIFICATION & COORDINATES */}
            <CardWrapper>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/10 border border-white/10 group-hover:bg-accent/20 transition-all duration-500">
                    <Compass size={14} className="text-accent group-hover:rotate-180 transition-transform duration-700" />
                  </div>
                  <span className="text-[10px] text-white/50 tracking-[0.2em] font-extrabold uppercase">Coordinates</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[12px] text-white font-mono tracking-wider">12°58'{(plot.center.y / 10).toFixed(1)}"N</span>
                  <span className="text-[12px] text-white font-mono tracking-wider">77°35'{(plot.center.x / 10).toFixed(1)}"E</span>
                </div>
              </div>
            </CardWrapper>

            {/* CARD 2: AREA */}
            <CardWrapper>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/50 tracking-[0.2em] font-extrabold uppercase flex items-center gap-2">
                  <Box size={14} className="text-white/80"/> Area Sq.Ft
                </span>
                <span className="text-lg text-white font-display font-bold tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{plot.area}</span>
              </div>
            </CardWrapper>

            {/* CARD 3: DIMENSIONS (GRID) */}
            <CardWrapper>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 tracking-[0.2em] font-extrabold uppercase mb-2 flex items-center gap-2">
                  <Ruler size={14} className="text-white/80"/> Boundary Lines
                </span>
                <div className="grid grid-cols-4 gap-x-2">
                  <div className="flex flex-col items-center bg-white/5 rounded-xl py-1.5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-accent font-bold mb-0.5">N</span>
                    <span className="text-[12px] text-white font-mono">{plot.dimensions.n}</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/5 rounded-xl py-1.5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-accent font-bold mb-0.5">S</span>
                    <span className="text-[12px] text-white font-mono">{plot.dimensions.s}</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/5 rounded-xl py-1.5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-accent font-bold mb-0.5">E</span>
                    <span className="text-[12px] text-white font-mono">{plot.dimensions.e}</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/5 rounded-xl py-1.5 border border-white/5 group-hover:bg-white/10 transition-colors">
                    <span className="text-[10px] text-accent font-bold mb-0.5">W</span>
                    <span className="text-[12px] text-white font-mono">{plot.dimensions.w}</span>
                  </div>
                </div>
              </div>
            </CardWrapper>

            {/* CARD 4: FINANCIALS */}
            <CardWrapper className="border-success/30 shadow-[0_10px_30px_rgba(74,222,128,0.1)] group-hover:border-success/60">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-success/70 tracking-[0.2em] font-extrabold uppercase flex items-center gap-2">
                  <Wallet size={14} /> Market Value
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[18px] text-success font-display font-bold tracking-wider drop-shadow-[0_0_10px_rgba(74,222,128,0.6)]">
                    {plot.price}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-success/30 flex items-center justify-center bg-success/10 group-hover:bg-success/20 transition-colors duration-500">
                    <div className="w-2 h-2 bg-success rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </CardWrapper>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
