/**
 * @file TimelineItem.jsx
 * @description A single event entry in the User Journey timeline.
 *
 * @param {{
 *   event: Object,
 *   isFirst?: boolean,
 *   isLast?: boolean,
 *   isSelected?: boolean,
 *   onClick?: Function,
 * }} props
 */

import { formatDate } from '../utils/formatters';

// ── Icons ─────────────────────────────────────────────────────────────────────

const PageViewIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const ClickIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
    />
  </svg>
);

// ── Config per event type ─────────────────────────────────────────────────────

const EVENT_CONFIG = {
  page_view: {
    icon: <PageViewIcon />,
    dotColor: 'bg-blue-500',
    dotRing: 'ring-blue-500/30',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    label: 'Page View',
  },
  click: {
    icon: <ClickIcon />,
    dotColor: 'bg-emerald-500',
    dotRing: 'ring-emerald-500/30',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    label: 'Click',
  },
};

const DEFAULT_CONFIG = {
  icon: null,
  dotColor: 'bg-slate-400',
  dotRing: 'ring-slate-400/30',
  iconColor: 'text-slate-500',
  iconBg: 'bg-slate-100 border-slate-200',
  badgeColor: 'bg-slate-100 text-slate-600 border border-slate-200',
  label: 'Event',
};

// ─────────────────────────────────────────────────────────────────────────────

const TimelineItem = ({ event, isFirst, isLast, isSelected, onClick }) => {
  const cfg = EVENT_CONFIG[event.event_type] || DEFAULT_CONFIG;

  // Safely extract the pathname from the URL for display.
  let displayUrl = event.page_url || '—';
  try {
    displayUrl = new URL(event.page_url).pathname || '/';
  } catch {
    /* keep original if URL is invalid */
  }

  return (
    <div
      className={`relative flex gap-4 group cursor-pointer transition-all duration-200 ${
        isSelected ? 'sp-timeline-selected' : ''
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* ── Connector line + dot ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Top line */}
        {!isFirst && <div className="w-px flex-1 bg-slate-200 mb-1.5" />}
        {isFirst && <div className="w-px flex-1" />}

        {/* Dot */}
        <div
          className={`w-3 h-3 rounded-full ring-4 flex-shrink-0 z-10 transition-transform duration-200
            ${cfg.dotColor} ${cfg.dotRing}
            ${isSelected ? 'scale-125' : 'group-hover:scale-110'}
          `}
        />

        {/* Bottom line */}
        {!isLast ? (
          <div className="w-px flex-1 bg-slate-200 mt-1.5" />
        ) : (
          <div className="w-px flex-1" />
        )}
      </div>

      {/* ── Event card ───────────────────────────────────────────────────── */}
      <div
        className={`flex-1 mb-3 rounded-xl border p-3.5 transition-all duration-200 ${
          isSelected
            ? 'bg-blue-50 border-blue-200 shadow-sm'
            : 'bg-white border-slate-200 group-hover:bg-slate-50 group-hover:border-slate-300'
        }`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md ${cfg.badgeColor}`}>
            <span className={cfg.iconColor}>{cfg.icon}</span>
            {cfg.label}
          </span>
          <span className="text-xs text-slate-500 font-mono tabular-nums flex-shrink-0">
            {formatDate(event.timestamp)}
          </span>
        </div>

        {/* Page URL */}
        <p
          className="text-sm text-slate-900 font-mono truncate"
          title={event.page_url}
        >
          {displayUrl}
        </p>

        {/* Click coordinates (click events only) */}
        {event.event_type === 'click' && event.x != null && event.y != null && (
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="text-slate-400">X:</span>
              <span className="text-slate-700 font-mono">{event.x}px</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-slate-400">Y:</span>
              <span className="text-slate-700 font-mono">{event.y}px</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
