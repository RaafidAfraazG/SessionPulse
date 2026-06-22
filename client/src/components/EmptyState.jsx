/**
 * @file EmptyState.jsx
 * @description Empty state illustration + message component.
 */

/**
 * @param {{
 *   icon?: React.ReactNode,
 *   title?: string,
 *   description?: string,
 *   action?: React.ReactNode,
 * }} props
 */
const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description = 'Data will appear here once events are collected.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    {/* Illustration */}
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-4xl shadow-sm">
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-slate-400" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5" />
          </svg>
        )}
      </div>
      {/* Decorative dots */}
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500/40 animate-ping" />
    </div>

    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>

    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
