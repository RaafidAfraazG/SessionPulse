/**
 * @file SessionsPage.jsx
 * @description Sessions list + User Journey panel.
 *
 * Layout:
 * ┌─────────────────────────────────────────────┐
 * │  Stats row (3 cards)                        │
 * ├─────────────────────────────┬───────────────┤
 * │  Search + Toolbar           │               │
 * │  Session cards list         │  Journey      │
 * │                             │  Panel        │
 * └─────────────────────────────┴───────────────┘
 */

import { useState, useMemo } from 'react';
import useSessions from '../hooks/useSessions';
import useSessionDetail from '../hooks/useSessionDetail';
import StatCard from '../components/StatCard';
import SessionSearch from '../components/SessionSearch';
import SessionTable from '../components/SessionTable';
import Timeline from '../components/Timeline';
import LoadingSkeleton, { StatCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import DemoControls from '../components/DemoControls';
import { formatRelativeTime, formatNumber } from '../utils/formatters';

// ── SVG Icons for stat cards ─────────────────────────────────────────────────
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// ── User Journey Side Panel ───────────────────────────────────────────────────
const JourneyPanel = ({ sessionId, onClose }) => {
  const { events, loading, error } = useSessionDetail(sessionId);

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 flex-shrink-0">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900">User Journey</h2>
          <p
            className="text-xs text-slate-500 font-mono truncate mt-0.5"
            title={sessionId}
          >
            {sessionId}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close journey panel"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Panel body */}
      {loading ? (
        <div className="p-4">
          <LoadingSkeleton rows={4} />
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <Timeline events={events} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const SessionsPage = () => {
  const { sessions, totalEvents, lastActive, loading, error, refetch, lastRefreshed } =
    useSessions();
  const [search, setSearch] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Client-side search filter.
  const filtered = useMemo(() => {
    if (!search.trim()) return sessions;
    const q = search.toLowerCase();
    return sessions.filter((s) => s.session_id.toLowerCase().includes(q));
  }, [sessions, search]);

  const handleSelectSession = (id) => {
    setSelectedSessionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Stats Row ──────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={<UsersIcon />}
              title="Total Sessions"
              value={formatNumber(sessions.length)}
              subtitle={`${filtered.length} matching search`}
              color="blue"
            />
            <StatCard
              icon={<BoltIcon />}
              title="Total Events"
              value={formatNumber(totalEvents)}
              subtitle="across all sessions"
              color="emerald"
            />
            <StatCard
              icon={<ClockIcon />}
              title="Last Activity"
              value={formatRelativeTime(lastActive)}
              subtitle={lastActive ? new Date(lastActive).toLocaleString() : '—'}
              color="amber"
            />
          </>
        )}
      </div>

      {/* ── Main Split Layout ───────────────────────────────────────────── */}
      <div
        className={`flex-1 flex min-h-0 ${
          selectedSessionId ? 'grid grid-cols-1 lg:grid-cols-[1fr,380px]' : ''
        }`}
      >
        {/* ── Left: Session List ────────────────────────────────────────── */}
        <div className="flex flex-col min-h-0 overflow-hidden">
          {/* Demo Controls */}
          <DemoControls onReset={refetch} />

          {/* Toolbar */}
          <div className="px-5 pb-3 flex items-center gap-3">
            <div className="flex-1">
              <SessionSearch value={search} onChange={setSearch} />
            </div>
            <button
              onClick={refetch}
              title="Refresh"
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500
                         hover:text-slate-700 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>

          {/* Refresh indicator */}
          {lastRefreshed && !loading && (
            <p className="px-5 pb-2 text-xs text-slate-600">
              Auto-refreshing every 5s · last updated {formatRelativeTime(lastRefreshed)}
            </p>
          )}

          {/* Session list — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 sp-scrollbar">
            {loading ? (
              <LoadingSkeleton rows={6} />
            ) : error ? (
              <ErrorState
                message={error}
                onRetry={refetch}
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon="🔍"
                title={search ? 'No sessions match your search' : 'No sessions yet'}
                description={
                  search
                    ? `No session ID contains "${search}". Try a shorter query.`
                    : 'Start the tracker on any page and interactions will appear here.'
                }
                action={
                  search ? (
                    <button
                      onClick={() => setSearch('')}
                      className="px-4 py-2 text-sm font-medium bg-white hover:bg-slate-50
                                 border border-slate-200 text-slate-700 rounded-lg transition-colors shadow-sm"
                    >
                      Clear Search
                    </button>
                  ) : null
                }
              />
            ) : (
              <SessionTable
                sessions={filtered}
                selectedId={selectedSessionId}
                onSelect={handleSelectSession}
              />
            )}
          </div>
        </div>

        {/* ── Right: Journey Panel (only when a session is selected) ────── */}
        {selectedSessionId && (
          <div className="hidden lg:flex flex-col h-full border-l border-slate-200 overflow-hidden">
            <JourneyPanel
              sessionId={selectedSessionId}
              onClose={() => setSelectedSessionId(null)}
            />
          </div>
        )}
      </div>

      {/* ── Mobile Journey Overlay ──────────────────────────────────────── */}
      {selectedSessionId && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white sp-slide-up">
          <JourneyPanel
            sessionId={selectedSessionId}
            onClose={() => setSelectedSessionId(null)}
          />
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
