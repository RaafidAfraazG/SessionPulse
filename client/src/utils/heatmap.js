/**
 * @file heatmap.js
 * @description Canvas-based heatmap rendering engine.
 *
 * Algorithm:
 * 1. Draw each click as a white radial-gradient blob onto an offscreen canvas
 *    using 'lighter' composite mode so overlapping blobs add up (density).
 * 2. Read the resulting pixel intensities.
 * 3. Map each pixel's brightness to a colour on a cold-to-hot colour scale
 *    (blue → cyan → green → yellow → red).
 * 4. Write the coloured pixels to the visible canvas.
 *
 * Coordinates are normalised from a VIRTUAL_W × VIRTUAL_H assumed viewport
 * (standard 1280 × 800) to the actual canvas pixel dimensions.
 */

/** Assumed screen resolution at which events were recorded. */
const VIRTUAL_W = 1280;
const VIRTUAL_H = 800;

/**
 * Map an intensity value (0–1) to an RGB colour on the heatmap scale.
 * Scale: blue (cold) → cyan → green → yellow → red (hot)
 *
 * @param {number} t - Intensity value between 0 and 1.
 * @returns {[number, number, number]} RGB tuple.
 */
function getHeatColor(t) {
  const stops = [
    [0, 0, 255],    // blue
    [0, 255, 255],  // cyan
    [0, 255, 0],    // green
    [255, 255, 0],  // yellow
    [255, 0, 0],    // red
  ];
  const clamped = Math.min(Math.max(t, 0), 0.9999);
  const scaled = clamped * (stops.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const c0 = stops[i];
  const c1 = stops[i + 1];
  return [
    Math.round(c0[0] + f * (c1[0] - c0[0])),
    Math.round(c0[1] + f * (c1[1] - c0[1])),
    Math.round(c0[2] + f * (c1[2] - c0[2])),
  ];
}

/**
 * Render a heatmap onto a canvas element.
 *
 * @param {HTMLCanvasElement} canvas  - Target canvas (width/height must be set).
 * @param {{ x: number, y: number }[]} clicks - Array of click coordinates.
 */
export function renderHeatmap(canvas, clicks) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  if (!clicks || clicks.length === 0) return;

  let maxX = Math.max(W, VIRTUAL_W);
  let maxY = Math.max(H, VIRTUAL_H);
  
  clicks.forEach(({ x, y }) => {
    if (x != null && x > maxX) maxX = x;
    if (y != null && y > maxY) maxY = y;
  });

  // Scale factors from virtual to canvas pixel space.
  const scaleX = W / maxX;
  const scaleY = H / maxY;

  // Blob radius scales with canvas width for consistent visual density.
  const radius = Math.max(30, W * 0.038);

  // ── Step 1: Offscreen accumulation (grayscale, additive) ─────────────────
  const offscreen = document.createElement('canvas');
  offscreen.width = W;
  offscreen.height = H;
  const octx = offscreen.getContext('2d');
  octx.globalCompositeOperation = 'lighter'; // additive blending = density

  clicks.forEach(({ x, y }) => {
    if (x == null || y == null) return;
    const cx = x * scaleX;
    const cy = y * scaleY;
    const grad = octx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    octx.fillStyle = grad;
    octx.beginPath();
    octx.arc(cx, cy, radius, 0, Math.PI * 2);
    octx.fill();
  });

  // ── Step 2: Colorise ─────────────────────────────────────────────────────
  const srcData = octx.getImageData(0, 0, W, H);
  const src = srcData.data;

  const output = ctx.createImageData(W, H);
  const out = output.data;

  for (let i = 0; i < src.length; i += 4) {
    const raw = src[i]; // red channel (white blobs → equal RGB)
    const t = Math.min(raw / 160, 1); // normalise; 160 ≈ "very hot" threshold

    if (t < 0.02) {
      out[i + 3] = 0; // fully transparent — no activity here
      continue;
    }

    const [r, g, b] = getHeatColor(t);
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    // Alpha: low-density areas are semi-transparent, hot spots more opaque.
    out[i + 3] = Math.min(255, Math.round(t * 210 + 25));
  }

  ctx.putImageData(output, 0, 0);
}
