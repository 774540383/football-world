"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface BracketTeam {
  name: string;
  flag: string;
  score?: number;
  winner?: boolean;
}

interface BracketRound {
  name: string;
  matches: {
    team1: BracketTeam;
    team2: BracketTeam;
  }[];
}

const bracketData: BracketRound[] = [
  {
    name: "دور الـ16",
    matches: [
      { team1: { name: "هولندا", flag: "🇳🇱", score: 3, winner: true }, team2: { name: "الولايات المتحدة", flag: "🇺🇸", score: 1 } },
      { team1: { name: "الأرجنتين", flag: "🇦🇷", score: 2, winner: true }, team2: { name: "أستراليا", flag: "🇦🇺", score: 1 } },
      { team1: { name: "فرنسا", flag: "🇫🇷", score: 3, winner: true }, team2: { name: "بولندا", flag: "🇵🇱", score: 1 } },
      { team1: { name: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 3, winner: true }, team2: { name: "السنغال", flag: "🇸🇳", score: 0 } },
      { team1: { name: "البرازيل", flag: "🇧🇷", score: 4, winner: true }, team2: { name: "كوريا", flag: "🇰🇷", score: 1 } },
      { team1: { name: "إسبانيا", flag: "🇪🇸", score: 1, winner: true }, team2: { name: "المغرب", flag: "🇲🇦", score: 0 } },
      { team1: { name: "قطر", flag: "🇶🇦", score: 2, winner: true }, team2: { name: "سويسرا", flag: "🇨🇭", score: 1 } },
      { team1: { name: "ألمانيا", flag: "🇩🇪", score: 2, winner: true }, team2: { name: "الدنمارك", flag: "🇩🇰", score: 0 } },
    ],
  },
  {
    name: "ربع النهائي",
    matches: [
      { team1: { name: "هولندا", flag: "🇳🇱", score: 2, winner: true }, team2: { name: "الأرجنتين", flag: "🇦🇷", score: 2 } },
      { team1: { name: "فرنسا", flag: "🇫🇷", score: 2, winner: true }, team2: { name: "إنجلترا", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1 } },
      { team1: { name: "البرازيل", flag: "🇧🇷", score: 1, winner: true }, team2: { name: "إسبانيا", flag: "🇪🇸", score: 1 } },
      { team1: { name: "قطر", flag: "🇶🇦", score: 0 }, team2: { name: "ألمانيا", flag: "🇩🇪", score: 1, winner: true } },
    ],
  },
  {
    name: "نصف النهائي",
    matches: [
      { team1: { name: "الأرجنتين", flag: "🇦🇷", score: 3, winner: true }, team2: { name: "فرنسا", flag: "🇫🇷", score: 0 } },
      { team1: { name: "البرازيل", flag: "🇧🇷", score: 1, winner: true }, team2: { name: "ألمانيا", flag: "🇩🇪", score: 0 } },
    ],
  },
  {
    name: "النهائي",
    matches: [
      { team1: { name: "الأرجنتين", flag: "🇦🇷", score: 3, winner: true }, team2: { name: "البرازيل", flag: "🇧🇷", score: 3 } },
    ],
  },
];

export function WorldCupBracket() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max">
        {bracketData.map((round, roundIndex) => (
          <div key={round.name} className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold text-primary">{round.name}</h3>
            </div>
            {round.matches.map((match, matchIndex) => (
              <motion.div
                key={matchIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: matchIndex * 0.1 }}
              >
                <Card className="p-3 min-w-[200px]">
                  {[match.team1, match.team2].map((team, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all",
                        team.winner && "bg-emerald-500/10 font-semibold"
                      )}
                    >
                      <span className="text-lg">{team.flag}</span>
                      <span className="text-sm flex-1">{team.name}</span>
                      {team.score !== undefined && (
                        <span className={cn(
                          "font-bold text-sm w-6 text-center",
                          team.winner && "text-emerald-600"
                        )}>
                          {team.score}
                        </span>
                      )}
                    </div>
                  ))}
                </Card>
              </motion.div>
            ))}
            {round.name === "النهائي" && (
              <div className="text-center mt-2">
                <Trophy className="w-6 h-6 text-yellow-500 mx-auto animate-pulse" />
                <p className="text-xs text-muted-foreground mt-1">البطل</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
