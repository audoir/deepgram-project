import { useState, useEffect } from "react";
import { SystemState } from "@/lib/models";

export function useSystemState() {
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemState = async () => {
      try {
        const response = await fetch("/api/observability");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSystemState(data);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch system state",
        );
      }
    };

    // Initial fetch
    fetchSystemState();

    // Set up polling interval
    const interval = setInterval(fetchSystemState, 2000);

    return () => clearInterval(interval);
  }, []);

  return {
    systemState,
    lastUpdated,
    error,
    setError,
  };
}
