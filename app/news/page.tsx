import { NewsCard } from "@/components/news/news-card";
import { SectionHeader } from "@/components/shared/section-header";
import { getNewsFeed } from "@/lib/data";
import { Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNewsFeed({ limit: 30 });

  return (
    <div className="space-y-8">
      <SectionHeader title="آخر الأخبار" icon={Newspaper} />

      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد أخبار متاحة حالياً
        </div>
      )}
    </div>
  );
}
