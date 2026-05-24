import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerStats } from "@/components/player/player-stats";
import { getPlayerById } from "@/lib/data";
import { getImageUrl } from "@/lib/utils";
import { Shirt, Flag, Ruler, Weight, Cake } from "lucide-react";

interface PlayerPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const positionLabels: Record<string, string> = {
  Goalkeeper: "حارس مرمى",
  Defender: "مدافع",
  Midfielder: "وسط",
  Forward: "مهاجم",
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const player = await getPlayerById(id);

  if (!player) notFound();

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 overflow-hidden">
              {player.photo ? (
                <img src={getImageUrl(player.photo)} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shirt className="w-12 h-12 opacity-50" />
                </div>
              )}
            </div>
            {player.number && (
              <span className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center shadow-xl">
                {player.number}
              </span>
            )}
          </div>
          <div className="text-center md:text-right space-y-2">
            <h1 className="text-2xl md:text-4xl font-black">{player.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              {player.position && (
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  {positionLabels[player.position] || player.position}
                </Badge>
              )}
              {player.team && (
                <Badge variant="outline" className="border-white/20 text-white/80">
                  {player.team.nameAr || player.team.name}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-white/70">
              {player.nationality && (
                <span className="flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  {player.nationality}
                </span>
              )}
              {player.age && (
                <span className="flex items-center gap-1">
                  <Cake className="w-3 h-3" />
                  {player.age} سنة
                </span>
              )}
              {player.height && (
                <span className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  {player.height}
                </span>
              )}
              {player.weight && (
                <span className="flex items-center gap-1">
                  <Weight className="w-3 h-3" />
                  {player.weight}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <PlayerStats player={player as any} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">آخر الإحصائيات</h3>
            {player.stats && player.stats.length > 0 ? (
              <div className="space-y-3">
                {player.stats.slice(0, 10).map((stat) => (
                  <div key={stat.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">الموسم {stat.season}</span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="font-medium">⚽ {stat.goals}</span>
                      <span className="font-medium">🎯 {stat.assists}</span>
                      <span className="font-medium">⭐ {stat.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">لا توجد إحصائيات متاحة</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-bold mb-4">إحصائيات الموسم</h3>
            <div className="space-y-3">
              {[
                { label: "المباريات", value: player.appearances },
                { label: "الأهداف", value: player.goals },
                { label: "التمريرات الحاسمة", value: player.assists },
                { label: "دقائق اللعب", value: player.minutesPlayed },
                { label: "بطاقات صفراء", value: player.yellowCards },
                { label: "بطاقات حمراء", value: player.redCards },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
