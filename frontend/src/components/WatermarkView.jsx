import React, { useState } from 'react';
import { Eye, Download, Upload, CheckCircle2, Sparkles, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { embedWatermark, extractWatermark } from '../services/api';

export default function WatermarkView() {
  const [activeSubTab, setActiveSubTab] = useState('embed'); // 'embed' or 'extract'

  // Embed State
  const [embedFile, setEmbedFile] = useState(null);
  const [embedPreview, setEmbedPreview] = useState(null);
  const [secretText, setSecretText] = useState('0x9fa17b4c6e82d1a3f5b7c9e0d2a4f6b8c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0');
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [watermarkedBlobUrl, setWatermarkedBlobUrl] = useState(null);

  // Extract State
  const [extractFile, setExtractFile] = useState(null);
  const [extractPreview, setExtractPreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractResult, setExtractResult] = useState(null);

  const handleEmbedFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setEmbedFile(f);
      setEmbedPreview(URL.createObjectURL(f));
      setWatermarkedBlobUrl(null);
    }
  };

  const handleExtractFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setExtractFile(f);
      setExtractPreview(URL.createObjectURL(f));
      setExtractResult(null);
    }
  };

  const handleEmbed = async (e) => {
    e.preventDefault();
    if (!embedFile || !secretText) {
      alert('Please upload an image and specify the secret signature to embed.');
      return;
    }

    setIsEmbedding(true);
    try {
      const blob = await embedWatermark(embedFile, secretText);
      const url = URL.createObjectURL(blob);
      setWatermarkedBlobUrl(url);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#10b981']
      });
    } catch (err) {
      alert(err.message || 'Watermark embedding failed');
    } finally {
      setIsEmbedding(false);
    }
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!extractFile) {
      alert('Please upload an image to extract watermark.');
      return;
    }

    setIsExtracting(true);
    setExtractResult(null);

    try {
      const res = await extractWatermark(extractFile);
      setExtractResult(res);

      if (res.hasWatermark) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#10b981']
        });
      }
    } catch (err) {
      alert(err.message || 'Watermark extraction failed');
    } finally {
      setIsExtracting(false);
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
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          color: 'var(--neon-purple)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <Eye size={16} />
          INVISIBLE LSB PIXEL STEGANOGRAPHY
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          color: '#fff',
          marginBottom: '10px'
        }}>
          Steganographic Watermarking
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem' }}>
          Solves C2PA's biggest vulnerability: social media platforms (Twitter, Instagram) strip EXIF & JUMBF metadata. By encoding the on-chain hash directly into the least significant bit (LSB) of image pixels, provenance survives re-compression and metadata stripping.
        </p>

        {/* Sub-tabs */}
        <div style={{ display: 'inline-flex', background: 'rgba(3, 7, 18, 0.6)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-subtle)', marginTop: '24px' }}>
          <button
            onClick={() => setActiveSubTab('embed')}
            style={{
              padding: '8px 24px',
              borderRadius: '10px',
              background: activeSubTab === 'embed' ? 'var(--neon-purple)' : 'transparent',
              color: activeSubTab === 'embed' ? '#030712' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Embed Signature into Pixels
          </button>
          <button
            onClick={() => setActiveSubTab('extract')}
            style={{
              padding: '8px 24px',
              borderRadius: '10px',
              background: activeSubTab === 'extract' ? 'var(--neon-purple)' : 'transparent',
              color: activeSubTab === 'extract' ? '#030712' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Extract & Re-Verify Provenance
          </button>
        </div>
      </div>

      {/* Embed Mode */}
      {activeSubTab === 'embed' && (
        <form onSubmit={handleEmbed} className="glass-3d" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)'
        }}>
          <label className="dropzone-cyber" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 20px',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            background: 'rgba(3, 7, 18, 0.5)',
            cursor: 'pointer',
            marginBottom: '24px'
          }}>
            <input type="file" onChange={handleEmbedFileChange} style={{ display: 'none' }} accept="image/*" />
            {embedPreview ? (
              <div style={{ textAlign: 'center' }}>
                <img src={embedPreview} alt="Preview" style={{ maxHeight: '160px', borderRadius: '12px', marginBottom: '10px' }} />
                <div style={{ color: '#fff', fontWeight: 600 }}>{embedFile?.name}</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Upload size={32} color="var(--neon-purple)" style={{ marginBottom: '10px' }} />
                <div style={{ color: '#fff', fontWeight: 700 }}>Upload original clean image</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>PNG, JPEG, or WEBP image format</div>
              </div>
            )}
          </label>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
              SECRET PROVENANCE SIGNATURE / ON-CHAIN HASH TO EMBED
            </label>
            <input
              type="text"
              value={secretText}
              onChange={(e) => setSecretText(e.target.value)}
              placeholder="0x... or custom text signature"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(3, 7, 18, 0.7)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--neon-purple)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isEmbedding}
            className="btn-cyber"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
              color: '#030712',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
              marginBottom: watermarkedBlobUrl ? '24px' : '0'
            }}
          >
            {isEmbedding ? 'Injecting LSB Watermark...' : 'Embed Invisible Signature (Preserves Visual Quality)'}
          </button>

          {watermarkedBlobUrl && (
            <div style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid var(--neon-purple)',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={32} color="var(--neon-purple)" style={{ marginBottom: '10px' }} />
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', marginBottom: '6px' }}>
                Watermark Successfully Embedded in Pixel Channels!
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                The image looks visually identical, but its pixel color values now contain the immutable signature.
              </p>
              <a
                href={watermarkedBlobUrl}
                download="watermarked_asset.png"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--neon-purple)',
                  color: '#030712',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                <Download size={16} />
                <span>Download Watermarked PNG</span>
              </a>
            </div>
          )}
        </form>
      )}

      {/* Extract Mode */}
      {activeSubTab === 'extract' && (
        <form onSubmit={handleExtract} className="glass-3d" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)'
        }}>
          <label className="dropzone-cyber" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 20px',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed rgba(255, 255, 255, 0.15)',
            background: 'rgba(3, 7, 18, 0.5)',
            cursor: 'pointer',
            marginBottom: '24px'
          }}>
            <input type="file" onChange={handleExtractFileChange} style={{ display: 'none' }} accept="image/*" />
            {extractPreview ? (
              <div style={{ textAlign: 'center' }}>
                <img src={extractPreview} alt="Preview" style={{ maxHeight: '160px', borderRadius: '12px', marginBottom: '10px' }} />
                <div style={{ color: '#fff', fontWeight: 600 }}>{extractFile?.name}</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Upload size={32} color="var(--neon-purple)" style={{ marginBottom: '10px' }} />
                <div style={{ color: '#fff', fontWeight: 700 }}>Upload image to inspect for pixel watermark</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Extracts signature even if metadata was completely stripped</div>
              </div>
            )}
          </label>

          <button
            type="submit"
            disabled={isExtracting}
            className="btn-cyber"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
              color: '#030712',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
              marginBottom: extractResult ? '24px' : '0'
            }}
          >
            {isExtracting ? 'Decoding Pixel Matrix...' : 'Extract Invisible Watermark & Audit On-Chain'}
          </button>

          {extractResult && (
            <div style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              background: extractResult.hasWatermark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              border: `1px solid ${extractResult.hasWatermark ? 'var(--neon-emerald)' : 'var(--neon-crimson)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Shield size={24} color={extractResult.hasWatermark ? 'var(--neon-emerald)' : 'var(--neon-crimson)'} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {extractResult.hasWatermark ? '✅ Watermark Detected & Extracted' : '❌ No Pixel Watermark Found'}
                </h3>
              </div>

              {extractResult.hasWatermark ? (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '4px' }}>
                    EXTRACTED SIGNATURE / HASH
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: 'var(--neon-emerald)',
                    wordBreak: 'break-all',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(3, 7, 18, 0.6)',
                    marginBottom: '14px'
                  }}>
                    {extractResult.extractedSignature}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Ledger Status: <span style={{ color: '#fff', fontWeight: 700 }}>
                      {extractResult.ledgerVerified ? 'Verified On-Chain Ancestry' : 'Unregistered in Current Ledger'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {extractResult.message}
                </div>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
