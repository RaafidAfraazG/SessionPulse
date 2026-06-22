/**
 * @file SessionSearch.jsx
 * @description Search input for filtering sessions by session_id.
 *
 * @param {{
 *   value: string,
 *   onChange: (value: string) => void,
 *   placeholder?: string,
 * }} props
 */

const SessionSearch = ({ value, onChange, placeholder = 'Search by Session ID…' }) => (
  <div className="relative">
    {/* Search icon */}
    <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-slate-400" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </div>

    <input
      type="text"
      id="session-search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      className="w-full bg-white border border-slate-200 text-slate-900 text-sm
                 rounded-xl pl-10 pr-10 py-2.5 placeholder:text-slate-400
                 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
                 transition-all duration-200 shadow-sm"
    />

    {/* Clear button */}
    {value && (
      <button
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

export default SessionSearch;
