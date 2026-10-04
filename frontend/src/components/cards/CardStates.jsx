import React from 'react';
import BorderGlow from './BorderGlow';
import { AlertCircle, RefreshCw, Database, WifiOff } from 'lucide-react';

/**
 * CardSkeleton
 * 
 * Shimmering loading placeholder for stats, blocks, and transaction cards.
 */
export function CardSkeleton({
  height = '180px',
  borderRadius = 22,
  className = '',
  style = {},
}) {
  return (
    <div
      className={className}
      style={{
        height,
        borderRadius: `${borderRadius}px`,
        backgroundColor: '#090812',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      {/* Shimmer Wave */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.04) 50%, transparent 100%)',
        animation: 'skeletonShimmer 1.8s infinite linear',
        pointerEvents: 'none',
      }} />

      {/* Top placeholder */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '40%', height: '14px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />
      </div>

      {/* Middle placeholder */}
      <div style={{ width: '60%', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Bottom placeholder */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ width: '25%', height: '12px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
        <div style={{ width: '45%', height: '12px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }} />
      </div>

      <style>{`
        @keyframes skeletonShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

/**
 * CardError
 * 
 * Displays RPC connection failures or query errors with a retry action.
 */
export function CardError({
  title = 'RPC Node Unreachable',
  message = 'Could not fetch live block consensus from local EVM testnet.',
  onRetry,
  height = '180px',
  className = '',
  style = {},
}) {
  return (
    <BorderGlow
      backgroundColor="#10070d"
      borderRadius={22}
      glowRadius={30}
      glowIntensity={0.8}
      glowColor="350 85% 55%"
      colors={['#ff3366', '#ffaa00', '#7c3aed']}
      className={className}
      style={{ height, ...style }}
    >
      <div style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        gap: '10px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 51, 102, 0.15)',
          border: '1px solid rgba(255, 51, 102, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff3366',
        }}>
          <WifiOff size={18} />
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#f8fafc',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: '#94a3b8',
            maxWidth: '280px',
            marginTop: '3px',
          }}>
            {message}
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 51, 102, 0.12)',
              border: '1px solid rgba(255, 51, 102, 0.3)',
              color: '#ff3366',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <RefreshCw size={12} />
            Retry RPC Query
          </button>
        )}
      </div>
    </BorderGlow>
  );
}

/**
 * CardEmpty
 * 
 * Empty state indicator for transaction feeds or model registries.
 */
export function CardEmpty({
  title = 'No On-Chain Records Yet',
  message = 'Register your first genesis artifact to begin streaming live transactions.',
  height = '180px',
  actionText,
  onAction,
  className = '',
  style = {},
}) {
  return (
    <BorderGlow
      backgroundColor="#090814"
      borderRadius={22}
      glowRadius={28}
      glowIntensity={0.6}
      glowColor="215 50% 50%"
      colors={['#64748b', '#38bdf8', '#7c3aed']}
      className={className}
      style={{ height, ...style }}
    >
      <div style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        gap: '8px',
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
        }}>
          <Database size={18} />
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#f8fafc',
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: '#64748b',
            maxWidth: '300px',
            marginTop: '3px',
          }}>
            {message}
          </div>
        </div>

        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="btn btn-ghost"
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              borderRadius: '9999px',
              marginTop: '4px',
            }}
          >
            {actionText}
          </button>
        )}
      </div>
    </BorderGlow>
  );
}
