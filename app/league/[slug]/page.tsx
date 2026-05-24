import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { MatchCard } from "@/components/match/match-card";
import { StandingsTable } from "@/components/shared/standings-table";
import { SectionHeader } from "@/components/shared/section-header";
import { TeamCard } from "@/components/team/team-card";
import { getMatches, getStandings, getLeagues } from "@/lib/data";
import { Calendar, LineChart, Shield, Trophy } from "lucide-react";

interface LeaguePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function LeaguePage({ params }: LeaguePageProps) {
  const { slug } = await params;
  const leagues: any[] = await getLeagues();
  const league = leagues.find(
    (l: any) => l.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!league) notFound();

  const standings = await getStandings(league.id, league.season);
  const matches = await getMatches({ leagueId: league.id, limit: 10 });

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="flex items-center gap-4">
          {league.logo && (
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-3 border border-white/20">
              <img src={league.logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-4xl font-black">{league.nameAr || league.name}</h1>
            <p className="text-white/70">الموسم {league.season}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <SectionHeader title="آخر المباريات" icon={Calendar} />
            <div className="space-y-3">
              {matches.slice(0, 5).map((match) => (
                <MatchCard key={match.id} match={match as any} variant="compact" />
              ))}
              {matches.length === 0 && (
                <p className="text-sm text-muted-foreground">لا توجد مباريات</p>
              )}
            </div>
          </section>

          <section>
            <SectionHeader title="الترتيب" icon={LineChart} />
            <Card className="overflow-hidden">
              <div className="p-4">
                <StandingsTable standings={standings as any} />
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              معلومات البطولة
            </h3>
            <div className="space-y-3">
              {[
                { label: "النوع", value: league.type === "league" ? "دوري" : "كأس" },
                { label: "الموسم", value: league.season },
                { label: "الدولة", value: league.country || "عالمي" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
