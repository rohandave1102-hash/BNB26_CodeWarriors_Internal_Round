import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, Zap, CheckCircle2, XCircle, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { runAdversarialSimulation } from '../services/api';

export default function AdversarialLab() {
  const [runningScenario, setRunningScenario] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const scenarios = [
    {
      id: 'SILENT_TAMPER',
      title: 'Silent Content Tamper Attack',
      tag: 'Integrity Violation',
      color: 'var(--neon-crimson)',
      badge: 'SHA-256 Mismatch',
      description: 'An attacker secretly alters a single word or pixel in a verified AI document ("Approved" -> "REJECTED").',
      expected: 'ModelLedger detects the single-bit alteration, breaking the hash chain and failing verification.'
    },
    {
      id: 'FABRICATED_GENESIS',
      title: 'Fabricated Genesis / Prior Art Theft',
      tag: 'Double-Spending',
      color: 'var(--neon-amber)',
      badge: 'Duplicate Prevention',
      description: 'An attacker takes someone else\'s already-registered artwork and tries to claim original genesis credit under their own wallet.',
      expected: 'Smart contract rejects duplicate minting with "Artifact hash already registered".'
    },
    {
      id: 'BROKEN_LINEAGE',
      title: 'Dangling Node / Broken Lineage Attack',
      tag: 'Chain Spoofing',
      color: 'var(--neon-purple)',
      badge: 'Parent Verification',
      description: 'An adversary claims their modified file originates from a fake non-existent parent hash.',
      expected: 'Protocol audits parent existence on-chain, rejecting orphaned claims.'
    }
  ];

  const handleSimulate = async (scenarioId) => {
    setRunningScenario(scenarioId);
    setResult(null);
    setError(null);
    try {
      const data = await runAdversarialSimulation(scenarioId);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Simulation error');
    } finally {
      setRunningScenario(null);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 120px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--neon-crimson)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px',
          letterSpacing: '0.04em'
        }}>
          <AlertOctagon size={14} />
          ADVERSARIAL STRESS TEST LAB
        </div>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          color: '#fff'
        }}>
          Attack <span style={{ color: 'var(--neon-crimson)' }}>Sandbox</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          marginTop: '12px',
          fontSize: '1.05rem',
          maxWidth: '680px',
          margin: '12px auto 0'
        }}>
          Simulate real-world exploits, silent tampering, and copyright theft to witness ModelLedger's cryptographic defense in real time.
        </p>
      </div>

      {/* Scenario Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
        {scenarios.map((s) => (
          <div
            key={s.id}
            className="glass-3d"
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `3px solid ${s.color}`
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: s.color,
                  letterSpacing: '0.04em'
                }}>
                  {s.tag}
                </span>
                <span className="badge-futuristic" style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem'
                }}>
                  {s.badge}
                </span>
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                {s.description}
              </p>

              <div style={{
                background: 'rgba(7, 11, 20, 0.7)',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                marginBottom: '24px'
              }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Expected Defense: </span>
                {s.expected}
              </div>
            </div>

            <button
              onClick={() => handleSimulate(s.id)}
              disabled={runningScenario !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: s.color,
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.88rem',
                boxShadow: `0 0 20px ${s.color}44`,
                opacity: runningScenario ? 0.6 : 1
              }}
            >
              <Zap size={16} />
              {runningScenario === s.id ? 'Simulating Attack Vector...' : 'Launch Attack Vector'}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          marginTop: '24px',
          padding: '14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          color: 'var(--neon-crimson)',
          fontSize: '0.88rem'
        }}>
          {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="glass-3d" style={{
          marginTop: '36px',
          padding: '32px',
          border: '1px solid var(--neon-emerald)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(7, 11, 20, 0.9) 100%)',
          boxShadow: '0 0 45px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'var(--neon-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--neon-emerald-glow)'
            }}>
              <CheckCircle2 size={28} color="#030712" strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                Exploit Neutralized: {result.scenario}
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                ModelLedger Cryptographic Consensus & Lineage Check
              </p>
            </div>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
            {result.description}
          </p>

          {/* Hashes Comparison */}
          {result.originalHash && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '18px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neon-emerald)', fontWeight: 700, marginBottom: '6px' }}>
                  GENESIS REGISTERED HASH:
                </div>
                <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', wordBreak: 'break-all' }}>
                  {result.originalHash}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neon-crimson)', fontWeight: 700, marginBottom: '6px' }}>
                  TAMPERED ARTIFACT HASH:
                </div>
                <div className="mono-tag" style={{ color: 'var(--neon-crimson)', fontSize: '0.82rem', wordBreak: 'break-all' }}>
                  {result.tamperedHash}
                </div>
              </div>
            </div>
          )}

          {/* Rejection Details */}
          {result.rejectionReason && (
            <div style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: 'var(--neon-crimson)',
              fontSize: '0.85rem',
              marginBottom: '18px'
            }}>
              <strong>EVM Transaction Reversion: </strong> {result.rejectionReason}
            </div>
          )}

          <div style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: 'var(--neon-emerald)',
            fontSize: '0.9rem',
            fontWeight: 700
          }}>
            🛡️ Protocol Conclusion: {result.conclusion}
          </div>
        </div>
      )}
    </div>
  );
}
