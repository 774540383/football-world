"use client";

import { motion } from "framer-motion";
import { cn, getImageUrl } from "@/lib/utils";
import type { StandingType } from "@/types";

interface StandingsTableProps {
  standings: StandingType[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        لا توجد ترتيبات متاحة
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-muted-foreground border-b">
            <th className="text-right py-3 px-2 font-medium">#</th>
            <th className="text-right py-3 px-2 font-medium">الفريق</th>
            <th className="text-center py-3 px-2 font-medium">ل</th>
            <th className="text-center py-3 px-2 font-medium">ف</th>
            <th className="text-center py-3 px-2 font-medium">ت</th>
            <th className="text-center py-3 px-2 font-medium">خ</th>
            <th className="text-center py-3 px-2 font-medium">له</th>
            <th className="text-center py-3 px-2 font-medium">عليه</th>
            <th className="text-center py-3 px-2 font-medium">+/-</th>
            <th className="text-center py-3 px-2 font-bold">ن</th>
            <th className="text-center py-3 px-2 font-medium">آخر 5</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "border-b border-muted/50 hover:bg-accent/30 transition-colors",
                index < 4 && "bg-emerald-500/5",
                index > standings.length - 4 && "bg-red-500/5"
              )}
            >
              <td className="py-3 px-2">
                <span className={cn(
                  "text-sm font-bold w-6 inline-block text-center",
                  index === 0 && "text-yellow-500",
                  index === 1 && "text-gray-400",
                  index === 2 && "text-amber-600",
                  index > standings.length - 4 && "text-red-500"
                )}>
                  {row.position}
                </span>
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {row.team.logo && (
                      <img src={getImageUrl(row.team.logo)} alt="" className="w-full h-full object-contain" />
                    )}
                  </div>
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {row.team.nameAr || row.team.name}
                  </span>
                </div>
              </td>
              <td className="text-center py-3 px-2 text-sm">{row.played}</td>
              <td className="text-center py-3 px-2 text-sm text-emerald-600 font-medium">{row.won}</td>
              <td className="text-center py-3 px-2 text-sm text-amber-600 font-medium">{row.drawn}</td>
              <td className="text-center py-3 px-2 text-sm text-red-600 font-medium">{row.lost}</td>
              <td className="text-center py-3 px-2 text-sm">{row.goalsFor}</td>
              <td className="text-center py-3 px-2 text-sm">{row.goalsAgainst}</td>
              <td className="text-center py-3 px-2 text-sm font-medium">{row.goalsFor - row.goalsAgainst}</td>
              <td className="text-center py-3 px-2 text-sm font-bold text-primary">{row.points}</td>
              <td className="text-center py-3 px-2">
                <div className="flex gap-0.5 justify-center">
                  {row.form?.split("").map((c, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-4 h-4 rounded-sm text-[8px] font-bold flex items-center justify-center",
                        c === "W" && "bg-emerald-500 text-white",
                        c === "D" && "bg-amber-500 text-white",
                        c === "L" && "bg-red-500 text-white"
                      )}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
