import { Suspense } from "react";
import { HomeHero } from "@/components/home/home-hero";
import { LiveMatchesSection } from "@/components/home/live-matches-section";
import { UpcomingMatchesSection } from "@/components/home/upcoming-matches-section";
import { NewsSection } from "@/components/home/news-section";
import { LeaguesSection } from "@/components/home/leagues-section";
import { Sidebar } from "@/components/layout/sidebar";
import { AdBanner } from "@/components/shared/ad-banner";
import { MatchSkeleton } from "@/components/shared/skeleton-card";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HomeHero />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Suspense fallback={<MatchSkeleton />}>
            <LiveMatchesSection />
          </Suspense>

          <AdBanner position="inline" />

          <Suspense fallback={<MatchSkeleton />}>
            <UpcomingMatchesSection />
          </Suspense>

          <Suspense fallback={<div>جاري تحميل الأخبار...</div>}>
            <NewsSection />
          </Suspense>
        </div>

        <aside className="hidden lg:block space-y-6">
          <Sidebar />
          <AdBanner position="sidebar" />
        </aside>
      </div>

      <Suspense fallback={<div>جاري تحميل الدوريات...</div>}>
        <LeaguesSection />
      </Suspense>
    </div>
  );
}
