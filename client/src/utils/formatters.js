/**
 * @file formatters.js
 * @description Date and string formatting utilities.
 */

/**
 * Format a date as a short human-readable string.
 * e.g. "Jun 22, 3:45:10 PM"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

/**
 * Format a date as a relative time string.
 * e.g. "just now", "5m ago", "2h ago"
 * Falls back to formatDate for dates older than 24 hours.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '—';
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return formatDate(date);
};

/**
 * Truncate a string to a max length and add an ellipsis.
 * @param {string} str
 * @param {number} [maxLen=22]
 * @returns {string}
 */
export const truncate = (str, maxLen = 22) => {
  if (!str) return '—';
  return str.length > maxLen ? `${str.substring(0, maxLen)}…` : str;
};

/**
 * Format a number with comma separators.
 * @param {number} n
 * @returns {string}
 */
export const formatNumber = (n) => {
  if (n == null) return '0';
  return new Intl.NumberFormat('en-US').format(n);
};
