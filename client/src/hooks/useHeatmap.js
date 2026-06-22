/**
 * @file useHeatmap.js
 * @description Hook for fetching heatmap click data for a given page URL.
 *
 * Fetching is triggered manually via the `fetch` function returned
 * by this hook, so the user controls when to load (after typing a URL).
 */

import { useState, useRef } from 'react';
import { fetchHeatmap } from '../services/api';

/**
 * @returns {{
 *   clicks: Object[],
 *   page: string,
 *   loading: boolean,
 *   error: string|null,
 *   fetch: (pageUrl: string) => Promise<void>,
 * }}
 */
const useHeatmap = () => {
  const [clicks, setClicks] = useState([]);
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const load = async (pageUrl) => {
    if (!pageUrl || !pageUrl.trim()) return;
    const trimmed = pageUrl.trim();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchHeatmap(trimmed);
      if (!mountedRef.current) return;
      setClicks(res.data || []);
      setPage(res.page || trimmed);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message);
      setClicks([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return { clicks, page, loading, error, fetch: load };
};

export default useHeatmap;
