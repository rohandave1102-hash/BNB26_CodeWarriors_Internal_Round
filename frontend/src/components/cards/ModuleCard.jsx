import React from 'react';
import BorderGlow from './BorderGlow';
import { ArrowUpRight } from 'lucide-react';

/**
 * ModuleCard
 * 
 * Interactive feature/module panel with custom glowing icon and action trigger.
 */
export default function ModuleCard({
  title,
  description,
  icon: Icon,
  badgeText,
  badgeColor = '#00f0ff',
  glowColor = '275 85% 65%',
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  actionText = 'Launch Module',
  onAction,
  className = '',
  style = {},
}) {
  return (
    <BorderGlow
      backgroundColor="#0A0914"
      borderRadius={22}
      glowRadius={36}
      glowIntensity={1.0}
      coneSpread={24}
      glowColor={glowColor}
      colors={colors}
      className={className}
      style={{ minHeight: '210px', ...style }}
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        {/* Top: Icon & Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          {Icon && (
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: `${badgeColor}15`,
              border: `1px solid ${badgeColor}35`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${badgeColor}20`,
            }}>
              <Icon size={22} color={badgeColor} />
            </div>
          )}

          {badgeText && (
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: `${badgeColor}15`,
              border: `1px solid ${badgeColor}30`,
              color: badgeColor,
            }}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#f8fafc',
            marginBottom: '8px',
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            lineHeight: 1.55,
          }}>
            {description}
          </p>
        </div>

        {/* Action Link */}
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={onAction}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: badgeColor,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontWeight: 600,
              padding: 0,
              transition: 'transform 0.2s ease, opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <span>{actionText}</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </BorderGlow>
  );
}
