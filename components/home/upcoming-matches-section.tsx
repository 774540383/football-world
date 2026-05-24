import { MatchCard } from "@/components/match/match-card";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { getMatches } from "@/lib/data";
import { Calendar, CalendarDays } from "lucide-react";

export async function UpcomingMatchesSection() {
  const today = new Date().toISOString().split("T")[0];
  const matches = await getMatches({ date: today, status: "SCHEDULED" });

  return (
    <section>
      <SectionHeader
        title="مباريات اليوم"
        icon={CalendarDays}
        href="/matches"
      />
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.slice(0, 6).map((match) => (
            <MatchCard key={match.id} match={match as any} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="لا توجد مباريات اليوم"
          description="تحقق من جدول المباريات القادمة"
        />
      )}
    </section>
  );
}
