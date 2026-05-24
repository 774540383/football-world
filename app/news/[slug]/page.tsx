import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getNewsBySlug } from "@/lib/data";
import { formatDate, getImageUrl } from "@/lib/utils";
import { Calendar, Eye, User } from "lucide-react";

interface NewsSlugPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function NewsSlugPage({ params }: NewsSlugPageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) notFound();

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge>{news.category}</Badge>
          {news.team && (
            <Badge variant="outline">{news.team.nameAr || news.team.name}</Badge>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-black leading-tight">{news.title}</h1>
        {news.excerpt && (
          <p className="text-lg text-muted-foreground">{news.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(news.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {news.views} مشاهدة
          </span>
          {news.author && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {news.author.name}
            </span>
          )}
        </div>
      </div>

      {news.image && (
        <div className="relative h-[400px] rounded-3xl overflow-hidden">
          <img
            src={getImageUrl(news.image)}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
    </article>
  );
}
