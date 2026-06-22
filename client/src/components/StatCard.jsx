/**
 * @file StatCard.jsx
 * @description Metric card for the stats bar at the top of pages.
 *
 * @param {{
 *   icon: React.ReactNode,
 *   title: string,
 *   value: string|number,
 *   subtitle?: string,
 *   color?: 'blue'|'emerald'|'amber'|'purple'|'rose',
 * }} props
 */

const colorMap = {
  blue:    'text-blue-600    bg-blue-50    border-blue-100',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  amber:   'text-amber-600   bg-amber-50   border-amber-100',
  purple:  'text-purple-600  bg-purple-50  border-purple-100',
  rose:    'text-rose-600    bg-rose-50    border-rose-100',
};

const StatCard = ({ icon, title, value, subtitle, color = 'blue' }) => {
  const iconClasses = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4
                    hover:border-slate-300 hover:shadow-sm transition-all duration-200">
      <div className={`p-2.5 rounded-lg border flex-shrink-0 ${iconClasses}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight truncate">
          {value ?? '—'}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
