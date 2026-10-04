import React, { useEffect, useState, useRef } from 'react';
import BorderGlow from './BorderGlow';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Animated CountUp Hook
 */
function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    if (typeof target !== 'number' || isNaN(target)) {
      setCount(target);
      return;
    }

    const startVal = prevTargetRef.current;
    const endVal = target;
    prevTargetRef.current = target;

    let startTime = null;
    let animId = null;

    const step = (now) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + (endVal - startVal) * ease));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [target, duration]);

  return count;
}

/**
 * StatCard
 * 
 * Interactive metric panel using BorderGlow with smooth CountUp numerals,
 * status trend pills, and custom icon halos.
 */
export default function StatCard({
  label,
  value,
  previousValue,
  unit = '',
  trend = null, // e.g. "+12.4%" or "-2.1%"
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon,
  accentColor = '#00f0ff',
  glowColor = '190 90% 55%',
  colors = ['#00f0ff', '#7c3aed', '#ff00c8'],
  subtitle,
  className = '',
  style = {},
  onClick,
}) {
  const isNumeric = typeof value === 'number';
  const animatedValue = useCountUp(isNumeric ? value : 0);

  return (
    <BorderGlow
      backgroundColor="#090814"
      borderRadius={22}
      glowRadius={36}
      glowIntensity={1.1}
      coneSpread={24}
      glowColor={glowColor}
      colors={colors}
      fillOpacity={0.4}
      className={className}
      style={{ minHeight: '160px', ...style }}
      onClick={onClick}
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        {/* Top row: Label & Icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#94a3b8',
            }}>
              {label}
            </span>
          </div>

          {Icon && (
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: `${accentColor}18`,
              border: `1px solid ${accentColor}35`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 16px ${accentColor}25`,
            }}>
              <Icon size={18} color={accentColor} />
            </div>
          )}
        </div>

        {/* Middle row: CountUp Metric Value */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
          <span style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: '2.1rem',
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            {isNumeric ? animatedValue.toLocaleString() : value}
          </span>
          {unit && (
            <span style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.9rem',
              color: accentColor,
              fontWeight: 600,
            }}>
              {unit}
            </span>
          )}
        </div>

        {/* Bottom row: Trend badge & subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          {trend && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 600,
              backgroundColor: trendDirection === 'up'
                ? 'rgba(0, 255, 163, 0.12)'
                : trendDirection === 'down'
                ? 'rgba(255, 51, 102, 0.12)'
                : 'rgba(255, 255, 255, 0.08)',
              color: trendDirection === 'up'
                ? '#00ffa3'
                : trendDirection === 'down'
                ? '#ff3366'
                : '#94a3b8',
              border: `1px solid ${
                trendDirection === 'up'
                  ? 'rgba(0, 255, 163, 0.25)'
                  : trendDirection === 'down'
                  ? 'rgba(255, 51, 102, 0.25)'
                  : 'rgba(255, 255, 255, 0.1)'
              }`,
            }}>
              {trendDirection === 'up' && <TrendingUp size={12} />}
              {trendDirection === 'down' && <TrendingDown size={12} />}
              {trendDirection === 'neutral' && <Minus size={12} />}
              {trend}
            </div>
          )}

          {subtitle && (
            <span style={{
              fontSize: '0.75rem',
              color: '#64748b',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}
