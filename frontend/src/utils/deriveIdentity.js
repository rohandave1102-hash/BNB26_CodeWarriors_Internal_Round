/**
 * deriveIdentity.js
 * 
 * Deterministic identity engine for Web3 addresses, hashes, and artifact CIDs.
 * Generates:
 * - Cybernetic color palettes (hue, glowColor HSL, 3-color array)
 * - Gradients and backing glows for ProfileCard & BorderGlow
 * - Deterministic geometric SVG Identicon Data URI
 * - Address/hash truncation and formatting
 */

// Simple deterministic 32-bit FNV-1a hash
function fnv1a(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// Convert HSL to Hex
function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generates a deterministic SVG Identicon
 * 5x5 symmetrical matrix with cyber-futuristic patterns
 */
function generateIdenticonSvg(hashStr, primaryColor, secondaryColor) {
  const seed = fnv1a(hashStr);
  const size = 64;
  const cellSize = size / 5;
  
  // 5x5 grid with left-right symmetry (columns 0,1,2 generate 3,4)
  let rects = '';
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 5; y++) {
      const bitIndex = x * 5 + y;
      const isActive = ((seed >> (bitIndex % 30)) & 1) === 1;
      if (isActive) {
        const fill = (bitIndex % 3 === 0) ? secondaryColor : primaryColor;
        // Draw left cell
        rects += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="${fill}" />`;
        // Draw mirrored right cell
        if (x < 2) {
          const mirrorX = 4 - x;
          rects += `<rect x="${mirrorX * cellSize}" y="${y * cellSize}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="${fill}" />`;
        }
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#080711" rx="12" />
    <g opacity="0.95">${rects}</g>
    <circle cx="${size / 2}" cy="${size / 2}" r="3" fill="#ffffff" opacity="0.6" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Truncate address or hash: 0x1234...5678
 */
export function truncateHash(str, lead = 6, tail = 4) {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= lead + tail) return str;
  return `${str.substring(0, lead)}…${str.substring(str.length - tail)}`;
}

/**
 * Derives a full design identity from any hash or address
 */
export function deriveIdentity(identifier, options = {}) {
  const safeId = (identifier || '0x0000000000000000000000000000000000000000').toLowerCase();
  const seed = fnv1a(safeId);

  // Derive base hue: favor cybernetic ranges (cyan 180-200, purple 260-290, magenta 310-335, emerald 145-165)
  // Palette buckets prevent muddy brown/drab colors
  const palettes = [
    { base: 185, spread: 25 }, // Neon Cyan / Electric Blue
    { base: 275, spread: 30 }, // Electric Purple / Violet
    { base: 320, spread: 20 }, // Cyber Magenta / Neon Pink
    { base: 155, spread: 25 }, // Matrix Emerald / Teal
    { base: 215, spread: 25 }, // Deep Sapphire / Cobalt
  ];
  
  const bucket = palettes[seed % palettes.length];
  const hue = Math.floor(bucket.base + ((seed >> 4) % bucket.spread));

  // High-saturation cybernetic HSL values
  const saturation = 85;
  const lightness = 65;

  const hex1 = hslToHex(hue, saturation, lightness);
  const hex2 = hslToHex((hue + 35) % 360, saturation, lightness - 5);
  const hex3 = hslToHex((hue - 35 + 360) % 360, saturation - 10, lightness + 5);

  const glowColor = `${hue} ${saturation}% ${lightness}%`;
  const colors = [hex1, hex2, hex3];

  const innerGradient = `linear-gradient(135deg, ${hex1}26 0%, ${hex2}14 50%, #06050e 100%)`;
  const behindGlowColor = `hsla(${hue}, 85%, 60%, 0.35)`;

  const avatarUrl = options.avatarUrl || generateIdenticonSvg(safeId, hex1, hex2);

  return {
    rawId: safeId,
    shortId: truncateHash(safeId, options.lead || 6, options.tail || 4),
    hue,
    glowColor,
    colors,
    primaryColor: hex1,
    secondaryColor: hex2,
    accentColor: hex3,
    innerGradient,
    behindGlowColor,
    avatarUrl,
    isContract: safeId.startsWith('0x') && safeId.length === 42,
  };
}
