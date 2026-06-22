/**
 * @file ErrorBoundary.jsx
 * @description React Error Boundary with a professional fallback UI.
 *
 * Catches any render-time JavaScript errors in its child tree and displays
 * a safe fallback instead of a blank white crash screen.
 *
 * Must be a class component — functional components cannot implement
 * componentDidCatch / getDerivedStateFromError.
 */

import { Component } from 'react';

// ── Fallback UI ────────────────────────────────────────────────────────────────
const FallbackUI = ({ error, onReset }) => (
  <div className="min-h-screen bg-white flex items-center justify-center p-6">
    <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center shadow-lg shadow-red-500/5">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-400" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-sm font-bold text-slate-400">
          Session<span className="text-blue-400">Pulse</span>
        </span>
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
      <p className="text-sm text-slate-500 leading-relaxed mb-6">
        An unexpected error occurred in the dashboard. This has been noted.
        You can try recovering below.
      </p>

      {/* Error detail (collapsible) */}
      {error && (
        <details className="text-left mb-6">
          <summary className="text-xs text-slate-600 cursor-pointer hover:text-slate-400 transition-colors select-none">
            Error details
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
            {error.message || String(error)}
          </pre>
        </details>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500
                     text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-semibold bg-white hover:bg-slate-50
                     border border-slate-200 hover:border-slate-300 text-slate-700
                     rounded-xl transition-all duration-200 shadow-sm"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

// ── Error Boundary Class ───────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught render error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackUI
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
