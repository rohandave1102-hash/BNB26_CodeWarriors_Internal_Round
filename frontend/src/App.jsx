import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      <main style={{ flex: 1 }}>
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

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        marginTop: 'auto'
      }}>
        ModelLedger Protocol • BitnBuild 2026 CodeWarriors • Cryptographic AI Provenance & EVM Trust System
      </footer>
    </div>
  );
}
