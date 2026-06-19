import { useState, useEffect, useMemo, useRef } from 'react';

/**
 * Global SWR-style cache shared across all consumers of useFetchData.
 *
 * Keyed by an explicit cacheKey or the fetcher's function name.
 * TTL is 5 minutes — anything fresher than that is served immediately
 * without hitting the network at all.
 */
const globalCache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000;
const MAX_RETRIES = 2;

export function useFetchData<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  cacheKey?: string,
): { data: T; loading: boolean; error: Error | null } {
  const key = cacheKey || fetcher.name || 'default';
  const cached = globalCache[key];
  const isFresh = !!cached && Date.now() - cached.timestamp < CACHE_TTL;

  const [data, setData] = useState<T>(() => (isFresh ? (cached!.data as T) : fallback));
  const [loading, setLoading] = useState(!isFresh);
  const [error, setError] = useState<Error | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let isMounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchData = async (attempt = 0): Promise<void> => {
      try {
        if (!globalCache[key] && isMounted) setLoading(true);

        const result = await fetcherRef.current();

        if (!isMounted) return;
        globalCache[key] = { data: result, timestamp: Date.now() };
        setData(result);
        setError(null);
        setLoading(false);
      } catch (err: unknown) {
        if (!isMounted) return;

        if (attempt < MAX_RETRIES) {
          // Exponential backoff: 1s, 2s. Track the timer so we can cancel
          // on unmount and avoid a "set state on unmounted component" leak.
          const delay = 2 ** attempt * 1000;
          retryTimer = setTimeout(() => {
            if (isMounted) fetchData(attempt + 1);
          }, delay);
          return;
        }

        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [key]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
