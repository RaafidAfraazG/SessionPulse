/**
 * @file DemoControls.jsx
 * @description Demo / testing controls panel.
 *
 * Collapsible section that provides:
 *  - Reset Analytics: DELETE /api/events/reset → clears all data → refresh
 *  - Start New Session: clears sp_session_id from localStorage → new session
 *
 * Visually distinct from the main UI (amber tinted) so it's clearly a
 * demo/testing tool and not part of the production analytics interface.
 *
 * @param {{ onReset: Function }} props - onReset called after successful reset.
 */

import { useState } from 'react';
import { resetAnalytics } from '../services/api';
import { useToast } from '../hooks/useToast.jsx';
import ConfirmModal from './ConfirmModal';

const DemoControls = ({ onReset }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { addToast } = useToast();

  // ── Reset Analytics ─────────────────────────────────────────────────────
  const handleReset = async () => {
    setResetLoading(true);
    try {
      const res = await resetAnalytics();
      setShowConfirm(false);
      addToast(
        `Analytics reset — ${res.deletedCount} event(s) deleted.`,
        'success'
      );
      // Notify parent (SessionsPage) to refetch.
      onReset?.();
    } catch (err) {
      addToast(err.message || 'Reset failed. Is the server running?', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  // ── Start New Session ───────────────────────────────────────────────────
  const handleNewSession = () => {
    try {
      localStorage.removeItem('sp_session_id');
      addToast('New session started. Refresh the tracked page to begin.', 'info');
    } catch {
      addToast('Could not clear session (localStorage unavailable).', 'warning');
    }
  };

  return (
    <>
      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <div className="mx-5 mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
        {/* Header / toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-controls="demo-controls-body"
          className="w-full flex items-center justify-between px-4 py-3 text-left
                     hover:bg-amber-500/5 transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🧪</span>
            <span className="text-sm font-semibold text-amber-400">Demo Controls</span>
            <span className="text-xs text-amber-600/80 bg-amber-500/10 border border-amber-500/20
                             px-2 py-0.5 rounded-full hidden sm:inline">
              Testing only
            </span>
          </div>
          <svg
            viewBox="0 0 24 24" fill="none"
            className={`w-4 h-4 text-amber-600 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
            stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
          </svg>
        </button>

        {/* Body */}
        {!collapsed && (
          <div
            id="demo-controls-body"
            className="px-4 pb-4 flex flex-wrap gap-3 items-center border-t border-amber-500/10"
          >
            <p className="w-full text-xs text-amber-700 mt-3 mb-1">
              Use these controls to generate demo data or reset the analytics state.
            </p>

            {/* Reset button */}
            <button
              id="btn-reset-analytics"
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl
                         bg-red-500/10 hover:bg-red-500/15 border border-red-500/25 text-red-400
                         transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              Reset Analytics
            </button>

            {/* New Session button */}
            <button
              id="btn-new-session"
              onClick={handleNewSession}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl
                         bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/25 text-blue-400
                         transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Start New Session
            </button>

            {/* Open demo page */}
            <a
              href="../tracker/demo.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl
                         bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-400
                         transition-all duration-200 no-underline"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Open Demo Page
            </a>
          </div>
        )}
      </div>

      {/* ── Confirm Modal ──────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={showConfirm}
        danger
        title="Reset Analytics"
        message="This will permanently delete all tracked events and sessions. Are you sure?"
        confirmLabel="Delete All"
        cancelLabel="Cancel"
        loading={resetLoading}
        onConfirm={handleReset}
        onCancel={() => !resetLoading && setShowConfirm(false)}
      />
    </>
  );
};

export default DemoControls;
