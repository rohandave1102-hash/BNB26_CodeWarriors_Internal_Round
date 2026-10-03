import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FloatingDock from './components/FloatingDock';
import CyberCursor from './components/CyberCursor';
import VerifyAudit from './components/VerifyAudit';
import RegisterGenesis from './components/RegisterGenesis';
import LogTransformation from './components/LogTransformation';
import AdversarialLab from './components/AdversarialLab';
import { getStats } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('verify');
  const [stats, setStats] = useState({
    totalArtifacts: 0,
    isContractConnected: false
  });

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      // Backend may be warming up
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Interactive Cyber Follower Cursor */}
      <CyberCursor />

      {/* Futuristic Background Ambient Glows */}
      <div style={{
        position: 'fixed',
        top: '-15%',
        left: '20%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        top: '40%',
        right: '-10%',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Classy Minimalist Navbar */}
      <Navbar stats={stats} />

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        position: 'relative',
        zIndex: 1,
        paddingBottom: '120px' // Space for floating dock
      }}>
        {activeTab === 'verify' && (
          <VerifyAudit onSwitchTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'register' && (
          <RegisterGenesis onRegistrationSuccess={fetchStats} />
        )}
        {activeTab === 'transform' && (
          <LogTransformation onTransformationSuccess={fetchStats} />
        )}
        {activeTab === 'adversarial' && (
          <AdversarialLab />
        )}
      </main>

      {/* Futuristic Floating Island Menu */}
      <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Subdued Protocol Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '28px 24px 130px 24px', // Extra bottom clearance for dock
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ModelLedger Protocol</span> • EVM-Anchored Autonomous AI Lineage Engine
          </div>
          <div style={{ fontSize: '0.72rem' }}>
            Multi-Tier Trust • Salted Keccak-256 Prompt Commitments • Perceptual pHash Integrity • BitnBuild 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
