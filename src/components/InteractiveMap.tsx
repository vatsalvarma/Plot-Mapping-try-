import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import type { PlotData } from '../data/mockPlots';

interface InteractiveMapProps {
  plots: PlotData[];
  selectedPlot: PlotData | null;
  onSelectPlot: (plot: PlotData) => void;
  isStatusView: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  plots,
  selectedPlot,
  onSelectPlot,
  isStatusView
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const minScale = Math.max(windowSize.w / 4000, windowSize.h / 1000);
  
  // Spring configurations for smooth pan/zoom
  const x = useSpring(0, { damping: 50, stiffness: 400 });
  const y = useSpring(0, { damping: 50, stiffness: 400 });
  const scale = useSpring(minScale, { damping: 50, stiffness: 300 });

  useEffect(() => {
    // Force initial layout to fill screen perfectly
    x.set(0);
    y.set(0);
    scale.set(minScale);
  }, [windowSize]);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy], dragging }) => {
        setIsDragging(!!dragging);
        const currentScale = scale.get();
        const minX = windowSize.w - 4000 * currentScale;
        const minY = windowSize.h - 1000 * currentScale;
        
        x.set(Math.max(minX, Math.min(0, dx)));
        y.set(Math.max(minY, Math.min(0, dy)));
      },
      onPinch: ({ offset: [s], memo }) => {
        const newScale = Math.max(minScale, Math.min(s, 4));
        scale.set(newScale);
        
        const minX = windowSize.w - 4000 * newScale;
        const minY = windowSize.h - 1000 * newScale;
        x.set(Math.max(minX, Math.min(0, x.get())));
        y.set(Math.max(minY, Math.min(0, y.get())));
        
        return memo;
      },
      onWheel: ({ event, delta: [, dy] }) => {
        event.preventDefault();
        const currentScale = scale.get();
        const newScale = Math.max(minScale, Math.min(currentScale - dy * 0.01, 4));
        scale.set(newScale);
        
        const minX = windowSize.w - 4000 * newScale;
        const minY = windowSize.h - 1000 * newScale;
        x.set(Math.max(minX, Math.min(0, x.get())));
        y.set(Math.max(minY, Math.min(0, y.get())));
      }
    },
    {
      target: containerRef,
      drag: { 
        from: () => [x.get(), y.get()],
      },
      pinch: { scaleBounds: { min: minScale, max: 4 }, modifierKey: null },
      eventOptions: { passive: false }
    }
  );

  return (
    <div ref={containerRef} className="map-wrapper">
      <motion.div
        style={{ x, y, scale, originX: 0, originY: 0 }}
        className="map-image"
      >
        <img 
          src="/map.jpg" 
          alt="Real Estate Layout" 
          className="map-image"
          style={{ width: '4000px', height: '1000px', objectFit: 'cover' }}
          draggable={false}
        />

        <svg 
          viewBox="0 0 4000 1000" 
          className="map-svg"
          style={{ width: '4000px', height: '1000px' }}
        >
          {plots.map(plot => {
            const isSelected = selectedPlot?.id === plot.id;
            
            let fillColor = 'transparent';
            let strokeColor = 'rgba(255, 255, 255, 0.4)';
            let strokeWidth = '2';
            let strokeDasharray = 'none';

            if (isStatusView) {
              if (plot.status === 'AVAILABLE') {
                fillColor = 'rgba(74, 222, 128, 0.4)';
                strokeColor = 'rgba(74, 222, 128, 0.8)';
              } else if (plot.status === 'BOOKED') {
                fillColor = 'rgba(251, 191, 36, 0.4)';
                strokeColor = 'rgba(251, 191, 36, 0.8)';
              } else if (plot.status === 'SOLD') {
                fillColor = 'rgba(239, 68, 68, 0.4)';
                strokeColor = 'rgba(239, 68, 68, 0.8)';
              }
            } else {
              if (isSelected) {
                fillColor = 'rgba(255, 255, 255, 0.2)';
                strokeColor = 'rgba(255, 255, 255, 0.9)';
                strokeWidth = '3';
              }
            }

            if (isStatusView && isSelected) {
              strokeWidth = '4';
              strokeColor = '#ffffff';
              strokeDasharray = '4, 4';
            }

            return (
              <g key={plot.id} className="plot-group" onClick={(e) => {
                e.stopPropagation();
                if (!isDragging) onSelectPlot(plot);
              }}>
                <polygon
                  points={plot.points}
                  className="plot-polygon"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinejoin="round"
                />
                
                {(!isStatusView || isSelected) && (
                  <text
                    x={plot.center.x}
                    y={plot.center.y}
                    className="plot-text"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {plot.number}
                  </text>
                )}

                {!isSelected && (
                  <g className="plot-info-icon">
                     <circle cx={plot.center.x + 20} cy={plot.center.y - 15} r="8" fill="white" />
                     <text x={plot.center.x + 20} y={plot.center.y - 14} fontSize="10" fontWeight="bold" fill="#333" textAnchor="middle" dominantBaseline="middle">i</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>
      
      <div className="watermark">
         <div className="watermark-diamond" />
         <h1 className="watermark-text">LUMINEXA | PLOT MAPPING</h1>
      </div>
    </div>
  );
};
