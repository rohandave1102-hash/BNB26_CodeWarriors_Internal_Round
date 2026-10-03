import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, Zap, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
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
      color: 'var(--crimson)',
      description: 'An attacker secretly alters a single word in a verified AI contract ("Approved" -> "REJECTED").',
      expected: 'ModelLedger detects the single-bit difference through SHA-256 and blocks fraudulent execution.'
    },
    {
      id: 'FABRICATED_GENESIS',
      title: 'Fabricated Genesis / Prior Art Theft',
      tag: 'Duplicate Ownership',
      color: 'var(--amber)',
      description: 'An attacker downloads an authentic artist creation and attempts to re-mint a second Genesis block.',
      expected: 'Blockchain rejects duplicate registration with "Artifact hash already registered".'
    },
    {
      id: 'BROKEN_LINEAGE',
      title: 'Dangling Node / Broken Lineage Attack',
      tag: 'Chain Spoofing',
      color: 'var(--indigo)',
      description: 'An adversary claims their edited file originates from a fake non-existent parent hash.',
      expected: 'Protocol audits parent state on-chain, rejecting orphan lineage claims.'
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
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(239, 68, 68, 0.15)',
          color: 'var(--crimson)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <AlertOctagon size={14} />
          <span>HACKATHON ADVERSARIAL SANDBOX</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
          Adversarial Testing Lab
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>
          Simulate real-world attacks, spoofing attempts, and silent tampering to evaluate ModelLedger's cryptographic resilience.
        </p>
      </div>

      {/* Scenario Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {scenarios.map((s) => (
          <div
            key={s.id}
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `3px solid ${s.color}`
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: s.color,
                  letterSpacing: '0.04em'
                }}>
                  {s.tag}
                </span>
                <ShieldAlert size={18} color={s.color} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                {s.description}
              </p>
              <div style={{
                background: 'rgba(7, 9, 14, 0.6)',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                marginBottom: '20px'
              }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Expected Defense: </span>
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
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                background: s.color,
                color: '#07090e',
                fontWeight: 700,
                fontSize: '0.85rem',
                opacity: runningScenario ? 0.6 : 1
              }}
            >
              <Zap size={15} />
              {runningScenario === s.id ? 'Simulating Attack...' : 'Launch Attack Vector'}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          marginTop: '24px',
          padding: '14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--crimson)',
          fontSize: '0.88rem'
        }}>
          {error}
        </div>
      )}

      {/* Simulation Result Presentation */}
      {result && (
        <div className="glass-panel" style={{
          marginTop: '32px',
          padding: '28px',
          border: '1px solid var(--emerald)',
          background: 'rgba(16, 185, 129, 0.05)',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={24} color="#07090e" strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                Attack Vector Neutralized: {result.scenario}
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                ModelLedger Cryptographic Protocol Enforcement Live Audit
              </p>
            </div>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '18px', lineHeight: 1.5 }}>
            {result.description}
          </p>

          {/* Hashes comparison for Silent Tamper */}
          {result.originalHash && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              background: 'rgba(7, 9, 14, 0.8)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontWeight: 600, marginBottom: '4px' }}>
                  GENESIS REGISTERED HASH:
                </div>
                <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', wordBreak: 'break-all' }}>
                  {result.originalHash}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--crimson)', fontWeight: 600, marginBottom: '4px' }}>
                  TAMPERED ARTIFACT HASH:
                </div>
                <div className="mono-tag" style={{ color: 'var(--crimson)', fontSize: '0.78rem', wordBreak: 'break-all' }}>
                  {result.tamperedHash}
                </div>
              </div>
            </div>
          )}

          {/* Rejection notice */}
          {result.rejectionReason && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--crimson)',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <strong>EVM Transaction Reversion: </strong> {result.rejectionReason}
            </div>
          )}

          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: 'var(--emerald)',
            fontSize: '0.88rem',
            fontWeight: 600
          }}>
            🛡️ Protocol Conclusion: {result.conclusion}
          </div>
        </div>
      )}
    </div>
  );
}
