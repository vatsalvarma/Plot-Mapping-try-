import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MapContainerProps {
  children: React.ReactNode;
}

export function MapContainer({ children }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth panning
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse movement
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Convert mouse percentage (0-100) to translation percentage (-X% to +X%)
  // We have a 3840px map. Let's make it pan based on mouse position.
  // const x = useTransform(smoothX, [0, window.innerWidth], [0, -1920]); // Max width - viewport width
  // const y = useTransform(smoothY, [0, window.innerHeight], [-100, -300]); // slight vertical pan
  
  // Update map bounds when window resizes
  const [bounds, setBounds] = useState({ maxScrollX: 0, maxScrollY: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (mapRef.current) {
        setBounds({
          maxScrollX: mapRef.current.clientWidth - window.innerWidth,
          maxScrollY: mapRef.current.clientHeight - window.innerHeight,
        });
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const xPan = useTransform(smoothX, [0, window.innerWidth], [0, -Math.max(0, bounds.maxScrollX)]);
  const yPan = useTransform(smoothY, [0, window.innerHeight], [0, -Math.max(0, bounds.maxScrollY)]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <motion.div 
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#090909] active:cursor-grabbing"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        ref={mapRef}
        style={{ x: xPan, y: yPan }}
        className="absolute top-0 left-0 w-[3840px] h-[1080px]"
      >
        <motion.img 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          src={`${import.meta.env.BASE_URL}map-bg.png`}
          alt="Map Background" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" /> {/* Luxury darkening overlay */}
        {children}
      </motion.div>
    </motion.div>
  );
}
