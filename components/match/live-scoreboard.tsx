"use client";

import { motion } from "framer-motion";
import { cn, getImageUrl } from "@/lib/utils";
import type { MatchType } from "@/types";

interface LiveScoreboardProps {
  match: MatchType;
}

export function LiveScoreboard({ match }: LiveScoreboardProps) {
  const isLive = match.status === "LIVE";
  const scoreDisplay = `${match.homeScore ?? 0} : ${match.awayScore ?? 0}`;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-8 text-center",
        isLive
          ? "gradient-live text-white shadow-2xl shadow-red-500/20"
          : "gradient-primary text-white shadow-2xl shadow-blue-500/20"
      )}
    >
      {isLive && (
        <>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </>
      )}

      {match.league && (
        <div className="flex items-center justify-center gap-2 mb-4">
          {match.league.logo && (
            <img src={getImageUrl(match.league.logo)} alt="" className="w-5 h-5 object-contain brightness-0 invert" />
          )}
          <span className="text-sm opacity-80">{match.league.nameAr || match.league.name}</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-6 md:gap-12 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
            {match.homeTeam.logo ? (
              <img src={getImageUrl(match.homeTeam.logo)} alt="" className="w-16 h-16 md:w-20 md:h-20 object-contain brightness-0 invert" />
            ) : (
              <span className="text-3xl font-bold opacity-50">{match.homeTeam.name?.charAt(0)}</span>
            )}
          </div>
          <span className="text-sm md:text-base font-medium opacity-90">
            {match.homeTeam.nameAr || match.homeTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            key={scoreDisplay}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter tabular-nums"
          >
            {scoreDisplay}
          </motion.div>
          {isLive && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm font-bold tracking-wide">{match.minute}&apos;</span>
            </div>
          )}
          {match.status === "SCHEDULED" && (
            <span className="text-sm mt-2 opacity-80">
              {new Date(match.date).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {match.status === "FINISHED" && (
            <span className="text-sm mt-2 opacity-70">انتهت المباراة</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
            {match.awayTeam.logo ? (
              <img src={getImageUrl(match.awayTeam.logo)} alt="" className="w-16 h-16 md:w-20 md:h-20 object-contain brightness-0 invert" />
            ) : (
              <span className="text-3xl font-bold opacity-50">{match.awayTeam.name?.charAt(0)}</span>
            )}
          </div>
          <span className="text-sm md:text-base font-medium opacity-90">
            {match.awayTeam.nameAr || match.awayTeam.name}
          </span>
        </div>
      </div>

      {(match.venue || match.referee) && (
        <div className="flex items-center justify-center gap-4 mt-4 text-xs opacity-70">
          {match.venue && <span>🏟 {match.venue}</span>}
          {match.referee && <span>👨‍⚖️ {match.referee}</span>}
        </div>
      )}
    </motion.div>
  );
}
