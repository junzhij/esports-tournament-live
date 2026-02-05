import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../api/client';
import { AdminState } from '../types';

export function useAdminState() {
  const [state, setState] = useState<AdminState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getAdminState();
      setState(data);
      setError(null);
      setLastUpdated(new Date().toISOString());
      setLoading(false);
      return true;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError('无法连接后端', 0);
      setError(apiErr);
      setLoading(false);
      setPolling(false);
      return false;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!polling) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    pollingRef.current = setInterval(() => {
      refresh();
    }, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [polling, refresh]);

  const resume = useCallback(() => {
    setPolling(true);
    refresh();
  }, [refresh]);

  return {
    state,
    loading,
    error,
    lastUpdated,
    polling,
    refresh,
    resume
  };
}
