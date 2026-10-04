import { useEffect, useRef } from 'react';

/**
 * LivingBackground — Blockchain Electro-Tech Dynamic Atmosphere
 * Features:
 * - Smooth color-changing ambient chromatic aurora/nebula (dark tones)
 * - Dark, moody changing constellation network with dynamic data packet pulses
 * - Subtle, dark cascading numbers & cryptographic hex streams
 * - Reactive particle field that gracefully responds to cursor interaction
 */
export default function LivingBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // ── 1. Color-Changing Nebula Centers ──
    const orbs = [
      { xRatio: 0.15, yRatio: 0.2,  radiusRatio: 0.45, speed: 0.00045, phase: 0,   hueOffset: 0 },
      { xRatio: 0.85, yRatio: 0.25, radiusRatio: 0.55, speed: 0.00035, phase: 1.8, hueOffset: 90 },
      { xRatio: 0.50, yRatio: 0.80, radiusRatio: 0.50, speed: 0.00050, phase: 3.2, hueOffset: 180 },
      { xRatio: 0.25, yRatio: 0.65, radiusRatio: 0.38, speed: 0.00040, phase: 4.5, hueOffset: 270 },
    ];

    // ── 2. Dark Changing Network Nodes ──
    const NODE_COUNT = Math.min(65, Math.floor(width / 24));
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.6,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Data packet pulses travelling between nodes
    const packets = Array.from({ length: 6 }, () => ({
      fromIdx: 0,
      toIdx: 1,
      progress: Math.random(),
      speed: Math.random() * 0.008 + 0.004,
    }));

    // ── 3. Dark Cryptographic Numbers & Hex Rain ──
    const chars = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'x', '7', '9',
      '⬡', '0x', 'µ', 'λ', '§', '∆', '∑', 'ø', '∫'
    ];

    const STREAM_COLUMNS = Math.floor(width / 32);
    const hashStreams = Array.from({ length: STREAM_COLUMNS }, (_, i) => ({
      x: i * 32 + (Math.random() * 14 - 7),
      y: Math.random() * -height,
      speed: Math.random() * 0.55 + 0.25,
      opacity: Math.random() * 0.12 + 0.05, // Dark and subtle
      size: Math.random() > 0.85 ? 11 : 9,
      char: chars[Math.floor(Math.random() * chars.length)],
      changeCounter: 0,
      changeRate: Math.floor(Math.random() * 45 + 20),
    }));

    let time = 0;
    const CONNECT_DIST = 140;

    const render = () => {
      time += 1;

      // Base cycling color hue (evolves smoothly every frame)
      const baseHue = (time * 0.06) % 360;

      // ── Clear Canvas to Deep Obsidian Void ──
      ctx.fillStyle = '#020207';
      ctx.fillRect(0, 0, width, height);

      // ── Layer 1: Dynamic Chromatic Color-Changing Aura ──
      orbs.forEach((orb) => {
        const t = time * orb.speed;
        const cx = orb.xRatio * width + Math.sin(t + orb.phase) * (width * 0.08);
        const cy = orb.yRatio * height + Math.cos(t * 0.8 + orb.phase) * (height * 0.08);
        const maxR = Math.max(width, height) * orb.radiusRatio;

        // Evolving dark cyber hues: saturation 75%, lightness 7-9% (dark and atmospheric)
        const currentHue = (baseHue + orb.hueOffset) % 360;
        const colorStart = `hsla(${currentHue}, 75%, 8%, 0.40)`;
        const colorMid = `hsla(${(currentHue + 25) % 360}, 70%, 5%, 0.18)`;

        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        grd.addColorStop(0, colorStart);
        grd.addColorStop(0.5, colorMid);
        grd.addColorStop(1, 'transparent');

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Layer 2: Dark Falling Numbers & Hex Hashes ──
      ctx.font = '10px "JetBrains Mono", monospace';
      hashStreams.forEach((stream) => {
        stream.y += stream.speed;
        if (stream.y > height + 30) {
          stream.y = -20;
          stream.x = Math.random() * width;
          stream.char = chars[Math.floor(Math.random() * chars.length)];
        }

        stream.changeCounter++;
        if (stream.changeCounter > stream.changeRate) {
          stream.char = chars[Math.floor(Math.random() * chars.length)];
          stream.changeCounter = 0;
        }

        // Color matches the dark ambient hue
        const glyphHue = (baseHue + (stream.x / width) * 80) % 360;
        ctx.fillStyle = `hsla(${glyphHue}, 60%, 42%, ${stream.opacity})`;
        ctx.font = `${stream.size}px "JetBrains Mono", monospace`;
        ctx.fillText(stream.char, stream.x, stream.y);
      });

      // ── Layer 3: Dark Changing Lines (Constellation & Circuits) ──
      const activeConnections = [];

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            // Dark, fine lines (alpha 0.03 - 0.11 max)
            const alpha = (1 - dist / CONNECT_DIST) * 0.11;
            const lineHue = (baseHue + ((a.x + b.x) / (width * 2)) * 60) % 360;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${lineHue}, 70%, 45%, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            activeConnections.push({ a, b, hue: lineHue });
          }
        }
      }

      // ── Optional: Mouse Proximity Lines (Dark Subtle Linkage) ──
      if (mouseRef.current.active) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = mx - n.x;
          const dy = my - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.14;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `hsla(${(baseHue + 180) % 360}, 80%, 50%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // ── Layer 4: Nodes & Occasional Data Packets ──
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        const nodeHue = (baseHue + (node.x / width) * 90) % 360;
        const glow = 0.25 + Math.sin(node.pulse) * 0.15; // Dark, subtle pulse

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${nodeHue}, 75%, 55%, ${glow})`;
        ctx.fill();
      });

      // Data packets cruising along active lines
      if (activeConnections.length > 5) {
        packets.forEach((p) => {
          p.progress += p.speed;
          if (p.progress >= 1 || p.connIdx >= activeConnections.length) {
            p.progress = 0;
            p.connIdx = Math.floor(Math.random() * activeConnections.length);
          }

          const conn = activeConnections[p.connIdx];
          if (conn) {
            const px = conn.a.x + (conn.b.x - conn.a.x) * p.progress;
            const py = conn.a.y + (conn.b.y - conn.a.y) * p.progress;

            ctx.beginPath();
            ctx.arc(px, py, 1.6, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${conn.hue}, 90%, 65%, 0.45)`;
            ctx.fill();
          }
        });
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
