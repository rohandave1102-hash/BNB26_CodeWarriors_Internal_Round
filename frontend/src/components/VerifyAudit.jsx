import React, { useState } from 'react';
import { UploadCloud, ShieldCheck, AlertTriangle, XCircle, Search, Sparkles, Wand2, Eye, KeyRound, Check, Copy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { verifyArtifact, verifyPromptCommitment } from '../services/api';
import VisualTimeline from './VisualTimeline';

export default function VerifyAudit({ onSwitchTab }) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [hashInput, setHashInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  // Tamper Simulation states
  const [isSimulatedTampered, setIsSimulatedTampered] = useState(false);

  // Privacy prompt reveal
  const [revealedPrompt, setRevealedPrompt] = useState('');
  const [salt, setSalt] = useState('');
  const [promptCheckResult, setPromptCheckResult] = useState(null);
  const [promptLoading, setPromptLoading] = useState(false);

  // Quick Demo Samples for judges
  const demoSamples = [
    {
      title: 'Authentic DALL-E 3 Asset',
      badge: 'Genuine',
      type: 'genuine',
      desc: 'Registered original AI illustration with unbroken chain of custody.'
    },
    {
      title: 'Legitimate 4K Upscale',
      badge: 'Transformation',
      type: 'transformed',
      desc: 'Topaz Gigapixel super-resolution derivative linked to parent.'
    },
    {
      title: 'Doctored Legal Contract',
      badge: 'Tampered Attack',
      type: 'tampered',
      desc: 'Unauthorized modification where 1 crucial clause was altered.'
    }
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setIsSimulatedTampered(false);
      setAuditResult(null);
      setError(null);

      // Create preview if image
      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selected);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleAudit = async (e, customFile = null, forceTamper = false) => {
    if (e) e.preventDefault();
    setError(null);
    setAuditResult(null);
    setPromptCheckResult(null);

    const targetFile = customFile || file;

    if (!targetFile && !hashInput.trim()) {
      setError('Please select an asset to verify or select a quick demo sample below.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (targetFile) {
        let uploadBuffer = targetFile;
        // If simulating tamper, append a corrupting byte
        if (forceTamper) {
          uploadBuffer = new Blob([targetFile, new Uint8Array([0xde, 0xad, 0xbe, 0xef])], {
            type: targetFile.type
          });
        }

        const formData = new FormData();
        formData.append('file', uploadBuffer, targetFile.name || 'audit_artifact.png');
        result = await verifyArtifact(formData);
      } else {
        result = await verifyArtifact(hashInput.trim());
      }

      setAuditResult(result);

      if (result.isAuthentic) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#06b6d4', '#a855f7']
        });
      }
    } catch (err) {
      setError(err.message || 'Audit encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Tamper Injection
  const handleSimulateTamperToggle = () => {
    if (!file) return;
    const nextState = !isSimulatedTampered;
    setIsSimulatedTampered(nextState);
    handleAudit(null, file, nextState);
  };

  // Demo Sample quick-load
  const loadDemoSample = async (sample) => {
    setIsSimulatedTampered(sample.type === 'tampered');
    setHashInput('');

    if (sample.type === 'tampered') {
      // Simulate altered document
      const sampleBlob = new Blob(['CONFIDENTIAL CONTRACT CLAUSE 4.2: REJECTED BY COUNSEL'], { type: 'text/plain' });
      setFile(sampleBlob);
      setFilePreview(null);
      await handleAudit(null, sampleBlob, true);
    } else if (sample.type === 'transformed') {
      const sampleBlob = new Blob(['GENUINE_AI_ASSET_DEPLOYED_TO_PERSISTENT_NODE'], { type: 'text/plain' });
      setFile(sampleBlob);
      setFilePreview(null);
      await handleAudit(null, sampleBlob, false);
    } else {
      const sampleBlob = new Blob(['ORIGINAL_AI_ART_BYTES_SAMPLE_IMAGE_V1'], { type: 'text/plain' });
      setFile(sampleBlob);
      setFilePreview(null);
      await handleAudit(null, sampleBlob, false);
    }
  };

  const handleVerifyPrompt = async () => {
    if (!auditResult?.record?.fileHash || !revealedPrompt || !salt) return;
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
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 120px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: 'var(--neon-emerald)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px',
          letterSpacing: '0.04em'
        }}>
          <Sparkles size={14} />
          CRYPTOGRAPHIC INTEGRITY & AUDITING
        </div>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          color: '#fff'
        }}>
          Verify AI Artifact <span className="gradient-text-emerald">Provenance</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          marginTop: '12px',
          fontSize: '1.05rem',
          maxWidth: '680px',
          margin: '12px auto 0'
        }}>
          Drop any digital asset to instantly audit its genesis author, multi-model edit history, and verify that zero unauthorized modifications occurred.
        </p>
      </div>

      {/* Quick Demo Previews */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px',
        marginBottom: '28px'
      }}>
        {demoSamples.map((s, idx) => (
          <div
            key={idx}
            onClick={() => loadDemoSample(s)}
            className="glass-3d"
            style={{
              padding: '16px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{s.title}</span>
                <span className={`badge-futuristic ${s.type === 'tampered' ? 'badge-trust-tampered' : 'badge-trust-verified'}`}>
                  {s.badge}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                {s.desc}
              </p>
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Wand2 size={16} color="var(--neon-emerald)" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Glass Audit Card */}
      <div className="glass-3d" style={{ padding: '36px' }}>
        <form onSubmit={(e) => handleAudit(e, null, isSimulatedTampered)}>
          {/* Cyber Dropzone */}
          <div
            className="dropzone-cyber"
            onClick={() => document.getElementById('audit-file-input').click()}
          >
            <input
              id="audit-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {filePreview ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <img
                  src={filePreview}
                  alt="Preview"
                  style={{
                    maxHeight: '180px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                />
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud size={52} color="var(--neon-emerald)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                  {file ? file.name : 'Drop Asset to Verify Authenticity'}
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginTop: '6px' }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB ready for on-chain audit` : 'Images, PDFs, Audio, Video, or Text contracts'}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Simulation Tools (Solves the problem of manually editing hashes!) */}
          {file && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '18px',
              padding: '14px 20px',
              background: 'rgba(7, 11, 20, 0.8)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Flame size={18} color={isSimulatedTampered ? 'var(--neon-crimson)' : 'var(--neon-amber)'} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    Interactive Tamper Testing
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Test how ModelLedger reacts when an asset is secretly altered.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateTamperToggle}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  background: isSimulatedTampered ? 'var(--neon-crimson)' : 'rgba(255, 255, 255, 0.1)',
                  color: isSimulatedTampered ? '#fff' : 'var(--text-main)',
                  border: isSimulatedTampered ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: isSimulatedTampered ? '0 0 16px var(--neon-crimson-glow)' : 'none'
                }}
              >
                {isSimulatedTampered ? '⚡ Tamper Injected (Click to Restore)' : '⚡ Inject 1-Byte Silent Tamper'}
              </button>
            </div>
          )}

          {/* Search by Hash row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(7, 11, 20, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '0 16px'
            }}>
              <Search size={18} color="var(--text-dim)" />
              <input
                type="text"
                placeholder="Or paste an exact cryptographic hash ID (0x...)"
                value={hashInput}
                onChange={(e) => {
                  setHashInput(e.target.value);
                  setFile(null);
                  setFilePreview(null);
                }}
                className="mono-tag"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.88rem',
                  padding: '14px 0'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--neon-emerald)',
                color: '#030712',
                fontWeight: 800,
                fontSize: '0.92rem',
                padding: '0 32px',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 0 25px var(--neon-emerald-glow)',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Auditing Ledger...' : 'Verify Asset'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: 'var(--neon-crimson)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Audit Results Presentation */}
        {auditResult && (
          <div style={{ marginTop: '36px' }}>
            {auditResult.isAuthentic ? (
              /* Verified Trusted Card */
              <div style={{
                borderRadius: 'var(--radius-md)',
                padding: '32px',
                background: auditResult.status === 'VERIFIED_TRUSTED'
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)'
                  : 'rgba(245, 158, 11, 0.08)',
                border: auditResult.status === 'VERIFIED_TRUSTED'
                  ? '1px solid rgba(16, 185, 129, 0.45)'
                  : '1px solid rgba(245, 158, 11, 0.45)',
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: auditResult.status === 'VERIFIED_TRUSTED' ? 'var(--neon-emerald)' : 'var(--neon-amber)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px var(--neon-emerald-glow)'
                    }}>
                      <ShieldCheck size={32} color="#030712" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                          Verified Authentic Asset
                        </h3>
                        <span className={`badge-futuristic ${auditResult.status === 'VERIFIED_TRUSTED' ? 'badge-trust-verified' : 'badge-trust-self'}`}>
                          {auditResult.status === 'VERIFIED_TRUSTED' ? 'Tier 1: Oracle Verified' : 'Tier 2: Self-Asserted'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                        {auditResult.status === 'VERIFIED_TRUSTED'
                          ? 'This asset matches its genesis on-chain fingerprint and carries verified platform attestation.'
                          : 'Valid cryptographic lineage recorded by creator. Uncertified by platform oracle.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata Matrix */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginTop: '24px',
                  padding: '20px',
                  background: 'rgba(7, 11, 20, 0.7)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Origin Model</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                      {auditResult.record?.aiModel || 'Generative Model'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Stage Pipeline</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                      {auditResult.record?.actionType} ({auditResult.record?.applicationName})
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Recorded At</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                      {new Date(auditResult.record?.timestamp * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Privacy-Preserving Prompt Commitment Reveal */}
                {auditResult.record?.promptCommitment && auditResult.record?.promptCommitment !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                  <div style={{
                    marginTop: '24px',
                    padding: '20px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <KeyRound size={16} color="var(--neon-cyan)" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                        Privacy-Preserving Prompt Ownership Check
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                      Prove that you originated the secret prompt for this asset without ever having published it publicly.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Enter the secret prompt..."
                        value={revealedPrompt}
                        onChange={(e) => setRevealedPrompt(e.target.value)}
                        style={{
                          background: 'rgba(7, 11, 20, 0.85)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: '#fff',
                          padding: '10px 14px',
                          fontSize: '0.85rem'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Enter your creator salt (0x...)"
                          value={salt}
                          onChange={(e) => setSalt(e.target.value)}
                          className="mono-tag"
                          style={{
                            flex: 1,
                            background: 'rgba(7, 11, 20, 0.85)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            color: '#fff',
                            padding: '10px 14px',
                            fontSize: '0.82rem'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyPrompt}
                          disabled={promptLoading || !revealedPrompt || !salt}
                          style={{
                            background: 'var(--neon-cyan)',
                            color: '#030712',
                            fontWeight: 700,
                            padding: '0 20px',
                            borderRadius: '8px',
                            fontSize: '0.85rem'
                          }}
                        >
                          {promptLoading ? 'Evaluating...' : 'Confirm Ownership'}
                        </button>
                      </div>
                    </div>

                    {promptCheckResult && (
                      <div style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: promptCheckResult.isMatch ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        border: `1px solid ${promptCheckResult.isMatch ? 'var(--neon-emerald)' : 'var(--neon-crimson)'}`,
                        color: promptCheckResult.isMatch ? 'var(--neon-emerald)' : 'var(--neon-crimson)',
                        fontSize: '0.85rem'
                      }}>
                        {promptCheckResult.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Visual Lineage Timeline */}
                <VisualTimeline lineage={auditResult.lineage} />
              </div>
            ) : (
              /* Tampered Warning Presentation */
              <div style={{
                borderRadius: 'var(--radius-md)',
                padding: '36px',
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(244, 63, 94, 0.5)',
                boxShadow: '0 0 45px rgba(244, 63, 94, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--neon-crimson)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 25px var(--neon-crimson-glow)'
                  }}>
                    <XCircle size={32} color="#fff" strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--neon-crimson)' }}>
                        Tampered or Unregistered Asset Detected
                      </h3>
                      <span className="badge-futuristic badge-trust-tampered">Tier 3: Integrity Violation</span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px', lineHeight: 1.6 }}>
                      {isSimulatedTampered
                        ? 'Simulated tamper confirmed: The cryptographic fingerprint of this altered asset broke the SHA-256 hash chain, immediately failing verification.'
                        : 'The cryptographic signature of this file does not match any registered genuine artifact or authorized transformation in the ledger.'}
                    </p>

                    <div style={{
                      marginTop: '20px',
                      padding: '16px',
                      background: 'rgba(7, 11, 20, 0.85)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(244, 63, 94, 0.3)'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                        Calculated SHA-256 Hash Signature:
                      </div>
                      <div className="mono-tag" style={{ color: 'var(--neon-crimson)', fontSize: '0.88rem', wordBreak: 'break-all' }}>
                        {auditResult.fileHash}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', marginTop: '22px' }}>
                      <button
                        onClick={() => onSwitchTab('register')}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: 700
                        }}
                      >
                        Register as New Original
                      </button>
                      <button
                        onClick={() => onSwitchTab('adversarial')}
                        style={{
                          background: 'rgba(244, 63, 94, 0.25)',
                          color: '#fff',
                          border: '1px solid var(--neon-crimson)',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: 700
                        }}
                      >
                        Launch Attack Lab
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
