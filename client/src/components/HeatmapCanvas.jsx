/**
 * @file HeatmapCanvas.jsx
 * @description Canvas-based heatmap overlaid on a browser/webpage mockup.
 *
 * Renders click coordinates from the API onto a 16:9 "viewport" that
 * mimics what the actual tracked page looks like. Uses the renderHeatmap
 * utility for efficient canvas drawing.
 *
 * @param {{
 *   clicks: { x: number, y: number, session_id: string, timestamp: string }[],
 *   pageUrl?: string,
 * }} props
 */

import { useEffect, useRef, useCallback } from 'react';
import { renderHeatmap } from '../utils/heatmap';

// ── Simulated webpage background ──────────────────────────────────────────────
const PageMockup = () => (
  <div className="absolute inset-0 bg-slate-50 overflow-hidden select-none pointer-events-none">
    {/* Navbar */}
    <div className="absolute top-0 left-0 right-0 h-11 bg-white border-b border-slate-200 flex items-center px-6 gap-6 shadow-sm">
      <div className="w-20 h-3.5 bg-slate-300 rounded-sm" />
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="w-12 h-2.5 bg-slate-200 rounded-sm" />
        <div className="w-12 h-2.5 bg-slate-200 rounded-sm" />
        <div className="w-12 h-2.5 bg-slate-200 rounded-sm" />
        <div className="w-16 h-6 bg-blue-100 rounded" />
      </div>
    </div>

    {/* Hero Section */}
    <div className="absolute top-11 left-0 right-0 h-52 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 flex flex-col items-center justify-center gap-3">
      <div className="w-56 h-5 bg-slate-300 rounded-sm" />
      <div className="w-80 h-3 bg-slate-200 rounded-sm" />
      <div className="w-64 h-3 bg-slate-200 rounded-sm" />
      <div className="flex gap-3 mt-2">
        <div className="w-20 h-7 bg-blue-200 rounded-lg" />
        <div className="w-20 h-7 bg-slate-200 rounded-lg" />
      </div>
    </div>

    {/* Cards */}
    <div className="absolute top-[274px] left-6 right-6 grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col p-3 gap-2">
          <div className="w-6 h-6 bg-slate-100 rounded" />
          <div className="w-3/4 h-2.5 bg-slate-200 rounded-sm" />
          <div className="w-full h-2 bg-slate-100 rounded-sm" />
          <div className="w-5/6 h-2 bg-slate-100 rounded-sm" />
        </div>
      ))}
    </div>

    {/* Text block */}
    <div className="absolute top-[430px] left-6 right-6 space-y-2">
      <div className="w-1/3 h-3.5 bg-slate-300 rounded-sm mb-3" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`h-2.5 bg-slate-200 rounded-sm ${i === 4 ? 'w-4/6' : 'w-full'}`} />
      ))}
    </div>

    {/* Footer */}
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-100 border-t border-slate-200 flex items-center justify-center gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="w-14 h-2 bg-slate-300 rounded-sm" />)}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const HeatmapCanvas = ({ clicks = [], pageUrl = '' }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const W = container.clientWidth;
    const H = container.clientHeight;
    if (W === 0 || H === 0) return;
    canvas.width = W;
    canvas.height = H;
    renderHeatmap(canvas, clicks);
  }, [clicks]);

  // Redraw whenever clicks data changes.
  useEffect(() => {
    // Small delay to allow the container to fully paint first.
    const t = setTimeout(draw, 50);
    return () => clearTimeout(t);
  }, [draw]);

  // Redraw on window resize.
  useEffect(() => {
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-md px-3 py-1.5 min-w-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-emerald-500 flex-shrink-0" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <span className="text-xs text-slate-600 font-mono truncate">
            {pageUrl || 'about:blank — enter a URL above to load heatmap data'}
          </span>
        </div>
        {/* Click count badge */}
        {clicks.length > 0 && (
          <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
            {clicks.length} click{clicks.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Viewport: 16:9 aspect ratio */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* Simulated page content */}
        <PageMockup />
        {/* Heatmap overlay — transparent canvas on top */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'normal' }}
        />
      </div>
    </div>
  );
};

export default HeatmapCanvas;
