import React from 'react';
import { Shield, ExternalLink, Terminal } from 'lucide-react';

export default function Navbar({ stats }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(3, 7, 18, 0.7)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 32px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.45)',
            transform: 'perspective(600px) rotateX(8deg) rotateY(-8deg)'
          }}>
            <Shield size={23} color="#030712" strokeWidth={2.5} />
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8'
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                fontFamily: 'var(--font-display)',
                color: '#fff'
              }}>
                Model<span style={{ color: 'var(--neon-emerald)' }}>Ledger</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--neon-emerald)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                v2 FASTAPI + EVM
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Decentralized AI Provenance, C2PA Credentials & Stegano Forensics
            </div>
          </div>
        </div>

        {/* Minimal Right Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Swagger link */}
          <a
            href="http://localhost:5000/docs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Terminal size={14} color="var(--neon-cyan)" />
            <span>FastAPI Docs</span>
            <ExternalLink size={12} />
          </a>

          {/* Live Node Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 16px',
            borderRadius: '9999px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.8rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: stats?.isContractConnected ? 'var(--neon-emerald)' : 'var(--neon-cyan)',
              boxShadow: `0 0 12px ${stats?.isContractConnected ? 'var(--neon-emerald)' : 'var(--neon-cyan)'}`
            }} />
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {stats?.isContractConnected ? 'Hardhat EVM (31337)' : 'Resilient Cryptographic Engine'}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>
              {stats?.totalArtifacts || 0} Anchored
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
