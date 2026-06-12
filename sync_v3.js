
require('dotenv').config({ path: '/opt/football-world-vps/.env' });

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE = "https://v3.football.api-sports.io";
const headers = { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" };
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log("API KEY loaded:", API_KEY ? API_KEY.substring(0, 10) + "..." : "MISSING");

async function fetchApi(endpoint, params = {}) {
  const url = new URL(BASE + endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(endpoint + ": " + res.status);
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    console.log("API WARN:", JSON.stringify(data.errors));
  }
  return data.response || [];
}

const teamCache = {};

async function getTeamId(apiId, name, logo, country) {
  if (teamCache[apiId]) return teamCache[apiId];
  const t = await prisma.team.upsert({
    where: { apiId },
    update: { name, logo, country },
    create: { apiId, name, logo, country },
  });
  teamCache[apiId] = t.id;
  return t.id;
}

async function syncLeagues() {
  console.log("Fetching all current leagues...");
  const all = await fetchApi("/leagues", { current: "true" });
  console.log("Total leagues:", all.length);
  
  // Major league IDs
  const majorIds = [39, 140, 135, 78, 61, 2, 3, 325];
  const target = all.filter(l => majorIds.includes(l.league.id));
  console.log("Target major leagues:", target.length);
  
  for (const item of target) {
    const l = item.league;
    const s = (item.seasons || []).find(x => x.current) || (item.seasons || [])[0];
    const season = s ? s.year : 2024;
    const lid = l.id;
    
    console.log("\n======== " + l.name + " (ID:" + lid + ", Season:" + season + ") ========");
    
    // Upsert league
    await prisma.league.upsert({
      where: { apiId: lid },
      update: { name: l.name, logo: l.logo, country: item.country?.name, season },
      create: { apiId: lid, name: l.name, logo: l.logo, country: item.country?.name, season },
    });
    
    // Teams
    console.log("Fetching teams...");
    const teams = await fetchApi("/teams", { league: lid, season });
    for (const t of teams) {
      await getTeamId(t.team.id, t.team.name, t.team.logo, t.team.country);
    }
    console.log("Teams:", teams.length);
    
    // Fixtures (next 30 days)
    console.log("Fetching fixtures...");
    const now = new Date();
    const from = new Date(now - 7*86400000).toISOString().split("T")[0];
    const to = new Date(now + 30*86400000).toISOString().split("T")[0];
    const fixtures = await fetchApi("/fixtures", { league: lid, season, from, to });
    
    let matchCount = 0;
    for (const f of fixtures) {
      const fix = f.fixture;
      const homeId = await getTeamId(f.teams.home.id, f.teams.home.name, f.teams.home.logo, "");
      const awayId = await getTeamId(f.teams.away.id, f.teams.away.name, f.teams.away.logo, "");
      
      let status = "SCHEDULED";
      const sht = (fix.status || {}).short || "";
      if (["LIVE","1H","2H","HT","ET","P"].includes(sht)) status = "LIVE";
      else if (["FT","AET","PEN"].includes(sht)) status = "FINISHED";
      else if (sht === "CANC") status = "CANCELLED";
      else if (sht === "PST") status = "POSTPONED";
      
      const score = f.score || {};
      const homeSc = score.fulltime?.home ?? score.halftime?.home ?? null;
      const awaySc = score.fulltime?.away ?? score.halftime?.away ?? null;
      
      await prisma.match.upsert({
        where: { apiId: fix.id },
        update: {
          status, minute: fix.status?.elapsed || 0,
          homeScore: homeSc, awayScore: awaySc,
          date: new Date(fix.date), venue: fix.venue?.name,
          referee: fix.referee, round: f.league?.round || null,
          leagueId: String(lid),
        },
        create: {
          apiId: fix.id, status, minute: fix.status?.elapsed || 0,
          homeTeamId: homeId, awayTeamId: awayId,
          homeScore: homeSc, awayScore: awaySc,
          date: new Date(fix.date), venue: fix.venue?.name,
          referee: fix.referee, round: f.league?.round || null,
          leagueId: String(lid),
        },
      });
      matchCount++;
    }
    console.log("Fixtures:", matchCount);
    
    // Standings
    console.log("Fetching standings...");
    const standingsData = await fetchApi("/standings", { league: lid, season });
    let standingCount = 0;
    for (const item of standingsData) {
      const groups = item.league?.standings || [];
      for (const group of groups) {
        for (const entry of group) {
          const teamId = await getTeamId(entry.team.id, entry.team.name, entry.team.logo, "");
          await prisma.standing.upsert({
            where: { leagueId_season_teamId: { leagueId: String(lid), season, teamId } },
            update: {
              position: entry.rank, played: entry.all?.played || 0,
              won: entry.all?.win || 0, drawn: entry.all?.draw || 0,
              lost: entry.all?.lose || 0,
              goalsFor: entry.all?.goals?.for || 0,
              goalsAgainst: entry.all?.goals?.against || 0,
              points: entry.points, form: entry.form || null,
            },
            create: {
              leagueId: String(lid), season, position: entry.rank, teamId,
              played: entry.all?.played || 0, won: entry.all?.win || 0,
              drawn: entry.all?.draw || 0, lost: entry.all?.lose || 0,
              goalsFor: entry.all?.goals?.for || 0,
              goalsAgainst: entry.all?.goals?.against || 0,
              points: entry.points, form: entry.form || null,
            },
          });
          standingCount++;
        }
      }
    }
    console.log("Standings:", standingCount);
    
    // Top scorers
    console.log("Fetching top scorers...");
    try {
      const scorers = await fetchApi("/players/topscorers", { league: lid, season });
      for (const item of scorers) {
        const p = item.player;
        const stats = item.statistics?.[0];
        if (!stats) continue;
        await prisma.player.upsert({
          where: { apiId: p.id },
          update: {
            name: p.name, firstName: p.firstname, lastName: p.lastname,
            photo: p.photo, position: stats.games?.position || "",
            nationality: p.nationality,
            goals: stats.goals?.total || 0, assists: stats.goals?.assists || 0,
            appearances: stats.games?.appearences || 0,
            rating: parseFloat(stats.games?.rating || "0"),
          },
          create: {
            apiId: p.id, name: p.name, firstName: p.firstname, lastName: p.lastname,
            photo: p.photo, position: stats.games?.position || "",
            nationality: p.nationality,
            goals: stats.goals?.total || 0, assists: stats.goals?.assists || 0,
            appearances: stats.games?.appearences || 0,
            rating: parseFloat(stats.games?.rating || "0"),
          },
        });
      }
      console.log("Top scorers:", scorers.length);
    } catch(e) {
      console.log("Top scorers skip:", e.message);
    }
    
    // Squads
    console.log("Fetching squads...");
    let playerCount = 0;
    for (const t of teams) {
      try {
        const squad = await fetchApi("/players/squads", { team: t.team.id });
        for (const item of squad) {
          const p = item.player || item;
          const teamPrismaId = teamCache[t.team.id];
          await prisma.player.upsert({
            where: { apiId: p.id },
            update: {
              name: p.name, photo: p.photo, position: p.position,
              number: p.number, age: p.age, nationality: p.nationality,
              teamId: teamPrismaId || undefined,
            },
            create: {
              apiId: p.id, name: p.name, photo: p.photo, position: p.position,
              number: p.number, age: p.age, nationality: p.nationality,
              teamId: teamPrismaId || undefined,
            },
          });
          playerCount++;
        }
        await new Promise(r => setTimeout(r, 100));
      } catch(e) {
        // skip squad errors for individual teams
      }
    }
    console.log("Players:", playerCount);
  }
  
  console.log("\n======== SYNC COMPLETE ========");
}

syncLeagues()
  .catch(e => console.error("FATAL:", e.message))
  .finally(() => prisma.$disconnect());
