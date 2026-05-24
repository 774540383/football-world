"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Radio, Newspaper, ChevronLeft } from "lucide-react";

export function HomeHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12 text-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 text-center md:text-right">
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 ml-2 animate-pulse" />
            مباريات مباشرة الآن
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            عالم كرة القدم
            <br />
            <span className="text-yellow-400">في مكان واحد</span>
          </h1>
          <p className="text-white/70 text-lg max-w-lg">
            تابع المباريات المباشرة، الأخبار العاجلة، الإحصائيات الدقيقة، وكل ما يخص كرة القدم العالمية
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/live">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                <Radio className="w-5 h-5 ml-2" />
                المباريات المباشرة
              </Button>
            </Link>
            <Link href="/world-cup">
              <Button size="lg" variant="glass" className="text-white border-white/30 hover:bg-white/10">
                <Trophy className="w-5 h-5 ml-2" />
                كأس العالم
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {[
            { number: "100+", label: "دوري" },
            { number: "500+", label: "فريق" },
            { number: "10K+", label: "مباراة" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black">{s.number}</p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
