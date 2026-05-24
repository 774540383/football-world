import { MatchCard } from "@/components/match/match-card";
import { SectionHeader } from "@/components/shared/section-header";
import { getMatches } from "@/lib/data";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const today = new Date().toISOString().split("T")[0];
  const matches = await getMatches({ date: today });

  return (
    <div className="space-y-8">
      <SectionHeader title="جدول المباريات" icon={Calendar} />

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد مباريات اليوم
        </div>
      )}
    </div>
  );
}
