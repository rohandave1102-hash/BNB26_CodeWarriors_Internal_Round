import React, { useState } from 'react';
import { UploadCloud, Database, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { logTransformation } from '../services/api';

export default function LogTransformation({ onTransformationSuccess }) {
  const [file, setFile] = useState(null);
  const [parentHash, setParentHash] = useState('');
  const [actionType, setActionType] = useState('AI_UPSCALE');
  const [applicationName, setApplicationName] = useState('Topaz Gigapixel AI');
  
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

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
      setError('Please upload the modified/transformed artifact.');
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
      formData.append('file', file);
      formData.append('parentHash', parentHash.trim());
      formData.append('actionType', actionType);
      formData.append('applicationName', applicationName);

      const res = await logTransformation(formData);
      setReceipt(res);
      if (onTransformationSuccess) onTransformationSuccess();
    } catch (err) {
      setError(err.message || 'Failed to log transformation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '36px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
          Multi-System Transformation Logging
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.95rem' }}>
          Append legitimate modifications (upscaling, inpainting, format changes) to the cryptographic chain of custody.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          {/* Parent Hash Input */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <LinkIcon size={14} color="var(--emerald)" />
              <span>Original Parent Hash ID (Ancestor Block)</span>
            </label>
            <input
              type="text"
              placeholder="0x... (Hash of Genesis artifact or previous version)"
              value={parentHash}
              onChange={(e) => setParentHash(e.target.value)}
              className="mono-tag"
              style={{
                width: '100%',
                background: 'rgba(7, 9, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                padding: '12px 14px',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Transformed File Upload */}
          <div
            className="dropzone"
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
            onClick={() => document.getElementById('transform-file-input').click()}
          >
            <input
              id="transform-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <UploadCloud size={40} color="var(--cyan)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {file ? file.name : 'Select or drop transformed artifact (Resized, Upscaled, or Edited)'}
            </h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '4px' }}>
              {file ? `${(file.size / 1024).toFixed(1)} KB modified asset` : 'Generates new cryptographic child node'}
            </p>
          </div>

          {/* Transformation Attributes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Transformation Action Type
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
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
                <option value="AI_UPSCALE">AI Super-Resolution / Upscale (4K/8K)</option>
                <option value="INPAINT_EDIT">Inpainting / Generative Edit</option>
                <option value="RE_ENCODE">Re-Encoding / Format Conversion</option>
                <option value="WATERMARK">Cryptographic Watermarking</option>
                <option value="STYLE_TRANSFER">Neural Style Transfer</option>
                <option value="DOCUMENT_COMPRESSION">PDF/Document Optimization</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Processing Tool / Platform
              </label>
              <input
                type="text"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
                placeholder="e.g. Topaz Gigapixel, Photoshop AI, FFmpeg"
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: 'var(--cyan)',
              color: '#07090e',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Appending Block to Blockchain...' : 'Log Transformation to Ledger'}
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
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <CheckCircle2 size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                Transformation Block Successfully Appended!
              </h3>
            </div>

            <div style={{
              background: 'rgba(7, 9, 14, 0.8)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                New Derivative Hash:
              </div>
              <div className="mono-tag" style={{ color: 'var(--cyan)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {receipt.newHash}
              </div>
            </div>

            <div style={{
              background: 'rgba(7, 9, 14, 0.8)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Linked Parent Hash:
              </div>
              <div className="mono-tag" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {receipt.parentHash}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
