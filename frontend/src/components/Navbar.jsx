import React from 'react';
import { Shield, CheckCircle2, AlertOctagon, Cpu, Database, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, stats }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Shield size={24} color="#07090e" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                Model<span style={{ color: 'var(--emerald)' }}>Ledger</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--emerald)',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}>
                EVM v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Cryptographic AI Provenance & Multi-System Trust Protocol
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '5px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'verify', label: 'Verify & Audit', icon: Shield },
            { id: 'register', label: 'Register Genesis', icon: Cpu },
            { id: 'transform', label: 'Log Transformation', icon: Database },
            { id: 'adversarial', label: 'Adversarial Lab', icon: AlertOctagon }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '9px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--emerald)' : 'transparent',
                  color: isActive ? '#07090e' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 0 16px rgba(16, 185, 129, 0.35)' : 'none'
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Network & Stats pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '9999px',
            background: 'rgba(13, 18, 29, 0.9)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: stats?.isContractConnected ? 'var(--emerald)' : 'var(--cyan)',
              boxShadow: `0 0 8px ${stats?.isContractConnected ? 'var(--emerald)' : 'var(--cyan)'}`
            }} />
            <span style={{ color: 'var(--text-muted)' }}>
              {stats?.isContractConnected ? 'Hardhat EVM (31337)' : 'Cryptographic Engine'}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
              {stats?.totalArtifacts || 0} Artifacts
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
