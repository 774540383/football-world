import { MatchCard } from "@/components/match/match-card";
import { getMatches } from "@/lib/data";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Radio, WifiOff, Tv, Play } from "lucide-react";
import { FALLBACK_CHANNELS } from "@/lib/streaming";

export const dynamic = "force-dynamic";
export const revalidate = 10;

export default async function LivePage() {
  const live = await getMatches({ status: "LIVE" });
  const scheduled = await getMatches({ status: "SCHEDULED" });

  const freeChannels = FALLBACK_CHANNELS.filter((ch) => ch.isFree && ch.active);

  return (
    <div className="space-y-8">
      {/* Live Channels Banner */}
      <Link href="/live/channels">
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Tv className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">القنوات الرياضية المباشرة</h2>
                <p className="text-white/70 text-sm">شاهد البث المباشر للقنوات الرياضية</p>
              </div>
            </div>
            <Button variant="secondary" className="gap-2 bg-white/10 text-white border border-white/20 hover:bg-white/20">
              <Play className="w-4 h-4" />
              تصفح القنوات
            </Button>
          </div>
          {freeChannels.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {freeChannels.slice(0, 4).map((ch) => (
                <span key={ch.id} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs border border-white/10">
                  {ch.nameAr}
                </span>
              ))}
              {freeChannels.length > 4 && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs">+{freeChannels.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div>
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
            description="جميع المباريات انتهت حالياً، تابع المباريات القادمة أو شاهد القنوات الرياضية"
          />
        )}
      </div>

      <div>
        <SectionHeader title="المباريات القادمة" icon={Radio} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduled.slice(0, 12).map((match) => (
            <MatchCard key={match.id} match={match as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
