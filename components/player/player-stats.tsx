"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PlayerType } from "@/types";
import {
  Goal,
  Gift,
  Eye,
  ShieldAlert,
  AlertTriangle,
  Ban,
  Clock,
  Swords,
  Crosshair,
  ArrowUpFromLine,
} from "lucide-react";

interface PlayerStatsProps {
  player: PlayerType;
}

const statCards = [
  { key: "goals", label: "الأهداف", icon: Goal, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "assists", label: "التمريرات الحاسمة", icon: Gift, color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "appearances", label: "المباريات", icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10" },
  { key: "yellowCards", label: "بطاقات صفراء", icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { key: "redCards", label: "بطاقات حمراء", icon: Ban, color: "text-red-500", bg: "bg-red-500/10" },
  { key: "minutesPlayed", label: "دقائق اللعب", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export function PlayerStats({ player }: PlayerStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const value = (player as any)[stat.key] ?? 0;
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn("rounded-2xl p-4 text-center", stat.bg)}
          >
            <Icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
