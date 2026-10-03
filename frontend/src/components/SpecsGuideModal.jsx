import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, Zap, Sparkles, Layers, Eye, CheckCircle2, ChevronRight, Cpu } from 'lucide-react';

export default function SpecsGuideModal({ isOpen, onClose, onNavigate }) {
  const [activeTopic, setActiveTopic] = useState('getting-started');

  if (!isOpen) return null;

  const topics = [
    { id: 'getting-started', label: '🚀 Quick Start (30 Seconds)', icon: Sparkles },
    { id: 'trust-tiers', label: '🛡️ 3-Tier Trust Model', icon: ShieldCheck },
    { id: 'dual-hash', label: '⚡ Dual-Hash & ELA Forensics', icon: Cpu },
    { id: 'stegano-watermark', label: '👁️ Steganography vs Metadata', icon: Eye },
    { id: 'adversarial-lab', label: '🔬 Attack Playbooks', icon: Zap }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      background: 'rgba(3, 3, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-3d" style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(10, 10, 20, 0.95)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={18} color="#03030a" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                System Specifications & User Guide
              </h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                ModelLedger Protocol • BitnBuild 2026 CodeWarriors
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar Navigation */}
          <div style={{
            width: '260px',
            borderRight: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: 'rgba(5, 5, 12, 0.4)'
          }}>
            {topics.map((t) => {
              const Icon = t.icon;
              const isActive = activeTopic === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(t.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
                    color: isActive ? 'var(--neon-cyan)' : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Pane */}
          <div style={{ flex: 1, padding: '28px', overflowY: 'auto', lineHeight: 1.6 }}>
            {activeTopic === 'getting-started' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  🚀 Quick-Start Demonstration Guide
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Everything in ModelLedger is designed for immediate evaluation with <strong>zero manual typing</strong>. Follow these 3 easy steps:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>Step 1: Test Instant On-Chain Audit</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      In <strong>Verify & Forensics</strong>, click any of the 3 preloaded sample cards (e.g. <em>Genesis Cyber Portrait</em>). Click <strong>"Verify Cryptographic Integrity"</strong> to observe on-chain verification and Merkle DAG tracing.
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-magenta)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>Step 2: Simulate Tampering with 1-Click</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Toggle the <strong>"⚡ Inject Silent Tamper: ON"</strong> button next to the dropzone. It mutates bits in memory, immediately triggering <strong>Tier 3 (Tampered / Disputed)</strong> with forensic breakdown!
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-purple)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span>Step 3: Test Invisible Pixel Watermarking</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      In <strong>Stegano Watermark</strong>, embed an on-chain signature into image pixels. Even if Twitter or WhatsApp strips all metadata on upload, ModelLedger extracts the pixel signature and re-links to the EVM blockchain.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === 'trust-tiers' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  🛡️ The 3-Tier Cryptographic Trust Model
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Rather than a naive binary "true/false", ModelLedger establishes industrial 3-tier classification:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                    <div style={{ color: 'var(--neon-emerald)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                      Tier 1: Verified Trusted (Authentic Root)
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Exact bitwise SHA-256 matches on-chain genesis records countersigned by an authorized platform oracle key or validated genesis minter.
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                    <div style={{ color: 'var(--neon-cyan)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                      Tier 2: Derivation / Format Shift
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Perceptual visual hash matches (Hamming distance ≤ 6 bits), but byte digest differs. Indicates legitimate re-encoding (PNG to JPEG), compression, or documented Merkle DAG transformation.
                    </div>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 0, 127, 0.08)', border: '1px solid rgba(255, 0, 127, 0.3)' }}>
                    <div style={{ color: 'var(--neon-magenta)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                      Tier 3: Tampered / Disputed / Counterfeit
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Perceptual divergence detected (Hamming distance &gt; threshold) or unverified claim. Flags spliced deepfakes, attribution fraud, or silent adversarial tampering.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === 'dual-hash' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  ⚡ Dual-Hash Integrity & ELA Forensics
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  Standard systems fail when files are simply resized or re-saved. ModelLedger solves this using a two-stage pipeline:
                </p>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '18px', marginBottom: '20px' }}>
                  <li><strong>Cryptographic SHA-256 Digest:</strong> Detects single-bit tamper modifications via cryptographic avalanche effect.</li>
                  <li><strong>64-bit Perceptual Hash (dHash):</strong> Converts frequency gradients into a visual fingerprint that survives resizing, lossy compression, and format changes.</li>
                  <li><strong>Error Level Analysis (ELA):</strong> Re-compresses the image buffer at 90% quality to isolate areas edited with inconsistent JPEG compression tables.</li>
                </ul>
              </div>
            )}

            {activeTopic === 'stegano-watermark' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  👁️ Steganographic Watermarking vs Metadata Stripping
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  <strong>The C2PA Problem:</strong> Content Credentials (C2PA/JUMBF) store provenance in image header metadata. When uploaded to Twitter, Discord, or Instagram, servers strip EXIF/XMP metadata, deleting provenance.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  <strong>ModelLedger's Solution:</strong> We embed the 32-byte on-chain transaction hash directly into the <em>Least Significant Bit (LSB)</em> of image pixel color channels. The signature lives in the image itself, allowing instantaneous retrieval after platform uploads.
                </p>
              </div>
            )}

            {activeTopic === 'adversarial-lab' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                  🔬 Adversarial Attack Simulator
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  Test ModelLedger's mathematical invariants against live exploits:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div><strong>1. Silent Bit-Flip:</strong> Imperceptible payload injection defeated by cryptographic hash avalanche.</div>
                  <div><strong>2. Duplicate Genesis:</strong> Impersonator claiming attribution defeated by EVM single-registration invariant.</div>
                  <div><strong>3. Dangling Parent:</strong> Counterfeit child derivative defeated by Merkle DAG parent existence invariant.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            EVM Contract: <code style={{ color: 'var(--neon-cyan)' }}>0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512</code>
          </span>
          <button
            onClick={onClose}
            className="btn-cyber"
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #00f0ff 0%, #8b5cf6 100%)',
              color: '#03030a',
              fontWeight: 800,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Got It, Return to App
          </button>
        </div>
      </div>
    </div>
  );
}
