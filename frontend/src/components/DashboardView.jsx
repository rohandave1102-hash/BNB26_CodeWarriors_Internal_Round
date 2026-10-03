import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Database, 
  GitBranch, 
  Cpu, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function DashboardView({ stats, onNavigate, user }) {
  const activities = [
    {
      type: 'GENESIS_ANCHOR',
      title: 'Genesis Asset #2026 Originated',
      model: 'Stable Diffusion 3.5 Large',
      hash: '0x9fa17b4c6e82d1a3f5b7c9e0d2a4f6b8c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0',
      tier: 'Tier 1 Verified',
      color: 'var(--neon-emerald)',
      time: '2 mins ago'
    },
    {
      type: 'TRANSFORMATION_LOG',
      title: 'Super-Resolution Upscale Logged',
      model: 'Topaz Gigapixel AI v7.1',
      hash: '0x4a8b2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6e82d1a3f5b7c9e0d2a4f6',
      tier: 'Tier 2 Derived',
      color: 'var(--neon-cyan)',
      time: '14 mins ago'
    },
    {
      type: 'STEGANO_WATERMARK',
      title: 'LSB Pixel Signature Embedded',
      model: 'Midjourney v6.1 Synth',
      hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      tier: 'Pixel Protected',
      color: 'var(--neon-purple)',
      time: '32 mins ago'
    },
    {
      type: 'TAMPER_DEFENSE',
      title: 'Silent Bit-Flip Injected & Blocked',
      model: 'Adversarial Injection Test',
      hash: '0x000000000000000000000000000000000000000000000000000000000000bad1',
      tier: 'Tier 3 Defended',
      color: 'var(--neon-magenta)',
      time: '1 hour ago'
    }
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Welcome Banner */}
      <div className="glass-3d" style={{
        padding: '32px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(14, 14, 28, 0.9) 0%, rgba(10, 20, 35, 0.7) 100%)',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        marginBottom: '32px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: 'var(--neon-cyan)',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              <Activity size={14} />
              AUTONOMOUS CRYPTOGRAPHIC LEDGER MONITOR
            </div>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: '8px'
            }}>
              {user ? `Welcome, ${user.user_metadata?.full_name || user.email}` : 'Protocol Overview & Network Metrics'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '640px' }}>
              Real-time monitoring of decentralized AI content provenance, on-chain Merkle DAG state, perceptual hash recovery rates, and adversarial defense integrity.
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 24px',
            borderRadius: '16px',
            background: 'rgba(3, 3, 10, 0.7)',
            border: '1px solid rgba(0, 240, 255, 0.2)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>PROTOCOL STATUS</div>
              <div style={{ color: 'var(--neon-emerald)', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-emerald)', boxShadow: '0 0 10px var(--neon-emerald)' }} />
                100% OPERATIONAL
              </div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>EVM CHAIN</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                Hardhat 31337
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        <div className="glass-3d" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>TOTAL ANCHORED ASSETS</span>
            <Database size={18} color="var(--neon-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
            {stats?.totalArtifacts || 1}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)' }}>
            +100% On-Chain EVM Anchoring
          </div>
        </div>

        <div className="glass-3d" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>INTEGRITY INDEX</span>
            <ShieldCheck size={18} color="var(--neon-emerald)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--neon-emerald)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
            99.94%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Dual-Hash Cryptographic Conformance
          </div>
        </div>

        <div className="glass-3d" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>PIXEL WATERMARKS</span>
            <Sparkles size={18} color="var(--neon-purple)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--neon-purple)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
            100%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Survives Social Media Stripping
          </div>
        </div>

        <div className="glass-3d" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>ATTACKS BLOCKED</span>
            <Zap size={18} color="var(--neon-magenta)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--neon-magenta)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
            18 / 18
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Adversarial Invariants Maintained
          </div>
        </div>
      </div>

      {/* Main Grid: Trust Breakdown & Live Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Trust Tier Distribution */}
        <div className="glass-3d" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Cryptographic Trust Classification
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Multi-tier validation status across indexed digital assets.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--neon-emerald)', fontWeight: 700 }}>Tier 1: Verified Trusted (Root)</span>
                <span style={{ color: '#fff', fontWeight: 800 }}>76%</span>
              </div>
              <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}>
                <div style={{ width: '76%', height: '100%', borderRadius: '4px', background: 'var(--neon-emerald)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--neon-cyan)', fontWeight: 700 }}>Tier 2: Derivation / Format Shift</span>
                <span style={{ color: '#fff', fontWeight: 800 }}>20%</span>
              </div>
              <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}>
                <div style={{ width: '20%', height: '100%', borderRadius: '4px', background: 'var(--neon-cyan)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--neon-magenta)', fontWeight: 700 }}>Tier 3: Tampered / Disputed</span>
                <span style={{ color: '#fff', fontWeight: 800 }}>4%</span>
              </div>
              <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}>
                <div style={{ width: '4%', height: '100%', borderRadius: '4px', background: 'var(--neon-magenta)' }} />
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(3, 3, 10, 0.5)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}>
            ℹ️ Assets in <strong>Tier 3</strong> fail cryptographic or perceptual hash checks and are permanently flagged in the on-chain dispute registry.
          </div>
        </div>

        {/* Live Ledger Activity Feed */}
        <div className="glass-3d" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Live Provenance Stream
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>
              AUTO-SYNCING
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((act, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(3, 3, 10, 0.5)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{act.title}</span>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: `${act.color}22`,
                      color: act.color
                    }}>
                      {act.tier}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {act.model} • {act.time}
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {act.hash.slice(0, 10)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launchpad Cards */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '14px' }}>
          QUICK LAUNCHPAD NAVIGATION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div
            onClick={() => onNavigate('verify')}
            className="glass-3d"
            style={{ padding: '20px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <ShieldCheck size={22} color="var(--neon-emerald)" />
              <ArrowUpRight size={16} color="var(--text-dim)" />
            </div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>
              Audit Asset Integrity
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Dual-hash comparison & 1-click tamper simulation.
            </div>
          </div>

          <div
            onClick={() => onNavigate('originate')}
            className="glass-3d"
            style={{ padding: '20px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Sparkles size={22} color="var(--neon-cyan)" />
              <ArrowUpRight size={16} color="var(--text-dim)" />
            </div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>
              Originate Genesis Block
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Register new AI creation with salted prompt privacy.
            </div>
          </div>

          <div
            onClick={() => onNavigate('watermark')}
            className="glass-3d"
            style={{ padding: '20px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Layers size={22} color="var(--neon-purple)" />
              <ArrowUpRight size={16} color="var(--text-dim)" />
            </div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>
              Steganographic Watermarking
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Embed & extract invisible LSB pixel signatures.
            </div>
          </div>

          <div
            onClick={() => onNavigate('adversarial')}
            className="glass-3d"
            style={{ padding: '20px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Zap size={22} color="var(--neon-magenta)" />
              <ArrowUpRight size={16} color="var(--text-dim)" />
            </div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>
              Adversarial Sandbox
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Execute live security exploit stress tests.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
