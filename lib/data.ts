import { prisma } from "./prisma";
import { cache } from "react";

export const getLeagues = cache(async () => {
  return prisma.league.findMany({
    orderBy: { name: "asc" },
  });
});

export const getMatches = cache(async (opts?: {
  status?: string;
  leagueId?: string;
  teamId?: string;
  limit?: number;
  date?: string;
}) => {
  const where: any = {};
  if (opts?.status) where.status = opts.status;
  if (opts?.leagueId) where.leagueId = opts.leagueId;
  if (opts?.teamId) where.homeTeamId = opts.teamId;
  if (opts?.date) {
    const start = new Date(opts.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }

  const matches = await prisma.match.findMany({
    where,
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
      events: { orderBy: { minute: "asc" } },
    },
    orderBy: { date: "asc" },
    take: opts?.limit || 50,
  });

  const matchIds = matches.map((m) => m.id);
  const stats = await prisma.matchStat.findMany({
    where: { matchId: { in: matchIds } },
  });

  return matches.map((match) => ({
    ...match,
    homeStats: stats.find((s) => s.matchId === match.id && s.teamSide === "home") || null,
    awayStats: stats.find((s) => s.matchId === match.id && s.teamSide === "away") || null,
  }));
});

export const getLiveMatches = cache(async () => {
  const matches = await prisma.match.findMany({
    where: { status: "LIVE" },
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
    },
    orderBy: { date: "asc" },
  });

  const matchIds = matches.map((m) => m.id);
  const stats = await prisma.matchStat.findMany({
    where: { matchId: { in: matchIds } },
  });

  return matches.map((match) => ({
    ...match,
    homeStats: stats.find((s) => s.matchId === match.id && s.teamSide === "home") || null,
    awayStats: stats.find((s) => s.matchId === match.id && s.teamSide === "away") || null,
  }));
});

export const getMatchById = cache(async (id: string) => {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
      events: { orderBy: { minute: "asc" } },
    },
  });

  if (!match) return null;

  const stats = await prisma.matchStat.findMany({
    where: { matchId: match.id },
  });

  return {
    ...match,
    homeStats: stats.find((s) => s.teamSide === "home") || null,
    awayStats: stats.find((s) => s.teamSide === "away") || null,
  };
});

export const getTeamById = cache(async (id: string) => {
  return prisma.team.findUnique({
    where: { id },
    include: {
      players: true,
      league: true,
      homeMatches: {
        include: { awayTeam: true, league: true },
        orderBy: { date: "desc" },
        take: 10,
      },
      awayMatches: {
        include: { homeTeam: true, league: true },
        orderBy: { date: "desc" },
        take: 10,
      },
    },
  });
});

export const getPlayerById = cache(async (id: string) => {
  return prisma.player.findUnique({
    where: { id },
    include: {
      team: true,
      stats: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
});

export const getStandings = cache(async (leagueId: string, season?: number) => {
  return prisma.standing.findMany({
    where: {
      leagueId,
      season: season || new Date().getFullYear(),
    },
    include: { team: true },
    orderBy: { position: "asc" },
  });
});

export const getNewsFeed = cache(async (opts?: {
  category?: string;
  limit?: number;
  featured?: boolean;
}) => {
  const where: any = { published: true };
  if (opts?.category) where.category = opts.category;
  if (opts?.featured) where.featured = true;

  return prisma.news.findMany({
    where,
    include: {
      author: { select: { name: true, image: true } },
      team: { select: { name: true, nameAr: true, logo: true } },
    },
    orderBy: { createdAt: "desc" },
    take: opts?.limit || 20,
  });
});

export const getNewsBySlug = cache(async (slug: string) => {
  return prisma.news.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      team: { select: { name: true, nameAr: true, logo: true } },
      comments: {
        include: {
          user: { select: { name: true, image: true } },
          replies: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

export const getTopScorers = cache(async (leagueId: string, limit = 10) => {
  return prisma.player.findMany({
    where: {
      team: { leagueId },
      goals: { gt: 0 },
    },
    include: { team: { select: { name: true, logo: true } } },
    orderBy: { goals: "desc" },
    take: limit,
  });
});

export const getTopAssists = cache(async (leagueId: string, limit = 10) => {
  return prisma.player.findMany({
    where: {
      team: { leagueId },
      assists: { gt: 0 },
    },
    include: { team: { select: { name: true, logo: true } } },
    orderBy: { assists: "desc" },
    take: limit,
  });
});
