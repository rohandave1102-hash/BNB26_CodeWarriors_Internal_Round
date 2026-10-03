import React, { useState } from 'react';
import { UploadCloud, ShieldCheck, AlertTriangle, XCircle, Search, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { verifyArtifact, verifyPromptCommitment } from '../services/api';
import VisualTimeline from './VisualTimeline';

export default function VerifyAudit({ onSwitchTab }) {
  const [file, setFile] = useState(null);
  const [hashInput, setHashInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  // Privacy prompt reveal test state
  const [revealedPrompt, setRevealedPrompt] = useState('');
  const [salt, setSalt] = useState('');
  const [promptCheckResult, setPromptCheckResult] = useState(null);
  const [promptLoading, setPromptLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAuditResult(null);
      setError(null);
    }
  };

  const handleAudit = async (e) => {
    e.preventDefault();
    setError(null);
    setAuditResult(null);
    setPromptCheckResult(null);

    if (!file && !hashInput.trim()) {
      setError('Please select a file to audit or paste an exact cryptographic hash.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        result = await verifyArtifact(formData);
      } else {
        result = await verifyArtifact(hashInput.trim());
      }
      setAuditResult(result);
    } catch (err) {
      setError(err.message || 'Verification audit encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPrompt = async () => {
    if (!auditResult?.record?.fileHash || !revealedPrompt || !salt) {
      return;
    }
    setPromptLoading(true);
    try {
      const res = await verifyPromptCommitment(auditResult.record.fileHash, revealedPrompt, salt);
      setPromptCheckResult(res);
    } catch (err) {
      setPromptCheckResult({ isMatch: false, message: err.message });
    } finally {
      setPromptLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 20px' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
          Artifact Verification & Tamper Detection
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>
          Cryptographically audit any digital asset against the immutable on-chain provenance ledger.
        </p>
      </div>

      {/* Upload & Audit Card */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleAudit}>
          <div
            className="dropzone"
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => document.getElementById('audit-file-input').click()}
          >
            <input
              id="audit-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <UploadCloud size={46} color="var(--emerald)" style={{ margin: '0 auto 14px' }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
              {file ? file.name : 'Drop artifact to audit (Image, PDF, Document, Audio)'}
            </h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '6px' }}>
              {file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'Drag and drop or click to browse'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              OR AUDIT BY HASH ID
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(7, 9, 14, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0 14px'
            }}>
              <Search size={18} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="0x..."
                value={hashInput}
                onChange={(e) => {
                  setHashInput(e.target.value);
                  setFile(null);
                }}
                className="mono-tag"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.88rem',
                  padding: '12px 0'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--emerald)',
                color: '#07090e',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '0 28px',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Auditing...' : 'Run Audit'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--crimson)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Audit Results Panel */}
        {auditResult && (
          <div style={{ marginTop: '28px' }}>
            {auditResult.isAuthentic ? (
              /* Verified / Authentic card */
              <div style={{
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                background: auditResult.status === 'VERIFIED_TRUSTED' 
                  ? 'rgba(16, 185, 129, 0.08)' 
                  : 'rgba(245, 158, 11, 0.08)',
                border: auditResult.status === 'VERIFIED_TRUSTED'
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(245, 158, 11, 0.4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: auditResult.status === 'VERIFIED_TRUSTED' ? 'var(--emerald)' : 'var(--amber)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShieldCheck size={28} color="#07090e" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                          Authentic Artifact Verified
                        </h3>
                        <span className={auditResult.status === 'VERIFIED_TRUSTED' ? 'badge badge-verified' : 'badge badge-self-asserted'}>
                          {auditResult.status === 'VERIFIED_TRUSTED' ? 'Tier 1: Verified Trusted' : 'Tier 2: Self-Asserted'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                        {auditResult.status === 'VERIFIED_TRUSTED'
                          ? 'Backed by verified platform oracle attestation and unbroken on-chain cryptographic chain.'
                          : 'Recorded on-chain by creator. Authentic hash chain, unverified platform oracle.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audit details grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(7, 9, 14, 0.6)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Origin Model</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginTop: '3px' }}>
                      {auditResult.record?.aiModel || 'Generic Generative AI'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Registration Stage</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginTop: '3px' }}>
                      {auditResult.record?.actionType} ({auditResult.record?.applicationName})
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Timestamp</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginTop: '3px' }}>
                      {new Date(auditResult.record?.timestamp * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Privacy Prompt Commitment Check Section */}
                {auditResult.record?.promptCommitment && auditResult.record?.promptCommitment !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                  <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Lock size={15} color="var(--cyan)" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                        Privacy-Preserving Prompt Commitment Verification
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
                      This artifact possesses an immutable on-chain prompt commitment. Reveal the original prompt and salt below to mathematically prove ownership without having revealed it publicly before.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Enter the secret prompt used during generation..."
                        value={revealedPrompt}
                        onChange={(e) => setRevealedPrompt(e.target.value)}
                        style={{
                          background: 'rgba(7, 9, 14, 0.8)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          color: '#fff',
                          padding: '8px 12px',
                          fontSize: '0.85rem'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Enter creator salt (0x...)"
                          value={salt}
                          onChange={(e) => setSalt(e.target.value)}
                          className="mono-tag"
                          style={{
                            flex: 1,
                            background: 'rgba(7, 9, 14, 0.8)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: '#fff',
                            padding: '8px 12px',
                            fontSize: '0.8rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPrompt}
                          disabled={promptLoading || !revealedPrompt || !salt}
                          style={{
                            background: 'var(--cyan)',
                            color: '#07090e',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            padding: '0 16px',
                            borderRadius: '6px'
                          }}
                        >
                          {promptLoading ? 'Checking...' : 'Verify Secret Prompt'}
                        </button>
                      </div>
                    </div>

                    {promptCheckResult && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        background: promptCheckResult.isMatch ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        border: `1px solid ${promptCheckResult.isMatch ? 'var(--emerald)' : 'var(--crimson)'}`,
                        color: promptCheckResult.isMatch ? 'var(--emerald)' : 'var(--crimson)',
                        fontSize: '0.82rem'
                      }}>
                        {promptCheckResult.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Render Visual Blockchain Lineage */}
                <VisualTimeline lineage={auditResult.lineage} />
              </div>
            ) : (
              /* Tampered / Fake Warning Card */
              <div style={{
                borderRadius: 'var(--radius-md)',
                padding: '28px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'var(--crimson)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <XCircle size={30} color="#fff" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--crimson)' }}>
                        Unverified or Tampered Content Detected
                      </h3>
                      <span className="badge badge-tampered">Tier 3: Tampered Alert</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px', lineHeight: 1.5 }}>
                      The cryptographic signature of this file does not match any registered genuine artifact or authorized transformation in the ledger.
                    </p>

                    <div style={{
                      marginTop: '18px',
                      padding: '14px',
                      background: 'rgba(7, 9, 14, 0.8)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Computed File Hash:</div>
                      <div className="mono-tag" style={{ color: 'var(--crimson)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                        {auditResult.fileHash}
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => onSwitchTab('register')}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        Register as New Genesis
                      </button>
                      <button
                        onClick={() => onSwitchTab('adversarial')}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: 'var(--crimson)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        Run Tamper Simulation Lab
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
