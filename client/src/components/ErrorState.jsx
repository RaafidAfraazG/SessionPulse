/**
 * @file ErrorState.jsx
 * @description Error state display with retry support.
 */

/**
 * @param {{
 *   message?: string,
 *   onRetry?: Function,
 * }} props
 */
const ErrorState = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-600" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
    </div>

    <h3 className="text-base font-semibold text-red-600 mb-2">Connection Error</h3>
    <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">{message}</p>

    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium bg-white hover:bg-slate-50 shadow-sm
                   border border-slate-200 hover:border-slate-300 text-slate-700
                   rounded-lg transition-all duration-200 flex items-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
