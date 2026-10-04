import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FloatingDock from './components/FloatingDock';
import BlockchainBackground from './components/BlockchainBackground';
import DashboardView from './components/DashboardView';
import VerifyView from './components/VerifyView';
import OriginateView from './components/OriginateView';
import TransformView from './components/TransformView';
import WatermarkView from './components/WatermarkView';
import SandboxView from './components/SandboxView';
import SpecsGuideModal from './components/SpecsGuideModal';
import AuthModal from './components/AuthModal';
import { getStats } from './services/api';
import { getCurrentUser, signOut } from './services/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bgIntensity, setBgIntensity] = useState(1);

  const [stats, setStats] = useState({
    totalArtifacts: 0,
    isContractConnected: false,
  });

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch {
      /* Backend warming up */
    }
  };

  const loadUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      /* Offline fallback */
    }
  };

  useEffect(() => {
    fetchStats();
    loadUser();
    const interval = setInterval(fetchStats, 5000);

    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      // Dims from 1.0 down to 0.38 smoothly as user scrolls past the hero with slower, graceful curve
      const factor = Math.max(0.38, 1 - (scrollY / 1300) * 0.62);
      setBgIntensity(factor);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>

      {/* Layer 1: CGI Blockchain Background with Color-Shifting Cursor & Singularity */}
      <BlockchainBackground
        intensity={activeTab === 'dashboard' ? bgIntensity : 0.22}
        palette="violet-core"
        cursorEffects={activeTab === 'dashboard'}
      />

      {/* Layer 2: Fixed navbar */}
      <Navbar
        stats={stats}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Layer 3: Main content */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, paddingBottom: '120px' }}>
        {activeTab === 'dashboard'   && <DashboardView stats={stats} onNavigate={setActiveTab} user={user} />}
        {activeTab === 'verify'      && <VerifyView onSwitchTab={setActiveTab} />}
        {activeTab === 'originate'   && <OriginateView onRegistrationSuccess={fetchStats} />}
        {activeTab === 'transform'   && <TransformView onTransformationSuccess={fetchStats} />}
        {activeTab === 'watermark'   && <WatermarkView />}
        {activeTab === 'adversarial' && <SandboxView />}
      </main>

      {/* Layer 4: Floating island dock */}
      <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <SpecsGuideModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        onNavigate={(tab) => { setActiveTab(tab); setIsSpecsOpen(false); }}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '28px 24px 140px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.78rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>ModelLedger Protocol v3</span>
            {' '}·{' '}Python FastAPI · EVM Trust Engine · IPFS
          </div>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'rgba(0,240,255,0.25)', letterSpacing: '0.04em' }}>
            C2PA · LSB-Stego · Keccak-256 · ELA Forensics · BitnBuild 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
