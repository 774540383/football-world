
const fs = require("fs");
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '/opt/football-world-vps/.env' });
const prisma = new PrismaClient();

// ====== HELPER: fetch with timeout ======
async function fetchUrl(url, opts = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout || 10000);
  try {
    const res = await fetch(url, {
      ...opts,
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", ...(opts.headers || {}) },
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

// ====== ESPN Scraper ======
async function scrapeESPNStandings() {
  console.log("[ESPN] Fetching standings...");
  const leagueIds = { 39: "eng.1", 140: "esp.1", 135: "ita.1", 78: "ger.1", 61: "fra.1" };
  
  for (const [apiId, espnId] of Object.entries(leagueIds)) {
    try {
      const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${espnId}/standings`;
      const res = await fetchUrl(url, { timeout: 8000 });
      const data = await res.json();
      const entries = data?.children?.[0]?.standings?.entries || [];
      
      if (entries.length === 0) continue;
      
      const league = await prisma.league.findFirst({ where: { apiId: parseInt(apiId) } });
      if (!league) continue;
      
      for (const entry of entries) {
        const teamData = entry.team;
        const stats = {};
        (entry.stats || []).forEach(s => { stats[s.name] = s.value; });
        const pos = entry.stats?.find(s => s.name === "rank")?.value || 0;
        const played = entry.stats?.find(s => s.name === "gamesPlayed")?.value || 0;
        const won = entry.stats?.find(s => s.name === "wins")?.value || 0;
        const drawn = entry.stats?.find(s => s.name === "ties")?.value || 0;
        const lost = entry.stats?.find(s => s.name === "losses")?.value || 0;
        const gf = entry.stats?.find(s => s.name === "pointsFor")?.value || 0;
        const ga = entry.stats?.find(s => s.name === "pointsAgainst")?.value || 0;
        const pts = entry.stats?.find(s => s.name === "points")?.value || 0;
        
        // Upsert team
        const team = await prisma.team.upsert({
          where: { apiId: teamData.id },
          update: { name: teamData.displayName, logo: teamData.logos?.[0]?.href || null },
          create: { apiId: teamData.id, name: teamData.displayName, logo: teamData.logos?.[0]?.href || null, leagueId: league.id },
        });
        
        await prisma.standing.upsert({
          where: { leagueId_season_teamId: { leagueId: league.id, season: league.season, teamId: team.id } },
          update: { position: pos, played, won, drawn, lost, goalsFor: gf, goalsAgainst: ga, points: pts },
          create: { leagueId: league.id, season: league.season, position: pos, teamId: team.id, played, won, drawn, lost, goalsFor: gf, goalsAgainst: ga, points: pts },
        });
      }
      console.log(`  [ESPN] ${league.name}: ${entries.length} teams`);
    } catch(e) {
      console.log(`  [ESPN] ${apiId}: ${e.message}`);
    }
  }
}

// ====== Scrape upcoming matches from ESPN ======
async function scrapeESPNMatches() {
  console.log("\n[ESPN] Fetching matches...");
  const leagueIds = { 39: "eng.1", 140: "esp.1", 135: "ita.1", 78: "ger.1", 61: "fra.1" };
  
  for (const [apiId, espnId] of Object.entries(leagueIds)) {
    try {
      const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${espnId}/scoreboard`;
      const res = await fetchUrl(url, { timeout: 8000 });
      const data = await res.json();
      const events = data?.events || [];
      
      if (events.length === 0) continue;
      
      const league = await prisma.league.findFirst({ where: { apiId: parseInt(apiId) } });
      if (!league) continue;
      
      let matchCount = 0;
      for (const event of events) {
        const competition = event.competitions?.[0];
        if (!competition) continue;
        
        const homeTeam = competition.competitors?.find(c => c.homeAway === "home");
        const awayTeam = competition.competitors?.find(c => c.homeAway === "away");
        if (!homeTeam || !awayTeam) continue;
        
        const home = await prisma.team.upsert({
          where: { apiId: homeTeam.id },
          update: { name: homeTeam.team.displayName, logo: homeTeam.team.logos?.[0]?.href || null, leagueId: league.id },
          create: { apiId: homeTeam.id, name: homeTeam.team.displayName, logo: homeTeam.team.logos?.[0]?.href || null, leagueId: league.id },
        });
        const away = await prisma.team.upsert({
          where: { apiId: awayTeam.id },
          update: { name: awayTeam.team.displayName, logo: awayTeam.team.logos?.[0]?.href || null, leagueId: league.id },
          create: { apiId: awayTeam.id, name: awayTeam.team.displayName, logo: awayTeam.team.logos?.[0]?.href || null, leagueId: league.id },
        });
        
        // Determine status
        const statusType = competition.status?.type?.name || "STATUS_SCHEDULED";
        let status = "SCHEDULED";
        if (["STATUS_IN_PROGRESS", "STATUS_HALFTIME"].includes(statusType)) status = "LIVE";
        else if (["STATUS_FINAL", "STATUS_FULL_TIME"].includes(statusType)) status = "FINISHED";
        
        const homeScore = competition.status?.type?.completed ? (homeTeam.score || null) : null;
        const awayScore = competition.status?.type?.completed ? (awayTeam.score || null) : null;
        const date = new Date(event.date || competition.date);
        
        // Check if match exists
        const existing = await prisma.match.findFirst({ where: { homeTeamId: home.id, awayTeamId: away.id, date: { gte: new Date(date.getTime() - 3600000), lte: new Date(date.getTime() + 3600000) } } });
        
        if (existing) {
          await prisma.match.update({
            where: { id: existing.id },
            data: { status, homeScore, awayScore, minute: competition.status?.period || 0 },
          });
        } else {
          await prisma.match.create({
            data: {
              apiId: event.id,
              status, homeTeamId: home.id, awayTeamId: away.id,
              homeScore, awayScore, date, leagueId: league.id,
              minute: competition.status?.period || 0,
            },
          });
        }
        matchCount++;
      }
      console.log(`  [ESPN] ${league.name}: ${matchCount} matches`);
    } catch(e) {
      console.log(`  [ESPN] ${apiId}: ${e.message}`);
    }
  }
}

// ====== Scrape RSS feeds for news ======
async function scrapeNews() {
  console.log("\n[RSS] Fetching football news...");
  const feeds = [
    "https://www.espn.com/espn/rss/soccer/news",
    "https://rss.nytimes.com/services/xml/rss/nyt/Soccer.xml",
  ];
  
  for (const feedUrl of feeds) {
    try {
      const res = await fetchUrl(feedUrl, { timeout: 8000 });
      const xml = await res.text();
      
      // Simple RSS parsing
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
      for (const item of items.slice(0, 5)) {
        const title = (item.match(/<title>([^<]*)<\/title>/) || [,""])[1];
        const link = (item.match(/<link>([^<]*)<\/link>/) || [,""])[1];
        const desc = (item.match(/<description>([^<]*)<\/description>/) || [,""])[1];
        const pubDate = (item.match(/<pubDate>([^<]*)<\/pubDate>/) || [,""])[1];
        
        if (!title) continue;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").slice(0, 80);
        
        // Determine category
        let category = "OTHER";
        if (/champions league|ucl|uefa/i.test(title)) category = "CHAMPIONS_LEAGUE";
        else if (/world cup|wc2026|wc 2026|fifa/i.test(title)) category = "WORLD_CUP";
        else if (/transfer|signing|signed|contract/i.test(title)) category = "TRANSFER";
        else if (/premier league|epl|england/i.test(title)) category = "LEAGUE";
        
        const cleanDesc = desc ? desc.replace(/<[^>]*>/g, "").slice(0, 500) : title;
        
        await prisma.news.upsert({
          where: { slug },
          update: { title: title.slice(0, 200), content: cleanDesc, source: feedUrl, sourceUrl: link, category },
          create: { title: title.slice(0, 200), slug, content: cleanDesc, excerpt: cleanDesc.slice(0, 120), source: feedUrl, sourceUrl: link, category, published: true },
        });
      }
      console.log(`  [RSS] ${feedUrl}: ok`);
    } catch(e) {
      console.log(`  [RSS] ${e.message}`);
    }
  }
}

// ====== Scrape FIFA World Cup 2026 data ======
async function scrapeWorldCupData() {
  console.log("\n[FIFA] Fetching World Cup data...");
  try {
    // Read the pre-made 2026 groups data
    const groupsData = JSON.parse(fs.readFileSync("/opt/football-world-vps/worldcup-2026-data.json", "utf8"));
    const wcInfo = { year: 2026, host: "USA, Canada, Mexico", startDate: "2026-06-11", endDate: "2026-07-19", teams: 48, matches: 104 };
    
    // We store WC data in a special news article
    // The components will read from the JSON file directly
    
    console.log(`  [FIFA] ${groupsData.length} groups loaded for ${wcInfo.year}`);
    return { groups: groupsData, info: wcInfo };
  } catch(e) {
    console.log(`  [FIFA] ${e.message}`);
    return null;
  }
}

// ====== Main ======
async function main() {
  console.log("=== FOOTBALL DATA SCRAPER ===\n");
  
  await scrapeESPNStandings();
  await scrapeESPNMatches();
  await scrapeNews();
  const wcData = await scrapeWorldCupData();
  
  // Final counts
  console.log("\n=== FINAL COUNTS ===");
  console.log("Leagues:", await prisma.league.count());
  console.log("Teams:", await prisma.team.count());
  console.log("Players:", await prisma.player.count());
  console.log("Matches:", await prisma.match.count());
  console.log("Standings:", await prisma.standing.count());
  console.log("News:", await prisma.news.count());
  
  if (wcData) {
    console.log("World Cup groups:", wcData.groups.length);
  }
}

main()
  .catch(e => console.error("FATAL:", e.message))
  .finally(() => prisma.$disconnect());
