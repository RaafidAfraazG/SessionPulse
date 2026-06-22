/**
 * @file Sidebar.jsx
 * @description App sidebar with logo, navigation, and status footer.
 *
 * @param {{
 *   currentPage: string,
 *   onNavigate: (page: string) => void,
 * }} props
 */

const NAV_ITEMS = [
  {
    id: 'sessions',
    label: 'Sessions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
  {
    id: 'heatmap',
    label: 'Heatmap',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
        />
      </svg>
    ),
  },
];

const Sidebar = ({ currentPage, onNavigate }) => (
  <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-slate-50 border-r border-slate-200 h-full">
    {/* ── Logo ─────────────────────────────────────────────────────────── */}
    <div className="px-5 py-5 border-b border-slate-200">
      <div className="flex items-center gap-2.5">
        {/* Animated pulse dot */}
        <div className="relative flex h-5 w-5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30" />
          <span className="relative inline-flex h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30" />
        </div>
        <span className="text-base font-bold tracking-tight text-slate-900">
          Session<span className="text-blue-400">Pulse</span>
        </span>
      </div>
      <p className="text-xs text-slate-600 mt-1.5 pl-7">User Analytics Platform</p>
    </div>

    {/* ── Navigation ───────────────────────────────────────────────────── */}
    <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-2 mb-3">
        Analytics
      </p>
      {NAV_ITEMS.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-200 text-left
              ${isActive
                ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            {/* Active indicator bar */}
            <span className={`transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
              {item.icon}
            </span>
            {item.label}
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>
        );
      })}
    </nav>

    {/* ── Footer ───────────────────────────────────────────────────────── */}
    <div className="px-5 py-4 border-t border-slate-200">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-slate-600">API Connected</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">v1.0.0 — SessionPulse</p>
    </div>
  </aside>
);

export default Sidebar;
