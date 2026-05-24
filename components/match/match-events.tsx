"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MatchEventType } from "@/types";
import {
  CircleDot,
  Swords,
  AlertTriangle,
  CornerDownRight,
  Flag,
  ArrowUpFromLine,
  Ban,
  Goal,
  Shield,
  ArrowRightLeft,
} from "lucide-react";

interface MatchEventsProps {
  events: MatchEventType[];
  homeTeam: string;
  awayTeam: string;
}

const eventIcons: Record<string, any> = {
  goal: Goal,
  card: AlertTriangle,
  substitution: ArrowRightLeft,
  var: Shield,
  penalty: Swords,
  ownGoal: CornerDownRight,
  missedPenalty: Ban,
  corner: CornerDownRight,
  foul: AlertTriangle,
  offside: Flag,
};

const eventColors: Record<string, string> = {
  goal: "text-emerald-500",
  card: "text-yellow-500",
  redCard: "text-red-500",
  substitution: "text-blue-500",
  var: "text-purple-500",
  penalty: "text-orange-500",
  ownGoal: "text-red-400",
  missedPenalty: "text-red-500",
};

export function MatchEvents({ events, homeTeam, awayTeam }: MatchEventsProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        لا توجد أحداث بعد
      </div>
    );
  }

  return (
    <div className="relative space-y-3">
      <div className="absolute right-[23px] top-2 bottom-2 w-0.5 bg-border" />
      {events.map((event, index) => {
        const Icon = eventIcons[event.type] || CircleDot;
        const color = eventColors[event.type] || "text-muted-foreground";
        const isHome = event.teamSide === "home";

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: isHome ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-center gap-3",
              isHome ? "flex-row" : "flex-row-reverse"
            )}
          >
            <div className={cn(
              "w-12 h-6 rounded-full flex items-center justify-center bg-muted z-10",
              color
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <div className={cn(
              "flex-1 p-3 rounded-xl bg-muted/50",
              isHome ? "text-right" : "text-left"
            )}>
              <span className="text-sm font-medium">{event.player}</span>
              {event.assist && (
                <span className="text-xs text-muted-foreground block">
                  <span className="text-emerald-500">←</span> {event.assist}
                </span>
              )}
              {event.detail && (
                <span className="text-xs text-muted-foreground block">{event.detail}</span>
              )}
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground w-8 text-center">
              {event.minute}{event.extraMinute ? `+${event.extraMinute}` : ""}&apos;
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
