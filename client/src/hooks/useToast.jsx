/**
 * @file useToast.js
 * @description Toast notification system.
 *
 * Exports:
 *  - ToastProvider  : Wrap your app with this to enable toasts everywhere.
 *  - useToast       : Hook to call addToast() from any component.
 *
 * Usage:
 *   const { addToast } = useToast();
 *   addToast('Saved!', 'success');
 *   addToast('Something went wrong.', 'error');
 *   addToast('Heads up!', 'info');
 *   addToast('Check this out.', 'warning');
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ── Context ───────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ── Single Toast Item ─────────────────────────────────────────────────────────
const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 flex-shrink-0" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
};

const STYLES = {
  success: 'bg-white border-emerald-200 text-emerald-600 shadow-lg',
  error:   'bg-white border-red-200 text-red-600 shadow-lg',
  info:    'bg-white border-blue-200 text-blue-600 shadow-lg',
  warning: 'bg-white border-amber-200 text-amber-600 shadow-lg',
};

const PROGRESS_COLORS = {
  success: 'bg-emerald-400',
  error:   'bg-red-400',
  info:    'bg-blue-400',
  warning: 'bg-amber-400',
};

const DURATION_MS = 4000;

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  // Slide-in on mount.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Progress bar countdown.
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgress(pct);
      if (pct > 0) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        relative flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl
        max-w-sm w-full pointer-events-auto overflow-hidden
        backdrop-blur-md transition-all duration-300
        ${STYLES[toast.type] || STYLES.info}
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
    >
      {/* Icon */}
      <span className="mt-0.5">{ICONS[toast.type] || ICONS.info}</span>

      {/* Message */}
      <p className="flex-1 text-sm font-medium leading-snug text-slate-700">{toast.message}</p>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 transition-none ${PROGRESS_COLORS[toast.type]}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// ── Toast Container ───────────────────────────────────────────────────────────
const ToastContainer = ({ toasts, onRemove }) => (
  <div
    aria-label="Notifications"
    className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
  >
    {toasts.map((t) => (
      <ToastItem key={t.id} toast={t} onRemove={onRemove} />
    ))}
  </div>
);

// ── Provider ──────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      // Auto-dismiss after DURATION_MS + 300ms transition.
      setTimeout(() => removeToast(id), DURATION_MS + 300);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
};
