/**
 * @file useSessions.js
 * @description Hook for fetching all sessions with 5-second auto-refresh.
 *
 * Computes derived stats (totalEvents, lastActive) from the session list
 * so pages don't have to do it themselves.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSessions } from '../services/api';

const AUTO_REFRESH_MS = 5000;

/**
 * @returns {{
 *   sessions: Object[],
 *   totalEvents: number,
 *   lastActive: string|null,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function,
 *   lastRefreshed: Date|null,
 * }}
 */
const useSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  // Avoid setting state on unmounted component.
  const mountedRef = useRef(true);

  const load = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetchSessions();
      if (!mountedRef.current) return;
      setSessions(res.data || []);
      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message);
    } finally {
      if (mountedRef.current && isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load(true);
    const interval = setInterval(() => load(false), AUTO_REFRESH_MS);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [load]);

  // Derived stats computed from the session list.
  const totalEvents = sessions.reduce((sum, s) => sum + (s.total_events || 0), 0);
  const lastActive = sessions.length
    ? sessions.reduce((latest, s) =>
        !latest || new Date(s.last_activity) > new Date(latest)
          ? s.last_activity
          : latest, null)
    : null;

  return {
    sessions,
    totalEvents,
    lastActive,
    loading,
    error,
    refetch: () => load(false),
    lastRefreshed,
  };
};

export default useSessions;
