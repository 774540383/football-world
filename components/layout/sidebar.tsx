import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Flame } from "lucide-react";

const topMatches = [
  { home: "ريال مدريد", away: "برشلونة", time: "22:00", league: "الدوري الإسباني" },
  { home: "مانشستر سيتي", away: "ليفربول", time: "21:30", league: "الدوري الإنجليزي" },
  { home: "بايرن ميونخ", away: "بوروسيا دورتموند", time: "21:30", league: "الدوري الألماني" },
];

const topScorers = [
  { name: "كريستيانو رونالدو", goals: 28, team: "النصر" },
  { name: "كول بالمر", goals: 24, team: "تشيلسي" },
  { name: "إيرلينغ هالاند", goals: 22, team: "مانشستر سيتي" },
];

export function Sidebar() {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-500" />
          <h3 className="font-semibold text-sm">أهم المباريات اليوم</h3>
        </div>
        <div className="space-y-3">
          {topMatches.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/50 transition-all cursor-pointer">
              <div className="text-xs text-muted-foreground">{m.league}</div>
              <div className="text-xs font-medium">{m.time}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h3 className="font-semibold text-sm">ترتيب الهدافين</h3>
        </div>
        <div className="space-y-3">
          {topScorers.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/50 transition-all">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.team}</p>
                </div>
              </div>
              <Badge variant="secondary">{p.goals}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-primary/20">
        <div className="text-center space-y-2">
          <Trophy className="w-8 h-8 text-primary mx-auto" />
          <h3 className="font-semibold">كأس العالم 2026</h3>
          <p className="text-xs text-muted-foreground">العد التنازلي لكرة القدم</p>
          <Link href="/world-cup">
            <Badge variant="default" className="cursor-pointer">استكشف</Badge>
          </Link>
        </div>
      </Card>
    </div>
  );
}
