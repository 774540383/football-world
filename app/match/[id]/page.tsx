import { notFound } from "next/navigation";
import { LiveScoreboard } from "@/components/match/live-scoreboard";
import { MatchStats } from "@/components/match/match-stats";
import { MatchEvents } from "@/components/match/match-events";
import { getMatchById } from "@/lib/data";
import { MatchCard } from "@/components/match/match-card";
import { RelatedNews } from "@/components/match/related-news";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 10;

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) notFound();

  return (
    <div className="space-y-8">
      <LiveScoreboard match={match as any} />

      {match.status === "LIVE" || match.status === "FINISHED" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">إحصائيات المباراة</h3>
            <MatchStats
              homeStats={match.homeStats as any}
              awayStats={match.awayStats as any}
              homeName={match.homeTeam.nameAr || match.homeTeam.name}
              awayName={match.awayTeam.nameAr || match.awayTeam.name}
            />
          </div>
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">أحداث المباراة</h3>
            <MatchEvents
              events={match.events as any}
              homeTeam={match.homeTeam.name}
              awayTeam={match.awayTeam.name}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">تفاصيل المباراة</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "البطولة", value: match.league?.nameAr || match.league?.name },
                { label: "الجولة", value: match.round },
                { label: "الملعب", value: match.venue },
                { label: "الحكم", value: match.referee },
                { label: "التاريخ", value: new Date(match.date).toLocaleDateString("ar-EG") },
                { label: "الوقت", value: new Date(match.date).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) },
              ].filter((x) => x.value).map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">مواجهات سابقة</h3>
            <p className="text-sm text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        </div>
      )}

      <RelatedNews matchId={id} />
    </div>
  );
}
