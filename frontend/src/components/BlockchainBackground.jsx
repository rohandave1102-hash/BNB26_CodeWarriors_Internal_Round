import React, { useEffect, useRef, useCallback } from 'react';
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
 * Dynamic Animations:
 * - Fluid undulating constellation nodes with pulsing halos
 * - Shimmering, breathing electric connecting lines with energy currents
 * - Forward-streaming 3D perspective grid floor with continuous motion
 * - High-speed transaction packets traveling along consensus edges
 * - Floating, rotating blockchain constellation blocks with flowing dash vectors
 * - Sweeping telemetry radar wave across the network
 */
export default function BlockchainBackground({
  intensity = 1,
  palette = 'violet-core',
  cursorEffects = true,
  chainMood = 'idle',
  density = 'auto',
  reducedMotion = false,
  heroContainerRef,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);

  const activePaletteKeyRef = useRef(palette);
  const targetPaletteKeyRef = useRef(palette);
  const paletteTransitionRef = useRef({ progress: 1, duration: 600, startTime: 0 });

  const { stateRef: pointerRef } = useHeroPointer(heroContainerRef || containerRef, {
    enabled: cursorEffects && intensity > 0.4,
  });

  const isReducedMotion = reducedMotion || (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const cyclePalette = useCallback(() => {
    const currentIdx = PALETTE_ORDER.indexOf(targetPaletteKeyRef.current);
    const nextIdx = (currentIdx + 1) % PALETTE_ORDER.length;
    const nextKey = PALETTE_ORDER[nextIdx];
    targetPaletteKeyRef.current = nextKey;
    paletteTransitionRef.current = {
      progress: 0,
      duration: 500,
      startTime: performance.now(),
      fromKey: activePaletteKeyRef.current,
      toKey: nextKey,
    };
    activePaletteKeyRef.current = nextKey;
  }, []);

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
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Deterministic matrix reset
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Density Configuration ──
    const isMobile = width < 768;
    const isLowDensity = density === 'low' || (density === 'auto' && isMobile);
    const PARTICLE_TRAIL_CAP = isLowDensity ? 30 : 70;
    const RAIN_COLUMNS = Math.floor(width / (isLowDensity ? 48 : 30));
    const NODE_COUNT = isLowDensity ? 36 : 70;

    // ── Animation Variables ──
    let time = 0;
    let lastTime = performance.now();
    let currentCursorColor = { h: 270, s: 85, l: 65, a: 1 };
    let smoothScrollY = 0;
    const cursorParticles = [];
    const ripples = [];

    // Singularity orbiters
    const orbiters = Array.from({ length: 14 }, (_, i) => ({
      angle: (i / 14) * Math.PI * 2,
      radius: Math.random() * 28 + 14,
      speed: Math.random() * 0.02 + 0.01,
      size: Math.random() * 2 + 1,
      char: '0123456789abcdef'[Math.floor(Math.random() * 16)],
    }));

    let singularityStrength = 0;

    // ── Hash Rain with parallax (gentle fall) ──
    const hashChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', '⬡', '0x', 'µ', 'λ'];
    const hashRain = Array.from({ length: RAIN_COLUMNS }, (_, i) => ({
      x: i * (width / RAIN_COLUMNS) + Math.random() * 10,
      y: Math.random() * -height * 1.4,
      speed: Math.random() * 0.16 + 0.08,
      depth: Math.random(),
      char: hashChars[Math.floor(Math.random() * hashChars.length)],
      changeRate: Math.floor(Math.random() * 50 + 25),
      changeCounter: 0,
    }));

    // ── Blockchain Constellation Blocks ──
    const chainBlocks = [
      { x: width * 0.74, y: height * 0.22, rot: 0, size: 28, hash: '0x9f3a…c1', pulse: 0 },
      { x: width * 0.83, y: height * 0.35, rot: 0.4, size: 30, hash: '0x4e2b…84', pulse: 0 },
      { x: width * 0.76, y: height * 0.48, rot: 0.8, size: 28, hash: '0x17c9…a0', pulse: 0 },
      { x: width * 0.86, y: height * 0.62, rot: 1.2, size: 32, hash: '0x62da…f5', pulse: 0 },
    ];
    let nextMineTime = performance.now() + 8000;

    // ── Proof-of-Work Scrambler ──
    const powState = {
      x: width * 0.12,
      y: height * 0.42,
      hash: 'd8f49a2c',
      target: '0000a3f9',
      stage: 'scrambling',
      timer: 0,
    };

    // ── Animated Node Network (Continuous Velocity & Relaxed Organic Flight) ──
    const nodes = Array.from({ length: NODE_COUNT }, (_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      // Gentle, calm velocity: 0.14 to 0.32 px/frame
      const speed = 0.14 + Math.random() * 0.18;
      const isValidator = idx % 6 === 0; // ~17% are validator beacon nodes
      const hueType = idx % 4; // Variety of hues
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed,
        angle,
        turnSpeed: (Math.random() - 0.5) * 0.008, // Slow organic curving
        phase: Math.random() * Math.PI * 2,
        r: isValidator ? 3.6 : (Math.random() * 1.5 + 2.0),
        isValidator,
        hueType,
        sonarRadius: isValidator ? Math.random() * 45 : 0,
        energyFlash: 0,
      };
    });

    // Transaction photon packets traveling leisurely along constellation paths
    const PACKET_COUNT = isLowDensity ? 8 : 16;
    const packets = Array.from({ length: PACKET_COUNT }, () => ({
      from: Math.floor(Math.random() * NODE_COUNT),
      to: Math.floor(Math.random() * NODE_COUNT),
      progress: Math.random(),
      speed: 0.0022 + Math.random() * 0.0032,
      hue: Math.random() > 0.5 ? 185 : 280, // Cyan or Purple
    }));

    // ── Merkle Tree Nodes ──
    const merkleNodes = [
      { x: width * 0.20, y: height * 0.70, level: 0 },
      { x: width * 0.16, y: height * 0.77, level: 1 },
      { x: width * 0.24, y: height * 0.77, level: 1 },
      { x: width * 0.14, y: height * 0.84, level: 2 },
      { x: width * 0.18, y: height * 0.84, level: 2 },
      { x: width * 0.22, y: height * 0.84, level: 2 },
      { x: width * 0.26, y: height * 0.84, level: 2 },
    ];

    let lastClickHandled = null;

    // ════════════════════════════════════════════════════════════════════
    // MAIN RENDER LOOP
    // ════════════════════════════════════════════════════════════════════
    const render = (now) => {
      const dt = Math.min(32, now - lastTime);
      lastTime = now;
      time += 0.007; // Leisurely and calm global clock (reduced from 0.018)

      // Smooth, gentle scroll dampening so scrolling doesn't whip or rush the background
      const targetScrollY = typeof window !== 'undefined' ? (window.scrollY || 0) : 0;
      smoothScrollY += (targetScrollY - smoothScrollY) * 0.04;

      const P = pointerRef.current;

      // Handle gentle background click without flashing or re-rendering
      if (P.lastClick && P.lastClick !== lastClickHandled && P.isOverHero) {
        lastClickHandled = P.lastClick;
        cyclePalette();
        ripples.push({
          x: P.lastClick.x,
          y: P.lastClick.y,
          radius: 8,
          maxRadius: 190,
          color: currentCursorColor,
          alpha: 0.5,
        });
      }

      // Smooth color computation for cursor
      const rawCursorColor = computeCursorColor(
        P.xNorm,
        P.yNorm,
        P.speed,
        time,
        targetPaletteKeyRef.current
      );
      const targetColor = P.snapColor
        ? { h: 190, s: 95, l: 65, a: 1 }
        : applyChainMood(rawCursorColor, chainMood);

      currentCursorColor = lerpColor(currentCursorColor, targetColor, 0.14);

      // Scroll-driven intensity fade
      const currentIntensity = Math.max(0.18, Math.min(1, intensity));
      const activePalette = PALETTES[targetPaletteKeyRef.current] || PALETTES['violet-core'];

      // ── Layer 1: Deep Space Base & Nebula Meshes ──
      ctx.fillStyle = activePalette.fogColor || '#030209';
      ctx.fillRect(0, 0, width, height);

      // Fluid drifting aurora meshes
      const auroraCenters = [
        { x: width * 0.18 + Math.sin(time * 0.4) * 35, y: height * 0.22 + Math.cos(time * 0.3) * 25, r: width * 0.44, h: activePalette.primaryHue },
        { x: width * 0.82 + Math.cos(time * 0.35) * 40, y: height * 0.28 + Math.sin(time * 0.4) * 30, r: width * 0.48, h: activePalette.secondaryHue },
        { x: width * 0.50 + Math.sin(time * 0.5) * 30, y: height * 0.85, r: width * 0.40, h: activePalette.tertiaryHue },
      ];

      auroraCenters.forEach((c) => {
        const grd = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        const shiftHue = (c.h + Math.sin(time * 0.25) * 20) % 360;
        grd.addColorStop(0, `hsla(${shiftHue}, 80%, 9%, ${0.24 * currentIntensity})`);
        grd.addColorStop(0.6, `hsla(${(shiftHue + 25) % 360}, 70%, 6%, ${0.10 * currentIntensity})`);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cursor atmospheric ambient glow (hero only)
      if (P.isOverHero && cursorEffects && currentIntensity > 0.4) {
        const cursorGlowR = 240;
        const cursorGrd = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, cursorGlowR);
        cursorGrd.addColorStop(0, toHslaString(currentCursorColor, 0.09 * currentIntensity));
        cursorGrd.addColorStop(0.6, toHslaString(currentCursorColor, 0.02 * currentIntensity));
        cursorGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = cursorGrd;
        ctx.beginPath();
        ctx.arc(P.x, P.y, cursorGlowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Layer 2: ANIMATED 3D Perspective Grid Floor (Streaming Forward Gently) ──
      const horizonY = height * 0.64 - (smoothScrollY * 0.03);
      ctx.save();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = activePalette.gridColor;

      // Longitudinal lines receding to vanishing point
      const vpX = width * 0.5;
      const gridCols = 15;
      for (let i = -gridCols; i <= gridCols; i++) {
        const bottomX = vpX + (i * width * 0.105);
        ctx.beginPath();
        ctx.moveTo(vpX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // ANIMATION EFFECT: Smooth, deeply leisurely forward-scrolling horizontal grid lines
      const gridScroll = (time * 0.022 + smoothScrollY * 0.00008) % 1; // Ultra-relaxed cinematic forward travel
      for (let z = 0; z <= 8; z++) {
        const progress = (z + gridScroll) / 8;
        const lineY = horizonY + Math.pow(progress, 2.4) * (height - horizonY);
        const alpha = Math.min(1, Math.pow(progress, 1.3)) * 0.24 * currentIntensity;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.strokeStyle = `hsla(${activePalette.primaryHue}, 75%, 55%, ${alpha})`;
        ctx.stroke();
      }
      ctx.restore();

      // Horizon glow bar
      const horizGrd = ctx.createLinearGradient(0, horizonY - 35, 0, horizonY + 35);
      horizGrd.addColorStop(0, 'transparent');
      horizGrd.addColorStop(0.5, activePalette.horizonGlow);
      horizGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = horizGrd;
      ctx.fillRect(0, horizonY - 35, width, 70);

      // ── Layer 3: Streaming Hash Rain ──
      ctx.font = '9px "JetBrains Mono", monospace';
      hashRain.forEach((stream) => {
        stream.y += stream.speed * (0.4 + stream.depth * 0.7) * currentIntensity;
        if (stream.y > height + 30) {
          stream.y = -20;
          stream.x = Math.random() * width;
        }

        stream.changeCounter++;
        if (stream.changeCounter > stream.changeRate) {
          stream.char = hashChars[Math.floor(Math.random() * hashChars.length)];
          stream.changeCounter = 0;
        }

        const alpha = (0.04 + stream.depth * 0.10) * currentIntensity;
        ctx.fillStyle = toHslaString(currentCursorColor, alpha);
        ctx.fillText(stream.char, stream.x, stream.y);
      });

      // ── Layer 7: Breathing Merkle Tree ──
      ctx.save();
      const treePulse = Math.sin(time * 1.5) * 0.5 + 0.5;
      merkleNodes.forEach((node, i) => {
        if (node.level > 0) {
          const parentIdx = node.level === 1 ? 0 : (i <= 4 ? 1 : 2);
          const parent = merkleNodes[parentIdx];
          if (parent) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(parent.x, parent.y);
            ctx.strokeStyle = `hsla(${activePalette.accentHue}, 65%, 50%, ${0.05 + treePulse * 0.06})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${activePalette.accentHue}, 75%, 60%, ${0.15 + treePulse * 0.18})`;
        ctx.fill();
      });
      ctx.restore();

      // ── Layer 6: HIGH-ENERGY ANIMATED NODE NETWORK & STREAMING CIRCUITS ──
      const connectDist = isMobile ? 120 : 170;
      const neighborMap = Array.from({ length: nodes.length }, () => []);

      // 1. Fluid physics & organic drift movement
      nodes.forEach((n) => {
        n.angle += n.turnSpeed;
        n.x += Math.cos(n.angle) * n.speed * currentIntensity;
        n.y += Math.sin(n.angle) * n.speed * currentIntensity;

        // Interactive elastic mouse repulsion when moving over hero
        if (P.isOverHero && cursorEffects && currentIntensity > 0.4) {
          const dx = n.x - P.x;
          const dy = n.y - P.y;
          const distCursor = Math.hypot(dx, dy);
          if (distCursor < 160 && distCursor > 1) {
            const force = (1 - distCursor / 160) * 1.6;
            n.x += (dx / distCursor) * force;
            n.y += (dy / distCursor) * force;
          }
        }

        // Seamless boundary wrap with padding
        if (n.x < -30) n.x = width + 30;
        if (n.x > width + 30) n.x = -30;
        if (n.y < -30) n.y = height + 30;
        if (n.y > height + 30) n.y = -30;
      });

      // 2. Draw connecting lines with dynamic laser currents & flowing dashed energy
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectDist) {
            neighborMap[i].push(j);
            neighborMap[j].push(i);

            const normDist = 1 - dist / connectDist;
            const wavePulse = Math.sin(time * 0.9 + (a.x + b.y) * 0.012) * 0.5 + 0.5;

            // Subtle base network grid line
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${activePalette.primaryHue}, 80%, 55%, ${(0.04 + 0.12 * normDist) * currentIntensity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // ANIMATION EFFECT 1: Flowing electric dashed energy currents streaming along lines (relaxed drift)
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const lineHue = (activePalette.primaryHue + (i % 2 === 0 ? 0 : 35)) % 360;
            ctx.strokeStyle = `hsla(${lineHue}, 90%, 65%, ${(0.10 + 0.22 * normDist + 0.10 * wavePulse) * currentIntensity})`;
            ctx.lineWidth = 0.9;
            ctx.setLineDash([4, 14]);
            ctx.lineDashOffset = -time * 5 - (i + j) * 1.5; // Stately, calm streaming motion
            ctx.stroke();
            ctx.restore();

            // ANIMATION EFFECT 2: High-voltage plasma bridge when nodes draw close
            if (dist < connectDist * 0.38) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `hsla(${activePalette.tertiaryHue}, 100%, 72%, ${(0.22 + 0.25 * wavePulse) * currentIntensity})`;
              ctx.lineWidth = 1.3;
              ctx.stroke();
            }
          }
        }
      }

      // 3. Draw pulsing animated nodes (dots) with radiant glowing halos & sonar rings
      nodes.forEach((n) => {
        if (n.energyFlash > 0) n.energyFlash *= 0.94;
        const pulse = Math.sin(time * 1.1 + n.phase) * 0.22 + 1.0;
        const dynamicR = (n.r + n.energyFlash * 2.2) * pulse;

        let dotHue = activePalette.primaryHue;
        if (n.hueType === 1) dotHue = activePalette.secondaryHue;
        if (n.hueType === 2) dotHue = activePalette.tertiaryHue;
        if (n.hueType === 3) dotHue = activePalette.accentHue;

        // ANIMATION EFFECT 3: Validator Sonar Ripples
        if (n.isValidator) {
          n.sonarRadius += 0.15;
          if (n.sonarRadius > 50) n.sonarRadius = 4;
          const ringAlpha = (1 - n.sonarRadius / 50) * 0.42 * currentIntensity;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.sonarRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${dotHue}, 90%, 65%, ${ringAlpha})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }

        // ANIMATION EFFECT 4: Radiant outer glowing halo
        const auraR = dynamicR * 3.6;
        const auraGrd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, auraR);
        auraGrd.addColorStop(0, `hsla(${dotHue}, 85%, 65%, ${(0.32 + n.energyFlash * 0.4) * currentIntensity})`);
        auraGrd.addColorStop(0.5, `hsla(${dotHue}, 80%, 55%, ${(0.08 + n.energyFlash * 0.15) * currentIntensity})`);
        auraGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, auraR, 0, Math.PI * 2);
        ctx.fill();

        // ANIMATION EFFECT 5: Sharp energetic core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, dynamicR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dotHue}, 95%, 85%, ${(0.75 + n.energyFlash * 0.25) * currentIntensity})`;
        ctx.fill();
      });

      // 4. ANIMATION EFFECT 6: High-speed transaction photon packets traveling along constellation paths
      packets.forEach((p) => {
        const nodeA = nodes[p.from];
        const nodeB = nodes[p.to];
        if (!nodeA || !nodeB) return;

        p.progress += p.speed * currentIntensity;
        if (p.progress >= 1) {
          p.progress = 0;
          p.from = p.to;
          const neighbors = neighborMap[p.from];
          if (neighbors && neighbors.length > 0) {
            p.to = neighbors[Math.floor(Math.random() * neighbors.length)];
          } else {
            p.to = Math.floor(Math.random() * nodes.length);
          }
          if (nodes[p.to]) nodes[p.to].energyFlash = 1.0;
          return;
        }

        const headX = nodeA.x + (nodeB.x - nodeA.x) * p.progress;
        const headY = nodeA.y + (nodeB.y - nodeA.y) * p.progress;
        const tailProgress = Math.max(0, p.progress - 0.22);
        const tailX = nodeA.x + (nodeB.x - nodeA.x) * tailProgress;
        const tailY = nodeA.y + (nodeB.y - nodeA.y) * tailProgress;

        // Glowing comet tail
        const tailGrd = ctx.createLinearGradient(tailX, tailY, headX, headY);
        tailGrd.addColorStop(0, 'transparent');
        tailGrd.addColorStop(1, `hsla(${p.hue}, 100%, 75%, ${0.9 * currentIntensity})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = tailGrd;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Bright photon head
        ctx.beginPath();
        ctx.arc(headX, headY, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${currentIntensity})`;
        ctx.fill();
      });

      // 5. ANIMATION EFFECT 7: Interactive laser filaments linking mouse to nearest constellation dots
      if (P.isOverHero && cursorEffects && currentIntensity > 0.4) {
        const nearby = [];
        for (let i = 0; i < nodes.length; i++) {
          const d = Math.hypot(nodes[i].x - P.x, nodes[i].y - P.y);
          if (d < 220) nearby.push({ node: nodes[i], dist: d });
        }
        nearby.sort((a, b) => a.dist - b.dist);
        const topNearby = nearby.slice(0, 5);

        topNearby.forEach(({ node, dist }) => {
          const factor = 1 - dist / 220;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(P.x, P.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = toHslaString(currentCursorColor, 0.45 * factor * currentIntensity);
          ctx.lineWidth = 1.1;
          ctx.setLineDash([3, 8]);
          ctx.lineDashOffset = -time * 7; // Gentle laser streaming toward mouse
          ctx.stroke();
          ctx.restore();
        });
      }

      // 6. ANIMATION EFFECT 8: Sweeping telemetry radar scanline (slow orbital sweep)
      const scanCycle = (time * 0.015) % 1;
      const scanY = scanCycle * (height + 200) - 100;
      const scanGrd = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      scanGrd.addColorStop(0, 'transparent');
      scanGrd.addColorStop(0.5, `hsla(${activePalette.primaryHue}, 85%, 60%, ${0.06 * currentIntensity})`);
      scanGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrd;
      ctx.fillRect(0, scanY - 50, width, 100);

      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = `hsla(${activePalette.tertiaryHue}, 90%, 70%, ${0.16 * currentIntensity})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // ── Layer 4: ANIMATED Blockchain Constellation (Floating & Flowing Dashes) ──
      if (now > nextMineTime) {
        nextMineTime = now + 9000;
        const lastBlock = chainBlocks[chainBlocks.length - 1];
        const newBlock = {
          x: lastBlock.x + (Math.random() * 30 - 15),
          y: Math.min(height * 0.72, lastBlock.y + 40),
          rot: lastBlock.rot + 0.4,
          size: 26,
          hash: `0x${Math.random().toString(16).substring(2, 6)}…${Math.random().toString(16).substring(2, 4)}`,
          pulse: 0.6,
        };
        chainBlocks.push(newBlock);
        if (chainBlocks.length > 5) chainBlocks.shift();
      }

      ctx.save();
      for (let i = 0; i < chainBlocks.length; i++) {
        const blk = chainBlocks[i];
        blk.rot += 0.003 * currentIntensity; // Stately 3D rotation
        if (blk.pulse > 0) blk.pulse *= 0.95;

        // Floating vertical bobbing
        const animatedBlockY = blk.y + Math.sin(time * 0.8 + i * 1.2) * 6;
        const animatedBlockX = blk.x + Math.cos(time * 0.6 + i * 1.2) * 4;

        // Animated flowing dash vector connecting blocks (relaxed drift)
        if (i < chainBlocks.length - 1) {
          const next = chainBlocks[i + 1];
          const nextAnimatedY = next.y + Math.sin(time * 0.8 + (i + 1) * 1.2) * 6;
          const nextAnimatedX = next.x + Math.cos(time * 0.6 + (i + 1) * 1.2) * 4;

          ctx.beginPath();
          ctx.moveTo(animatedBlockX, animatedBlockY);
          ctx.lineTo(nextAnimatedX, nextAnimatedY);
          ctx.strokeStyle = `hsla(${activePalette.primaryHue}, 80%, 60%, ${0.28 * currentIntensity})`;
          ctx.lineWidth = 1.1;
          ctx.setLineDash([4, 8]);
          ctx.lineDashOffset = -time * 4; // Stately flowing dash stream
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.save();
        ctx.translate(animatedBlockX, animatedBlockY);
        ctx.rotate(blk.rot);

        const sz = blk.size;
        ctx.fillStyle = `hsla(${activePalette.primaryHue}, 70%, 14%, ${0.35 * currentIntensity})`;
        ctx.strokeStyle = `hsla(${activePalette.primaryHue}, 85%, 65%, ${(0.4 + blk.pulse * 0.3) * currentIntensity})`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.strokeRect(-sz / 2, -sz / 2, sz, sz);
        ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
        ctx.restore();

        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = `hsla(${activePalette.secondaryHue}, 75%, 68%, ${0.4 * currentIntensity})`;
        ctx.fillText(blk.hash, animatedBlockX + 20, animatedBlockY + 3);
      }
      ctx.restore();

      // ── Layer 5: Proof-of-Work Scrambler ──
      powState.timer++;
      if (powState.timer % 5 === 0) {
        if (powState.stage === 'scrambling') {
          powState.hash = Math.random().toString(16).substring(2, 10);
          if (powState.timer > 180) {
            powState.stage = 'resolved';
            powState.hash = powState.target;
          }
        } else if (powState.stage === 'resolved' && powState.timer > 260) {
          powState.stage = 'scrambling';
          powState.timer = 0;
        }
      }

      ctx.save();
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = powState.stage === 'resolved' ? 'rgba(0, 255, 163, 0.75)' : `hsla(${activePalette.secondaryHue}, 75%, 60%, 0.4)`;
      ctx.fillText(`POW::${powState.hash}`, powState.x, powState.y);
      ctx.restore();

      // ── Render Subtle Ripples ──
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 5;
        rp.alpha *= 0.94;

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = toHslaString(rp.color, rp.alpha * 0.4);
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (rp.alpha < 0.02 || rp.radius > rp.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // ── Layer 8: Headline Calm Zone Vignette ──
      const centerGrd = ctx.createRadialGradient(
        width * 0.5,
        height * 0.38,
        0,
        width * 0.5,
        height * 0.38,
        width * 0.38
      );
      centerGrd.addColorStop(0, 'rgba(3, 2, 9, 0.28)');
      centerGrd.addColorStop(0.7, 'rgba(3, 2, 9, 0.08)');
      centerGrd.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGrd;
      ctx.fillRect(0, 0, width, height);

      // ════════════════════════════════════════════════════════════════
      // CURSOR SYSTEM (Active ONLY when over Hero)
      // ════════════════════════════════════════════════════════════════
      if (cursorEffects && P.isOverHero && currentIntensity > 0.4 && !isReducedMotion) {
        const targetX = P.snapTarget ? P.snapTarget.x : P.x;
        const targetY = P.snapTarget ? P.snapTarget.y : P.y;

        // Particle ribbon
        if (P.speed > 0.4 && cursorParticles.length < PARTICLE_TRAIL_CAP) {
          cursorParticles.push({
            x: P.x + (Math.random() - 0.5) * 5,
            y: P.y + (Math.random() - 0.5) * 5,
            vx: (Math.random() - 0.5) * 0.6 - P.vx * 0.06,
            vy: (Math.random() - 0.5) * 0.6 - P.vy * 0.06,
            alpha: 0.8,
            size: Math.random() * 2 + 1,
            color: { ...currentCursorColor },
          });
        }

        for (let i = cursorParticles.length - 1; i >= 0; i--) {
          const pt = cursorParticles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.alpha *= 0.92;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = toHslaString(pt.color, pt.alpha);
          ctx.fill();

          if (pt.alpha < 0.03) {
            cursorParticles.splice(i, 1);
          }
        }

        // Singularity (idle for 0.6s)
        if (P.isIdle && !P.snapTarget) {
          singularityStrength = Math.min(1, singularityStrength + 0.04);
        } else {
          singularityStrength = Math.max(0, singularityStrength - 0.09);
        }

        if (singularityStrength > 0.02) {
          const sRad = 20 * singularityStrength;
          ctx.save();
          ctx.translate(P.x, P.y);

          const voidGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, sRad);
          voidGrd.addColorStop(0, '#000000');
          voidGrd.addColorStop(0.7, '#030208');
          voidGrd.addColorStop(1, 'transparent');
          ctx.fillStyle = voidGrd;
          ctx.beginPath();
          ctx.arc(0, 0, sRad * 1.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, sRad, 0, Math.PI * 2);
          ctx.strokeStyle = toHslaString(currentCursorColor, 0.85 * singularityStrength);
          ctx.lineWidth = 1.4;
          ctx.stroke();

          orbiters.forEach((orb) => {
            orb.angle += orb.speed;
            const ox = Math.cos(orb.angle) * orb.radius * singularityStrength;
            const oy = Math.sin(orb.angle) * orb.radius * singularityStrength;
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.fillStyle = toHslaString(currentCursorColor, 0.65 * singularityStrength);
            ctx.fillText(orb.char, ox, oy);
          });
          ctx.restore();
        }

        // Core Dot
        ctx.beginPath();
        ctx.arc(targetX, targetY, P.snapTarget ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = toHslaString(currentCursorColor, 0.95);
        ctx.fill();

        // Lagging Ring
        const ringRadius = P.snapTarget ? 24 : 13;
        ctx.beginPath();
        ctx.arc(targetX, targetY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = toHslaString(currentCursorColor, 0.6);
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

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
        pointerEvents: 'none',
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
