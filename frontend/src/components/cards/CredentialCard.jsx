import React from 'react';
import ProfileCard from './ProfileCard';
import { deriveIdentity, truncateHash } from '../../utils/deriveIdentity';
import { Award, CheckCircle2, Shield, Hash, Globe } from 'lucide-react';

/**
 * CredentialCard
 * 
 * Holographic proof-of-issuance credential card for verified AI models and artifacts.
 */
export default function CredentialCard({
  title = 'Autonomous Genesis Model #409',
  issuer = 'ModelLedger Protocol Authority',
  creator = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  assetHash = '0xa87f4c9b2e1d034981f9a2345091238479102938471092837401928374019283',
  ipfsCid = 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
  onVerify,
  className = '',
  style = {},
}) {
  const idData = deriveIdentity(assetHash);

  const extraData = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Hash size={11} /> Hash
        </span>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#f8fafc' }}>
          {truncateHash(assetHash, 6, 6)}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Globe size={11} /> IPFS CID
        </span>
        <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#00f0ff' }}>
          {truncateHash(ipfsCid, 6, 4)}
        </span>
      </div>
    </div>
  );

  return (
    <ProfileCard
      avatarUrl={idData.avatarUrl}
      name={title}
      title={issuer}
      handle={truncateHash(creator, 6, 4)}
      status="C2PA Certified"
      statusColor="#00ffa3"
      contactText="Verify Proof On-Chain"
      onContact={onVerify}
      innerGradient={idData.innerGradient}
      behindGlowColor={idData.behindGlowColor}
      badge={(
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(124, 58, 237, 0.15)',
          border: '1px solid rgba(124, 58, 237, 0.35)',
          fontSize: '0.7rem',
          color: '#c4b5fd',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          <Award size={12} />
          W3C Verifiable
        </div>
      )}
      extraData={extraData}
      className={className}
      style={style}
    />
  );
}
