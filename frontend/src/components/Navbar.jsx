import React from 'react';
import { Shield, ExternalLink, Terminal, BookOpen, User, LogOut } from 'lucide-react';

export default function Navbar({ stats, onOpenSpecs, onOpenAuth, user, onSignOut }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      backgroundColor: 'rgba(5, 5, 14, 0.75)',
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
            background: 'linear-gradient(135deg, #00f0ff 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.45)',
            transform: 'perspective(600px) rotateX(8deg) rotateY(-8deg)'
          }}>
            <Shield size={23} color="#03030a" strokeWidth={2.5} />
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#00f0ff',
              boxShadow: '0 0 10px #00f0ff'
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
                Model<span style={{ color: 'var(--neon-cyan)' }}>Ledger</span>
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(0, 240, 255, 0.15)',
                color: 'var(--neon-cyan)',
                border: '1px solid rgba(0, 240, 255, 0.3)'
              }}>
                EVM + C2PA
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Autonomous AI Provenance & Steganographic Forensics
            </div>
          </div>
        </div>

        {/* Minimal Right Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Guide & Specs Button */}
          <button
            onClick={onOpenSpecs}
            className="btn-cyber"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '999px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: 'var(--neon-cyan)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <BookOpen size={14} />
            <span>📖 Guide & Specs</span>
          </button>

          {/* Swagger link */}
          <a
            href="http://localhost:5000/docs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Terminal size={14} color="var(--neon-purple)" />
            <span>API Docs</span>
            <ExternalLink size={12} />
          </a>

          {/* Live Node Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 16px',
            borderRadius: '9999px',
            background: 'rgba(12, 12, 24, 0.7)',
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
              {stats?.isContractConnected ? 'Hardhat EVM (31337)' : 'Resilient Cryptographic Mode'}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
            <span style={{ color: '#fff', fontWeight: 700 }}>
              {stats?.totalArtifacts || 0} Anchored
            </span>
          </div>

          {/* User Auth Profile Pill */}
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '5px 12px',
              borderRadius: '999px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.35)'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'var(--neon-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#03030a',
                fontWeight: 800,
                fontSize: '0.72rem'
              }}>
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                  {user.user_metadata?.full_name || user.email.split('@')[0]}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--neon-purple)' }}>
                  {user.role || 'Auditor'}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  marginLeft: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-cyber"
              style={{
                padding: '7px 16px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #00f0ff 0%, #8b5cf6 100%)',
                color: '#03030a',
                fontSize: '0.78rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <User size={14} />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
