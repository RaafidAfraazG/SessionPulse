/**
 * @file Header.jsx
 * @description Sticky top header with page title, live counter, refresh indicator,
 *              and mobile navigation tabs.
 *
 * @param {{
 *   title: string,
 *   subtitle?: string,
 *   totalEvents?: number,
 *   lastRefreshed?: Date|null,
 *   currentPage: string,
 *   onNavigate: (page: string) => void,
 *   actions?: React.ReactNode,
 * }} props
 */

import { useState, useEffect } from 'react';
import { formatRelativeTime } from '../utils/formatters';

// Auto-ticking "last refreshed" label.
const RefreshBadge = ({ lastRefreshed }) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () => setLabel(formatRelativeTime(lastRefreshed));
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastRefreshed]);

  if (!lastRefreshed) return null;

  return (
    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>Refreshed {label}</span>
    </div>
  );
};

// Mobile nav tabs.
const MobileTabs = ({ currentPage, onNavigate }) => (
  <div className="flex lg:hidden border-t border-slate-200">
    {[
      { id: 'sessions', label: 'Sessions' },
      { id: 'heatmap', label: 'Heatmap' },
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-200
          ${currentPage === item.id
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-slate-600 hover:text-slate-900'}
        `}
      >
        {item.label}
      </button>
    ))}
  </div>
);

const Header = ({
  title,
  subtitle,
  totalEvents,
  lastRefreshed,
  currentPage,
  onNavigate,
  actions,
}) => (
  <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      {/* Left: Title */}
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
      </div>

      {/* Center/Right: Indicators + Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Live event counter */}
        {totalEvents != null && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 tabular-nums">
              {totalEvents.toLocaleString()} events
            </span>
          </div>
        )}

        {/* Refresh timestamp */}
        <RefreshBadge lastRefreshed={lastRefreshed} />

        {/* Custom actions slot */}
        {actions}
      </div>
    </div>

    {/* Mobile tabs */}
    <MobileTabs currentPage={currentPage} onNavigate={onNavigate} />
  </header>
);

export default Header;
