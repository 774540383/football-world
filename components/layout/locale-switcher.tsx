"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export function LocaleSwitcher() {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved === "ar" || saved === "en") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  function toggle() {
    const next: Locale = locale === "ar" ? "en" : "ar";
    setLocaleState(next);
    localStorage.setItem("locale", next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    window.location.reload();
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="gap-1 text-sm">
      <Globe className="w-4 h-4" />
      {locale === "ar" ? "English" : "العربية"}
    </Button>
  );
}
