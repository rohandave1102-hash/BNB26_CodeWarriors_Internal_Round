import React, { useState } from 'react';
import { GitBranch, Upload, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BorderGlow } from './cards';
import { logTransformation } from '../services/api';

export default function TransformView({ onTransformationSuccess }) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [parentHash, setParentHash] = useState('');
  const [actionType, setActionType] = useState('AI_UPSCALE');
  const [applicationName, setApplicationName] = useState('Topaz Gigapixel AI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleAutoLinkDemo = () => {
    // Canvas dummy for derivative
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 400, 400);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('Upscaled Child Node #2026', 40, 200);

    canvas.toBlob((blob) => {
      const demoFile = new File([blob], 'upscaled_variant.png', { type: 'image/png' });
      setFile(demoFile);
      setFilePreview(URL.createObjectURL(blob));
    });

    setParentHash('0x9fa17b4c6e82d1a3f5b7c9e0d2a4f6b8c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0');
    setActionType('AI_UPSCALE');
    setApplicationName('Topaz Gigapixel AI v7.1');
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
    if (!file || !parentHash) {
      alert('Please upload transformed file and specify parent hash.');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parent_hash', parentHash.trim());
      formData.append('action_type', actionType);
      formData.append('application_name', applicationName);

      const res = await logTransformation(formData);
      setResult(res);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#38bdf8']
      });

      if (onTransformationSuccess) onTransformationSuccess();
    } catch (err) {
      alert(err.message || 'Transformation logging failed');
    } finally {
      setIsSubmitting(false);
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
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: 'var(--neon-cyan)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <GitBranch size={16} />
          MERKLE DAG TRANSFORMATION TRACKER
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          color: '#fff',
          marginBottom: '10px'
        }}>
          Log Edit History & Lineage
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
          Record derivative transformations (upscaling, re-encoding, inpainting, watermarking). Links modified artifacts back to root ancestor in the immutable DAG chain.
        </p>

        {/* Demo Button */}
        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={handleAutoLinkDemo}
            className="btn-cyber"
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} />
            <span>⚡ Auto-Link Demo Ancestor</span>
          </button>
        </div>
      </div>

      <BorderGlow
        borderRadius={24}
        glowRadius={40}
        colors={['#00f0ff', '#38bdf8', '#7c3aed']}
        glowColor="190 90% 55%"
        style={{ marginBottom: '32px' }}
      >
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {/* Upload Transformed File */}
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
                <div style={{ color: '#fff', fontWeight: 700 }}>Upload modified/transformed derivative asset</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Resulting image after editing, inpainting, or upscaling</div>
              </div>
            )}
          </label>

          {/* Parent Hash Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
              PARENT ANCESTOR HASH (MUST BE REGISTERED)
            </label>
            <input
              type="text"
              value={parentHash}
              onChange={(e) => setParentHash(e.target.value)}
              placeholder="0x..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(3, 7, 18, 0.7)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--neon-cyan)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
              required
            />
          </div>

          {/* Action Type & Pipeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                TRANSFORMATION ACTION TYPE
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(3, 7, 18, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="AI_UPSCALE">AI Super-Resolution / Upscale</option>
                <option value="INPAINT">Inpainting / Generative Fill</option>
                <option value="RE_ENCODE">Format Conversion / Lossy Re-encode</option>
                <option value="WATERMARK">Steganographic Watermarking</option>
                <option value="STYLE_TRANSFER">Neural Style Transfer</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                TRANSFORMATION APPLICATION
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-cyber"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #06b6d4 0%, #38bdf8 100%)',
              color: '#030712',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)'
            }}
          >
            {isSubmitting ? 'Logging Transformation to Chain...' : 'Append Child Node to Merkle DAG Lineage'}
          </button>
        </form>
      </BorderGlow>

      {/* Result */}
      {result && (
        <BorderGlow
          borderRadius={24}
          glowRadius={42}
          colors={['#10b981', '#00f0ff', '#7c3aed']}
          glowColor="160 85% 60%"
        >
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <CheckCircle2 size={28} color="var(--neon-emerald)" />
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                  Transformation Successfully Anchored to Lineage
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Child Node Appended • Inherited Ancestor Provenance
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px', borderRadius: 'var(--radius-sm)', background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>PARENT ANCESTOR</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {result.parentHash.slice(0, 16)}...
                </div>
              </div>
              <ArrowRight size={20} color="var(--neon-cyan)" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700 }}>CHILD DERIVATIVE</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>
                  {result.newHash.slice(0, 16)}...
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>
      )}
    </div>
  );
}
