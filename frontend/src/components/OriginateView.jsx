import React, { useState } from 'react';
import { PlusCircle, Upload, Sparkles, Key, CheckCircle, Download, Database, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BorderGlow } from './cards';
import { registerGenesis } from '../services/api';

export default function OriginateView({ onRegistrationSuccess }) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [aiModel, setAiModel] = useState('Midjourney v6.1');
  const [applicationName, setApplicationName] = useState('Studio Neural Pipeline');
  const [prompt, setPrompt] = useState('');
  const [salt, setSalt] = useState('');
  const [isOracleAttested, setIsOracleAttested] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleQuickDemo = () => {
    // Generate sample image canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 400, 400);
    grad.addColorStop(0, '#030712');
    grad.addColorStop(0.5, '#065f46');
    grad.addColorStop(1, '#0e7490');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('ModelLedger Genesis #2026', 40, 200);

    canvas.toBlob((blob) => {
      const demoFile = new File([blob], 'genesis_cyber_specimen.png', { type: 'image/png' });
      setFile(demoFile);
      setFilePreview(URL.createObjectURL(blob));
    });

    setAiModel('Stable Diffusion 3.5 Large');
    setApplicationName('ComfyUI Enterprise Node');
    setPrompt('Cybernetic biometric android with internal neon optical circuits');
    setSalt('0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file or click Quick Fill Demo Sample.');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ai_model', aiModel);
      formData.append('application_name', applicationName);
      if (prompt) formData.append('prompt', prompt);
      if (salt) formData.append('salt', salt);
      formData.append('is_oracle_attested', isOracleAttested);

      const res = await registerGenesis(formData);
      setResult(res);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#a855f7']
      });

      if (onRegistrationSuccess) onRegistrationSuccess();
    } catch (err) {
      alert(err.message || 'Origination failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: 'var(--neon-cyan)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <PlusCircle size={16} />
          GENESIS ASSET REGISTRATION & C2PA MINTING
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          color: '#fff',
          marginBottom: '10px'
        }}>
          Originate AI Creation
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Anchor original generative outputs on-chain. Generates exact SHA-256 digests, perceptual pHash, zero-knowledge salted prompt commitments, IPFS CIDs, and C2PA Content Credentials.
        </p>

        {/* Quick Demo Button */}
        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="btn-cyber"
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--neon-emerald)',
              color: 'var(--neon-emerald)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} />
            <span>⚡ Quick Fill Demo Specimen</span>
          </button>
        </div>
      </div>

      <BorderGlow
        borderRadius={24}
        glowRadius={40}
        colors={['#00f0ff', '#10b981', '#7c3aed']}
        glowColor="190 90% 55%"
        style={{ marginBottom: '32px' }}
      >
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {/* Upload Dropzone */}
          <label className="dropzone-cyber" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 20px',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            background: 'rgba(3, 7, 18, 0.6)',
            cursor: 'pointer',
            marginBottom: '24px'
          }}>
            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,.pdf,.bin" />
            {filePreview ? (
              <div style={{ textAlign: 'center' }}>
                <img src={filePreview} alt="Preview" style={{ maxHeight: '160px', borderRadius: '12px', marginBottom: '10px', border: '1px solid var(--neon-cyan)', boxShadow: '0 0 20px rgba(0,240,255,0.3)' }} />
                <div style={{ color: '#fff', fontWeight: 600 }}>{file?.name}</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Upload size={32} color="var(--neon-cyan)" style={{ marginBottom: '10px' }} />
                <div style={{ color: '#fff', fontWeight: 700 }}>Click or drop file to originate</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Images, documents, or generative model outputs</div>
              </div>
            )}
          </label>

          {/* Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                GENERATIVE AI MODEL
              </label>
              <input
                type="text"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(3, 7, 18, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                APPLICATION / PIPELINE
              </label>
              <input
                type="text"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(3, 7, 18, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
                required
              />
            </div>
          </div>

          {/* Privacy Prompt Commitment */}
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(3, 7, 18, 0.4)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Key size={16} color="var(--neon-emerald)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                Privacy-Preserving Salted Prompt Commitment (Optional)
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <input
                type="text"
                placeholder="Secret generation prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(3, 7, 18, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
              <input
                type="text"
                placeholder="Private salt (random hex string)"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(3, 7, 18, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--neon-emerald)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cyber"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
              color: '#030712',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)'
            }}
          >
            {isSubmitting ? 'Minting On-Chain & Generating C2PA...' : 'Originate Genesis Block (Anchor to EVM)'}
          </button>
        </form>
      </BorderGlow>

      {/* Result Display */}
      {result && (
        <BorderGlow
          borderRadius={24}
          glowRadius={42}
          colors={['#10b981', '#00f0ff', '#7c3aed']}
          glowColor="160 85% 60%"
        >
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <CheckCircle size={28} color="var(--neon-emerald)" />
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                  Genesis Asset Successfully Anchored
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Immutable On-Chain Verification Block Created
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'rgba(3, 7, 18, 0.5)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>SHA-256 DIGEST</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--neon-emerald)', wordBreak: 'break-all' }}>
                  {result.fileHash}
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: 'rgba(3, 7, 18, 0.5)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>IPFS CID (CONTENT IDENTIFIER)</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--neon-cyan)', wordBreak: 'break-all' }}>
                  {result.ipfs?.cid}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => downloadJson(result.c2paManifest, `C2PA_Manifest_${result.fileHash.slice(0, 8)}.json`)}
                className="btn-cyber"
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid var(--neon-cyan)',
                  color: 'var(--neon-cyan)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>C2PA Manifest (JSON)</span>
              </button>

              <button
                onClick={() => downloadJson(result.provenancePassport, `Provenance_Passport_${result.fileHash.slice(0, 8)}.json`)}
                className="btn-cyber"
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid var(--neon-emerald)',
                  color: 'var(--neon-emerald)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>W3C Verifiable Credential</span>
              </button>
            </div>
          </div>
        </BorderGlow>
      )}
    </div>
  );
}
