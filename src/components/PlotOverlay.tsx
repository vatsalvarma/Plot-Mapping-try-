
import { motion } from 'framer-motion';
import type { FilterStatus, PlotData } from '../types';
import { cn } from '../lib/utils';
import { PLOTS } from '../data/plots';

interface PlotOverlayProps {
  activeFilter: FilterStatus;
  selectedPlot: PlotData | null;
  onPlotClick: (plot: PlotData) => void;
  onPlotHover?: (plot: PlotData | null) => void;
}

const statusColors = {
  AVAILABLE: 'fill-success/40 stroke-success hover:fill-success/60',
  BOOKED: 'fill-warning/40 stroke-warning hover:fill-warning/60',
  SOLD: 'fill-danger/40 stroke-danger hover:fill-danger/60',
};

export function PlotOverlay({ activeFilter, selectedPlot, onPlotClick, onPlotHover }: PlotOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-[3840px] h-[1080px]">
      <svg 
        viewBox="0 0 3840 1080" 
        className="w-full h-full pointer-events-auto"
        preserveAspectRatio="xMidYMid slice"
      >
        {PLOTS.map((plot) => {
          const isSelected = selectedPlot?.id === plot.id;
          const isVisible = activeFilter === 'NONE' || activeFilter === 'ALL' || activeFilter === plot.status;
          
          if (!isVisible) return null;

          const colorClass = activeFilter === 'NONE' 
            ? 'stroke-white fill-white/5' 
            : statusColors[plot.status];

          return (
            <g key={plot.id} className="group transition-all duration-300">
              <motion.polygon
                onClick={() => onPlotClick(plot)}
                onPointerEnter={() => onPlotHover?.(plot)}
                onPointerLeave={() => onPlotHover?.(null)}
                points={plot.points}
                whileHover={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' }}
                animate={isSelected ? { 
                  strokeWidth: [4, 7, 4], 
                  opacity: [1, 0.7, 1], 
                  filter: ['drop-shadow(0 0 20px rgba(255,255,255,0.7))', 'drop-shadow(0 0 35px rgba(255,255,255,1))', 'drop-shadow(0 0 20px rgba(255,255,255,0.7))'] 
                } : {
                  strokeWidth: 3,
                  opacity: 1,
                  filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))'
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  'transition-all duration-500 hover:!fill-white/40',
                  colorClass,
                  isSelected ? 'stroke-white' : ''
                )}
                style={{
                  transformOrigin: `${plot.center.x}px ${plot.center.y}px`,
                }}
              />
              <motion.text
                x={plot.center.x}
                y={plot.center.y}
                textAnchor="middle"
                dominantBaseline="middle"
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                whileInView={{ opacity: 0, scale: 0.5, y: 10 }} 
                className="fill-white font-display font-bold text-2xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
              >
                {plot.number}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
