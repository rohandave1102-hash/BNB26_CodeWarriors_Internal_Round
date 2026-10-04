import React, { useState } from 'react';
import BorderGlow from './BorderGlow';
import { truncateHash, deriveIdentity } from '../../utils/deriveIdentity';
import { Copy, Check, ArrowRight, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

/**
 * StatusMark badge with icon & pulse dot
 */
export function StatusMark({ status = 'Done' }) {
  const configs = {
    Pending: {
      color: '#ffaa00',
      bg: 'rgba(255, 170, 0, 0.12)',
      border: 'rgba(255, 170, 0, 0.25)',
      icon: Clock,
      pulse: true,
    },
    Running: {
      color: '#00f0ff',
      bg: 'rgba(0, 240, 255, 0.12)',
      border: 'rgba(0, 240, 255, 0.3)',
      icon: Clock,
      pulse: true,
    },
    Done: {
      color: '#00ffa3',
      bg: 'rgba(0, 255, 163, 0.12)',
      border: 'rgba(0, 255, 163, 0.25)',
      icon: CheckCircle2,
      pulse: false,
    },
    Failed: {
      color: '#ff3366',
      bg: 'rgba(255, 51, 102, 0.12)',
      border: 'rgba(255, 51, 102, 0.25)',
      icon: AlertTriangle,
      pulse: false,
    },
    Cancelled: {
      color: '#94a3b8',
      bg: 'rgba(148, 163, 184, 0.12)',
      border: 'rgba(148, 163, 184, 0.25)',
      icon: XCircle,
      pulse: false,
    },
  };

  const current = configs[status] || configs.Done;
  const Icon = current.icon;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      borderRadius: '9999px',
      backgroundColor: current.bg,
      border: `1px solid ${current.border}`,
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: '0.72rem',
      fontWeight: 600,
      color: current.color,
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: current.color,
        boxShadow: `0 0 8px ${current.color}`,
        animation: current.pulse ? 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none',
      }} />
      <Icon size={12} />
      <span>{status}</span>
    </div>
  );
}

/**
 * TransactionCard
 * 
 * Shows on-chain tx hash, from/to routing, value, gas, and confirmation status.
 */
export default function TransactionCard({
  hash = '0x3fa85f64297c8363c79c1bcdec144298793144d47660770d107a0e361c2c5b92',
  from = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  to = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  value = '0.00 ETH',
  actionType = 'ORIGINATE_GENESIS',
  confirmations = 12,
  requiredConfirmations = 12,
  status = 'Done', // 'Pending' | 'Running' | 'Done' | 'Failed' | 'Cancelled'
  timestamp = 'Just now',
  className = '',
  style = {},
}) {
  const [copied, setCopied] = useState(false);
  const idData = deriveIdentity(hash);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min(100, Math.round((confirmations / requiredConfirmations) * 100));

  return (
    <BorderGlow
      backgroundColor="#0A0914"
      borderRadius={22}
      glowRadius={32}
      glowIntensity={0.9}
      coneSpread={26}
      glowColor={idData.glowColor}
      colors={idData.colors}
      className={className}
      style={{ minHeight: '190px', ...style }}
    >
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
        {/* Top: Action Type Badge & StatusMark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: idData.primaryColor,
              backgroundColor: `${idData.primaryColor}15`,
              border: `1px solid ${idData.primaryColor}30`,
              padding: '3px 8px',
              borderRadius: '6px',
            }}>
              {actionType}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{timestamp}</span>
          </div>

          <StatusMark status={status} />
        </div>

        {/* Center: Hash with Copy Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '8px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tx:</span>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#f8fafc',
              letterSpacing: '0.04em',
            }}>
              {truncateHash(hash, 10, 8)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: copied ? '#00ffa3' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono, monospace)',
              padding: '4px 6px',
              borderRadius: '6px',
              transition: 'color 0.2s',
            }}
            title="Copy transaction hash"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Routing: From -> To & Value */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>{truncateHash(from, 6, 4)}</span>
            <ArrowRight size={13} color="#64748b" />
            <span style={{ fontFamily: 'var(--font-mono, monospace)' }}>{truncateHash(to, 6, 4)}</span>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontWeight: 700,
            color: '#f8fafc',
          }}>
            {value}
          </div>
        </div>

        {/* Bottom: Confirmation progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>
            <span>Confirmations</span>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', color: progressPercent === 100 ? '#00ffa3' : '#00f0ff' }}>
              {confirmations}/{requiredConfirmations} ({progressPercent}%)
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
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: progressPercent === 100 ? '#00ffa3' : idData.primaryColor,
              boxShadow: `0 0 8px ${progressPercent === 100 ? '#00ffa3' : idData.primaryColor}`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}
