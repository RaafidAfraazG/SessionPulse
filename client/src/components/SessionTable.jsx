/**
 * @file SessionTable.jsx
 * @description Card-list of sessions with copy-ID, event count badge, and activity time.
 *
 * @param {{
 *   sessions: Object[],
 *   selectedId: string|null,
 *   onSelect: (sessionId: string) => void,
 * }} props
 */

import { useState, memo } from 'react';
import { truncate, formatRelativeTime, formatNumber } from '../utils/formatters';

// ── Copy button with brief ✓ feedback ─────────────────────────────────────────
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation(); // Don't trigger row selection.
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy Session ID"
      aria-label="Copy Session ID"
      className={`flex-shrink-0 p-1.5 rounded-md border text-xs font-medium transition-all duration-200
        ${copied
          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300'}
      `}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
          />
        </svg>
      )}
    </button>
  );
};

// ── Event count badge ─────────────────────────────────────────────────────────
const EventBadge = ({ count }) => {
  const color =
    count >= 20 ? 'bg-blue-50 text-blue-600 border-blue-200' :
    count >= 5  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  'bg-slate-50 text-slate-500 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${color}`}>
      {formatNumber(count)}
    </span>
  );
};

// ── Avatar letter ─────────────────────────────────────────────────────────────
const SessionAvatar = ({ sessionId }) => {
  const hues = [210, 150, 260, 30, 330, 170];
  const hue = hues[sessionId.charCodeAt(3) % hues.length];
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
      style={{ background: `hsl(${hue}, 70%, 40%)` }}
    >
      {sessionId.slice(-2).toUpperCase()}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const SessionTable = ({ sessions, selectedId, onSelect }) => {
  if (sessions.length === 0) return null;

  return (
    <div className="space-y-2">
      {sessions.map((session) => {
        const isSelected = session.session_id === selectedId;
        return (
          <div
            key={session.session_id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(session.session_id)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(session.session_id)}
            className={`group flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer
                        transition-all duration-200 outline-none
                        focus-visible:ring-2 focus-visible:ring-blue-500/50
              ${isSelected
                ? 'bg-blue-50 border-blue-200 shadow-md shadow-blue-500/5'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'
              }`}
          >
            {/* Avatar */}
            <SessionAvatar sessionId={session.session_id} />

            {/* Session info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-slate-900 truncate" title={session.session_id}>
                  {truncate(session.session_id, 24)}
                </span>
                <CopyButton text={session.session_id} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">
                  Last active {formatRelativeTime(session.last_activity)}
                </span>
              </div>
            </div>

            {/* Right side: event count + arrow */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <EventBadge count={session.total_events} />
                <p className="text-xs text-slate-600 mt-0.5">events</p>
              </div>
              <svg
                viewBox="0 0 24 24" fill="none"
                className={`w-4 h-4 transition-all duration-200
                  ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5'}`}
                stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(SessionTable);
