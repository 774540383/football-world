"use client";

import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Trophy, MapPin, Calendar } from "lucide-react";
import { WORLD_CUP_INFO } from "@/lib/constants";

export function WorldCupHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12 text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-white/10 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-3xl md:text-5xl font-black mb-2">
            كأس العالم {WORLD_CUP_INFO.year}
          </h1>
          <p className="text-white/70 text-lg mb-6">
            {WORLD_CUP_INFO.host}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <CountdownTimer
            targetDate={WORLD_CUP_INFO.startDate}
            size="lg"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{WORLD_CUP_INFO.startDate} — {WORLD_CUP_INFO.endDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{WORLD_CUP_INFO.host}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>{WORLD_CUP_INFO.teams} فريق — {WORLD_CUP_INFO.matches} مباراة</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
