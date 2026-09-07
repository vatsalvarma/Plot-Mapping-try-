import React from 'react';

export const HUD: React.FC = () => {
  return (
    <div className="ui-layer">
      
      {/* Top Navigation */}
      <div className="top-nav ui-interactive">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           {/* Logo Icon */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
           <span style={{ fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 'bold' }}>SurveilTrack</span>
        </div>
        
        <div className="nav-links">
          <div className="nav-link">BRIEF</div>
          <div className="nav-link active">UNIT MAP</div>
          <div className="nav-link">SETUP</div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            NEW YORK, USA
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
             2:30AM
          </span>
        </div>
      </div>

      {/* Filter Tabs below Top Nav */}
      <div style={{ position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)', display: 'flex', border: '1px solid var(--border-light)', background: 'var(--bg-panel)' }} className="ui-interactive">
         <div style={{ padding: '0.5rem 1rem', borderRight: '1px solid var(--border-light)', color: '#fff' }}>City</div>
         <div style={{ padding: '0.5rem 1rem', borderRight: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>District</div>
         <div style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)' }}>Street</div>
      </div>

      {/* Left Sidebar Icons */}
      <div style={{ position: 'absolute', left: 0, top: '50px', bottom: '0', width: '60px', borderRight: '1px solid var(--border-light)', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingTop: '2rem' }} className="ui-interactive">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>

      {/* Drone Details Card */}
      <div className="drone-card ui-interactive">
        <div className="drone-card-inner">
           <div className="drone-image-box">
              {/* Drone Wireframe Icon */}
              <svg width="120" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 4v4M8 6h8M6 8h12M4 10h16M12 10v6M9 16h6M8 18h8M7 20h10M6 10l-2 8M18 10l2 8"/>
              </svg>
              <button className="drone-details-btn">Details ↗</button>
           </div>
           
           <div className="drone-title">
             <div className="status-dot status-active" />
             <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)' }}>ACTIVE</span>
             AEC-4200-NYC
           </div>

           <div className="stat-row">
             <span className="stat-label">Power</span>
             <span>80% ||||||||--</span>
           </div>
           <div className="stat-row">
             <span className="stat-label">Session</span>
             <span>3HR 20MIN</span>
           </div>
           <div className="stat-row">
             <span className="stat-label">Signal</span>
             <span style={{ color: 'var(--accent-orange)' }}>MODERATE <div className="status-dot" style={{ display: 'inline-block', background: 'var(--accent-orange)' }}/></span>
           </div>

           <div style={{ display: 'flex', border: '1px solid var(--border-light)', marginTop: '1.5rem' }}>
             <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>PERFORMANCE</div>
             <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', color: 'var(--text-muted)' }}>HEALTH</div>
           </div>

           <div className="progress-bar-container">
             <div className="progress-bars">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`bar-segment ${i < 12 ? 'filled' : ''}`} />
                ))}
                <span style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>62%</span>
             </div>
             <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>PREPARING PERFORMANCE DETAILS...</div>
           </div>
        </div>
      </div>

      {/* Bottom Unit List */}
      <div className="bottom-bar ui-interactive" style={{ left: '60px' }}>
         <div className="bottom-tabs">
           <div className="bottom-tab active">Unit List</div>
           <div className="bottom-tab">Statistics</div>
           <div className="bottom-tab">Performances</div>
           <div className="bottom-tab">Overview</div>
           <div className="bottom-tab">Messages</div>
         </div>
         
         <div className="unit-list">
           <div className="unit-item" style={{ borderColor: 'rgba(255,255,255,0.5)' }}>
              <div className="status-dot status-active" /> AEC-4200-NYC <span style={{ marginLeft: 'auto' }}>↗</span>
           </div>
           <div className="unit-item">
              <div className="status-dot status-active" /> BAS-3100-NYC <span style={{ marginLeft: 'auto' }}>↗</span>
           </div>
           <div className="unit-item">
              <div className="status-dot status-inactive" /> ICD-500-NYC <span style={{ marginLeft: 'auto' }}>↗</span>
           </div>
           <div className="unit-item">
              <div className="status-dot" style={{ background: '#666' }} /> MME-9420-NYC <span style={{ marginLeft: 'auto' }}>↗</span>
           </div>
         </div>
      </div>

    </div>
  );
};
