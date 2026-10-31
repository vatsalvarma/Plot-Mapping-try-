import { motion } from 'framer-motion';
import type { FilterStatus, PlotData, PlotMap } from '../types';
import { cn } from '../lib/utils';

interface PlotOverlayProps {
  currentMap: PlotMap;
  activeFilter: FilterStatus;
  selectedPlot: PlotData | null;
  onPlotClick: (plot: PlotData) => void;
  onPlotHover?: (plot: PlotData | null) => void;
}

const statusColors = {
  AVAILABLE: 'fill-success/35 stroke-success hover:fill-success/55',
  BOOKED: 'fill-warning/35 stroke-warning hover:fill-warning/55',
  SOLD: 'fill-danger/35 stroke-danger hover:fill-danger/55',
};

export function PlotOverlay({ currentMap, activeFilter, selectedPlot, onPlotClick, onPlotHover }: PlotOverlayProps) {
  const isSunsetValley = currentMap.id === 'sunset-valley';
  const defaultStrokeWidth = isSunsetValley ? 0.01 : 2;
  const hoverStrokeWidth = isSunsetValley ? 1.4 : 2.5;
  const selectedStrokeWidth = isSunsetValley ? [1.2, 2.2, 1.2] : [2.5, 4.5, 2.5];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
      <svg 
        viewBox={`0 0 ${currentMap.width} ${currentMap.height}`}
        className="w-full h-full pointer-events-auto"
        preserveAspectRatio={currentMap.enableMousePan ? "xMidYMid slice" : "none"}
      >
        {currentMap.plots.map((plot) => {
          const isSelected = selectedPlot?.id === plot.id;
          const isVisible = activeFilter === 'NONE' || activeFilter === 'ALL' || activeFilter === plot.status;
          
          if (!isVisible) return null;

          const colorClass = activeFilter === 'NONE' 
            ? 'stroke-white fill-white/10 hover:fill-white/30' 
            : statusColors[plot.status];

          return (
            <g key={`${plot.id}-${plot.points}`} className="group transition-all duration-300 cursor-pointer">
              <motion.polygon
                key={plot.points}
                onClick={() => onPlotClick(plot)}
                onPointerEnter={() => onPlotHover?.(plot)}
                onPointerLeave={() => onPlotHover?.(null)}
                points={plot.points}
                whileHover={{ 
                  filter: isSunsetValley
                    ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'
                    : 'drop-shadow(0 0 15px rgba(255,255,255,0.9))',
                  strokeWidth: hoverStrokeWidth
                }}
                animate={isSelected ? { 
                  strokeWidth: selectedStrokeWidth, 
                  opacity: [1, 0.8, 1], 
                  filter: [
                    'drop-shadow(0 0 15px rgba(255,255,255,0.8))', 
                    'drop-shadow(0 0 30px rgba(255,255,255,1))', 
                    'drop-shadow(0 0 15px rgba(255,255,255,0.8))'
                  ] 
                } : {
                  strokeWidth: defaultStrokeWidth,
                  opacity: 1,
                  filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))'
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  'transition-all duration-300',
                  colorClass,
                  isSelected ? 'stroke-white !fill-white/30' : ''
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
                className="fill-white font-display font-extrabold text-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none select-none"
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
