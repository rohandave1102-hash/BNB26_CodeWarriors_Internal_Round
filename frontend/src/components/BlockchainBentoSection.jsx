import React, { useState, useEffect } from 'react';
import {
  StatCard,
  TransactionCard,
  BlockCard,
  ModuleCard,
  CtaCard,
  WalletCard,
  ValidatorCard,
  CredentialCard,
  CardSkeleton,
  CardError,
  CardEmpty,
} from './cards';
import {
  Blocks,
  Activity,
  ShieldCheck,
  Zap,
  Fingerprint,
  Droplets,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from 'lucide-react';

/**
 * BlockchainBentoSection
 * 
 * Asymmetric Bento-Layout Card Showcase featuring:
 * - Varied scale (1 large featured card, compact stats, wide transactions, holographic profile cards)
 * - Deterministic hash identities
 * - Real API stats & live-tick simulation
 * - Interactive variant switcher (Normal, Loading Skeletons, Error State, Empty State)
 */
export default function BlockchainBentoSection({ stats = {}, onNavigate }) {
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'loading' | 'error' | 'empty'
  const [liveBlockNumber, setLiveBlockNumber] = useState(19420841);
  const [liveTxCount, setLiveTxCount] = useState(148);
  const [confirmationTick, setConfirmationTick] = useState(9);

  // Live block stream simulation (advances every 8s)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveBlockNumber((b) => b + 1);
      setLiveTxCount((t) => Math.floor(Math.random() * 80 + 120));
      setConfirmationTick((c) => (c >= 12 ? 1 : c + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* ── Section Header & State Switcher ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '36px',
      }}>
        <div>
          <div className="section-label" style={{ marginBottom: '10px' }}>
            ⬡ REACT BITS HYPER-INTERFACE
          </div>
          <h2 className="text-display gradient-text" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            EVM Protocol Bento Matrix
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '580px', marginTop: '6px' }}>
            High-density cyber panels powered by reactive <strong>BorderGlow</strong> conic beams
            and holographic 3D <strong>ProfileCard</strong> identity layers.
          </p>
        </div>

        {/* State Switcher Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(8, 7, 18, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {[
            { id: 'normal', label: 'Live Data' },
            { id: 'loading', label: 'Skeleton' },
            { id: 'error', label: 'RPC Error' },
            { id: 'empty', label: 'Empty State' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setViewState(id)}
              style={{
                background: viewState === id ? 'linear-gradient(135deg, #00f0ff, #7c3aed)' : 'transparent',
                color: viewState === id ? '#020208' : '#94a3b8',
                fontWeight: viewState === id ? 800 : 500,
                border: 'none',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-sans, sans-serif)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Conditional States: Skeletons, Error, Empty ── */}
      {viewState === 'loading' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <CardSkeleton height="200px" />
          <CardSkeleton height="200px" />
          <CardSkeleton height="200px" />
          <CardSkeleton height="200px" />
          <CardSkeleton height="240px" style={{ gridColumn: 'span 2' }} />
          <CardSkeleton height="240px" style={{ gridColumn: 'span 2' }} />
        </div>
      )}

      {viewState === 'error' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <CardError
            title="EVM RPC Node Timeout"
            message="Could not connect to Hardhat localnet on port 8545. Check chain process."
            onRetry={() => setViewState('normal')}
          />
          <CardError
            title="IPFS Gateway Degraded"
            message="Gateway pinning latency exceeded 3000ms threshold for CID verification."
            onRetry={() => setViewState('normal')}
          />
          <CardError
            title="C2PA Attestation Pending"
            message="Manifest signature worker pool exhausted. Requeuing cryptographic bundle."
            onRetry={() => setViewState('normal')}
          />
        </div>
      )}

      {viewState === 'empty' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <CardEmpty
            title="No Genesis Assets Anchored"
            message="Your account has not originated any cryptographically signed models yet."
            actionText="Register Genesis Asset"
            onAction={() => onNavigate?.('originate')}
          />
          <CardEmpty
            title="Transaction Feed Inactive"
            message="No on-chain transactions detected in current session block pool."
            actionText="Simulate Test Run"
            onAction={() => onNavigate?.('adversarial')}
          />
        </div>
      )}

      {/* ── Live Bento Grid ── */}
      {viewState === 'normal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Row 1: Single Highlight CTA Card (Animated BorderGlow Sweep) */}
          <div style={{ width: '100%' }}>
            <CtaCard
              title="Autonomous Provenance & Hard-Binding Engine"
              description="Anchor your synthetic models to the EVM blockchain with C2PA embedded manifests, 3× redundant LSB watermarking, and decentralized IPFS storage."
              primaryActionText="Register Genesis Model"
              secondaryActionText="Inspect Protocol Engine"
              onPrimaryAction={() => onNavigate?.('originate')}
              onSecondaryAction={() => onNavigate?.('verify')}
            />
          </div>

          {/* Row 2: 3 Compact Metric Cards (Stats with CountUp) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            <StatCard
              label="Total Artifacts Anchored"
              value={stats.totalArtifacts || 128}
              unit="MODELS"
              trend="+18.4%"
              trendDirection="up"
              icon={Blocks}
              accentColor="#00f0ff"
              glowColor="190 90% 55%"
              colors={['#00f0ff', '#38bdf8', '#7c3aed']}
              subtitle="Verified on EVM Localnet"
            />

            <StatCard
              label="Consensus Block Height"
              value={liveBlockNumber}
              unit="HEIGHT"
              trend="+1 block/8s"
              trendDirection="neutral"
              icon={Activity}
              accentColor="#00ffa3"
              glowColor="155 85% 50%"
              colors={['#00ffa3', '#00f0ff', '#7c3aed']}
              subtitle="EVM Hardhat Testnet"
            />

            <StatCard
              label="Dual-Hash Verification Rate"
              value={99.8}
              unit="%"
              trend="+0.4%"
              trendDirection="up"
              icon={ShieldCheck}
              accentColor="#a855f7"
              glowColor="275 85% 65%"
              colors={['#c084fc', '#f472b6', '#38bdf8']}
              subtitle="pHash & Keccak-256 Alignment"
            />
          </div>

          {/* Row 3: Asymmetric Bento: Wide Transaction + Live Block + Holographic Identity */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}>
            {/* Column A: Wide Transaction Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TransactionCard
                hash="0x9a8f4c1b2e3d405981f9a2345091238479102938471092837401928374019283"
                from="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                to="0x5FbDB2315678afecb367f032d93F642f64180aa3"
                value="0.00 ETH"
                actionType="GENESIS_COMMITMENT"
                confirmations={confirmationTick}
                requiredConfirmations={12}
                status={confirmationTick === 12 ? 'Done' : 'Running'}
                timestamp="2s ago"
              />

              <BlockCard
                blockNumber={liveBlockNumber}
                hash="0xbc91a45e8271034f891b2c450123984719203948571029384710928374019283"
                txCount={liveTxCount}
                timestamp="Just mined"
                validator="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                gasUsed={14200000}
                gasLimit={30000000}
                onClick={() => onNavigate?.('verify')}
              />
            </div>

            {/* Column B: Holographic Credential Proof-of-Issuance (ProfileCard) */}
            <div>
              <CredentialCard
                title="Model #409: Neural Style Genesis"
                issuer="ModelLedger C2PA Authority"
                creator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                assetHash="0x892a014e591b2c450123984719203948571029384710928374019283bc91a45e"
                ipfsCid="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
                onVerify={() => onNavigate?.('verify')}
              />
            </div>

            {/* Column C: Node Validator Identity Card (ProfileCard) */}
            <div>
              <ValidatorCard
                address="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
                nodeName="Oracle Validator Sigma-01"
                role="EVM Consensus & Keccak Signer"
                uptime="99.98%"
                blocksAttested={128450}
                onInspect={() => onNavigate?.('verify')}
              />
            </div>
          </div>

          {/* Row 4: Module Cards with Custom Glow Halos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            <ModuleCard
              title="C2PA Manifest Hard-Binding"
              description="Cryptographic metadata injection into JFIF/PNG chunks, surviving cross-platform recompression pipelines."
              icon={Fingerprint}
              badgeText="STANDARDIZED"
              badgeColor="#00f0ff"
              glowColor="190 90% 55%"
              colors={['#00f0ff', '#7c3aed', '#ff00c8']}
              actionText="Open Manifest Inspector"
              onAction={() => onNavigate?.('originate')}
            />

            <ModuleCard
              title="LSB Steganographic Watermark"
              description="Bit-redundant pixel watermarking with majority-vote decoding to resist social media stripping."
              icon={Droplets}
              badgeText="ROBUST"
              badgeColor="#a855f7"
              glowColor="275 85% 65%"
              colors={['#a855f7', '#ff00c8', '#00f0ff']}
              actionText="Launch Stegano Shield"
              onAction={() => onNavigate?.('watermark')}
            />

            <ModuleCard
              title="Adversarial Attack Sandbox"
              description="Test model provenance against byte mutation, ELA tampering, and broken DAG lineage attacks."
              icon={Zap}
              badgeText="SECURITY LAB"
              badgeColor="#ff00c8"
              glowColor="320 90% 60%"
              colors={['#ff00c8', '#00ffa3', '#00f0ff']}
              actionText="Simulate Adversarial Attack"
              onAction={() => onNavigate?.('adversarial')}
            />
          </div>
        </div>
      )}
    </section>
  );
}
