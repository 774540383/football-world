import { NewsCard } from "@/components/news/news-card";
import { SectionHeader } from "@/components/shared/section-header";
import { prisma } from "@/lib/prisma";
import { Newspaper } from "lucide-react";

interface RelatedNewsProps {
  matchId: string;
}

export async function RelatedNews({ matchId }: RelatedNewsProps) {
  const news = await prisma.news.findMany({
    where: { matchId, published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (news.length === 0) return null;

  return (
    <section>
      <SectionHeader title="أخبار المباراة" icon={Newspaper} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((item) => (
          <NewsCard key={item.id} news={item as any} variant="compact" />
        ))}
      </div>
    </section>
  );
}
