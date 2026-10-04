import React from 'react';
import BorderGlow from './BorderGlow';
import { truncateHash, deriveIdentity } from '../../utils/deriveIdentity';
import { Blocks, Fuel, Cpu, Clock } from 'lucide-react';

/**
 * BlockCard
 * 
 * Displays verified block header details, validator signatures, and gas usage.
 */
export default function BlockCard({
  blockNumber = 19420841,
  hash = '0x88e962236b733e1664f54620a160fa1cbdec64e25514b534e7048f99497e7997',
  txCount = 142,
  timestamp = '8s ago',
  validator = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  gasUsed = 12450000,
  gasLimit = 30000000,
  className = '',
  style = {},
  onClick,
}) {
  const idData = deriveIdentity(hash);
  const gasPercent = Math.min(100, Math.round((gasUsed / gasLimit) * 100));

  return (
    <BorderGlow
      backgroundColor="#090812"
      borderRadius={22}
      glowRadius={34}
      glowIntensity={0.95}
      coneSpread={26}
      glowColor="185 85% 55%" // Cyan/Teal block theme
      colors={['#00f0ff', '#38bdf8', '#00ffa3']}
      className={className}
      style={{ minHeight: '190px', ...style }}
      onClick={onClick}
    >
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
        {/* Top: Block badge & timestamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 240, 255, 0.12)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Blocks size={16} color="#00f0ff" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
              }}>
                #{blockNumber.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Hash: {truncateHash(hash, 6, 6)}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.72rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono, monospace)',
          }}>
            <Clock size={12} />
            {timestamp}
          </div>
        </div>

        {/* Validator & Tx Count */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '10px 14px',
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Transactions</div>
            <div style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#00ffa3',
            }}>
              {txCount} txs
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase' }}>Validator</div>
            <div style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.78rem',
              color: '#38bdf8',
              marginTop: '4px',
            }}>
              {truncateHash(validator, 6, 4)}
            </div>
          </div>
        </div>

        {/* Gas target progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Fuel size={12} color="#00f0ff" /> Gas Utilization
            </span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#00f0ff' }}>
              {gasPercent}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${gasPercent}%`,
              height: '100%',
              backgroundColor: '#00f0ff',
              boxShadow: '0 0 8px rgba(0, 240, 255, 0.8)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}
