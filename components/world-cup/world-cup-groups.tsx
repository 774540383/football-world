"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import worldCupData from "@/worldcup-2026-data.json";

const flagMap: Record<string, string> = {
  "us":"🇺🇸","pt":"🇵🇹","kr":"🇰🇷","gh":"🇬🇭","ar":"🇦🇷","fr":"🇫🇷","dk":"🇩🇰","au":"🇦🇺",
  "gb-eng":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","nl":"🇳🇱","sn":"🇸🇳","ec":"🇪🇨","de":"🇩🇪","es":"🇪🇸","jp":"🇯🇵","cm":"🇨🇲",
  "br":"🇧🇷","hr":"🇭🇷","ch":"🇨🇭","sa":"🇸🇦","be":"🇧🇪","ma":"🇲🇦","rs":"🇷🇸","ca":"🇨🇦",
  "it":"🇮🇹","mx":"🇲🇽","pl":"🇵🇱","tn":"🇹🇳","uy":"🇺🇾","ng":"🇳🇬","se":"🇸🇪","ir":"🇮🇷",
  "co":"🇨🇴","eg":"🇪🇬","py":"🇵🇾","iq":"🇮🇶","cl":"🇨🇱","dz":"🇩🇿","cz":"🇨🇿","nz":"🇳🇿",
  "ci":"🇨🇮","gb-wls":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","no":"🇳🇴","qa":"🇶🇦","tr":"🇹🇷","ru":"🇷🇺","gb-sct":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","jm":"🇯🇲",
};

function buildGroups() {
  return (worldCupData as any[]).map((g: any) => ({
    name: "المجموعة " + g.name,
    teams: g.teams.map((t: any, i: number) => {
      const pts = Math.max(1, 6 - i * 2);
      const won = Math.floor(pts / 3);
      const drawn = pts - won * 3;
      const lost = 3 - won - drawn;
      const gf = won * 2 + drawn + i;
      const ga = lost * 2 + 3 - i;
      return { name: t.nameAr, flag: flagMap[t.flag] || "🏳", played: 3, won, drawn, lost, gf, ga, pts };
    }),
  }));
}

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

const mockGroups: GroupData[] = buildGroups();

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
