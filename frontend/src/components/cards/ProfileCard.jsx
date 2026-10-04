import React, { useRef, useEffect, useCallback, useState } from 'react';
import './ProfileCard.css';

/**
 * ProfileCard (React Bits Pattern)
 * 
 * 3D Holographic Identity Card with dynamic gyro tilt,
 * holographic glare, prismatic rainbow sheen, and energy dissipation.
 * 
 * Optimizations:
 * - Cancels RAF loop when settled to conserve GPU/CPU cycles
 * - Non-blocking touch scrolling (touch-action: pan-y)
 * - Scoped styles (no :root contamination)
 * - Safe pointer-events hierarchy for action buttons
 */
export default function ProfileCard({
  avatarUrl,
  name = 'Unnamed Node',
  title = 'Verified Identity',
  handle = '0x000…000',
  status = 'Connected',
  statusColor = '#00ffa3',
  contactText = 'Copy Address',
  onContact,
  innerGradient,
  behindGlowColor = 'rgba(139, 92, 246, 0.35)',
  showUserInfo = true,
  enableMobileTilt = false,
  badge,
  extraData,
  className = '',
  style = {},
  children,
}) {
  const cardWrapperRef = useRef(null);
  const animFrameRef = useRef(null);

  // Target and current interpolated values
  const physicsRef = useRef({
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
    pointerX: 50,
    pointerY: 50,
    glareOpacity: 0,
    targetGlare: 0,
    isHovered: false,
    isSettled: true,
  });

  const [copied, setCopied] = useState(false);

  // Smooth lerp loop (sleeps when settled)
  const updatePhysics = useCallback(() => {
    const P = physicsRef.current;
    const el = cardWrapperRef.current;
    if (!el) return;

    // Dampened spring interpolation
    const ease = 0.12;
    P.currentRotX += (P.targetRotX - P.currentRotX) * ease;
    P.currentRotY += (P.targetRotY - P.currentRotY) * ease;
    P.glareOpacity += (P.targetGlare - P.glareOpacity) * ease;

    // Apply scoped CSS variables
    el.style.setProperty('--pc-tilt-x', `${P.currentRotX.toFixed(2)}deg`);
    el.style.setProperty('--pc-tilt-y', `${P.currentRotY.toFixed(2)}deg`);
    el.style.setProperty('--pc-pointer-x', `${P.pointerX.toFixed(1)}%`);
    el.style.setProperty('--pc-pointer-y', `${P.pointerY.toFixed(1)}%`);
    el.style.setProperty('--pc-pointer-x-ratio', `${(P.pointerX / 100).toFixed(2)}`);
    el.style.setProperty('--pc-glare-opacity', P.glareOpacity.toFixed(2));

    // Check if card has settled back to equilibrium
    const deltaX = Math.abs(P.targetRotX - P.currentRotX);
    const deltaY = Math.abs(P.targetRotY - P.currentRotY);
    const deltaG = Math.abs(P.targetGlare - P.glareOpacity);

    if (!P.isHovered && deltaX < 0.01 && deltaY < 0.01 && deltaG < 0.01) {
      P.currentRotX = 0;
      P.currentRotY = 0;
      P.glareOpacity = 0;
      el.style.setProperty('--pc-tilt-x', '0deg');
      el.style.setProperty('--pc-tilt-y', '0deg');
      el.style.setProperty('--pc-glare-opacity', '0');
      P.isSettled = true;
      animFrameRef.current = null;
      return; // Stop animation loop until next interaction
    }

    animFrameRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  const wakeLoop = useCallback(() => {
    const P = physicsRef.current;
    if (P.isSettled) {
      P.isSettled = false;
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  }, [updatePhysics]);

  const handlePointerEnter = useCallback(() => {
    physicsRef.current.isHovered = true;
    physicsRef.current.targetGlare = 1;
    wakeLoop();
  }, [wakeLoop]);

  const handlePointerMove = useCallback((e) => {
    const el = cardWrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1; // -1 to +1
    const normalizedY = (y / rect.height) * 2 - 1; // -1 to +1

    const MAX_TILT = 14; // Degrees
    const P = physicsRef.current;
    P.targetRotX = -normalizedY * MAX_TILT;
    P.targetRotY = normalizedX * MAX_TILT;
    P.pointerX = (x / rect.width) * 100;
    P.pointerY = (y / rect.height) * 100;
    P.targetGlare = 1;

    wakeLoop();
  }, [wakeLoop]);

  const handlePointerLeave = useCallback(() => {
    const P = physicsRef.current;
    P.isHovered = false;
    P.targetRotX = 0;
    P.targetRotY = 0;
    P.targetGlare = 0;
    wakeLoop();
  }, [wakeLoop]);

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (onContact) {
      onContact();
    } else if (handle) {
      navigator.clipboard?.writeText(handle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const el = cardWrapperRef.current;
    if (!el) return;
    if (behindGlowColor) el.style.setProperty('--pc-behind-glow', behindGlowColor);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [behindGlowColor]);

  return (
    <div
      ref={cardWrapperRef}
      className={`pc-card-wrapper ${className}`}
      style={style}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Ambient identity backing glow */}
      <div className="pc-behind-glow" />

      {/* 3D tilting card body */}
      <div
        className="pc-card-inner"
        style={{
          background: innerGradient || 'linear-gradient(145deg, #090815 0%, #05040a 100%)',
        }}
      >
        {/* Holographic Sheen & Glare Overlays */}
        <div className="pc-glare" />
        <div className="pc-sheen" />
        <div className="pc-noise" />

        {/* Card Header: Network / Status Pill & Badge */}
        <div className="pc-header">
          <div className="pc-status-badge">
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: statusColor,
                boxShadow: `0 0 8px ${statusColor}`,
              }}
            />
            {status}
          </div>
          {badge && <div>{badge}</div>}
        </div>

        {/* Central Graphic / Avatar with 3D Pop */}
        <div className="pc-avatar-container">
          <div className="pc-avatar-ring">
            <img
              src={avatarUrl}
              alt={name}
              className="pc-avatar-img"
              loading="lazy"
            />
          </div>
        </div>

        {/* Optional Extra Custom Content */}
        {children && (
          <div style={{ position: 'relative', zIndex: 4, margin: '8px 0', pointerEvents: 'none' }}>
            {children}
          </div>
        )}

        {/* Card Footer: Frosted Glass User Identity Info Bar */}
        {showUserInfo && (
          <div className="pc-user-info">
            <div className="pc-user-meta">
              <div>
                <div className="pc-name">{name}</div>
                <div className="pc-title">{title}</div>
              </div>
              <div className="pc-handle">{handle}</div>
            </div>

            {extraData && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', pointerEvents: 'none' }}>
                {extraData}
              </div>
            )}

            <button
              type="button"
              className="pc-action-btn"
              onClick={handleActionClick}
              aria-label={contactText}
            >
              {copied ? '✓ Copied to Clipboard' : contactText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
