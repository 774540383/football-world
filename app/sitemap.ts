import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1.0 },
    { url: `${BASE_URL}/live`, lastModified: new Date(), changeFrequency: "always" as const, priority: 0.9 },
    { url: `${BASE_URL}/matches`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${BASE_URL}/standings`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${BASE_URL}/world-cup`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
  ];

  const news = await prisma.news.findMany({
    select: { slug: true, updatedAt: true },
    where: { published: true },
    take: 100,
  });

  const newsPages = news.map((n) => ({
    url: `${BASE_URL}/news/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const teams = await prisma.team.findMany({
    select: { id: true, updatedAt: true },
    take: 100,
  });

  const teamPages = teams.map((t) => ({
    url: `${BASE_URL}/team/${t.id}`,
    lastModified: t.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  const matches = await prisma.match.findMany({
    select: { id: true, updatedAt: true },
    take: 200,
  });

  const matchPages = matches.map((m) => ({
    url: `${BASE_URL}/match/${m.id}`,
    lastModified: m.updatedAt,
    changeFrequency: "always" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...newsPages, ...teamPages, ...matchPages];
}
