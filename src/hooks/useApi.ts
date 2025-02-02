import { useCallback, useState } from "react";

type UseApiReturn<T, Args extends any[]> = {
  loading: boolean;
  error: string | null;
  data: T | null;
  execute: (...args: Args) => Promise<T>;
};

const useApi = <T, Args extends any[]>(
  apiCall: (...args: Args) => Promise<T>
): UseApiReturn<T, Args> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: Args): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);
      setData(response);
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { loading, data, error, execute };
};

export default useApi;
