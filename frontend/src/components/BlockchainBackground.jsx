import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useHeroPointer } from '../hooks/useHeroPointer';
import {
  PALETTES,
  PALETTE_ORDER,
  lerpHue,
  lerpColor,
  toHslaString,
  computeCursorColor,
  applyChainMood,
} from '../utils/palettes';

/**
 * BlockchainBackground — CGI-Grade Cinematic Blockchain Canvas & Cursor Engine
 * 
 * 8 Visual Layers in a Single Cohesive RAF Loop:
 * 1. Deep Space Base (Aurora / Nebula Mesh)
 * 2. Perspective Grid Floor (Receding lines with Horizon Glow)
 * 3. Parallax Hash Rain (Multi-depth hex streams)
 * 4. Blockchain Constellation (Linked blocks with live mining-in events)
 * 5. Proof-of-Work Moment (Resolves into leading zeros 0000...a3f9)
 * 6. Validator Node Network with traveling tx data packets
 * 7. Breathing Merkle Tree Constellation
 * 8. Ambient Volumetric Vignette with headline calm zone
 * 
 * Cursor System (Hero Only):
 * - Color-shifting particle ribbon trail based on position, speed, and time
 * - Dark-matter singularity after 0.6s idle with gravitational lensing & accretion ring
 * - Shockwave burst on movement and palette cycling on click
 */
