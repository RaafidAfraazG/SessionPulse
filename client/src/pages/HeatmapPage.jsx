/**
 * @file HeatmapPage.jsx
 * @description Heatmap visualisation page.
 *
 * The user enters a page URL, clicks "Load Heatmap", and the canvas
 * renders click density. A colour legend and click count summary are shown below.
 */

import { useState } from 'react';
import useHeatmap from '../hooks/useHeatmap';
import HeatmapCanvas from '../components/HeatmapCanvas';
import HeatmapControls from '../components/HeatmapControls';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

// ── Colour legend ─────────────────────────────────────────────────────────────
const Legend = () => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-slate-500">Activity level:</span>
    <div
      className="h-3 w-36 rounded-full"
      style={{
        background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)',
      }}
    />
    <div className="flex items-center justify-between w-28 text-xs text-slate-500">
      <span>Low</span>
      <span>High</span>
    </div>
  </div>
);

// ── Stat pill ─────────────────────────────────────────────────────────────────
const Pill = ({ label, value, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${colors[color]}`}>
      {label}:&nbsp;<span className="font-bold">{value}</span>
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const HeatmapPage = () => {
  const [urlInput, setUrlInput] = useState('');
  const { clicks, page, loading, error, fetch: loadHeatmap } = useHeatmap();
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleFetch = async () => {
    if (!urlInput.trim()) return;
    setHasLoaded(true);
    await loadHeatmap(urlInput);
  };

  // Derive quick stats from the click data.
  const uniqueSessions = hasLoaded
    ? new Set(clicks.map((c) => c.session_id)).size
    : 0;

  return (
    <div className="p-5 space-y-5 max-w-6xl mx-auto">
      {/* ── Title Row ────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Click Heatmap</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Visualise where users click on any tracked page. Enter the page URL below.
        </p>
      </div>

      {/* ── URL Controls ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Page URL
        </p>
        <HeatmapControls
          value={urlInput}
          onChange={setUrlInput}
          onFetch={handleFetch}
          loading={loading}
        />
        <p className="text-xs text-slate-600 mt-2">
          💡 Tip: Use the exact URL that was tracked, e.g.{' '}
          <code className="text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-xs">
            http://127.0.0.1:5500/tracker/demo.html
          </code>
        </p>
      </div>

      {/* ── Results Area ─────────────────────────────────────────────────── */}
      {!hasLoaded ? (
        /* Pre-fetch empty state */
        <EmptyState
          icon="🌡️"
          title="No heatmap loaded"
          description={'Enter a page URL above and click "Load Heatmap" to visualise click density.'}
        />
      ) : error ? (
        <ErrorState message={error} onRetry={handleFetch} />
      ) : (
        <>
          {/* Stats pills (visible once data loads) */}
          {!loading && clicks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Pill label="Clicks" value={clicks.length} color="blue" />
              <Pill label="Sessions" value={uniqueSessions} color="emerald" />
              <Pill label="Page" value={page || urlInput} color="amber" />
              <div className="ml-auto">
                <Legend />
              </div>
            </div>
          )}

          {/* Heatmap canvas / browser mockup */}
          {loading ? (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white animate-pulse shadow-sm" style={{ aspectRatio: '16/9' }} />
          ) : clicks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <EmptyState
                icon="🖱️"
                title="No clicks recorded for this page"
                description="Make sure users have clicked on this page and the URL matches exactly what was tracked."
              />
            </div>
          ) : (
            <HeatmapCanvas clicks={clicks} pageUrl={page || urlInput} />
          )}

          {/* Click distribution table */}
          {!loading && clicks.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Recent Clicks</h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto sp-scrollbar">
                {[...clicks].reverse().slice(0, 20).map((click, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-slate-500 font-mono">{click.session_id?.slice(-12)}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500">
                        X: <span className="font-mono text-slate-900">{click.x}</span>
                      </span>
                      <span className="text-slate-500">
                        Y: <span className="font-mono text-slate-900">{click.y}</span>
                      </span>
                      <span className="text-slate-400">
                        {click.timestamp
                          ? new Date(click.timestamp).toLocaleTimeString()
                          : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeatmapPage;
