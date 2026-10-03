import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, Copy, Check, Download, Lock, Key } from 'lucide-react';
import { registerArtifact } from '../services/api';

export default function RegisterGenesis({ onRegistrationSuccess }) {
  const [file, setFile] = useState(null);
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
      setFile(e.target.files[0]);
      setReceipt(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an artifact to register.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('aiModel', aiModel);
      formData.append('applicationName', applicationName);
      formData.append('creator', creator);
      formData.append('isOracleAttested', isOracleAttested);
      if (secretPrompt.trim()) {
        formData.append('secretPrompt', secretPrompt.trim());
      }

      const res = await registerArtifact(formData);
      setReceipt(res);
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
      type: "GENESIS_BIRTH_CERTIFICATE",
      fileHash: receipt.fileHash,
      perceptualHash: receipt.perceptualHash,
      promptCommitment: receipt.promptCommitment,
      salt: receipt.salt,
      aiModel,
      applicationName,
      issuedAt: new Date().toISOString(),
      blockchainTx: receipt.receipt?.transactionHash,
      status: receipt.receipt?.trustTier
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-ledger-cert-${receipt.fileHash.slice(0, 8)}.json`;
    a.click();
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '36px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
          Artifact Registration ("Birth Certificate")
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>
          Mint an immutable Genesis Root Block establishing original AI authorship and cryptographic provenance.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          {/* File Upload Zone */}
          <div
            className="dropzone"
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
            onClick={() => document.getElementById('genesis-file-input').click()}
          >
            <input
              id="genesis-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <UploadCloud size={40} color="var(--emerald)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {file ? file.name : 'Select or drop original AI artifact (PNG, JPG, PDF, TXT)'}
            </h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
              {file ? `${(file.size / 1024).toFixed(1)} KB ready for hashing` : 'Never leaves client buffer unprotected'}
            </p>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Origin AI Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(7, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  padding: '10px 14px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="DALL-E 3">DALL-E 3 (OpenAI)</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                <option value="Stable Diffusion XL">Stable Diffusion XL (Stability AI)</option>
                <option value="FLUX.1">FLUX.1</option>
                <option value="Whisper v3">Whisper v3 (Audio)</option>
                <option value="Suno v3">Suno v3 (Music)</option>
                <option value="Custom Pipeline">Custom Proprietary Model</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Application / Pipeline Origin
              </label>
              <input
                type="text"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
                placeholder="e.g. OpenAI API, Discord Bot"
                style={{
                  width: '100%',
                  background: 'rgba(7, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  padding: '10px 14px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {/* Privacy-Preserving Secret Prompt */}
          <div style={{
            padding: '16px',
            background: 'rgba(7, 9, 14, 0.5)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={15} color="var(--emerald)" />
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                Privacy-Preserving Prompt Commitment (Optional)
              </label>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
              Your secret prompt is never published in plaintext. ModelLedger computes an encrypted salt commitment (`keccak256(prompt + salt)`) on-chain so you can prove authorship later without leaking trade secrets.
            </p>
            <input
              type="text"
              placeholder="e.g. 'A futuristic hyper-detailed architectural schematic of an eco-city...'"
              value={secretPrompt}
              onChange={(e) => setSecretPrompt(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#fff',
                padding: '9px 12px',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Oracle attestation toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--emerald)" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  Platform Oracle Attestation
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Countersigns with authorized key to grant Tier 1 (Verified Trusted) status.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isOracleAttested}
              onChange={(e) => setIsOracleAttested(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--emerald)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: 'var(--emerald)',
              color: '#07090e',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Minting On-Chain Genesis Block...' : 'Register Genesis Artifact'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '20px',
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

        {/* Success Receipt */}
        {receipt && (
          <div style={{
            marginTop: '28px',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={24} color="var(--emerald)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  Genesis "Birth Certificate" Minted!
                </h3>
              </div>
              <span className="badge badge-verified">
                {receipt.receipt?.trustTier || 'VERIFIED_TRUSTED'}
              </span>
            </div>

            {/* Hash Display */}
            <div style={{
              background: 'rgba(7, 9, 14, 0.8)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Unique Cryptographic Hash ID:</span>
                <button
                  onClick={copyHash}
                  style={{
                    background: 'transparent',
                    color: 'var(--emerald)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Hash'}
                </button>
              </div>
              <div className="mono-tag" style={{ color: 'var(--text-main)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {receipt.fileHash}
              </div>
            </div>

            {/* Salted Prompt Info */}
            {receipt.promptCommitment && receipt.promptCommitment !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
              <div style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Key size={14} />
                  <span>Private Prompt Commitment Anchored On-Chain:</span>
                </div>
                <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', wordBreak: 'break-all', marginTop: '4px' }}>
                  Commitment: {receipt.promptCommitment}
                </div>
                {receipt.salt && (
                  <div className="mono-tag" style={{ color: 'var(--amber)', fontSize: '0.75rem', wordBreak: 'break-all', marginTop: '4px' }}>
                    Your Creator Salt: {receipt.salt} (Save this to prove ownership later)
                  </div>
                )}
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
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '10px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Download size={16} />
              Download Cryptographic Certificate (.json)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
