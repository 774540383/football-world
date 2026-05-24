import { MatchCard } from "@/components/match/match-card";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { getLiveMatches } from "@/lib/data";
import { Radio, WifiOff } from "lucide-react";

export async function LiveMatchesSection() {
  const matches = await getLiveMatches();

  return (
    <section>
      <SectionHeader
        title="المباريات المباشرة"
        icon={Radio}
        href="/live"
      />
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.slice(0, 4).map((match) => (
            <MatchCard key={match.id} match={match as any} variant="default" />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={WifiOff}
          title="لا توجد مباريات مباشرة الآن"
          description="ستظهر المباريات المباشرة هنا عند بدايتها"
        />
      )}
    </section>
  );
}
