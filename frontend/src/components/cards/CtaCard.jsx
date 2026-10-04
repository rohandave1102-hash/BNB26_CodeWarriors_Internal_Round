import React from 'react';
import BorderGlow from './BorderGlow';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * CtaCard (Highlight Card)
 * 
 * One per page; uses `animated={true}` on BorderGlow for an active laser-sweep
 * perimeter beam that instantly draws attention.
 */
export default function CtaCard({
  title = 'Anchor Your First AI Asset On-Chain',
  description = 'Generate a cryptographic C2PA manifest with salted Keccak-256 prompt commitments and IPFS pinning.',
  primaryActionText = 'Register Genesis Asset',
  secondaryActionText = 'Read Specifications',
  onPrimaryAction,
  onSecondaryAction,
  badgeText = 'NEW PROTOCOL FEATURE',
  className = '',
  style = {},
}) {
  return (
    <BorderGlow
      animated={true} // Single animated card per page rule
      backgroundColor="#0D0A18"
      borderRadius={26}
      glowRadius={42}
      glowIntensity={1.25}
      coneSpread={30}
      glowColor="315 90% 60%" // Magenta/Cyan high-contrast theme
      colors={['#ff00c8', '#00f0ff', '#7c3aed']}
      fillOpacity={0.6}
      className={className}
      style={{ width: '100%', ...style }}
    >
      <div style={{
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(255, 0, 200, 0.04) 0%, rgba(0, 240, 255, 0.04) 100%)',
      }}>
        {/* Top: Pill Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 0, 200, 0.12)',
            border: '1px solid rgba(255, 0, 200, 0.3)',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#ff00c8',
          }}>
            <Sparkles size={13} />
            {badgeText}
          </span>
        </div>

        {/* Content */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: '#94a3b8',
            maxWidth: '680px',
            lineHeight: 1.6,
          }}>
            {description}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onPrimaryAction}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '0.9rem',
              borderRadius: '9999px',
              boxShadow: '0 0 25px rgba(255, 0, 200, 0.4), 0 0 10px rgba(0, 240, 255, 0.3)',
            }}
          >
            <span>{primaryActionText}</span>
            <ArrowRight size={16} />
          </button>

          {secondaryActionText && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="btn btn-ghost"
              style={{
                padding: '12px 24px',
                fontSize: '0.9rem',
                borderRadius: '9999px',
              }}
            >
              {secondaryActionText}
            </button>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}
