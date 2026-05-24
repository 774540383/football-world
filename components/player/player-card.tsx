import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import type { PlayerType } from "@/types";
import { Shirt } from "lucide-react";

const positionLabels: Record<string, string> = {
  Goalkeeper: "حارس",
  Defender: "مدافع",
  Midfielder: "وسط",
  Forward: "مهاجم",
};

interface PlayerCardProps {
  player: PlayerType;
  showTeam?: boolean;
}

export function PlayerCard({ player, showTeam = false }: PlayerCardProps) {
  return (
    <Link href={`/player/${player.id}`}>
      <Card className="p-4 hover-lift group">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-muted overflow-hidden transition-transform group-hover:scale-110">
              {player.photo ? (
                <img src={getImageUrl(player.photo)} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <Shirt className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
            {player.number && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-lg">
                {player.number}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{player.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              {player.position && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {positionLabels[player.position] || player.position}
                </Badge>
              )}
              {player.age && (
                <span className="text-xs text-muted-foreground">{player.age} سنة</span>
              )}
            </div>
            {showTeam && player.team && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {player.team.nameAr || player.team.name}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="flex gap-2">
              <div className="text-center">
                <p className="text-lg font-bold">{player.goals}</p>
                <p className="text-[10px] text-muted-foreground">هدف</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{player.assists}</p>
                <p className="text-[10px] text-muted-foreground">صنع</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
