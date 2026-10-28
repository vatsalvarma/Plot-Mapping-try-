import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlotMap } from '../types';
import { Layers, ChevronDown, Check, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { ALL_MAPS } from '../data/plots';

interface PlotSwitcherProps {
  currentMap: PlotMap;
  onSelectMap: (map: PlotMap) => void;
}

export function PlotSwitcher({ currentMap, onSelectMap }: PlotSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="fixed top-10 right-10 z-50 pointer-events-auto">
      {/* Main Luxury Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative group flex items-center gap-3.5 px-4 py-2.5 rounded-2xl",
          "bg-black/60 backdrop-blur-2xl border border-white/15",
          "shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-300",
          isOpen ? "border-accent shadow-[0_0_25px_rgba(212,175,55,0.4)]" : "hover:border-white/30"
        )}
      >
        {/* Glow ambient background on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Small thumbnail preview of current map */}
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shadow-md shrink-0">
          <img 
            src={`${import.meta.env.BASE_URL}${currentMap.thumbnail}`}
            alt={currentMap.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text info */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-accent" />
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-accent uppercase">
              CHANGE PLOTS
            </span>
          </div>
          <span className="text-xs font-display font-bold text-white tracking-wide truncate max-w-[130px]">
            {currentMap.name}
          </span>
        </div>

        {/* Dropdown Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-1 text-white/60 group-hover:text-white"
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      {/* Floating Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 10, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full w-[340px] bg-black/80 backdrop-blur-3xl border border-white/15 rounded-3xl p-3 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            {/* Header info */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-accent" />
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-white/50 uppercase">
                  Available Layouts
                </span>
              </div>
              <span className="text-[10px] font-mono text-accent/80 bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                {ALL_MAPS.length} MAPS
              </span>
            </div>

            {/* List of Maps */}
            <div className="flex flex-col gap-2">
              {ALL_MAPS.map((map) => {
                const isActive = currentMap.id === map.id;

                return (
                  <motion.div
                    key={map.id}
                    onClick={() => {
                      onSelectMap(map);
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group relative flex items-center gap-3.5 p-2.5 rounded-2xl cursor-pointer transition-all duration-300",
                      isActive
                        ? "bg-white/15 border border-accent/60 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                        : "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    {/* Small image thumbnail from public folder */}
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-neutral-900">
                      <img
                        src={`${import.meta.env.BASE_URL}${map.thumbnail}`}
                        alt={map.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono font-bold text-white/90">
                        {map.plots.length}P
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-display font-bold text-white tracking-wide truncate group-hover:text-accent transition-colors">
                          {map.name}
                        </span>
                        {isActive && (
                          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-accent text-black shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-white/50 tracking-wide truncate mt-0.5">
                        {map.subtitle}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn(
                          "text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border",
                          isActive 
                            ? "bg-accent/20 text-accent border-accent/40" 
                            : "bg-white/5 text-white/60 border-white/10"
                        )}>
                          {map.badge}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
