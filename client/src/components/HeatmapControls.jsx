/**
 * @file HeatmapControls.jsx
 * @description Page URL input + fetch button for the Heatmap view.
 *
 * @param {{
 *   value: string,
 *   onChange: (v: string) => void,
 *   onFetch: () => void,
 *   loading: boolean,
 * }} props
 */

const HeatmapControls = ({ value, onChange, onFetch, loading }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onFetch();
  };

  return (
    <div className="flex gap-3 items-center">
      {/* URL input */}
      <div className="relative flex-1">
        {/* Globe icon */}
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-slate-400" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 0 1 3 12c0-1.348.295-2.63.818-3.782"
            />
          </svg>
        </div>
        <input
          id="heatmap-url-input"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/your-page"
          className="w-full bg-white border border-slate-200 text-slate-900 text-sm
                     rounded-xl pl-10 pr-4 py-3 placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
                     transition-all duration-200 font-mono shadow-sm"
        />
      </div>

      {/* Fetch button */}
      <button
        id="heatmap-fetch-btn"
        onClick={onFetch}
        disabled={!value.trim() || loading}
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold
                   bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400
                   disabled:border disabled:border-slate-200 text-white
                   transition-all duration-200 shadow-md shadow-blue-500/20
                   disabled:shadow-none flex-shrink-0"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Loading…
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Load Heatmap
          </>
        )}
      </button>
    </div>
  );
};

export default HeatmapControls;
