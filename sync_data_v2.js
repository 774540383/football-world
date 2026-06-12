
const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE = "https://v3.football.api-sports.io";
const headers = { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" };
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchApi(endpoint, params = {}) {
  const url = new URL(BASE + endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(endpoint + ": " + res.status);
  const data = await res.json();
  return data.response || [];
}

// Cache for team apiId -> Prisma id mapping
const teamIdCache = {};

async function ensureTeam(apiId, name, logo, country) {
  if (teamIdCache[apiId]) return teamIdCache[apiId];
  const team = await prisma.team.upsert({
    where: { apiId },
    update: { name, logo, country },
    create: { apiId, name, logo, country },
  });
  teamIdCache[apiId] = team.id;
  return team.id;
}

async function ensureLeague(apiId, name, logo, country, season) {
  const league = await prisma.league.upsert({
    where: { apiId },
    update: { name, logo, country, season, type: "league" },
    create: { apiId, name, logo, country, season, type: "league" },
  });
  return league.id;
}

async function syncMajorLeagues() {
  console.log("Fetching leagues...");
  const all = await fetchApi("/leagues", { current: "true" });
  const majorIds = [39, 140, 135, 78, 61, 2, 3, 325];
  const target = all.filter(l => majorIds.includes(l.league.id));
  
  for (const item of target) {
    const l = item.league;
    const s = (item.seasons || []).find(s => s.current) || (item.seasons || [])[0];
    const season = s ? s.year : 2024;
    const leagueId = l.id;
    
    console.log("\n=== " + l.name + " (" + season + ") ===");
    
    // Upsert league
    await ensureLeague(leagueId, l.name, l.logo, item.country?.name, season);
    
    // Fetch teams
    console.log("  Teams...");
    const teams = await fetchApi("/teams", { league: leagueId, season });
    for (const t of teams) {
      await ensureTeam(t.team.id, t.team.name, t.team.logo, t.team.country);
    }
    console.log("  " + teams.length + " teams saved");
    
    // Fetch fixtures (last 7 days + next 30 days)
    console.log("  Fixtures...");
    const now = new Date();
    const from = new Date(now - 7*86400000).toISOString().split("T")[0];
    const to = new Date(now + 30*86400000).toISOString().split("T")[0];
    const fixtures = await fetchApi("/fixtures", { league: leagueId, season, from, to });
    
    for (const f of fixtures) {
      const fix = f.fixture;
      const homeApiId = f.teams.home.id;
      const awayApiId = f.teams.away.id;
      const homeId = await ensureTeam(homeApiId, f.teams.home.name, f.teams.home.logo, "");
      const awayId = await ensureTeam(awayApiId, f.teams.away.name, f.teams.away.logo, "");
      
      const score = f.score || {};
      let status = "SCHEDULED";
      const sht = (fix.status || {}).short || "";
      if (["LIVE","1H","2H","HT","ET","P"].includes(sht)) status = "LIVE";
      else if (["FT","AET","PEN"].includes(sht)) status = "FINISHED";
      else if (sht === "CANC") status = "CANCELLED";
      else if (sht === "PST") status = "POSTPONED";
      
      await prisma.match.upsert({
        where: { apiId: fix.id },
        update: {
          status,
          minute: fix.status?.elapsed || 0,
          homeScore: score.fulltime?.home ?? score.halftime?.home ?? null,
          awayScore: score.fulltime?.away ?? score.halftime?.away ?? null,
          date: new Date(fix.date),
          venue: fix.venue?.name,
          referee: fix.referee,
          round: f.league?.round || null,
          leagueId: String(leagueId),
        },
        create: {
          apiId: fix.id,
          status,
          minute: fix.status?.elapsed || 0,
          homeTeamId: homeId,
          awayTeamId: awayId,
          homeScore: score.fulltime?.home ?? score.halftime?.home ?? null,
          awayScore: score.fulltime?.away ?? score.halftime?.away ?? null,
          date: new Date(fix.date),
          venue: fix.venue?.name,
          referee: fix.referee,
          round: f.league?.round || null,
          leagueId: String(leagueId),
        },
      });
    }
    console.log("  " + fixtures.length + " fixtures saved");
    
    // Standings
    console.log("  Standings...");
    const standings = await fetchApi("/standings", { league: leagueId, season });
    for (const item of standings) {
      const groups = item.league?.standings || [];
      for (const group of groups) {
        for (const entry of group) {
          const teamApiId = entry.team.id;
          const teamId = await ensureTeam(teamApiId, entry.team.name, entry.team.logo, "");
          await prisma.standing.upsert({
            where: {
              leagueId_season_teamId: {
                leagueId: String(leagueId),
                season,
                teamId,
              },
            },
            update: {
              position: entry.rank,
              played: entry.all?.played || 0,
              won: entry.all?.win || 0,
              drawn: entry.all?.draw || 0,
              lost: entry.all?.lose || 0,
              goalsFor: entry.all?.goals?.for || 0,
              goalsAgainst: entry.all?.goals?.against || 0,
              points: entry.points,
              form: entry.form || null,
            },
            create: {
              leagueId: String(leagueId),
              season,
              position: entry.rank,
              teamId,
              played: entry.all?.played || 0,
              won: entry.all?.win || 0,
              drawn: entry.all?.draw || 0,
              lost: entry.all?.lose || 0,
              goalsFor: entry.all?.goals?.for || 0,
              goalsAgainst: entry.all?.goals?.against || 0,
              points: entry.points,
              form: entry.form || null,
            },
          });
        }
      }
    }
    console.log("  Standings saved");
    
    // Top scorers
    console.log("  Top scorers...");
    try {
      const scorers = await fetchApi("/players/topscorers", { league: leagueId, season });
      for (const item of scorers) {
        const p = item.player;
        const stats = item.statistics?.[0];
        if (!stats) continue;
        await prisma.player.upsert({
          where: { apiId: p.id },
          update: {
            name: p.name,
            firstName: p.firstname,
            lastName: p.lastname,
            photo: p.photo,
            position: stats.games?.position || "",
            nationality: p.nationality,
            goals: stats.goals?.total || 0,
            assists: stats.goals?.assists || 0,
            appearances: stats.games?.appearences || 0,
            rating: parseFloat(stats.games?.rating || "0"),
            teamId: teamIdCache[stats.team?.id] || null,
          },
          create: {
            apiId: p.id,
            name: p.name,
            firstName: p.firstname,
            lastName: p.lastname,
            photo: p.photo,
            position: stats.games?.position || "",
            nationality: p.nationality,
            goals: stats.goals?.total || 0,
            assists: stats.goals?.assists || 0,
            appearances: stats.games?.appearences || 0,
            rating: parseFloat(stats.games?.rating || "0"),
            teamId: teamIdCache[stats.team?.id] || null,
          },
        });
      }
      console.log("  " + scorers.length + " top scorers saved");
    } catch(e) {
      console.log("  Top scorers skipped: " + e.message);
    }
    
    // Squad players
    console.log("  Squads...");
    for (const t of teams) {
      try {
        const squad = await fetchApi("/players/squads", { team: t.team.id });
        for (const item of squad) {
          const p = item.player || item;
          await prisma.player.upsert({
            where: { apiId: p.id },
            update: {
              name: p.name,
              photo: p.photo,
              position: p.position,
              number: p.number,
              age: p.age,
              nationality: p.nationality,
              teamId: teamIdCache[t.team.id] || null,
            },
            create: {
              apiId: p.id,
              name: p.name,
              photo: p.photo,
              position: p.position,
              number: p.number,
              age: p.age,
              nationality: p.nationality,
              teamId: teamIdCache[t.team.id] || null,
            },
          });
        }
        await new Promise(r => setTimeout(r, 150));
      } catch(e) {
        // skip squad errors
      }
    }
    console.log("  Squads done");
  }
}

syncMajorLeagues()
  .then(() => console.log("\n=== SYNC COMPLETE ==="))
  .catch(e => console.error("\nFATAL:", e.message))
  .finally(() => prisma.$disconnect());
