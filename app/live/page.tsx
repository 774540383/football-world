import { MatchCard } from "@/components/match/match-card";
import { getMatches } from "@/lib/data";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Radio, WifiOff } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 10;

export default async function LivePage() {
  const live = await getMatches({ status: "LIVE" });
  const scheduled = await getMatches({ status: "SCHEDULED" });

  return (
    <div className="space-y-8">
      <SectionHeader title="المباريات المباشرة" icon={Radio} />

      {live.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {live.map((match) => (
            <MatchCard key={match.id} match={match as any} variant="live" />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={WifiOff}
          title="لا توجد مباريات مباشرة"
          description="جميع المباريات انتهت حالياً، تابع المباريات القادمة"
        />
      )}

      <SectionHeader title="المباريات القادمة" icon={Radio} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduled.slice(0, 12).map((match) => (
          <MatchCard key={match.id} match={match as any} />
        ))}
      </div>
    </div>
  );
}