export default function BlockchainBackground({
  intensity = 1,
  palette: initialPalette = 'violet-core',
  cursorEffects = true,
  chainEvents,
  chainMood = 'idle',
  density = 'auto',
  reducedMotion = false,
  heroContainerRef,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);

  // Active palette with smooth cross-fade
  const [currentPaletteKey, setCurrentPaletteKey] = useState(initialPalette);
  const targetPaletteKeyRef = useRef(initialPalette);
  const paletteTransitionRef = useRef({ progress: 1, duration: 600, startTime: 0 });

  // Hero pointer intelligence
  const { stateRef: pointerRef } = useHeroPointer(heroContainerRef || containerRef);

  // Check reduced motion
  const isReducedMotion = reducedMotion || (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Cycle palette on user click
  const cyclePalette = useCallback(() => {
    const currentIdx = PALETTE_ORDER.indexOf(targetPaletteKeyRef.current);
    const nextIdx = (currentIdx + 1) % PALETTE_ORDER.length;
    const nextKey = PALETTE_ORDER[nextIdx];
    targetPaletteKeyRef.current = nextKey;
    paletteTransitionRef.current = {
      progress: 0,
      duration: 600,
      startTime: performance.now(),
      fromKey: currentPaletteKey,
      toKey: nextKey,
    };
    setCurrentPaletteKey(nextKey);
  }, [currentPaletteKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Density Budget Configuration ──
    const isMobile = width < 768;
    const isLowDensity = density === 'low' || (density === 'auto' && isMobile);
    const PARTICLE_TRAIL_CAP = isLowDensity ? 40 : 110;
    const RAIN_COLUMNS = Math.floor(width / (isLowDensity ? 48 : 28));
    const NODE_COUNT = isLowDensity ? 24 : 45;

    // ── State Objects ──
    let time = 0;
    let lastTime = performance.now();
    let currentCursorColor = { h: 270, s: 85, l: 65, a: 1 };

    // Shockwaves (from clicks or mined blocks)
    const shockwaves = [];

    // Cursor particle ribbon trail
    const cursorParticles = [];

    // Singularity orbiters
    const orbiters = Array.from({ length: 18 }, (_, i) => ({
      angle: (i / 18) * Math.PI * 2,
      radius: Math.random() * 38 + 18,
      speed: Math.random() * 0.05 + 0.03,
      size: Math.random() * 2 + 1,
      char: '0123456789abcdef'[Math.floor(Math.random() * 16)],
    }));

    // Singularity transition state
    let singularityStrength = 0; // 0 (hidden) to 1 (full void)

    // ── Layer 3: Hash Rain Columns ──
    const hashChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', '⬡', '0x', 'µ', 'λ'];
    const hashRain = Array.from({ length: RAIN_COLUMNS }, (_, i) => ({
      x: i * (width / RAIN_COLUMNS) + Math.random() * 10,
      y: Math.random() * -height * 1.5,
      speed: Math.random() * 0.6 + 0.3,
      depth: Math.random(), // 0 = far (blurred), 1 = near (sharp)
      char: hashChars[Math.floor(Math.random() * hashChars.length)],
      length: Math.floor(Math.random() * 5 + 3),
      changeRate: Math.floor(Math.random() * 30 + 15),
      changeCounter: 0,
    }));

    // ── Layer 4: Blockchain Constellation ──
    const chainBlocks = [
      { x: width * 0.72, y: height * 0.28, rot: 0, size: 28, hash: '0x9f3a…c1', pulse: 0, minedIn: true },
      { x: width * 0.80, y: height * 0.38, rot: 0.4, size: 32, hash: '0x4e2b…84', pulse: 0, minedIn: true },
      { x: width * 0.74, y: height * 0.50, rot: 0.8, size: 30, hash: '0x17c9…a0', pulse: 0, minedIn: true },
      { x: width * 0.86, y: height * 0.62, rot: 1.2, size: 34, hash: '0x62da…f5', pulse: 0, minedIn: true },
    ];
    let nextMineTime = performance.now() + 6000;
    let newlyMinedBlock = null;

    // ── Layer 5: Proof-of-Work Scrambler ──
    let powState = {
      active: true,
      x: width * 0.16,
      y: height * 0.42,
      hash: 'd8f49a2c',
      target: '0000a3f9',
      stage: 'scrambling', // 'scrambling' -> 'resolved' -> 'pause'
      timer: 0,
    };

    // ── Layer 6: Node Network & Traveling Packets ──
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.5 + 0.8,
    }));

    const packets = Array.from({ length: 8 }, () => ({
      fromIdx: 0,
      toIdx: 1,
      progress: Math.random(),
      speed: Math.random() * 0.009 + 0.004,
    }));

    // ── Layer 7: Merkle Tree Nodes (Subtle Background Geometry) ──
    const merkleNodes = [
      { x: width * 0.22, y: height * 0.72, level: 0 },
      { x: width * 0.18, y: height * 0.78, level: 1 },
      { x: width * 0.26, y: height * 0.78, level: 1 },
      { x: width * 0.16, y: height * 0.84, level: 2 },
      { x: width * 0.20, y: height * 0.84, level: 2 },
      { x: width * 0.24, y: height * 0.84, level: 2 },
      { x: width * 0.28, y: height * 0.84, level: 2 },
    ];

    let lastClickHandled = null;

    // ════════════════════════════════════════════════════════════════════
    // MAIN RENDER LOOP (Single Canvas, Single RAF Loop)
    // ════════════════════════════════════════════════════════════════════
    const render = (now) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      time += 0.016;

      const P = pointerRef.current;

      // Handle user click palette cycle & shockwave trigger
      if (P.lastClick && P.lastClick !== lastClickHandled) {
        lastClickHandled = P.lastClick;
        cyclePalette();
        shockwaves.push({
          x: P.lastClick.x,
          y: P.lastClick.y,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.65,
          color: currentCursorColor,
          alpha: 0.65,
        });
      }

      // ── Palette Cross-Fade Calculation ──
      const trans = paletteTransitionRef.current;
      let activePalette = PALETTES[targetPaletteKeyRef.current] || PALETTES['violet-core'];

      if (trans.progress < 1) {
        const elapsed = now - trans.startTime;
        trans.progress = Math.min(1, elapsed / trans.duration);
      }

      // Smooth color computation for cursor
      const rawCursorColor = computeCursorColor(
        P.xNorm,
        P.yNorm,
        P.speed,
        time,
        targetPaletteKeyRef.current
      );
      // Magnetic snapping color adoption
      const targetColor = P.snapColor
        ? { h: 190, s: 95, l: 65, a: 1 } // snapped accent
        : applyChainMood(rawCursorColor, chainMood);

      currentCursorColor = lerpColor(currentCursorColor, targetColor, 0.14);

      // Scroll-driven intensity fade (dims, slows, desaturates when scrolled down)
      const currentIntensity = Math.max(0.18, Math.min(1, intensity));

      // ── Layer 1: Deep Space Base & Nebula Meshes ──
      ctx.fillStyle = activePalette.fogColor || '#030209';
      ctx.fillRect(0, 0, width, height);

      // Color-shifting Aurora Orbs
      const auroraCenters = [
        { x: width * 0.18, y: height * 0.25, r: width * 0.45, h: activePalette.primaryHue },
        { x: width * 0.82, y: height * 0.30, r: width * 0.50, h: activePalette.secondaryHue },
        { x: width * 0.50, y: height * 0.85, r: width * 0.40, h: activePalette.tertiaryHue },
      ];

      auroraCenters.forEach((c) => {
        const grd = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        const shiftHue = (c.h + Math.sin(time * 0.2) * 20) % 360;
        grd.addColorStop(0, `hsla(${shiftHue}, 75%, 10%, ${0.28 * currentIntensity})`);
        grd.addColorStop(0.6, `hsla(${(shiftHue + 30) % 360}, 65%, 6%, ${0.12 * currentIntensity})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cursor Atmospheric Backing Color Field (follows cursor and tints local nebula)
      if (P.isOverHero && cursorEffects) {
        const cursorGlowR = 260;
        const cursorGrd = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, cursorGlowR);
        cursorGrd.addColorStop(0, toHslaString(currentCursorColor, 0.12 * currentIntensity));
        cursorGrd.addColorStop(0.5, toHslaString(currentCursorColor, 0.04 * currentIntensity));
        cursorGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = cursorGrd;
        ctx.beginPath();
        ctx.arc(P.x, P.y, cursorGlowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Layer 2: Perspective Grid Floor ──
      const horizonY = height * 0.65;
      const fov = 320;
      ctx.save();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = activePalette.gridColor;

      // Vanishing point perspective lines
      const vpX = width * 0.5;
      const gridCols = 16;
      for (let i = -gridCols; i <= gridCols; i++) {
        const bottomX = vpX + (i * width * 0.1);
        ctx.beginPath();
        ctx.moveTo(vpX, horizonY);

        // Gentle cursor grid distortion
        if (P.isOverHero && P.y > horizonY) {
          const dx = bottomX - P.x;
          const dy = height - P.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warp = Math.max(0, 1 - dist / 220) * 16 * (singularityStrength > 0.5 ? -1 : 1);
          ctx.lineTo(bottomX + (dx > 0 ? warp : -warp), height);
        } else {
          ctx.lineTo(bottomX, height);
        }
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let z = 1; z <= 8; z++) {
        const lineY = horizonY + Math.pow(z / 8, 2.2) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }
      ctx.restore();

      // Horizon glow bar
      const horizGrd = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 40);
      horizGrd.addColorStop(0, 'transparent');
      horizGrd.addColorStop(0.5, activePalette.horizonGlow);
      horizGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = horizGrd;
      ctx.fillRect(0, horizonY - 40, width, 80);

      // ── Layer 3: Parallax Hash Rain ──
      ctx.font = '10px "JetBrains Mono", monospace';
      hashRain.forEach((stream) => {
        stream.y += stream.speed * (0.4 + stream.depth * 0.8) * currentIntensity;
        if (stream.y > height + 40) {
          stream.y = -30;
          stream.x = Math.random() * width;
        }

        stream.changeCounter++;
        if (stream.changeCounter > stream.changeRate) {
          stream.char = hashChars[Math.floor(Math.random() * hashChars.length)];
          stream.changeCounter = 0;
        }

        // Parallax depth blur and opacity
        const alpha = (0.04 + stream.depth * 0.12) * currentIntensity;
        const fontSize = Math.floor(8 + stream.depth * 4);
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        // Near cursor interaction: deflect slightly
        let drawX = stream.x;
        if (P.isOverHero) {
          const dx = stream.x - P.x;
          const dy = stream.y - P.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const push = (1 - dist / 120) * 18 * (singularityStrength > 0.5 ? -1.5 : 1);
            drawX += dx > 0 ? push : -push;
          }
        }

        ctx.fillStyle = toHslaString(currentCursorColor, alpha);
        ctx.fillText(stream.char, drawX, stream.y);
      });

      // ── Layer 7: Breathing Merkle Tree ──
      ctx.save();
      const treePulse = Math.sin(time * 1.5) * 0.5 + 0.5;
      merkleNodes.forEach((node, i) => {
        // Draw parent edge if not root
        if (node.level > 0) {
          const parentIdx = node.level === 1 ? 0 : (i <= 4 ? 1 : 2);
          const parent = merkleNodes[parentIdx];
          if (parent) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(parent.x, parent.y);
            ctx.strokeStyle = `hsla(${activePalette.accentHue}, 60%, 45%, ${0.05 + treePulse * 0.05})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${activePalette.accentHue}, 70%, 55%, ${0.15 + treePulse * 0.15})`;
        ctx.fill();
      });
      ctx.restore();

      // ── Layer 6: Node Network with Traveling Data Packets ──
      const activeConnections = [];
      const connectDist = 130;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.09 * currentIntensity;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${activePalette.primaryHue}, 70%, 45%, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
            activeConnections.push({ a, b });
          }
        }
      }

      // Drift nodes
      nodes.forEach((n) => {
        n.x += n.vx * currentIntensity;
        n.y += n.vy * currentIntensity;
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${activePalette.primaryHue}, 75%, 55%, ${0.25 * currentIntensity})`;
        ctx.fill();
      });

      // Data packets along edges
      if (activeConnections.length > 4) {
        packets.forEach((p) => {
          p.progress += p.speed * currentIntensity;
          if (p.progress >= 1 || p.connIdx >= activeConnections.length) {
            p.progress = 0;
            p.connIdx = Math.floor(Math.random() * activeConnections.length);
          }
          const conn = activeConnections[p.connIdx];
          if (conn) {
            const px = conn.a.x + (conn.b.x - conn.a.x) * p.progress;
            const py = conn.a.y + (conn.b.y - conn.a.y) * p.progress;
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = toHslaString(currentCursorColor, 0.75 * currentIntensity);
            ctx.fill();
          }
        });
      }

      // ── Layer 4: Blockchain Constellation (Linked Blocks & Live Mining) ──
      // Check block mining trigger
      if (now > nextMineTime) {
        nextMineTime = now + 7500;
        const lastBlock = chainBlocks[chainBlocks.length - 1];
        const newBlock = {
          x: lastBlock.x + (Math.random() * 40 - 20),
          y: Math.min(height * 0.75, lastBlock.y + 45),
          rot: lastBlock.rot + 0.5,
          size: 28,
          hash: `0x${Math.random().toString(16).substring(2, 6)}…${Math.random().toString(16).substring(2, 4)}`,
          pulse: 1.0, // High flash pulse
          minedIn: true,
        };
        chainBlocks.push(newBlock);
        if (chainBlocks.length > 5) chainBlocks.shift();

        // Ripple from newly mined block
        shockwaves.push({
          x: newBlock.x,
          y: newBlock.y,
          radius: 5,
          maxRadius: 280,
          color: { h: 185, s: 95, l: 70, a: 1 },
          alpha: 0.8,
        });
      }

      // Render chain lines & 3D drifting blocks
      ctx.save();
      for (let i = 0; i < chainBlocks.length; i++) {
        const blk = chainBlocks[i];
        blk.rot += 0.003 * currentIntensity;
        if (blk.pulse > 0) blk.pulse *= 0.94; // Decay flash

        if (i < chainBlocks.length - 1) {
          const next = chainBlocks[i + 1];
          ctx.beginPath();
          ctx.moveTo(blk.x, blk.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `hsla(${activePalette.primaryHue}, 80%, 60%, ${0.25 * currentIntensity})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw isometric cube / block
        ctx.save();
        ctx.translate(blk.x, blk.y);
        ctx.rotate(blk.rot);

        const sz = blk.size;
        const flashAlpha = 0.2 + blk.pulse * 0.6;
        ctx.fillStyle = `hsla(${activePalette.primaryHue}, 70%, 15%, ${flashAlpha * currentIntensity})`;
        ctx.strokeStyle = `hsla(${blk.pulse > 0.3 ? 185 : activePalette.primaryHue}, 85%, 65%, ${(0.4 + blk.pulse * 0.6) * currentIntensity})`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.strokeRect(-sz / 2, -sz / 2, sz, sz);
        ctx.fillRect(-sz / 2, -sz / 2, sz, sz);

        // Center micro-glyph
        ctx.fillStyle = toHslaString(currentCursorColor, 0.6);
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Label beside block
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = `hsla(${activePalette.secondaryHue}, 70%, 65%, ${0.45 * currentIntensity})`;
        ctx.fillText(blk.hash, blk.x + 22, blk.y + 4);
      }
      ctx.restore();

      // ── Layer 5: Proof-of-Work Scrambler ──
      powState.timer++;
      if (powState.timer % 4 === 0) {
        if (powState.stage === 'scrambling') {
          powState.hash = Math.random().toString(16).substring(2, 10);
          if (powState.timer > 180) {
            powState.stage = 'resolved';
            powState.hash = powState.target;
            // Soft seal flash
            shockwaves.push({
              x: powState.x + 30,
              y: powState.y,
              radius: 5,
              maxRadius: 180,
              color: { h: 50, s: 95, l: 75, a: 1 }, // Gold-white spark
              alpha: 0.7,
            });
          }
        } else if (powState.stage === 'resolved' && powState.timer > 260) {
          powState.stage = 'scrambling';
          powState.timer = 0;
        }
      }

      ctx.save();
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = powState.stage === 'resolved' ? '#00ffa3' : `hsla(${activePalette.secondaryHue}, 80%, 60%, 0.45)`;
      ctx.fillText(`POW::${powState.hash}`, powState.x, powState.y);
      ctx.restore();

      // ── Render Shockwaves ──
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 8;
        sw.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = toHslaString(sw.color, sw.alpha);
        ctx.lineWidth = 1.6;
        ctx.stroke();

        if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }

      // ── Layer 8: Ambient Calm Zone & Vignette ──
      // Subtle headline zone attenuation: gently dims graphics directly behind center text
      const centerGrd = ctx.createRadialGradient(
        width * 0.5,
        height * 0.40,
        0,
        width * 0.5,
        height * 0.40,
        width * 0.42
      );
      centerGrd.addColorStop(0, 'rgba(3, 2, 9, 0.45)');
      centerGrd.addColorStop(0.7, 'rgba(3, 2, 9, 0.1)');
      centerGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGrd;
      ctx.fillRect(0, 0, width, height);

      // ════════════════════════════════════════════════════════════════
      // CURSOR SYSTEM (Hero Only, Eased Follow, Particles, Singularity)
      // ════════════════════════════════════════════════════════════════
      if (cursorEffects && P.isOverHero && !isReducedMotion) {
        const targetX = P.snapTarget ? P.snapTarget.x : P.x;
        const targetY = P.snapTarget ? P.snapTarget.y : P.y;

        // Emit motion trail particle
        if (P.speed > 0.4 && cursorParticles.length < PARTICLE_TRAIL_CAP) {
          cursorParticles.push({
            x: P.x + (Math.random() - 0.5) * 6,
            y: P.y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.8 - P.vx * 0.08,
            vy: (Math.random() - 0.5) * 0.8 - P.vy * 0.08,
            alpha: 0.85,
            size: Math.random() * 2.2 + 1.2,
            color: { ...currentCursorColor }, // Freeze color at emission instant
          });
        }

        // Draw & update particle ribbon
        for (let i = cursorParticles.length - 1; i >= 0; i--) {
          const pt = cursorParticles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha *= 0.93; // Smooth fade

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = toHslaString(pt.color, pt.alpha);
          ctx.fill();

          if (pt.alpha < 0.03) {
            cursorParticles.splice(i, 1);
          }
        }

        // ── Singularity Evaluation (0.6s stillness) ──
        if (P.isIdle && !P.snapTarget) {
          singularityStrength = Math.min(1, singularityStrength + 0.04);
        } else {
          // If we had a singularity and moved, trigger a burst ripple!
          if (singularityStrength > 0.6) {
            shockwaves.push({
              x: P.x,
              y: P.y,
              radius: 12,
              maxRadius: 220,
              color: currentCursorColor,
              alpha: 0.7,
            });
          }
          singularityStrength = Math.max(0, singularityStrength - 0.08);
        }

        // Render Singularity Core & Accretion Orbit
        if (singularityStrength > 0.02) {
          const sRad = 24 * singularityStrength;
          ctx.save();
          ctx.translate(P.x, P.y);

          // Dark-matter void core
          const voidGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, sRad);
          voidGrd.addColorStop(0, '#000000');
          voidGrd.addColorStop(0.7, '#020206');
          voidGrd.addColorStop(1, 'transparent');
          ctx.fillStyle = voidGrd;
          ctx.beginPath();
          ctx.arc(0, 0, sRad * 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Glowing Accretion Ring
          ctx.beginPath();
          ctx.arc(0, 0, sRad, 0, Math.PI * 2);
          ctx.strokeStyle = toHslaString(currentCursorColor, 0.9 * singularityStrength);
          ctx.lineWidth = 1.8;
          ctx.shadowColor = toHslaString(currentCursorColor);
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Orbiting hex glyphs & light dust
          orbiters.forEach((orb) => {
            orb.angle += orb.speed;
            const ox = Math.cos(orb.angle) * orb.radius * singularityStrength;
            const oy = Math.sin(orb.angle) * orb.radius * singularityStrength;

            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = toHslaString(currentCursorColor, 0.7 * singularityStrength);
            ctx.fillText(orb.char, ox, oy);
          });

          ctx.restore();
        }

        // Central Bright Cursor Dot
        ctx.beginPath();
        ctx.arc(targetX, targetY, P.snapTarget ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = toHslaString(currentCursorColor, 0.95);
        ctx.shadowColor = toHslaString(currentCursorColor);
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Magnetic Outer Lagging Ring
        const ringRadius = P.snapTarget ? 26 : 14;
        ctx.beginPath();
        ctx.arc(targetX, targetY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = toHslaString(currentCursorColor, 0.65);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    // Pause when tab hidden or document unmounted
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      } else {
        lastTime = performance.now();
        animRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    density,
    intensity,
    chainMood,
    cursorEffects,
    isReducedMotion,
    cyclePalette,
    pointerRef,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none', // Never blocks content interaction
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
