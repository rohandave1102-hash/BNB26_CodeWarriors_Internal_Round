import { useEffect, useRef, useState } from 'react';
import BlockchainBentoSection from './BlockchainBentoSection';
import {
  ShieldCheck, Fingerprint, GitFork, Droplets, FlaskConical,
  ArrowRight, Blocks, Hash, Eye, Lock, Zap, Globe, CheckCircle2,
  TrendingUp, Activity, FileCode2, Network
} from 'lucide-react';

/* ── CountUp hook ── */
function useCountUp(target, duration = 1800, deps = []) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ...deps]);
  return val;
}

/* ── Scroll reveal hook ── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Feature cards ── */
const FEATURES = [
  {
    icon: Hash,
    color: 'var(--neon-cyan)',
    label: 'C2PA Hard-Binding',
    desc: 'Cryptographic content credentials embedded into JFIF/PNG chunks — survives most platform pipelines.',
    tag: 'INDUSTRIAL STANDARD',
    tagClass: 'tag-cyan',
  },
  {
    icon: Lock,
    color: 'var(--electric-purple-bright)',
    label: 'LSB Steganography',
    desc: '3× redundant least-significant-bit watermarking with majority-vote decoding for compression resilience.',
    tag: 'SOFT BINDING',
    tagClass: 'tag-purple',
  },
  {
    icon: Blocks,
    color: 'var(--neon-emerald)',
    label: 'EVM On-Chain Registry',
    desc: 'Salted Keccak-256 commitments anchored to an Ethereum-compatible smart contract with fuzzy pHash lookups.',
    tag: 'BLOCKCHAIN NATIVE',
    tagClass: 'tag-emerald',
  },
  {
    icon: Globe,
    color: 'var(--neon-amber)',
    label: 'IPFS Content Addressing',
    desc: 'Immutable CID-based artifact storage on IPFS with pinning verification and gateway resilience.',
    tag: 'DECENTRALISED',
    tagClass: 'tag-amber',
  },
  {
    icon: Eye,
    color: 'var(--neon-magenta)',
    label: 'ELA Forensics',
    desc: 'Error-Level Analysis detects pixel-level manipulation with JPEG compression artifact comparison.',
    tag: 'FORENSICS',
    tagClass: 'tag-red',
  },
  {
    icon: Network,
    color: 'var(--neon-cyan)',
    label: 'Provenance Graph',
    desc: 'On-chain derivation chains with parent-hash tracing and transformation metadata for full model lineage.',
    tag: 'PROVENANCE',
    tagClass: 'tag-cyan',
  },
];

/* ── Protocol steps ── */
const PROTOCOL_STEPS = [
  { num: '01', title: 'Upload Artifact', desc: 'Drop any AI-generated image or model file to begin provenance registration.' },
  { num: '02', title: 'Embed + Hash',    desc: 'C2PA credentials are embedded; a salted Keccak-256 commitment is computed.' },
  { num: '03', title: 'IPFS Pin',        desc: 'The artifact is stored on IPFS and its CID is returned for verification.' },
  { num: '04', title: 'Anchor On-Chain', desc: 'The commitment hash is written to the EVM registry smart contract.' },
  { num: '05', title: 'Verify Anywhere', desc: 'Anyone can verify authenticity using the public contract & IPFS CID.' },
];

