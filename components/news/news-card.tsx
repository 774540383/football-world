"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, getImageUrl, truncate } from "@/lib/utils";
import type { NewsType } from "@/types";
import { Clock, Eye } from "lucide-react";

interface NewsCardProps {
  news: NewsType;
  variant?: "default" | "featured" | "compact";
}

const categoryLabels: Record<string, string> = {
  TRANSFERS: "انتقالات",
  MATCH_REPORT: "تقارير",
  INJURY: "إصابات",
  RUMOR: "شائعات",
  INTERVIEW: "مقابلات",
  ANALYSIS: "تحليل",
  OFFICIAL: "رسمي",
  OTHER: "أخبار",
};

export function NewsCard({ news, variant = "default" }: NewsCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/news/${news.slug}`}>
        <motion.div
          whileHover={{ y: -3 }}
          className="relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] group"
        >
          <div className="absolute inset-0">
            <img
              src={getImageUrl(news.image, "/images/placeholder.svg")}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge variant="default" className="mb-3">
              {categoryLabels[news.category] || news.category}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
              {news.title}
            </h2>
            {news.excerpt && (
              <p className="text-white/70 text-sm md:text-base line-clamp-2 mb-3">
                {news.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 text-white/60 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(news.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {news.views}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/news/${news.slug}`}>
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all">
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {news.image && (
              <img src={getImageUrl(news.image)} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium line-clamp-2 leading-snug">{news.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {categoryLabels[news.category] || news.category}
              </Badge>
              <span className="text-[10px] text-muted-foreground">{formatDate(news.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.slug}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className="glass-card overflow-hidden group"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(news.image, "/images/placeholder.svg")}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[news.category] || news.category}
            </Badge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2 leading-snug">{news.title}</h3>
          {news.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(news.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {news.views}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
