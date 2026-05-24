"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MatchStatType } from "@/types";

interface MatchStatsProps {
  homeStats: MatchStatType | null;
  awayStats: MatchStatType | null;
  homeName: string;
  awayName: string;
}

const statRows = [
  { key: "possession", label: "الاستحواذ", suffix: "%" },
  { key: "shots", label: "التسديدات", suffix: "" },
  { key: "shotsOnTarget", label: "على المرمى", suffix: "" },
  { key: "corners", label: "ركنيات", suffix: "" },
  { key: "fouls", label: "أخطاء", suffix: "" },
  { key: "yellowCards", label: "بطاقات صفراء", suffix: "" },
  { key: "redCards", label: "بطاقات حمراء", suffix: "" },
  { key: "offsides", label: "تسلل", suffix: "" },
  { key: "saves", label: "تصديات", suffix: "" },
];

export function MatchStats({ homeStats, awayStats, homeName, awayName }: MatchStatsProps) {
  if (!homeStats || !awayStats) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        لا توجد إحصائيات متاحة بعد
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium">{homeName}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">إحصائيات</span>
        <span className="text-sm font-medium">{awayName}</span>
      </div>

      {statRows.map((row, index) => {
        const homeVal = (homeStats as any)[row.key] ?? 0;
        const awayVal = (awayStats as any)[row.key] ?? 0;
        const total = homeVal + awayVal || 1;
        const homePercent = (homeVal / total) * 100;

        const isYellow = row.key === "yellowCards";
        const isRed = row.key === "redCards";

        return (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between text-sm">
              <span className={cn("font-mono font-bold w-8 text-left", isRed && "text-red-500")}>
                {homeVal}{row.suffix}
              </span>
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span className={cn("font-mono font-bold w-8 text-right", isRed && "text-red-500")}>
                {awayVal}{row.suffix}
              </span>
            </div>
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "absolute right-0 top-0 h-full rounded-full transition-all duration-500",
                  isYellow ? "bg-yellow-400" : isRed ? "bg-red-500" : "bg-primary"
                )}
                style={{ width: `${homePercent}%` }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
