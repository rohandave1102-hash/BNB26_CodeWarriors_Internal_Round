import { useEffect, useRef, useState } from 'react';

/**
 * CyberCursor v3 — smooth magnetic cursor with hero dark-matter mode
 */
export default function CyberCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onHoverIn = () => setIsHover(true);
    const onHoverOut = () => setIsHover(false);

    let animId;
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.12);
      ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.12);

      dot.style.left  = posRef.current.x + 'px';
      dot.style.top   = posRef.current.y + 'px';
      ring.style.left = ringPosRef.current.x + 'px';
      ring.style.top  = ringPosRef.current.y + 'px';

      animId = requestAnimationFrame(animate);
    };

    const interactables = 'a, button, [role="button"], input, label, select, textarea, [tabindex]';

    const attachHover = () => {
      document.querySelectorAll(interactables).forEach(el => {
        el.addEventListener('mouseenter', onHoverIn);
        el.addEventListener('mouseleave', onHoverOut);
      });
    };

    window.addEventListener('mousemove', onMove);
    animId = requestAnimationFrame(animate);
    attachHover();

    // Re-attach on DOM changes
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        id="cursor-dot"
        style={{
          position: 'fixed',
          width: isHover ? '14px' : '8px',
          height: isHover ? '14px' : '8px',
          background: isHover ? '#ff00c8' : '#00f0ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          boxShadow: isHover
            ? '0 0 20px rgba(255,0,200,0.8), 0 0 40px rgba(255,0,200,0.3)'
            : '0 0 12px rgba(0,240,255,0.8), 0 0 30px rgba(0,240,255,0.3)',
          mixBlendMode: 'screen',
          transition: 'width 0.2s, height 0.2s, background 0.2s, box-shadow 0.2s',
        }}
      />
      <div
        ref={ringRef}
        id="cursor-ring"
        style={{
          position: 'fixed',
          width: isHover ? '52px' : '34px',
          height: isHover ? '52px' : '34px',
          border: isHover
            ? '1.5px solid rgba(255,0,200,0.45)'
            : '1.5px solid rgba(0,240,255,0.45)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.25s, height 0.25s, border-color 0.2s',
        }}
      />
    </>
  );
}
