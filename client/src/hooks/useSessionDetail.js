/**
 * @file useSessionDetail.js
 * @description Hook for fetching all events for a specific session.
 *
 * Re-fetches automatically whenever sessionId changes.
 * Returns events in the chronological order provided by the API.
 */

import { useState, useEffect, useRef } from 'react';
import { fetchSessionById } from '../services/api';

/**
 * @param {string|null} sessionId - The session to load. Pass null to reset.
 * @returns {{
 *   events: Object[],
 *   loading: boolean,
 *   error: string|null,
 * }}
 */
const useSessionDetail = (sessionId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setEvents([]);
      setError(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchSessionById(sessionId);
        if (!mountedRef.current) return;
        setEvents(res.data || []);
      } catch (err) {
        if (!mountedRef.current) return;
        setError(err.message);
        setEvents([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    load();
  }, [sessionId]);

  return { events, loading, error };
};

export default useSessionDetail;
