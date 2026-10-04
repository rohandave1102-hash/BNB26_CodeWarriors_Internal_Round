import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useHeroPointer
 * 
 * Reusable pointer intelligence hook tracking:
 * - Position & normalized coordinates
 * - Instantaneous velocity & smoothed speed
 * - Idle time detection (triggers after ~600ms of stillness)
 * - Magnetic snapping targets (buttons, CTAs, pills)
 * - Hero boundary detection & touch gestures
 */
export function useHeroPointer(heroContainerRef, options = {}) {
  const {
    idleThresholdMs = 600,
    snapSelector = 'button, a, .btn, .pill-nav-item, [role="button"]',
  } = options;

  const stateRef = useRef({
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.35,
    prevX: window.innerWidth * 0.5,
    prevY: window.innerHeight * 0.35,
    vx: 0,
    vy: 0,
    speed: 0,
    xNorm: 0.5,
    yNorm: 0.35,
    isOverHero: true,
    isIdle: false,
    idleStartTime: performance.now(),
    snapTarget: null,
    snapColor: null,
    lastClick: null,
    isTouch: false,
  });

  const lastMoveTimeRef = useRef(performance.now());
  const touchHoldTimerRef = useRef(null);

  // Re-render state for consumers that need reactive state
  const [pointerSnapshot, setPointerSnapshot] = useState({
    isIdle: false,
    isOverHero: true,
    speed: 0,
  });

  const handlePointerMove = useCallback((e) => {
    const S = stateRef.current;
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTimeRef.current);
    lastMoveTimeRef.current = now;

    const newX = e.clientX;
    const newY = e.clientY;

    const dx = newX - S.prevX;
    const dy = newY - S.prevY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Instantaneous velocity (px per second normalized)
    S.vx = (dx / dt) * 16.66;
    S.vy = (dy / dt) * 16.66;
    // Smoothed speed
    S.speed = S.speed * 0.7 + dist * 0.3;

    S.prevX = S.x;
    S.prevY = S.y;
    S.x = newX;
    S.y = newY;
    S.xNorm = Math.max(0, Math.min(1, newX / window.innerWidth));
    S.yNorm = Math.max(0, Math.min(1, newY / window.innerHeight));

    // Reset idle timer
    if (dist > 1.5) {
      S.isIdle = false;
      S.idleStartTime = now;
    }

    // Check if within hero container
    if (heroContainerRef?.current) {
      const rect = heroContainerRef.current.getBoundingClientRect();
      S.isOverHero = (
        newX >= rect.left &&
        newX <= rect.right &&
        newY >= rect.top &&
        newY <= rect.bottom
      );
    } else {
      // Default to top 85svh
      S.isOverHero = newY < window.innerHeight * 0.85;
    }

    // Magnetic snapping check
    const target = document.elementFromPoint(newX, newY);
    const snapEl = target?.closest(snapSelector);
    if (snapEl) {
      const rect = snapEl.getBoundingClientRect();
      S.snapTarget = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      };
      // Check data attributes or computed accent
      const accent = snapEl.getAttribute('data-accent') ||
        (snapEl.classList.contains('btn-primary') ? '#ff00c8' : '#00f0ff');
      S.snapColor = accent;
    } else {
      S.snapTarget = null;
      S.snapColor = null;
    }
  }, [heroContainerRef, snapSelector]);

  const handleClick = useCallback((e) => {
    stateRef.current.lastClick = {
      x: e.clientX,
      y: e.clientY,
      timestamp: performance.now(),
    };
  }, []);

  // Touch device support
  const handleTouchStart = useCallback((e) => {
    stateRef.current.isTouch = true;
    const touch = e.touches[0];
    if (!touch) return;

    handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });

    // Press and hold for 400ms triggers dark-matter singularity
    touchHoldTimerRef.current = setTimeout(() => {
      stateRef.current.isIdle = true;
      stateRef.current.idleStartTime = performance.now();
    }, 400);
  }, [handlePointerMove]);

  const handleTouchEnd = useCallback((e) => {
    if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
    if (e.changedTouches[0]) {
      const touch = e.changedTouches[0];
      handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    }
    stateRef.current.isIdle = false;
  }, [handleClick]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Idle evaluation interval (every 80ms)
    const idleCheckInterval = setInterval(() => {
      const S = stateRef.current;
      const now = performance.now();
      const timeSinceMove = now - lastMoveTimeRef.current;

      if (!S.isIdle && timeSinceMove >= idleThresholdMs && S.isOverHero) {
        S.isIdle = true;
        S.idleStartTime = now;
        setPointerSnapshot(prev => ({ ...prev, isIdle: true }));
      } else if (S.isIdle && timeSinceMove < idleThresholdMs) {
        S.isIdle = false;
        setPointerSnapshot(prev => ({ ...prev, isIdle: false }));
      }

      // Decay speed smoothly towards 0 when still
      S.speed *= 0.88;
    }, 80);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      clearInterval(idleCheckInterval);
      if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
    };
  }, [handlePointerMove, handleClick, handleTouchStart, handleTouchEnd, idleThresholdMs]);

  return {
    stateRef,
    pointerSnapshot,
  };
}
