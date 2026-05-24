"use client";

import { useState, useEffect, useCallback } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date | string): Countdown {
  const calculate = useCallback((): Countdown => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
    };
  }, [targetDate]);

  const [countdown, setCountdown] = useState<Countdown>(calculate);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculate());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculate]);

  return countdown;
}
