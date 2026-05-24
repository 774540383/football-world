import { Card } from "@/components/ui/card";
import { StandingsTable } from "@/components/shared/standings-table";
import { SectionHeader } from "@/components/shared/section-header";
import { getStandings, getLeagues } from "@/lib/data";
import { LineChart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const leagues = await getLeagues();

  return (
    <div className="space-y-8">
      <SectionHeader title="ترتيب الدوريات" icon={LineChart} />

      {leagues.length > 0 ? (
        <div className="space-y-8">
          {leagues.slice(0, 5).map(async (league) => {
            const standings = await getStandings(league.id, league.season);
            return (
              <Card key={league.id} className="overflow-hidden">
                <div className="gradient-primary p-4 flex items-center gap-3">
                  {league.logo && (
                    <img src={league.logo} alt="" className="w-8 h-8 object-contain brightness-0 invert" />
                  )}
                  <h2 className="text-white font-bold">{league.nameAr || league.name}</h2>
                  <span className="text-white/60 text-sm mr-auto">{league.season}</span>
                </div>
                <div className="p-4">
                  <StandingsTable standings={standings as any} />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد ترتيبات متاحة حالياً
        </div>
      )}
    </div>
  );
}
