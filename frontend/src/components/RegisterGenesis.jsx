import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, Copy, Check, Download, Lock, Key, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerArtifact } from '../services/api';

export default function RegisterGenesis({ onRegistrationSuccess }) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [aiModel, setAiModel] = useState('Midjourney v6');
  const [applicationName, setApplicationName] = useState('Discord Midjourney Bot');
  const [creator, setCreator] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  const [isOracleAttested, setIsOracleAttested] = useState(true);
  const [secretPrompt, setSecretPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setReceipt(null);
      setError(null);

      if (selected.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(selected);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Quick 1-click sample for testing without picking files from disk
  const loadQuickSample = () => {
    const sampleBlob = new Blob(['CYBER_NEON_ORIGINAL_AI_ASSET_METROPOLIS_2026'], { type: 'text/plain' });
    setFile(sampleBlob);
    setFilePreview(null);
    setSecretPrompt('Cyberpunk neo-tokyo street in the rain with glowing holograms');
    setAiModel('FLUX.1');
    setApplicationName('Flux Pro Generation API');
    setReceipt(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an asset to register, or click "Load Demo Sample".');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file, file.name || 'original_asset.png');
      formData.append('aiModel', aiModel);
      formData.append('applicationName', applicationName);
      formData.append('creator', creator);
      formData.append('isOracleAttested', isOracleAttested);
      if (secretPrompt.trim()) {
        formData.append('secretPrompt', secretPrompt.trim());
      }

      const res = await registerArtifact(formData);
      setReceipt(res);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onRegistrationSuccess) onRegistrationSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyHash = () => {
    if (receipt?.fileHash) {
      navigator.clipboard.writeText(receipt.fileHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCertificate = () => {
    if (!receipt) return;
    const cert = {
      protocol: "ModelLedger AI Provenance Protocol",
      version: "1.0",
      certificateType: "GENESIS_BIRTH_CERTIFICATE",
      fileHash: receipt.fileHash,
      perceptualHash: receipt.perceptualHash,
      promptCommitment: receipt.promptCommitment,
      salt: receipt.salt,
      aiModel,
      applicationName,
      issuedAt: new Date().toISOString(),
      blockchainTx: receipt.receipt?.transactionHash,
      trustStatus: receipt.receipt?.trustTier
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ModelLedger-Certificate-${receipt.fileHash.slice(0, 8)}.json`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 120px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          color: 'var(--neon-cyan)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px',
          letterSpacing: '0.04em'
        }}>
          <Sparkles size={14} />
          ROOT BIRTH CERTIFICATE MINTER
        </div>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          color: '#fff'
        }}>
          Originate AI <span className="gradient-text-emerald">Asset</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          marginTop: '12px',
          fontSize: '1.05rem',
          maxWidth: '680px',
          margin: '12px auto 0'
        }}>
          Anchor an immutable Genesis block establishing origin, creator authorship, and cryptographic proof of existence.
        </p>
      </div>

      <div className="glass-3d" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit}>
          {/* Dropzone with preview */}
          <div
            className="dropzone-cyber"
            onClick={() => document.getElementById('genesis-file-input').click()}
            style={{ marginBottom: '24px' }}
          >
            <input
              id="genesis-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {filePreview ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <img
                  src={filePreview}
                  alt="Original Preview"
                  style={{
                    maxHeight: '180px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud size={48} color="var(--neon-cyan)" style={{ margin: '0 auto 14px' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  {file ? (file.name || 'Demo Sample Asset Loaded') : 'Select or Drop Original AI Creation'}
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '6px' }}>
                  Images, PDFs, Audio, Video, or Raw AI Output
                </p>
              </div>
            )}
          </div>

          {/* Quick Demo Sample Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={loadQuickSample}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: 'var(--neon-cyan)',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '999px'
              }}
            >
              <Sparkles size={13} />
              Load Ready-Made Sample
            </button>
          </div>

          {/* Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                Generative AI Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(7, 11, 20, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  padding: '12px 14px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="DALL-E 3">DALL-E 3 (OpenAI)</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                <option value="FLUX.1">FLUX.1 (Black Forest Labs)</option>
                <option value="Stable Diffusion 3">Stable Diffusion 3 (Stability AI)</option>
                <option value="Suno v3">Suno v3 (AI Music)</option>
                <option value="Whisper v3">Whisper v3 (Audio Transcription)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                Application / Generating Platform
              </label>
              <input
                type="text"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
                placeholder="e.g. OpenAI Web, Discord Bot, API Pipeline"
                style={{
                  width: '100%',
                  background: 'rgba(7, 11, 20, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  padding: '12px 14px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Privacy-Preserving Secret Prompt */}
          <div style={{
            padding: '18px',
            background: 'rgba(7, 11, 20, 0.65)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={15} color="var(--neon-emerald)" />
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                Zero-Knowledge Prompt Commitment (Optional)
              </label>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '12px', lineHeight: 1.5 }}>
              Your private prompt is never published in plaintext. ModelLedger computes a mathematical hash commitment (`keccak256(prompt + salt)`) on-chain so you can prove ownership anytime without leaking your secret prompt.
            </p>
            <input
              type="text"
              placeholder="e.g. 'A futuristic hyper-detailed architectural schematic of an eco-city...'"
              value={secretPrompt}
              onChange={(e) => setSecretPrompt(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#fff',
                padding: '11px 14px',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Oracle Attestation Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={22} color="var(--neon-emerald)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  Platform Oracle Attestation
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Countersigns with platform oracle key to grant Tier 1 (Verified Trusted) status.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isOracleAttested}
              onChange={(e) => setIsOracleAttested(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--neon-emerald)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--neon-emerald), var(--neon-cyan))',
              color: '#030712',
              fontWeight: 800,
              fontSize: '1.05rem',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 0 30px var(--neon-emerald-glow)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Minting On-Chain Birth Certificate...' : 'Originate Genesis Asset'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '20px',
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

        {/* Success Receipt Card */}
        {receipt && (
          <div style={{
            marginTop: '32px',
            padding: '28px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={26} color="var(--neon-emerald)" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                  Birth Certificate Minted On-Chain!
                </h3>
              </div>
              <span className="badge-futuristic badge-trust-verified">
                {receipt.receipt?.trustTier || 'VERIFIED_TRUSTED'}
              </span>
            </div>

            {/* Hash Box */}
            <div style={{
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Unique Cryptographic Fingerprint:</span>
                <button
                  onClick={copyHash}
                  style={{
                    background: 'transparent',
                    color: 'var(--neon-emerald)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied to Clipboard' : 'Copy Hash'}
                </button>
              </div>
              <div className="mono-tag" style={{ color: 'var(--text-main)', fontSize: '0.88rem', wordBreak: 'break-all' }}>
                {receipt.fileHash}
              </div>
            </div>

            {/* Prompt Salt */}
            {receipt.salt && (
              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)', fontSize: '0.85rem', fontWeight: 700 }}>
                  <Key size={15} />
                  <span>Private Creator Salt (Saved with Zero-Knowledge Commitment):</span>
                </div>
                <div className="mono-tag" style={{ color: 'var(--neon-amber)', fontSize: '0.8rem', wordBreak: 'break-all', marginTop: '6px' }}>
                  {receipt.salt}
                </div>
              </div>
            )}

            <button
              onClick={downloadCertificate}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontSize: '0.92rem',
                fontWeight: 700,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Download size={18} />
              Download Cryptographic Authenticity Passport (.json)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
