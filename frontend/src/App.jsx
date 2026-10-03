import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FloatingDock from './components/FloatingDock';
import CyberCursor from './components/CyberCursor';
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

  const [stats, setStats] = useState({
    totalArtifacts: 0,
    isContractConnected: false
  });

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      // Backend warming up
    }
  };

  const loadUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchStats();
    loadUser();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

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

      {/* Futuristic Background Ambient Glows & Holographic Meshes */}
      <div style={{
        position: 'fixed',
        top: '-15%',
        left: '20%',
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'floatOrbs 12s infinite ease-in-out'
      }} />
      <div style={{
        position: 'fixed',
        top: '35%',
        right: '-10%',
        width: '750px',
        height: '750px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'floatOrbs 15s infinite ease-in-out reverse'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '5%',
        left: '-10%',
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 255, 136, 0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'floatOrbs 18s infinite ease-in-out'
      }} />

      {/* Classy Minimalist Navbar */}
      <Navbar
        stats={stats}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        position: 'relative',
        zIndex: 1,
        paddingBottom: '120px' // Clearance for floating dock
      }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            onNavigate={(tab) => setActiveTab(tab)}
            user={user}
          />
        )}
        {activeTab === 'verify' && (
          <VerifyView onSwitchTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'originate' && (
          <OriginateView onRegistrationSuccess={fetchStats} />
        )}
        {activeTab === 'transform' && (
          <TransformView onTransformationSuccess={fetchStats} />
        )}
        {activeTab === 'watermark' && (
          <WatermarkView />
        )}
        {activeTab === 'adversarial' && (
          <SandboxView />
        )}
      </main>

      {/* Futuristic Floating Island Menu */}
      <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Specifications & Guide Modal */}
      <SpecsGuideModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsSpecsOpen(false);
        }}
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />

      {/* Subdued Protocol Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '28px 24px 130px 24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ModelLedger Protocol v2</span> • Python FastAPI & EVM Trust Engine
          </div>
          <div style={{ fontSize: '0.72rem' }}>
            Multi-Tier Trust • Salted Keccak-256 Commitments • LSB Steganography • IPFS CAS • C2PA Manifests • BitnBuild 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
