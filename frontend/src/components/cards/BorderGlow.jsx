import React, { useRef, useState, useEffect, useCallback } from 'react';
import './BorderGlow.css';

/**
 * BorderGlow (React Bits Pattern)
 * 
 * Interactive panel with dynamic edge glow, conic perimeter beam,
 * keyboard focus illumination, and mobile tap response.
 */
export default function BorderGlow({
  children,
  className = '',
  style = {},
  backgroundColor = '#0B0912',
  borderRadius = 24,
  glowRadius = 36,
  glowIntensity = 1.0,
  coneSpread = 25,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  glowColor = '275 85% 65%',
  animated = false,
  fillOpacity = 0.5,
  disabled = false,
  role,
  tabIndex,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const fadeTimeoutRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Compute cursor position relative to card and calculate angle / edge proximity
  const handlePointerMove = useCallback((e) => {
    if (disabled || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = x - centerX;
    const deltaY = y - centerY;

    // Angle in degrees from center
    const angleRad = Math.atan2(deltaY, deltaX);
    let angleDeg = (angleRad * (180 / Math.PI)) + 90;
    if (angleDeg < 0) angleDeg += 360;

    // Proximity to closest edge (0 = center, 1 = perimeter or outside)
    const normalizedDistX = Math.abs(deltaX) / centerX;
    const normalizedDistY = Math.abs(deltaY) / centerY;
    const edgeProximity = Math.min(Math.max(normalizedDistX, normalizedDistY), 1);

    card.style.setProperty('--cursor-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--cursor-y', `${(y / rect.height) * 100}%`);
    card.style.setProperty('--cursor-angle', `${angleDeg}deg`);
    card.style.setProperty('--edge-proximity', (0.35 + edgeProximity * 0.65).toFixed(3));
  }, [disabled]);

  const handlePointerLeave = useCallback(() => {
    if (disabled || !cardRef.current || isFocused) return;
    const card = cardRef.current;
    card.style.setProperty('--edge-proximity', '0');
  }, [disabled, isFocused]);

  // Touch / tap feedback (mobile support)
  const handleTouchStart = useCallback((e) => {
    if (disabled || !cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    card.style.setProperty('--cursor-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--cursor-y', `${(y / rect.height) * 100}%`);
    card.style.setProperty('--cursor-angle', '45deg');
    card.style.setProperty('--edge-proximity', '1');

    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    fadeTimeoutRef.current = setTimeout(() => {
      if (cardRef.current && !isFocused) {
        cardRef.current.style.setProperty('--edge-proximity', '0');
      }
    }, 1200);
  }, [disabled, isFocused]);

  // Keyboard accessibility
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--edge-proximity', '0.9');
      cardRef.current.style.setProperty('--cursor-angle', '45deg');
      cardRef.current.style.setProperty('--cursor-x', '50%');
      cardRef.current.style.setProperty('--cursor-y', '0%');
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--edge-proximity', '0');
    }
  }, []);

  // Set initial CSS variables
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty('--card-bg', backgroundColor);
    card.style.setProperty('--border-radius', `${borderRadius}px`);
    card.style.setProperty('--glow-radius', `${glowRadius}px`);
    card.style.setProperty('--glow-intensity', `${glowIntensity}`);
    card.style.setProperty('--cone-spread', `${coneSpread}deg`);
    card.style.setProperty('--glow-color', glowColor);
    card.style.setProperty('--color-1', colors[0] || '#c084fc');
    card.style.setProperty('--color-2', colors[1] || '#f472b6');
    card.style.setProperty('--color-3', colors[2] || '#38bdf8');
    card.style.setProperty('--fill-opacity', `${fillOpacity}`);

    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [backgroundColor, borderRadius, glowRadius, glowIntensity, coneSpread, glowColor, colors, fillOpacity]);

  return (
    <div
      ref={cardRef}
      className={`border-glow-wrapper ${animated ? 'border-glow-animated' : ''} ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        ...style,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      role={role ?? (onClick ? 'button' : undefined)}
      onClick={onClick}
      {...props}
    >
      <div className="border-glow-inner" style={{ borderRadius: `${borderRadius}px` }}>
        <div className="border-glow-fill" />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
