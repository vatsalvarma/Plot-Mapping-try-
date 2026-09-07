import React from 'react';
import { motion } from 'framer-motion';

interface StatusToggleProps {
  isStatusView: boolean;
  onToggle: (view: boolean) => void;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({ isStatusView, onToggle }) => {
  return (
    <div className="status-toggle-container">
      {/* Primary Toggle */}
      <div className="toggle-switcher glass-panel">
        <button
          onClick={() => onToggle(true)}
          className={`toggle-btn ${isStatusView ? "active-status" : "inactive"}`}
        >
          {isStatusView && (
            <motion.div
              layoutId="toggle-bg"
              className="toggle-bg-status"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '2px', backgroundColor: 'currentColor' }} /> STATUS
          </span>
        </button>
        <button
          onClick={() => onToggle(false)}
          className={`toggle-btn ${!isStatusView ? "" : "inactive"}`}
        >
          {!isStatusView && (
            <motion.div
              layoutId="toggle-bg"
              className="toggle-bg-filters"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          FILTERS
        </button>
      </div>

      {/* Legend (Only visible in status view) */}
      <motion.div 
        initial={false}
        animate={{ 
          opacity: isStatusView ? 1 : 0, 
          y: isStatusView ? 0 : 10,
          pointerEvents: isStatusView ? 'auto' : 'none'
        }}
        className="legend-container"
      >
        {[
          { label: 'AVAILABLE', color: 'var(--status-available)' },
          { label: 'BOOKED', color: 'var(--status-booked)' },
          { label: 'SOLD', color: 'var(--status-sold)' }
        ].map(status => (
          <div key={status.label} className="legend-item glass-panel">
            <div className="legend-dot" style={{ backgroundColor: status.color }} />
            <span className="legend-text">{status.label}</span>
          </div>
        ))}
      </motion.div>
      
      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.025em', padding: '0 0.5rem' }}>
        Live status and landmarks of the layout.
      </div>
    </div>
  );
};
