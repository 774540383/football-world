"use client";

import { useState, useEffect, useCallback } from "react";
import type { MatchType } from "@/types";

export function useLiveMatches() {
  const [matches, setMatches] = useState<MatchType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/matches?status=LIVE&limit=50");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMatches(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return { matches, loading, error, refetch: fetchMatches };
}
