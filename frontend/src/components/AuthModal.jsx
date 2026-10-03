import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles, Key, CheckCircle2 } from 'lucide-react';
import { signIn, signUp, demoLogin, isSupabaseConfigured } from '../services/supabase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Verified Platform Oracle');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      let user;
      if (tab === 'login') {
        user = await signIn(email, password);
      } else {
        user = await signUp(email, password, { full_name: fullName, role });
      }
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoRole) => {
    const user = demoLogin(demoRole);
    if (onAuthSuccess) onAuthSuccess(user);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      background: 'rgba(3, 3, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-3d" style={{
        width: '100%',
        maxWidth: '460px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(12, 12, 24, 0.95)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={16} color="#03030a" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                {tab === 'login' ? 'Auditor Authentication' : 'Create Ledger Identity'}
              </h3>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                {isSupabaseConfigured ? '⚡ Connected to Supabase Auth' : '⚡ Local Cryptographic Auth Engine'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              padding: '12px',
              background: tab === 'login' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--neon-cyan)' : '2px solid transparent',
              color: tab === 'login' ? 'var(--neon-cyan)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            style={{
              flex: 1,
              padding: '12px',
              background: tab === 'signup' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
              border: 'none',
              borderBottom: tab === 'signup' ? '2px solid var(--neon-cyan)' : '2px solid transparent',
              color: tab === 'signup' ? 'var(--neon-cyan)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Quick Demo Login Option */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              ⚡ 1-CLICK HACKATHON DEMO PROFILES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('Verified Platform Oracle')}
                className="btn-cyber"
                style={{
                  padding: '8px 6px',
                  borderRadius: '8px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  color: 'var(--neon-cyan)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Oracle
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Generative Artist')}
                className="btn-cyber"
                style={{
                  padding: '8px 6px',
                  borderRadius: '8px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: 'var(--neon-purple)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('Forensic Auditor')}
                className="btn-cyber"
                style={{
                  padding: '8px 6px',
                  borderRadius: '8px',
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  color: 'var(--neon-emerald)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Auditor
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>OR CREDENTIALS</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tab === 'signup' && (
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  placeholder="Dr. Evelyn Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(3, 3, 10, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="auditor@model-ledger.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(3, 3, 10, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(3, 3, 10, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            {errorMsg && (
              <div style={{ fontSize: '0.75rem', color: 'var(--neon-magenta)', marginTop: '4px' }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-cyber"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f0ff 0%, #8b5cf6 100%)',
                color: '#03030a',
                fontSize: '0.9rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              {isLoading ? 'Authenticating...' : tab === 'login' ? 'Sign In to Dashboard' : 'Register Identity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
