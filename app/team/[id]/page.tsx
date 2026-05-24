import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from "@/components/player/player-card";
import { MatchCard } from "@/components/match/match-card";
import { SectionHeader } from "@/components/shared/section-header";
import { getTeamById } from "@/lib/data";
import { getImageUrl } from "@/lib/utils";
import { MapPin, Users, Calendar, Trophy, Star } from "lucide-react";

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;
  const team = await getTeamById(id);

  if (!team) notFound();

  const allMatches = [...(team.homeMatches || []), ...(team.awayMatches || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 border border-white/20">
            {team.logo ? (
              <img src={getImageUrl(team.logo)} alt={team.name} className="w-full h-full object-contain brightness-0 invert" />
            ) : (
              <span className="text-4xl font-bold opacity-50">{team.name?.charAt(0)}</span>
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-black">{team.nameAr || team.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
              {team.country && <span>{team.country}</span>}
              {team.stadium && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {team.stadium}
                </span>
              )}
              {team.founded && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  تأسس {team.founded}
                </span>
              )}
            </div>
            {team.coach && (
              <div className="flex items-center gap-1 text-sm text-white/70">
                <Users className="w-3 h-3" />
                المدرب: {team.coach}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <SectionHeader title="آخر المباريات" icon={Calendar} />
            <div className="space-y-2">
              {allMatches.map((match) => (
                <MatchCard key={match.id} match={match as any} variant="compact" />
              ))}
              {allMatches.length === 0 && (
                <p className="text-sm text-muted-foreground">لا توجد مباريات بعد</p>
              )}
            </div>
          </section>

          <section>
            <SectionHeader title="قائمة اللاعبين" icon={Users} />
            {team.players && team.players.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {team.players.map((player) => (
                  <PlayerCard key={player.id} player={player as any} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">لا يوجد لاعبون مسجلون</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              معلومات الفريق
            </h3>
            <div className="space-y-3">
              {[
                { label: "التصنيف", value: team.rating?.toFixed(1) || "—" },
                { label: "الملعب", value: team.stadium || "—" },
                { label: "السعة", value: team.capacity ? `${team.capacity.toLocaleString()}` : "—" },
                { label: "المدرب", value: team.coach || "—" },
                { label: "تأسس", value: team.founded || "—" },
                { label: "الدوري", value: team.league?.nameAr || team.league?.name || "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              أفضل اللاعبين
            </h3>
            <p className="text-sm text-muted-foreground">لا توجد بيانات كافية</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
