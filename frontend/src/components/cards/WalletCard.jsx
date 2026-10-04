import React from 'react';
import ProfileCard from './ProfileCard';
import { deriveIdentity, truncateHash } from '../../utils/deriveIdentity';
import { Wallet, ShieldCheck, Coins } from 'lucide-react';

/**
 * WalletCard
 * 
 * Holographic 3D wallet card with deterministic identity colors,
 * network status, and on-chain asset balances.
 */
export default function WalletCard({
  address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  ensName = 'deployer.model.eth',
  network = 'Hardhat EVM Localnet',
  balanceEth = '10,000.00 ETH',
  balanceMlg = '4,500 MLG',
  onDisconnect,
  className = '',
  style = {},
}) {
  const idData = deriveIdentity(address);

  const extraData = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
      <div>
        <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase' }}>Balance</div>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: '#f8fafc' }}>
          {balanceEth}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase' }}>Protocol Tokens</div>
        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: idData.primaryColor }}>
          {balanceMlg}
        </div>
      </div>
    </div>
  );

  return (
    <ProfileCard
      avatarUrl={idData.avatarUrl}
      name={ensName || truncateHash(address, 6, 4)}
      title="Connected Signer"
      handle={truncateHash(address, 6, 6)}
      status={network}
      statusColor="#00ffa3"
      contactText="Copy Wallet Address"
      innerGradient={idData.innerGradient}
      behindGlowColor={idData.behindGlowColor}
      badge={(
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          fontSize: '0.7rem',
          color: '#00f0ff',
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          <ShieldCheck size={12} />
          EVM Verified
        </div>
      )}
      extraData={extraData}
      className={className}
      style={style}
    />
  );
}
