import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PlotMap } from '../types';

interface MapContainerProps {
  currentMap: PlotMap;
  children: React.ReactNode;
}

export function MapContainer({ currentMap, children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth panning (used only when enableMousePan is true)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Update map bounds when window resizes
  const [bounds, setBounds] = useState({ maxScrollX: 0, maxScrollY: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (mapRef.current && currentMap.enableMousePan) {
        setBounds({
          maxScrollX: mapRef.current.clientWidth - window.innerWidth,
          maxScrollY: mapRef.current.clientHeight - window.innerHeight,
        });
      } else {
        setBounds({ maxScrollX: 0, maxScrollY: 0 });
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [currentMap]);

  const xPan = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [0, -Math.max(0, bounds.maxScrollX)]);
  const yPan = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [0, -Math.max(0, bounds.maxScrollY)]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (currentMap.enableMousePan) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
  };

  return (
    <motion.div 
      key={currentMap.id}
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#090909] select-none"
      onMouseMove={handleMouseMove}
    >
      {currentMap.enableMousePan ? (
        /* Panoramic Panning Layout */
        <motion.div
          ref={mapRef}
          style={{ x: xPan, y: yPan }}
          className="absolute top-0 left-0 w-[3840px] h-[1080px]"
        >
          <img 
            src={`${import.meta.env.BASE_URL}${currentMap.image}`}
            alt={currentMap.name} 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          {children}
        </motion.div>
      ) : (
        /* Fullscreen Static Layout - No Mouse Movement */
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            <img 
              src={`${import.meta.env.BASE_URL}${currentMap.image}`}
              alt={currentMap.name} 
              className="w-full h-full object-fill pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            {children}
          </div>
        </div>
      )}
    </motion.div>
  );
}
