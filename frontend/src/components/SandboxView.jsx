import React, { useState } from 'react';
import { Zap, ShieldAlert, ShieldCheck, Play, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';
import { simulateTamper, simulateDuplicate, simulateBrokenChain } from '../services/api';

export default function SandboxView() {
  const [selectedPlaybook, setSelectedPlaybook] = useState('tamper');
  const [targetHash, setTargetHash] = useState('0x9fa17b4c6e82d1a3f5b7c9e0d2a4f6b8c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0');
  const [isRunning, setIsRunning] = useState(false);
  const [attackResult, setAttackResult] = useState(null);

  const playbooks = [
    {
      id: 'tamper',
      title: 'Silent Bit-Flip / Deepfake Poisoning',
      desc: 'Adversary makes an imperceptible 1-bit modification to bypass copyright or verification.',
      defense: 'Avalanche Effect + Bitwise SHA-256 Digest Invariant',
      threatLevel: 'CRITICAL',
      color: 'var(--neon-crimson)'
    },
    {
      id: 'duplicate',
      title: 'Duplicate Genesis Claim (Attribution Theft)',
      desc: 'Adversary re-submits existing genesis asset to claim false ownership or copyright.',
      defense: 'EVM Block Timestamp Priority & Single-Mint Registration Lock',
      threatLevel: 'HIGH',
      color: 'var(--neon-amber)'
    },
    {
      id: 'broken-chain',
      title: 'Dangling Parent / Broken Merkle Chain',
      desc: 'Adversary attempts to link a fraudulent derivative to a non-existent parent hash.',
      defense: 'Merkle DAG Parent Invariant Enforcement',
      threatLevel: 'MEDIUM',
      color: 'var(--neon-cyan)'
    }
  ];

  const handleRunAttack = async () => {
    setIsRunning(true);
    setAttackResult(null);

    try {
      let res;
      if (selectedPlaybook === 'tamper') {
        res = await simulateTamper(targetHash);
      } else if (selectedPlaybook === 'duplicate') {
        res = await simulateDuplicate(targetHash);
      } else {
        res = await simulateBrokenChain(targetHash);
      }
      setAttackResult(res);
    } catch (err) {
      alert(err.message || 'Simulation execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--neon-crimson)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <Zap size={16} />
          CRYPTOGRAPHIC ADVERSARIAL SANDBOX
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          color: '#fff',
          marginBottom: '10px'
        }}>
          Attack Simulator & Stress Test
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem' }}>
          Evaluate ModelLedger's cryptographic and EVM defense invariants against real-world adversarial vectors: silent tampering, duplicate claims, and counterfeit parent lineage.
        </p>
      </div>

      {/* Playbook Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {playbooks.map((p) => {
          const isSelected = selectedPlaybook === p.id;
          return (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPlaybook(p.id);
                setAttackResult(null);
              }}
              className="glass-3d"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'rgba(244, 63, 94, 0.12)' : 'var(--bg-card)',
                border: isSelected ? '1px solid var(--neon-crimson)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 25px rgba(244, 63, 94, 0.25)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: `${p.color}22`,
                  color: p.color,
                  border: `1px solid ${p.color}44`
                }}>
                  {p.threatLevel}
                </span>
                {isSelected && <CheckCircle2 size={18} color="var(--neon-crimson)" />}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                {p.desc}
              </p>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Defense: <span style={{ color: '#fff', fontWeight: 600 }}>{p.defense}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target & Launch Card */}
      <div className="glass-3d" style={{
        padding: '32px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '32px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
            TARGET ASSET HASH (ATTACK VECTOR PAYLOAD)
          </label>
          <input
            type="text"
            value={targetHash}
            onChange={(e) => setTargetHash(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(3, 7, 18, 0.7)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--neon-crimson)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <button
          onClick={handleRunAttack}
          disabled={isRunning}
          className="btn-cyber"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(244, 63, 94, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <Play size={18} fill="#fff" />
          <span>{isRunning ? 'Simulating Adversarial Attack...' : 'Launch Exploit & Verify Defense Invariant'}</span>
        </button>
      </div>

      {/* Attack Result Display */}
      {attackResult && (
        <div className="glass-3d" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          border: '1px solid var(--neon-crimson)',
          boxShadow: '0 0 35px var(--neon-crimson-glow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <ShieldCheck size={28} color="var(--neon-emerald)" />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                Attack Successfully Neutralized
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Invariant Enforced: <span style={{ color: 'var(--neon-emerald)', fontWeight: 700 }}>{attackResult.defenseMechanism}</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '18px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(3, 7, 18, 0.6)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '20px'
          }}>
            {attackResult.explanation}
          </div>

          <div style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Terminal size={18} color="var(--neon-crimson)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--neon-crimson)', fontWeight: 700 }}>
              VERDICT: {attackResult.verdict}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
