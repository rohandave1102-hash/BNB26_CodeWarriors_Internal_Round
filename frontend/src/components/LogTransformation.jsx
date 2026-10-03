import React, { useState } from 'react';
import { UploadCloud, GitBranch, Link as LinkIcon, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { logTransformation } from '../services/api';

export default function LogTransformation({ onTransformationSuccess }) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [parentHash, setParentHash] = useState('');
  const [actionType, setActionType] = useState('AI_UPSCALE');
  const [applicationName, setApplicationName] = useState('Topaz Gigapixel AI');
  
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

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

  // Quick 1-click Auto-fill sample to avoid manual hash typing
  const loadQuickTransform = () => {
    const sampleBlob = new Blob(['CYBER_NEON_ORIGINAL_AI_ASSET_METROPOLIS_4K_UPSCALED'], { type: 'text/plain' });
    setFile(sampleBlob);
    setFilePreview(null);
    setParentHash('0x42972c2b8ba8651bc56599ba6ced9d723ea3edabac672e1227ebcf797b411d30');
    setActionType('AI_UPSCALE');
    setApplicationName('Topaz Gigapixel AI 8X');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload the modified or transformed artifact.');
      return;
    }
    if (!parentHash.trim()) {
      setError('Please provide the parent Hash ID (the ancestor artifact you derived this from).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file, file.name || 'derivative_asset.png');
      formData.append('parentHash', parentHash.trim());
      formData.append('actionType', actionType);
      formData.append('applicationName', applicationName);

      const res = await logTransformation(formData);
      setReceipt(res);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onTransformationSuccess) onTransformationSuccess();
    } catch (err) {
      setError(err.message || 'Failed to log transformation.');
    } finally {
      setLoading(false);
    }
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
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          color: 'var(--neon-purple)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px',
          letterSpacing: '0.04em'
        }}>
          <Sparkles size={14} />
          MULTI-SYSTEM CUSTODY TRACKING
        </div>
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          color: '#fff'
        }}>
          Log Edit <span className="gradient-text-purple">History</span>
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          marginTop: '12px',
          fontSize: '1.05rem',
          maxWidth: '680px',
          margin: '12px auto 0'
        }}>
          Preserve unbroken provenance across multi-model workflows. Log upscaling, inpainting, and format conversions without breaking file integrity.
        </p>
      </div>

      <div className="glass-3d" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit}>
          {/* Quick Demo Pre-fill */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
            <button
              type="button"
              onClick={loadQuickTransform}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: 'var(--neon-purple)',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '999px'
              }}
            >
              <Wand2 size={13} />
              Auto-Link Demo Ancestor
            </button>
          </div>

          {/* Parent Hash input */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              <LinkIcon size={14} color="var(--neon-purple)" />
              <span>Ancestor Block Hash (The parent version this was modified from)</span>
            </label>
            <input
              type="text"
              placeholder="0x... (Hash of original Genesis file)"
              value={parentHash}
              onChange={(e) => setParentHash(e.target.value)}
              className="mono-tag"
              style={{
                width: '100%',
                background: 'rgba(7, 11, 20, 0.85)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                padding: '13px 16px',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Dropzone with preview */}
          <div
            className="dropzone-cyber"
            onClick={() => document.getElementById('transform-file-input').click()}
            style={{ marginBottom: '24px' }}
          >
            <input
              id="transform-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {filePreview ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <img
                  src={filePreview}
                  alt="Transformed Preview"
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
                <UploadCloud size={48} color="var(--neon-purple)" style={{ margin: '0 auto 14px' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  {file ? (file.name || 'Modified Asset Ready') : 'Select or Drop Modified Asset (Upscaled / Edited)'}
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '6px' }}>
                  Generates an append-only child block linked to the original ancestor
                </p>
              </div>
            )}
          </div>

          {/* Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                Transformation Action Type
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
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
                <option value="AI_UPSCALE">AI Super-Resolution / Upscale (4K/8K)</option>
                <option value="INPAINT_EDIT">Inpainting / Generative Edit</option>
                <option value="RE_ENCODE">Re-Encoding / Format Conversion</option>
                <option value="WATERMARK">Cryptographic Watermarking</option>
                <option value="STYLE_TRANSFER">Neural Style Transfer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                Processing Tool / Platform
              </label>
              <input
                type="text"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
                placeholder="e.g. Topaz Gigapixel, Photoshop AI, FFmpeg"
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--neon-purple), #ec4899)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.05rem',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 0 30px var(--neon-purple-glow)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Appending Block to Blockchain...' : 'Link Transformation to Chain'}
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

        {/* Success Receipt */}
        {receipt && (
          <div style={{
            marginTop: '32px',
            padding: '28px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(236, 72, 153, 0.08) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.45)',
            boxShadow: '0 0 35px rgba(168, 85, 247, 0.18)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <CheckCircle2 size={26} color="var(--neon-purple)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                Transformation Block Successfully Appended!
              </h3>
            </div>

            <div style={{
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                New Derivative Block Hash:
              </div>
              <div className="mono-tag" style={{ color: 'var(--neon-purple)', fontSize: '0.88rem', wordBreak: 'break-all' }}>
                {receipt.newHash}
              </div>
            </div>

            <div style={{
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Linked Ancestor Hash:
              </div>
              <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', wordBreak: 'break-all' }}>
                {receipt.parentHash}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
