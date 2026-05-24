"use client";

import { useState, useCallback } from "react";

type Locale = "ar" | "en";

export function useLocale(defaultLocale: Locale = "ar") {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  return { locale, setLocale, toggleLocale, isRtl: locale === "ar" };
}
