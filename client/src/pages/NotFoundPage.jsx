/**
 * @file NotFoundPage.jsx
 * @description 404 fallback for unknown page states.
 */

const NotFoundPage = ({ onNavigateHome }) => (
  <div className="flex flex-col items-center justify-center min-h-full py-20 px-6 text-center">
    {/* Large 404 */}
    <p className="text-8xl font-black text-slate-100 tracking-tighter select-none mb-4">
      404
    </p>

    {/* Icon */}
    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-6">
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-slate-400" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </svg>
    </div>

    <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
    <p className="text-sm text-slate-500 max-w-xs mb-8">
      The page you&apos;re looking for doesn&apos;t exist. Navigate using the sidebar.
    </p>

    <button
      onClick={onNavigateHome}
      className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500
                 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
    >
      Back to Sessions
    </button>
  </div>
);

export default NotFoundPage;
