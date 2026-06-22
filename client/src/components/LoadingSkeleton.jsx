/**
 * @file LoadingSkeleton.jsx
 * @description Animated skeleton placeholder for loading states.
 */

/**
 * @param {{ rows?: number, className?: string }} props
 */
const LoadingSkeleton = ({ rows = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`} role="status" aria-label="Loading…">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse rounded-xl bg-slate-200 h-16 w-full"
        style={{ opacity: 1 - i * 0.12 }}
      />
    ))}
    <span className="sr-only">Loading…</span>
  </div>
);

/**
 * Single-line skeleton for inline use.
 * @param {{ width?: string, height?: string }} props
 */
export const SkeletonLine = ({ width = 'w-full', height = 'h-4' }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${width} ${height}`} />
);

/**
 * Skeleton for a StatCard.
 */
export const StatCardSkeleton = () => (
  <div className="animate-pulse bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
    <div className="w-10 h-10 rounded-lg bg-slate-200" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-6 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  </div>
);

export default LoadingSkeleton;
