import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import type { TeamType } from "@/types";
import { MapPin, Users } from "lucide-react";

interface TeamCardProps {
  team: TeamType;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/team/${team.id}`}>
      <Card className="p-5 hover-lift group">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center p-3 transition-transform group-hover:scale-110">
            {team.logo ? (
              <img src={getImageUrl(team.logo)} alt={team.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">{team.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{team.nameAr || team.name}</h3>
            {team.country && (
              <p className="text-xs text-muted-foreground">{team.country}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {team.stadium && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {team.stadium}
              </span>
            )}
            {team.coach && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {team.coach}
              </span>
            )}
          </div>
          {team.rating > 0 && (
            <Badge variant="secondary" className="text-xs">
              {team.rating.toFixed(1)}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
