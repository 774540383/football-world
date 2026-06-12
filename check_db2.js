
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const c = {
    users: await p.user.count(),
    leagues: await p.league.count(),
    teams: await p.team.count(),
    players: await p.player.count(),
    matches: await p.match.count(),
    standings: await p.standing.count(),
    news: await p.news.count(),
  };
  console.log(JSON.stringify(c));
  
  const recentMatches = await p.match.findMany({ take: 3, orderBy: { date: 'desc' }, include: { homeTeam: true, awayTeam: true } });
  console.log("Recent matches:");
  for (const m of recentMatches) {
    console.log("  " + m.homeTeam.name + " vs " + m.awayTeam.name + " (" + m.status + ") " + m.date.toISOString().split('T')[0]);
  }
  
  const topScorers = await p.player.findMany({ where: { goals: { gt: 0 } }, orderBy: { goals: 'desc' }, take: 5 });
  console.log("Top scorers:");
  for (const pl of topScorers) {
    console.log("  " + pl.name + " - " + pl.goals + " goals");
  }
  
  await p.$disconnect();
}
main().catch(e => { console.error("ERR:", e.message); });
