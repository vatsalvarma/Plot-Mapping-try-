
import { motion } from 'framer-motion';

export function Logo() {
  const brand = "PRIZMABRIXX".split("");
  
  return (
    <div className="absolute top-10 left-10 z-50 flex items-center gap-6 pointer-events-auto cursor-pointer group">
      {/* SVG Logo Write Animation */}
      <svg width="45" height="45" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          d="M 50 10 L 90 90 L 10 90 Z" 
          fill="none" 
          stroke="#D4AF37" 
          strokeWidth="2" 
        />
        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          d="M 50 30 L 75 85 L 25 85 Z" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="1" 
        />
        <motion.circle 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 200 }}
          cx="50" cy="65" r="5" fill="#D4AF37" 
          className="group-hover:fill-white transition-colors duration-500"
        />
      </svg>
      
      <div className="flex flex-col">
        {/* Blur Reveal Text Animation */}
        <div className="flex overflow-hidden">
          {brand.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: 1.5 + (i * 0.1), duration: 0.8 }}
              className="text-white font-display text-2xl font-bold tracking-[0.3em] drop-shadow-md"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        {/* Animated Divider */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 2.5, duration: 1, ease: "easeInOut" }}
          className="h-[1px] bg-white/20 mt-1 mb-1 relative overflow-hidden"
        >
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ delay: 3.5, duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="absolute top-0 left-0 w-1/3 h-full bg-accent/80"
          />
        </motion.div>
        
        {/* Typewriter / Slide-up Subtitle */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 3, duration: 0.8, type: "spring" }}
            className="text-accent text-[8px] font-bold tracking-[0.4em]"
          >
            PLOT MAPPING
          </motion.div>
        </div>
      </div>
    </div>
  );
}
