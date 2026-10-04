import React, { useState, useEffect } from 'react';
import {
  StatCard,
  TransactionCard,
  ModuleCard,
  CtaCard,
  CredentialCard,
} from './cards';
import {
  Blocks,
  Activity,
  ShieldCheck,
  Fingerprint,
  Droplets,
} from 'lucide-react';

/**
 * BlockchainBentoSection
 * 
 * Clean, focused Asymmetric Bento-Layout Matrix featuring:
 * - Highlight CTA Banner with active laser-sweep border
 * - 3 Real-time Metric Panels with CountUp numerals
 * - Live verified Transaction stream + Holographic Proof-of-Issuance Credential
 * - 2 Core Technology Panels (C2PA Hard-Binding & LSB Steganography)
 */
export default function BlockchainBentoSection({ stats = {}, onNavigate }) {
  const [liveBlockNumber, setLiveBlockNumber] = useState(19420841);
  const [confirmationTick, setConfirmationTick] = useState(9);

  // Live block stream simulation (advances gently every 8s)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveBlockNumber((b) => b + 1);
      setConfirmationTick((c) => (c >= 12 ? 1 : c + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '10px 24px 70px' }}>
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

        {/* Row 3: Asymmetric Bento: Wide Transaction Stream + Holographic Credential Proof */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
        }}>
          {/* Column A: Wide Transaction Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
        </div>

        {/* Row 4: 2 Focused Module Cards with Custom Glow Halos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
        </div>
      </div>
    </section>
  );
}
