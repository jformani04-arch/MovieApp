import { useState, useEffect, useRef } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true); // ✅ Track mount state safely

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();

      // ✅ Only set state if component is still mounted
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    if (isMounted.current) {
      setData(null);
      setError(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    // 🧹 Cleanup for safety when component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
