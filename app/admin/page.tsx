import { Card } from "@/components/ui/card";
import { prisma, isPrismaAvailable } from "@/lib/prisma";
import { Calendar, Newspaper, Users, Shield, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let matchCount = 0;
  let newsCount = 0;
  let userCount = 0;
  let teamCount = 0;
  let recentMatches: any[] = [];
  let recentNews: any[] = [];

  if (isPrismaAvailable()) {
    try {
      const results = await Promise.allSettled([
        prisma.match.count(),
        prisma.news.count(),
        prisma.user.count(),
        prisma.team.count(),
      ]);
      matchCount = results[0].status === "fulfilled" ? results[0].value : 0;
      newsCount = results[1].status === "fulfilled" ? results[1].value : 0;
      userCount = results[2].status === "fulfilled" ? results[2].value : 0;
      teamCount = results[3].status === "fulfilled" ? results[3].value : 0;

      recentMatches = await prisma.match.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: { homeTeam: true, awayTeam: true, league: true },
      }).catch(() => []);

      recentNews = await prisma.news.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true, views: true, published: true },
      }).catch(() => []);
    } catch {
      // DB not available
    }
  }

  const stats = [
    { label: "المباريات", value: matchCount, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "الأخبار", value: newsCount, icon: Newspaper, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "المستخدمين", value: userCount, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "الفرق", value: teamCount, icon: Shield, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة إدارة الموقع</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            آخر المباريات
          </h3>
          <div className="space-y-2">
            {recentMatches.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/50 text-sm">
                <span className="truncate">
                  {m.homeTeam?.name || "?"} vs {m.awayTeam?.name || "?"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {m.homeScore ?? "-"}:{m.awayScore ?? "-"}
                </span>
              </div>
            ))}
            {recentMatches.length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد مباريات</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-primary" />
            آخر الأخبار
          </h3>
          <div className="space-y-2">
            {recentNews.map((n: any) => (
              <div key={n.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-accent/50 text-sm">
                <span className="truncate">{n.title}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {n.views ?? 0}
                </div>
              </div>
            ))}
            {recentNews.length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد أخبار</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
