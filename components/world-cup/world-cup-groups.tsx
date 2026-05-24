"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GroupTeam {
  name: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  pts: number;
}

interface GroupData {
  name: string;
  teams: GroupTeam[];
}

const mockGroups: GroupData[] = [
  {
    name: "المجموعة A",
    teams: [
      { name: "قطر", flag: "🇶🇦", played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 2, pts: 7 },
      { name: "هولندا", flag: "🇳🇱", played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, pts: 6 },
      { name: "السنغال", flag: "🇸🇳", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, pts: 4 },
      { name: "الإكوادور", flag: "🇪🇨", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 5, pts: 0 },
    ],
  },
  {
    name: "المجموعة B",
    teams: [
      { name: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, pts: 7 },
      { name: "الولايات المتحدة", flag: "🇺🇸", played: 3, won: 1, drawn: 2, lost: 0, gf: 3, ga: 1, pts: 5 },
      { name: "إيران", flag: "🇮🇷", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, pts: 3 },
      { name: "ويلز", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 5, pts: 1 },
    ],
  },
  {
    name: "المجموعة C",
    teams: [
      { name: "الأرجنتين", flag: "🇦🇷", played: 3, won: 3, drawn: 0, lost: 0, gf: 7, ga: 1, pts: 9 },
      { name: "بولندا", flag: "🇵🇱", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, pts: 4 },
      { name: "المكسيك", flag: "🇲🇽", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, pts: 3 },
      { name: "السعودية", flag: "🇸🇦", played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 6, pts: 1 },
    ],
  },
  {
    name: "المجموعة D",
    teams: [
      { name: "فرنسا", flag: "🇫🇷", played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 2, pts: 7 },
      { name: "الدنمارك", flag: "🇩🇰", played: 3, won: 1, drawn: 2, lost: 0, gf: 3, ga: 1, pts: 5 },
      { name: "تونس", flag: "🇹🇳", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, pts: 3 },
      { name: "أستراليا", flag: "🇦🇺", played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 4, pts: 1 },
    ],
  },
  {
    name: "المجموعة E",
    teams: [
      { name: "إسبانيا", flag: "🇪🇸", played: 3, won: 2, drawn: 0, lost: 1, gf: 6, ga: 3, pts: 6 },
      { name: "ألمانيا", flag: "🇩🇪", played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, pts: 4 },
      { name: "اليابان", flag: "🇯🇵", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, pts: 4 },
      { name: "كوستاريكا", flag: "🇨🇷", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 5, pts: 3 },
    ],
  },
  {
    name: "المجموعة F",
    teams: [
      { name: "البرازيل", flag: "🇧🇷", played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, pts: 9 },
      { name: "سويسرا", flag: "🇨🇭", played: 3, won: 1, drawn: 1, lost: 1, gf: 2, ga: 3, pts: 4 },
      { name: "الكاميرون", flag: "🇨🇲", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 5, pts: 3 },
      { name: "صربيا", flag: "🇷🇸", played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 5, pts: 1 },
    ],
  },
];

export function WorldCupGroups() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockGroups.map((group) => (
        <motion.div
          key={group.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="gradient-primary p-3">
              <h3 className="text-white font-bold text-center">{group.name}</h3>
            </div>
            <div className="p-3">
              <div className="flex items-center text-xs text-muted-foreground font-medium pb-2 px-2">
                <span className="w-6">#</span>
                <span className="flex-1">الفريق</span>
                <span className="w-6 text-center">ل</span>
                <span className="w-6 text-center">ف</span>
                <span className="w-6 text-center">ت</span>
                <span className="w-6 text-center">خ</span>
                <span className="w-6 text-center">+/-</span>
                <span className="w-7 text-center font-bold">ن</span>
              </div>
              {group.teams.map((team, i) => (
                <div
                  key={team.name}
                  className={cn(
                    "flex items-center text-sm py-2.5 px-2 rounded-xl transition-all",
                    i < 2 ? "bg-emerald-500/5" : "bg-red-500/5",
                    "hover:bg-accent/50"
                  )}
                >
                  <span className="w-6 font-bold text-xs">{i + 1}</span>
                  <span className="flex-1 flex items-center gap-2">
                    <span className="text-base">{team.flag}</span>
                    <span className="font-medium truncate">{team.name}</span>
                  </span>
                  <span className="w-6 text-center text-muted-foreground">{team.played}</span>
                  <span className="w-6 text-center text-emerald-600">{team.won}</span>
                  <span className="w-6 text-center text-amber-600">{team.drawn}</span>
                  <span className="w-6 text-center text-red-600">{team.lost}</span>
                  <span className="w-6 text-center text-muted-foreground">{team.gf - team.ga}</span>
                  <span className="w-7 text-center font-bold">{team.pts}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
