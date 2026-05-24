import { NewsCard } from "@/components/news/news-card";
import { SectionHeader } from "@/components/shared/section-header";
import { getNewsFeed } from "@/lib/data";
import { Newspaper } from "lucide-react";

export async function NewsSection() {
  const news = await getNewsFeed({ limit: 7 });

  if (news.length === 0) {
    return null;
  }

  const featured = news[0];
  const rest = news.slice(1, 7);

  return (
    <section>
      <SectionHeader title="آخر الأخبار" icon={Newspaper} href="/news" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-1">
          <NewsCard news={featured as any} variant="featured" />
        </div>
        <div className="space-y-4">
          {rest.map((item) => (
            <NewsCard key={item.id} news={item as any} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
