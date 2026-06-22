/**
 * @file App.jsx
 * @description Root application component.
 *
 * Wraps the entire app with:
 *  - ErrorBoundary   : catches render-time crashes
 *  - ToastProvider   : global toast notification system
 *
 * Uses React.lazy + Suspense for code-splitting pages so the initial
 * bundle doesn't include page-specific code.
 */

import { useState, lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './hooks/useToast.jsx';
import MainLayout from './layouts/MainLayout';
import LoadingSkeleton from './components/LoadingSkeleton';
import NotFoundPage from './pages/NotFoundPage';
import useSessions from './hooks/useSessions';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────────
const SessionsPage = lazy(() => import('./pages/SessionsPage'));
const HeatmapPage  = lazy(() => import('./pages/HeatmapPage'));

// ── Suspense fallback ─────────────────────────────────────────────────────────
const PageLoadingFallback = () => (
  <div className="p-6">
    <LoadingSkeleton rows={5} />
  </div>
);

// ── Page metadata ─────────────────────────────────────────────────────────────
const PAGE_META = {
  sessions: {
    title: 'Sessions',
    subtitle: 'Browse user sessions and replay their journey',
  },
  heatmap: {
    title: 'Heatmap',
    subtitle: 'Visualise click density across your tracked pages',
  },
};

// ─────────────────────────────────────────────────────────────────────────────

const AppInner = () => {
  const [currentPage, setCurrentPage] = useState('sessions');

  // Lift aggregate stats so the Header can display the live event counter.
  // The Sessions hook auto-refreshes every 5 seconds.
  const { totalEvents, lastRefreshed } = useSessions();

  const meta = PAGE_META[currentPage];

  const handleNavigate = (page) => {
    if (PAGE_META[page]) {
      setCurrentPage(page);
    } else {
      setCurrentPage('404');
    }
  };

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      headerProps={{
        title: meta?.title ?? 'Not Found',
        subtitle: meta?.subtitle,
        totalEvents,
        lastRefreshed,
      }}
    >
      <Suspense fallback={<PageLoadingFallback />}>
        {currentPage === 'sessions' && <SessionsPage />}
        {currentPage === 'heatmap'  && <HeatmapPage />}
        {currentPage === '404'      && (
          <NotFoundPage onNavigateHome={() => setCurrentPage('sessions')} />
        )}
        {!['sessions', 'heatmap', '404'].includes(currentPage) && (
          <NotFoundPage onNavigateHome={() => setCurrentPage('sessions')} />
        )}
      </Suspense>
    </MainLayout>
  );
};

// Wrap everything with providers at the top level.
const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  </ErrorBoundary>
);

export default App;
