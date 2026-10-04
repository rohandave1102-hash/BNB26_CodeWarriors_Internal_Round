import { useState, useEffect } from 'react';
import { Shield, Activity, BookOpen, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ stats, onOpenSpecs, onOpenAuth, user, onSignOut }) {
  const [scrolled, setScrolled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await onSignOut?.();
    setSigningOut(false);
  };

  return (
    <nav
      className={`navbar${scrolled ? ' scrolled' : ''}`}
      style={{ zIndex: 500 }}
    >
      {/* ── Brand ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00f0ff 0%, #7c3aed 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 18px rgba(0,240,255,0.4)',
          flexShrink: 0,
        }}>
          <Shield size={18} color="#020208" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #f0f4ff 0%, rgba(0,240,255,0.9) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}>
            ModelLedger
          </div>
          <div style={{
            fontSize: '0.62rem',
            fontFamily: 'var(--font-mono)',
            color: 'rgba(0,240,255,0.5)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '1px',
          }}>
            Protocol v3
          </div>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Chain status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px',
          borderRadius: 'var(--r-pill)',
          background: 'rgba(0,0,0,0.3)',
          border: stats.isContractConnected
            ? '1px solid rgba(0,255,163,0.25)'
            : '1px solid rgba(255,51,102,0.25)',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)',
          color: stats.isContractConnected ? 'var(--neon-emerald)' : 'var(--neon-red)',
        }}>
          <span className={`status-dot ${stats.isContractConnected ? 'online' : 'offline'}`}
            style={{ width: '6px', height: '6px' }} />
          {stats.isContractConnected ? 'EVM Live' : 'Offline'}
        </div>

        {/* Docs button */}
        <button
          onClick={onOpenSpecs}
          className="btn btn-ghost"
          style={{
            padding: '7px 14px',
            fontSize: '0.78rem',
            borderRadius: 'var(--r-pill)',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <BookOpen size={14} />
          <span style={{ display: 'none', ['@media (min-width: 640px)']: { display: 'inline' } }}>
            Docs
          </span>
        </button>

        {/* Auth */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '6px 12px',
              borderRadius: 'var(--r-pill)',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.3)',
              fontSize: '0.78rem',
              color: '#c4b5fd',
            }}>
              <User size={13} />
              <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email?.split('@')[0] || 'user'}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="btn btn-icon"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn btn-primary"
            style={{ padding: '7px 18px', fontSize: '0.78rem', borderRadius: 'var(--r-pill)' }}
          >
            <LogIn size={14} />
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
