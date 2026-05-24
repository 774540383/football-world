"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { X } from "lucide-react";

interface AdBannerProps {
  position?: "top" | "bottom" | "sidebar" | "inline";
  className?: string;
}

export function AdBanner({ position = "inline", className }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 text-center",
        position === "sidebar" && "p-3",
        className
      )}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5"
      >
        <X className="w-3 h-3" />
      </button>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium">إعلان</span> — مساحة إعلانية
      </p>
      <div className="mt-2 h-16 md:h-20 bg-muted/50 rounded-xl flex items-center justify-center">
        <span className="text-sm text-muted-foreground/50">إعلانك هنا</span>
      </div>
    </div>
  );
}
