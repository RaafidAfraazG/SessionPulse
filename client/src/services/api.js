/**
 * @file api.js
 * @description Centralised API service layer.
 *
 * All HTTP calls go through this module. The base URL is '/api', which
 * Vite proxies to http://localhost:5000 in development (see vite.config.js).
 *
 * Every function returns the parsed JSON body or throws an Error with
 * a meaningful message so hooks can surface it properly.
 */

/**
 * Base URL for all API requests.
 * In development, Vite proxies '/api' → http://localhost:5000 (vite.config.js).
 * In production (Vercel/etc.), set VITE_API_URL to the full backend URL.
 */
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Shared response handler — safely parses JSON and throws on non-2xx.
 * Handles empty bodies and non-JSON responses gracefully.
 * @param {Response} res
 * @returns {Promise<Object>}
 */
const handleResponse = async (res) => {
  // Read the raw text first so we don't crash on empty or non-JSON bodies.
  const text = await res.text();

  // If the body is empty the server is likely not running or crashed.
  if (!text || text.trim() === '') {
    throw new Error(
      `Server returned an empty response (HTTP ${res.status}). ` +
      'Is the backend running on port 5000?'
    );
  }

  // Try to parse JSON.
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Server returned non-JSON (HTTP ${res.status}). ` +
      'Check the backend console for errors.'
    );
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/sessions
 * Returns grouped sessions with session_id, total_events, last_activity.
 * @returns {Promise<{ success: boolean, count: number, data: Session[] }>}
 */
export const fetchSessions = () =>
  fetch(`${BASE_URL}/sessions`).then(handleResponse);

/**
 * GET /api/sessions/:sessionId
 * Returns all events for a specific session ordered by timestamp.
 * @param {string} sessionId
 * @returns {Promise<{ success: boolean, count: number, data: Event[] }>}
 */
export const fetchSessionById = (sessionId) =>
  fetch(`${BASE_URL}/sessions/${encodeURIComponent(sessionId)}`).then(handleResponse);

/**
 * DELETE /api/events/reset
 * Deletes all analytics events (demo / testing only).
 * @returns {Promise<{ success: boolean, deletedCount: number, message: string }>}
 */
export const resetAnalytics = () =>
  fetch(`${BASE_URL}/events/reset`, { method: 'DELETE' }).then(handleResponse);

/**
 * GET /api/heatmap?page=<url>
 * Returns click coordinates for a given page URL.
 * @param {string} pageUrl
 * @returns {Promise<{ success: boolean, page: string, count: number, data: Click[] }>}
 */
export const fetchHeatmap = (pageUrl) =>
  fetch(`${BASE_URL}/heatmap?page=${encodeURIComponent(pageUrl)}`).then(handleResponse);
