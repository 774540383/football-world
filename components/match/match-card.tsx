"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn, getImageUrl } from "@/lib/utils";
import type { MatchType } from "@/types";
import { Clock, MapPin } from "lucide-react";

interface MatchCardProps {
  match: MatchType;
  variant?: "default" | "compact" | "live";
}

export function MatchCard({ match, variant = "default" }: MatchCardProps) {
  const isLive = match.status === "LIVE";
  const isFinished = match.status === "FINISHED";

  if (variant === "compact") {
    return (
      <Link href={`/match/${match.id}`}>
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-all">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0 overflow-hidden">
              {match.homeTeam.logo && (
                <img src={getImageUrl(match.homeTeam.logo)} alt="" className="w-full h-full object-contain" />
              )}
            </div>
            <span className="text-sm truncate">{match.homeTeam.nameAr || match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-2 mx-3">
            {isLive && (
              <span className="text-xs font-bold text-red-500 animate-pulse">{match.minute}&apos;</span>
            )}
            <span className={cn("scoreboard text-base", isLive && "text-red-500 animate-pulse-score")}>
              {match.homeScore ?? "-"}:{match.awayScore ?? "-"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-sm truncate">{match.awayTeam.nameAr || match.awayTeam.name}</span>
            <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0 overflow-hidden">
              {match.awayTeam.logo && (
                <img src={getImageUrl(match.awayTeam.logo)} alt="" className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/match/${match.id}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
          isLive
            ? "bg-gradient-to-br from-red-500/5 to-rose-500/5 border-red-500/20 shadow-lg shadow-red-500/5"
            : isFinished
            ? "bg-gradient-to-br from-gray-500/5 to-gray-500/5 border-gray-500/10"
            : "bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/10 hover:shadow-lg hover:shadow-blue-500/5",
          "hover-lift"
        )}
      >
        {isLive && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-rose-500" />
        )}

        <div className="flex items-center justify-between mb-3">
          {match.league && (
            <div className="flex items-center gap-1.5">
              {match.league.logo && (
                <img src={getImageUrl(match.league.logo)} alt="" className="w-4 h-4 object-contain" />
              )}
              <span className="text-xs text-muted-foreground">{match.league.nameAr || match.league.name}</span>
            </div>
          )}
          {isLive && (
            <Badge variant="live" className="text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1 animate-pulse" />
              مباشر
            </Badge>
          )}
          {isFinished && (
            <Badge variant="finished" className="text-xs">انتهت</Badge>
          )}
          {match.status === "SCHEDULED" && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 ml-1" />
              {new Date(match.date).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
              {match.homeTeam.logo ? (
                <img src={getImageUrl(match.homeTeam.logo)} alt="" className="w-10 h-10 object-contain" />
              ) : (
                <span className="text-lg font-bold text-muted-foreground">
                  {match.homeTeam.name?.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-center leading-tight">
              {match.homeTeam.nameAr || match.homeTeam.name}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "scoreboard text-3xl",
              isLive && "text-red-500",
              isFinished && "text-foreground"
            )}>
              {isLive || isFinished ? (
                <span className="tabular-nums">
                  {match.homeScore ?? 0} : {match.awayScore ?? 0}
                </span>
              ) : (
                <span className="text-base text-muted-foreground">
                  {new Date(match.date).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            {isLive && (
              <span className="text-xs font-bold text-red-500 animate-pulse bg-red-500/10 px-2 py-0.5 rounded-full">
                {match.minute}&apos;
              </span>
            )}
            {match.status === "SCHEDULED" && match.venue && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{match.venue}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
              {match.awayTeam.logo ? (
                <img src={getImageUrl(match.awayTeam.logo)} alt="" className="w-10 h-10 object-contain" />
              ) : (
                <span className="text-lg font-bold text-muted-foreground">
                  {match.awayTeam.name?.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-center leading-tight">
              {match.awayTeam.nameAr || match.awayTeam.name}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
