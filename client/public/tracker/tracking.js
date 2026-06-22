/**
 * @file tracking.js
 * @description Lightweight vanilla JS tracking snippet for SessionPulse.
 *
 * It listens for page views and clicks, assigns a session ID, and safely
 * beacons data to the API. It is designed to be embedded in the <head>
 * or just before </body>.
 *
 * Supported Events:
 *   - page_view: Sent immediately on script load.
 *   - click: Captures precise screen coordinates.
 *
 * Session Persistence:
 *   Session IDs are kept in localStorage and expire according to the
 *   backend's definition of a session timeout (tracked passively).
 *
 * Network Strategy:
 *   Uses fetch() with keepalive: true to ensure clicks leading to
 *   navigation are not aborted by the browser.
 *
 * Browser Support:
 *   Written in ES5/var style intentionally to guarantee compatibility
 *   in every modern browser (Chrome 49+, Firefox 52+, Safari 10+).
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // ── Configuration ─────────────────────────────────────────────────────────

  /** Default API endpoint. Override with window.SESSIONPULSE_ENDPOINT. */
  var ENDPOINT =
    window.SESSIONPULSE_ENDPOINT || 'http://localhost:5000/api/events';

  /** localStorage key used to persist the session identifier. */
  var SESSION_KEY = 'sp_session_id';

  // ── Session Management ────────────────────────────────────────────────────

  /**
   * Generate a random string to act as a unique session/event ID.
   * Format: sp_xxxxxxxx_xxxxxxxx
   */
  function generateId() {
    return (
      'sp_' +
      Math.random().toString(36).substring(2, 10) +
      '_' +
      Math.random().toString(36).substring(2, 10)
    );
  }

  /**
   * Retrieve the current session ID from localStorage, or create
   * a new one and persist it if it doesn't exist.
   */
  function getSessionId() {
    try {
      var id = window.localStorage.getItem(SESSION_KEY);
      if (!id) {
        id = generateId();
        window.localStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (e) {
      // Fallback if localStorage is blocked (e.g. strict incognito mode)
      // The session will just be ephemeral for this page load.
      return generateId();
    }
  }

  // ── Network Dispatch ──────────────────────────────────────────────────────

  /**
   * Send the event payload to the SessionPulse backend.
   *
   * @param {Object} payload - The event data to send.
   */
  function sendEvent(payload) {
    // Basic validation. If the backend is down, we silently fail rather
    // than spamming the host site's console.
    if (!ENDPOINT) return;

    var data = JSON.stringify(payload);

    if (typeof fetch !== 'undefined') {
      // Prefer fetch with keepalive. This ensures the browser continues
      // the request even if the user clicks a link and unloads the page.
      fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
        keepalive: true,
      }).catch(function (err) {
        // Silently swallow network errors so we don't pollute the console
        // of the site integrating this tracker.
      });
    } else {
      // Fallback for extremely old environments without fetch().
      // Note: This won't survive page unloads reliably.
      var xhr = new XMLHttpRequest();
      xhr.open('POST', ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data);
    }
  }

  // ── Event Trackers ────────────────────────────────────────────────────────

  /**
   * Base payload builder.
   * Captures the common fields needed for every event.
   */
  function buildBaseEvent(type) {
    return {
      session_id: getSessionId(),
      event_type: type,
      page_url: window.location.href,
      // The backend adds server-side timestamps, but we send the exact
      // client-side time for accuracy.
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Track a 'page_view' event.
   */
  function trackPageView() {
    var payload = buildBaseEvent('page_view');
    sendEvent(payload);
  }

  /**
   * Track a 'click' event.
   * Captures the x and y coordinates relative to the viewport.
   */
  function trackClick(event) {
    var payload = buildBaseEvent('click');
    // pageX/pageY accounts for scrolling, which is usually what you want
    // for heatmaps rather than clientX/clientY (viewport only).
    payload.x = event.pageX;
    payload.y = event.pageY;
    sendEvent(payload);
  }

  // ── Initialisation ────────────────────────────────────────────────────────

  // 1. Send the initial page view as soon as the script executes.
  trackPageView();

  // 2. Attach global click listener.
  // We use capture phase (true) so we intercept the click even if
  // some other script stops event propagation (e.stopPropagation).
  document.addEventListener('click', trackClick, true);

})(window, document);
