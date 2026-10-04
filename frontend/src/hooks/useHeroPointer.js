import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useHeroPointer
 * 
 * Reusable pointer intelligence hook tracking:
 * - Position & normalized coordinates
 * - Instantaneous velocity & smoothed speed
 * - Idle time detection (triggers after ~600ms of stillness only inside hero)
 * - Magnetic snapping targets (buttons, CTAs, pills)
 * - Hero boundary detection & touch gestures
 */
export function useHeroPointer(heroContainerRef, options = {}) {
  const {
    idleThresholdMs = 600,
    snapSelector = 'button, a, .btn, .pill-nav-item, [role="button"]',
    enabled = true,
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
    isOverHero: enabled,
    isIdle: false,
    idleStartTime: performance.now(),
    snapTarget: null,
    snapColor: null,
    lastClick: null,
    isTouch: false,
  });

  const lastMoveTimeRef = useRef(performance.now());
  const touchHoldTimerRef = useRef(null);

  const [pointerSnapshot, setPointerSnapshot] = useState({
    isIdle: false,
    isOverHero: enabled,
    speed: 0,
  });

  const handlePointerMove = useCallback((e) => {
    if (!enabled) {
      stateRef.current.isOverHero = false;
      stateRef.current.isIdle = false;
      return;
    }

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

    // Reset idle timer on noticeable motion
    if (dist > 2) {
      S.isIdle = false;
      S.idleStartTime = now;
    }

    // Check if pointer is currently inside hero container
    if (heroContainerRef?.current) {
      const rect = heroContainerRef.current.getBoundingClientRect();
      S.isOverHero = (
        newX >= rect.left &&
        newX <= rect.right &&
        newY >= rect.top &&
        newY <= rect.bottom
      );
    } else {
      // Default: only top section when scrollY is near top
      const scrollY = window.scrollY || 0;
      S.isOverHero = scrollY < 400 && newY < window.innerHeight * 0.85;
    }

    // Magnetic snapping check
    if (S.isOverHero) {
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
        const accent = snapEl.getAttribute('data-accent') ||
          (snapEl.classList.contains('btn-primary') ? '#00f0ff' : '#a855f7');
        S.snapColor = accent;
      } else {
        S.snapTarget = null;
        S.snapColor = null;
      }
    } else {
      S.snapTarget = null;
      S.snapColor = null;
      S.isIdle = false;
    }
  }, [heroContainerRef, snapSelector, enabled]);

  // Handle background canvas click only (ignore interactive elements and non-hero clicks)
  const handleClick = useCallback((e) => {
    if (!enabled || !stateRef.current.isOverHero) return;

    // Do NOT register clicks on buttons, links, inputs, navbar, or docks
    const target = e.target;
    if (
      target.closest &&
      target.closest('button, a, input, select, textarea, [role="button"], .dock-item, .pill-nav-item, .navbar, .glass, .card, .border-glow-wrapper')
    ) {
      return;
    }

    stateRef.current.lastClick = {
      x: e.clientX,
      y: e.clientY,
      timestamp: performance.now(),
    };
  }, [enabled]);

  // Touch device support
  const handleTouchStart = useCallback((e) => {
    if (!enabled) return;
    stateRef.current.isTouch = true;
    const touch = e.touches[0];
    if (!touch) return;

    handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY });

    // Press and hold for 500ms triggers singularity
    touchHoldTimerRef.current = setTimeout(() => {
      if (stateRef.current.isOverHero) {
        stateRef.current.isIdle = true;
        stateRef.current.idleStartTime = performance.now();
      }
    }, 500);
  }, [handlePointerMove, enabled]);

  const handleTouchEnd = useCallback((e) => {
    if (touchHoldTimerRef.current) clearTimeout(touchHoldTimerRef.current);
    stateRef.current.isIdle = false;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Idle evaluation interval (every 80ms)
    const idleCheckInterval = setInterval(() => {
      if (!enabled) return;

      const S = stateRef.current;
      const now = performance.now();
      const timeSinceMove = now - lastMoveTimeRef.current;

      if (!S.isIdle && timeSinceMove >= idleThresholdMs && S.isOverHero && !S.snapTarget) {
        S.isIdle = true;
        S.idleStartTime = now;
        setPointerSnapshot(prev => ({ ...prev, isIdle: true }));
      } else if (S.isIdle && (!S.isOverHero || timeSinceMove < idleThresholdMs)) {
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
  }, [handlePointerMove, handleClick, handleTouchStart, handleTouchEnd, idleThresholdMs, enabled]);

  return {
    stateRef,
    pointerSnapshot,
  };
}