export default function DashboardView({ stats, onNavigate, user }) {
  const [heroRef, heroVisible] = useReveal(0.05);
  const [statsRef, statsVisible] = useReveal(0.2);
  const [featRef, featVisible] = useReveal(0.1);
  const [protRef, protVisible] = useReveal(0.1);

  const artifactCount = useCountUp(stats.totalArtifacts || 0, 1600, [stats.totalArtifacts]);

  /* Floating hash ticker state */
  const [ticker, setTicker] = useState('0x' + Array.from({ length: 64 }, () =>
    '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''));

  useEffect(() => {
    const id = setInterval(() => {
      setTicker('0x' + Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section
        ref={heroRef}
        className="hero-section hero-cursor-area"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
        }}
      >
        {/* Floating ticker bar */}
        <div style={{
          position: 'absolute', top: '78px', left: 0, right: 0,
          overflow: 'hidden', height: '32px',
          borderBottom: '1px solid rgba(0,240,255,0.08)',
          borderTop: '1px solid rgba(0,240,255,0.08)',
          display: 'flex', alignItems: 'center',
          background: 'rgba(0,240,255,0.02)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'rgba(0,240,255,0.3)',
            letterSpacing: '0.06em',
            animation: 'scan-across 12s linear infinite',
            whiteSpace: 'nowrap',
            paddingLeft: '100%',
          }}>
            BLOCK_HASH::{ticker}&nbsp;&nbsp;•&nbsp;&nbsp;
            PROTOCOL::EVM_CHAIN&nbsp;&nbsp;•&nbsp;&nbsp;
            C2PA::EMBEDDED&nbsp;&nbsp;•&nbsp;&nbsp;
            IPFS::PINNED&nbsp;&nbsp;•&nbsp;&nbsp;
            LSB_WATERMARK::3X_REDUNDANT
          </div>
        </div>

        {/* Section label */}
        <div
          className="section-label"
          style={{
            marginBottom: '24px',
            opacity: heroVisible ? 0.8 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          }}
        >
          ⬡ AI PROVENANCE PROTOCOL
        </div>

        {/* Main headline */}
        <h1
          className="text-display gradient-text"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            maxWidth: '900px',
            marginBottom: '28px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}
        >
          Trust the Machine.
          <br />
          Verify the Signal.
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            lineHeight: 1.7,
            marginBottom: '44px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s',
          }}
        >
          Cryptographic provenance for AI-generated content. C2PA embedding,
          on-chain commitment, IPFS pinning, and forensic watermarking — all in one protocol.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s',
          }}
        >
          <button
            className="btn btn-primary"
            data-accent="#00f0ff"
            onClick={() => onNavigate('originate')}
            style={{ padding: '14px 32px', fontSize: '0.95rem', borderRadius: 'var(--r-pill)' }}
          >
            <Fingerprint size={18} />
            Register Artifact
            <ArrowRight size={16} />
          </button>
          <button
            className="btn btn-ghost"
            data-accent="#a855f7"
            onClick={() => onNavigate('verify')}
            style={{ padding: '14px 32px', fontSize: '0.95rem', borderRadius: 'var(--r-pill)' }}
          >
            <ShieldCheck size={18} />
            Verify Authenticity
          </button>
        </div>

        {/* Hero mini-stats */}
        <div
          style={{
            display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center',
            marginTop: '60px',
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.7s',
          }}
        >
          {[
            { label: 'Artifacts Registered', value: artifactCount, suffix: '' },
            { label: 'EVM Chain', value: stats.isContractConnected ? 'LIVE' : 'OFF', isText: true },
            { label: 'Trust Tiers', value: 3, suffix: '' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}>
                {s.isText ? s.value : `${s.value}${s.suffix}`}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            opacity: heroVisible ? 0.5 : 0, transition: 'opacity 1s ease 1s',
            animation: 'float 2.5s ease-in-out infinite',
          }}
        >
          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Scroll</div>
          <div style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, rgba(0,240,255,0.4), transparent)' }} />
        </div>
      </section>

      {/* ═══════════════════════════ REACT BITS BENTO MATRIX ═══════════════════════════ */}
      <div
        ref={statsRef}
        style={{
          opacity: statsVisible ? 1 : 0,
          transform: statsVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <BlockchainBentoSection stats={stats} onNavigate={onNavigate} />
      </div>

      {/* ═══════════════════════════ FEATURES GRID ═══════════════════════════ */}
      <section style={{ padding: '20px 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={featRef} style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div
            className="section-label"
            style={{
              marginBottom: '16px',
              opacity: featVisible ? 0.8 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            ⬡ CORE TECHNOLOGIES
          </div>
          <h2
            className="text-display gradient-text-subtle"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              opacity: featVisible ? 1 : 0,
              transform: featVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            Six Layers of Trust
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="glass glass-hover"
              style={{
                borderRadius: 'var(--r-lg)',
                padding: '28px',
                opacity: featVisible ? 1 : 0,
                transform: featVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${feat.color}15`,
                  border: `1px solid ${feat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <feat.icon size={20} color={feat.color} />
                </div>
                <span className={`tag ${feat.tagClass}`}>{feat.tag}</span>
              </div>
              <h3 style={{
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '10px',
                fontFamily: 'var(--font-display)',
              }}>
                {feat.label}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ PROTOCOL FLOW ═══════════════════════════ */}
      <section ref={protRef} style={{ padding: '20px 24px 100px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>⬡ HOW IT WORKS</div>
          <h2
            className="text-display"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              color: 'var(--text-primary)',
              opacity: protVisible ? 1 : 0,
              transform: protVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            The Protocol Flow
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {PROTOCOL_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: '24px', alignItems: 'flex-start',
                opacity: protVisible ? 1 : 0,
                transform: protVisible ? 'translateX(0)' : 'translateX(-40px)',
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              }}
            >
              {/* Line + dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', flexShrink: 0 }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--electric-purple-bright) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
                  color: '#020208',
                  boxShadow: '0 0 20px rgba(0,240,255,0.3)',
                  flexShrink: 0,
                }}>
                  {step.num}
                </div>
                {i < PROTOCOL_STEPS.length - 1 && (
                  <div style={{
                    width: '1px', flex: 1, minHeight: '40px',
                    background: 'linear-gradient(to bottom, rgba(0,240,255,0.35), rgba(139,92,246,0.2))',
                    margin: '6px 0',
                  }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: i < PROTOCOL_STEPS.length - 1 ? '28px' : 0 }}>
                <div style={{
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '6px',
                }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: '60px', textAlign: 'center',
          opacity: protVisible ? 1 : 0,
          transition: 'opacity 0.6s ease 0.7s',
        }}>
          <div
            className="glass"
            style={{
              borderRadius: 'var(--r-xl)',
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(0,240,255,0.06) 0%, rgba(124,58,237,0.08) 100%)',
              border: '1px solid rgba(0,240,255,0.15)',
            }}
          >
            <CheckCircle2 size={36} color="var(--neon-emerald)" style={{ marginBottom: '16px' }} />
            <h3 className="text-display" style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
              Ready to Begin?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
              {user
                ? `Welcome back, ${user.email?.split('@')[0]}. Your artifacts are secured on-chain.`
                : 'Register your first AI artifact and establish an immutable provenance trail.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('originate')}
                style={{ borderRadius: 'var(--r-pill)', padding: '12px 28px' }}
              >
                <Zap size={16} />
                Start Registration
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => onNavigate('verify')}
                style={{ borderRadius: 'var(--r-pill)', padding: '12px 28px' }}
              >
                <ShieldCheck size={16} />
                Verify an Artifact
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
