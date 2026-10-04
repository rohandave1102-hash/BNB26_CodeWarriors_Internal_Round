import React from 'react';
import ProfileCard from './ProfileCard';
import { deriveIdentity, truncateHash } from '../../utils/deriveIdentity';
import { Cpu, CheckCircle2 } from 'lucide-react';

/**
 * ValidatorCard
 * 
 * Holographic 3D card for EVM consensus validators & oracle nodes.
 */
export default function ValidatorCard({
  address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  nodeName = 'Validator Node Alpha-07',
  role = 'Consensus Signer & Oracle',
  uptime = '99.98%',
  blocksAttested = 84210,
  slashingRisk = '0.00%',
  onInspect,
  className = '',
  style = {},
}) {
  const idData = deriveIdentity(address);

  const extraData = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
      <div>
        <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase' }}>Uptime</div>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: '#00ffa3' }}>
          {uptime}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase' }}>Blocks Signed</div>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: idData.primaryColor }}>
          {blocksAttested.toLocaleString()}
        </div>
      </div>
    </div>
  );

  return (
    <ProfileCard
      avatarUrl={idData.avatarUrl}
      name={nodeName}
      title={role}
      handle={truncateHash(address, 6, 6)}
      status="Active Validator"
      statusColor="#00ffa3"
      contactText="Inspect Node Metrics"
      onContact={onInspect}
      innerGradient={idData.innerGradient}
      behindGlowColor={idData.behindGlowColor}
      badge={(
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(0, 255, 163, 0.1)',
          border: '1px solid rgba(0, 255, 163, 0.25)',
          fontSize: '0.7rem',
          color: '#00ffa3',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          <CheckCircle2 size={12} />
          Epoch Active
        </div>
      )}
      extraData={extraData}
      className={className}
      style={style}
    />
  );
}
