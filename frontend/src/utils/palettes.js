/**
 * palettes.js
 * 
 * Color presets, HSL color-interpolation helpers, and chain-state mood tinting
 * for the BlockchainBackground CGI rendering engine.
 */

export const PALETTES = {
  'violet-core': {
    id: 'violet-core',
    name: 'Violet Core',
    primaryHue: 270,        // Electric Purple
    secondaryHue: 310,      // Magenta
    tertiaryHue: 190,       // Neon Cyan
    accentHue: 220,         // Deep Electric Blue
    gridColor: 'rgba(139, 92, 246, 0.12)',
    horizonGlow: 'rgba(124, 58, 237, 0.22)',
    fogColor: '#05030e',
  },
  'cyan-pulse': {
    id: 'cyan-pulse',
    name: 'Cyan Pulse',
    primaryHue: 185,        // Neon Cyan
    secondaryHue: 220,      // Electric Blue
    tertiaryHue: 155,       // Matrix Emerald
    accentHue: 280,         // Violet
    gridColor: 'rgba(0, 240, 255, 0.12)',
    horizonGlow: 'rgba(0, 240, 255, 0.22)',
    fogColor: '#02060b',
  },
  'magenta-storm': {
    id: 'magenta-storm',
    name: 'Magenta Storm',
    primaryHue: 320,        // Cyber Magenta
    secondaryHue: 275,      // Violet
    tertiaryHue: 350,       // Neon Red
    accentHue: 190,         // Cyan
    gridColor: 'rgba(255, 0, 200, 0.12)',
    horizonGlow: 'rgba(255, 0, 200, 0.20)',
    fogColor: '#070208',
  },
  'deep-blue': {
    id: 'deep-blue',
    name: 'Deep Blue',
    primaryHue: 220,        // Cobalt / Sapphire
    secondaryHue: 185,      // Cyan
    tertiaryHue: 260,       // Deep Purple
    accentHue: 150,         // Teal
    gridColor: 'rgba(56, 189, 248, 0.12)',
    horizonGlow: 'rgba(56, 189, 248, 0.22)',
    fogColor: '#02040c',
  },
};

export const PALETTE_ORDER = ['violet-core', 'cyan-pulse', 'magenta-storm', 'deep-blue'];

/**
 * Normalizes an angle in degrees to [0, 360)
 */
export function normalizeHue(h) {
  return ((h % 360) + 360) % 360;
}

/**
 * Shortest-path circular interpolation between two hues
 */
export function lerpHue(a, b, t) {
  const diff = ((b - a + 540) % 360) - 180;
  return normalizeHue(a + diff * t);
}

/**
 * Interpolates between two HSL color objects: { h, s, l, a }
 */
export function lerpColor(c1, c2, t) {
  return {
    h: lerpHue(c1.h, c2.h, t),
    s: c1.s + (c2.s - c1.s) * t,
    l: c1.l + (c2.l - c1.l) * t,
    a: (c1.a ?? 1) + ((c2.a ?? 1) - (c1.a ?? 1)) * t,
  };
}

/**
 * Formats HSL object to CSS string
 */
export function toHslaString(c, alphaOverride) {
  const alpha = alphaOverride !== undefined ? alphaOverride : (c.a ?? 1);
  return `hsla(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(c.l)}%, ${alpha.toFixed(3)})`;
}

/**
 * Computes dynamic cursor color based on:
 * - Position (horizontal maps left-to-right through theme spectrum)
 * - Velocity (fast motion elevates brightness toward cyan-white)
 * - Time drift (25s subtle cycle)
 * - Current active palette preset
 */
export function computeCursorColor(xNorm, yNorm, speed, timeSec, paletteKey = 'violet-core') {
  const pal = PALETTES[paletteKey] || PALETTES['violet-core'];

  // 1. Position-driven hue: sweeps through palette anchors across screen width
  const baseSpan = 140; // degrees span
  const posHue = pal.primaryHue + (xNorm - 0.5) * baseSpan;

  // 2. Time-driven drift (25s per cycle)
  const timeDrift = Math.sin(timeSec * (Math.PI * 2 / 25)) * 25;

  // 3. Speed-driven shift: high speed pushes toward bright cyan-white
  const speedNormalized = Math.min(speed / 35, 1); // 0 to 1
  const targetHue = lerpHue(posHue + timeDrift, 190, speedNormalized * 0.45);

  const saturation = 85 + (1 - speedNormalized) * 10 - yNorm * 10;
  const lightness = 60 + speedNormalized * 28 + (1 - yNorm) * 8; // Faster = whiter/brighter

  return {
    h: normalizeHue(targetHue),
    s: Math.max(50, Math.min(100, saturation)),
    l: Math.max(45, Math.min(96, lightness)),
    a: 1,
  };
}

/**
 * Applies chain-state mood tint:
 * - 'idle': untouched / cool calm
 * - 'busy': warm amber hue shift (gas spikes)
 * - 'degraded': red-violet tint (RPC issue)
 */
export function applyChainMood(color, mood = 'idle') {
  if (mood === 'busy') {
    return {
      h: lerpHue(color.h, 38, 0.35),
      s: Math.min(100, color.s + 10),
      l: color.l,
      a: color.a,
    };
  }
  if (mood === 'degraded') {
    return {
      h: lerpHue(color.h, 350, 0.45),
      s: Math.min(100, color.s + 15),
      l: Math.max(35, color.l - 5),
      a: color.a,
    };
  }
  return color;
}
