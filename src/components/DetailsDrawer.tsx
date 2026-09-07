import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlotData } from '../data/mockPlots';

interface DetailsDrawerProps {
  plot: PlotData | null;
  onClose: () => void;
}

export const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ plot, onClose }) => {
  return (
    <AnimatePresence>
      {plot && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="drawer-container"
        >
          <div className="drawer-content">
            {/* Header */}
            <div className="drawer-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className={`drawer-badge ${plot.status === 'AVAILABLE' ? 'badge-available' : plot.status === 'BOOKED' ? 'badge-booked' : 'badge-sold'}`}>
                    • {plot.status}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>PLOT {plot.number}</span>
                </div>
                <h2 className="drawer-title">Serene Acres, Plot {plot.number}</h2>
                <p className="drawer-subtitle">Hoskote Highway, Bangalore East</p>
              </div>
              <button
                onClick={onClose}
                className="drawer-close"
                aria-label="Close details"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Shape View */}
            <div className="shape-view">
              <div className="shape-badge">TAP TO ZOOM</div>
              
              <div className="shape-container">
                 <svg viewBox="0 0 200 200" className="shape-svg">
                   <polygon
                     points="40,40 160,30 180,140 30,160"
                     fill={plot.status === 'AVAILABLE' ? 'rgba(21,128,61,0.1)' : plot.status === 'BOOKED' ? 'rgba(180,83,9,0.1)' : 'rgba(185,28,28,0.1)'}
                     stroke={plot.status === 'AVAILABLE' ? '#22c55e' : plot.status === 'BOOKED' ? '#eab308' : '#ef4444'}
                     strokeWidth="2"
                   />
                   <text x="100" y="20" fontSize="10" fill="#666" textAnchor="middle">N {plot.dimensions.n}</text>
                   <text x="100" y="185" fontSize="10" fill="#666" textAnchor="middle">S {plot.dimensions.s}</text>
                   <text x="10" y="100" fontSize="10" fill="#666" textAnchor="middle" transform="rotate(-90 10,100)">W {plot.dimensions.w}</text>
                   <text x="190" y="100" fontSize="10" fill="#666" textAnchor="middle" transform="rotate(90 190,100)">E {plot.dimensions.e}</text>
                </svg>
              </div>
            </div>

            {/* Plot Area */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 className="drawer-section-title">PLOT AREA</h3>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span className="area-value">{plot.area.split(' ')[0]}</span>
                <span className="area-unit">{plot.area.split(' ')[1]}</span>
              </div>
              <div className="divider" />
              <div className="price-row">
                 <span className="price-label">Price</span>
                 <span className="price-value">{plot.price}</span>
              </div>
            </div>

            {/* Action */}
            <button onClick={onClose} className="action-btn">
              Back to map
              <svg className="action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <p className="drawer-footer-text">
              Area, facing, survey no., boundaries — in one scroll.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
