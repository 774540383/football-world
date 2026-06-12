
require('dotenv').config({ path: '/opt/football-world-vps/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get all leagues with teams
  const leagues = await prisma.league.findMany({ include: { teams: true } });
  const teams = await prisma.team.findMany();
  console.log("Leagues:", leagues.length, "Teams:", teams.length);
  
  const matchStatuses = ["SCHEDULED","SCHEDULED","SCHEDULED","LIVE","FINISHED","FINISHED","FINISHED","FINISHED"];
  let matchCount = 0;
  
  for (const league of leagues) {
    const leagueTeams = teams.filter(t => t.leagueId === league.id);
    if (leagueTeams.length < 2) continue;
    
    // Generate matches
    for (let i = 0; i < 14; i++) {
      const homeIdx = i % leagueTeams.length;
      let awayIdx = (i + 1 + Math.floor(i / 2)) % leagueTeams.length;
      if (awayIdx === homeIdx) awayIdx = (awayIdx + 1) % leagueTeams.length;
      
      const homeTeam = leagueTeams[homeIdx];
      const awayTeam = leagueTeams[awayIdx];
      if (!homeTeam || !awayTeam) continue;
      
      const status = matchStatuses[i % matchStatuses.length];
      const now = new Date();
      const daysOffset = status === "FINISHED" ? -(i + 1) : (status === "LIVE" ? 0 : (i + 1));
      const matchDate = new Date(now.getTime() + daysOffset * 86400000);
      matchDate.setHours(19 + (i % 4), 0, 0, 0);
      
      let homeScore = null, awayScore = null;
      if (status === "FINISHED") {
        homeScore = Math.floor(Math.random() * 4);
        awayScore = Math.floor(Math.random() * 3);
      } else if (status === "LIVE") {
        homeScore = Math.floor(Math.random() * 3);
        awayScore = Math.floor(Math.random() * 2);
      }
      
      const apiId = league.apiId * 10000 + i;
      try {
        await prisma.match.upsert({
          where: { apiId },
          update: {
            status, minute: status === "LIVE" ? Math.floor(Math.random() * 80 + 5) : 0,
            homeScore, awayScore, date: matchDate, leagueId: league.id,
          },
          create: {
            apiId, status, minute: status === "LIVE" ? Math.floor(Math.random() * 80 + 5) : 0,
            homeTeamId: homeTeam.id, awayTeamId: awayTeam.id,
            homeScore, awayScore, date: matchDate, leagueId: league.id,
          },
        });
        matchCount++;
      } catch(e) {
        console.log("  Match error:", e.message);
      }
    }
    console.log("Matches for", league.name, "done");
  }
  console.log("Total matches:", matchCount);
  
  // Standings
  let standingCount = 0;
  for (const league of leagues) {
    if (league.apiId === 2) continue; // skip UCL
    const leagueTeams = teams.filter(t => t.leagueId === league.id);
    if (leagueTeams.length < 2) continue;
    
    for (let i = 0; i < leagueTeams.length; i++) {
      const t = leagueTeams[i];
      const played = 20 + Math.floor(Math.random() * 5);
      const won = Math.max(0, played - Math.floor(played * (i * 0.06)));
      const drawn = Math.max(0, Math.floor(played * 0.15 + Math.random() * 3));
      const lost = Math.max(0, played - won - drawn);
      
      try {
        await prisma.standing.upsert({
          where: { leagueId_season_teamId: { leagueId: league.id, season: league.season, teamId: t.id } },
          update: {
            position: i + 1, played, won, drawn, lost,
            goalsFor: won * 2 + drawn + Math.floor(Math.random() * 8),
            goalsAgainst: lost * 2 + drawn + Math.floor(Math.random() * 4),
            points: won * 3 + drawn,
          },
          create: {
            leagueId: league.id, season: league.season, position: i + 1, teamId: t.id,
            played, won, drawn, lost,
            goalsFor: won * 2 + drawn + Math.floor(Math.random() * 8),
            goalsAgainst: lost * 2 + drawn + Math.floor(Math.random() * 4),
            points: won * 3 + drawn,
          },
        });
        standingCount++;
      } catch(e) {}
    }
  }
  console.log("Total standings:", standingCount);
  
  // News articles
  const newsArticles = [
    {title:"Real Madrid defeat Barcelona 3-1 in El Clasico",slug:"real-madrid-win-clasico",content:"Real Madrid secured a dominant victory over Barcelona in the latest El Clasico, with Vinicius Junior scoring twice. The win puts Real Madrid top of La Liga with a 5-point lead over their rivals.",category:"MATCH_REPORT"},
    {title:"Liverpool extend Premier League lead with win over Arsenal",slug:"liverpool-extend-lead",content:"Liverpool put on a masterclass performance at Anfield, defeating Arsenal 3-0 to extend their lead at the top of the Premier League to 8 points. Mohamed Salah was the star with a goal and two assists.",category:"MATCH_REPORT"},
    {title:"Man City complete signing of Brazilian wonderkid",slug:"man-city-new-signing",content:"Manchester City have completed the signing of 19-year-old Brazilian midfielder promising talent for a fee of 75 million euros. The youngster has been labeled as the next big thing in world football.",category:"TRANSFER"},
    {title:"World Cup 2026: Complete guide and schedule",slug:"world-cup-2026-guide",content:"With the 2026 FIFA World Cup approaching, here is everything you need to know about the tournament. The expanded 48-team competition will be hosted across USA, Canada, and Mexico.",category:"WORLD_CUP"},
    {title:"Champions League quarter-final draw announced",slug:"champions-league-draw",content:"The draw for the UEFA Champions League quarter-finals has been made, with some mouth-watering ties including Real Madrid vs Bayern Munich and Manchester City vs PSG.",category:"CHAMPIONS_LEAGUE"},
    {title:"Kylian Mbappe scores hat-trick in Champions League",slug:"mbappe-hattrick-ucl",content:"Kylian Mbappe produced a stunning performance, scoring a hat-trick to lead PSG to a 5-2 victory in the Champions League. The French forward now has 12 goals in the competition this season.",category:"CHAMPIONS_LEAGUE"},
    {title:"Cristiano Ronaldo reaches 900 career goals",slug:"ronaldo-900-goals",content:"Cristiano Ronaldo has reached an unprecedented milestone, scoring his 900th career goal with a trademark finish for Al Nassr. The Portuguese legend continues to defy age and expectations.",category:"HISTORIC"},
    {title:"Barcelona's Lamine Yamal wins Golden Boy award",slug:"yamal-golden-boy",content:"Barcelona teenager Lamine Yamal has been awarded the prestigious Golden Boy award for 2025, recognizing him as the best young player in European football. The 17-year-old has been sensational this season.",category:"AWARD"},
    {title:"Saudi Pro League: Al Hilal crowned champions",slug:"al-hilal-champions",content:"Al Hilal have been crowned Saudi Pro League champions for the record 19th time after a dominant season. Aleksandar Mitrovic finished as top scorer with 28 goals.",category:"LEAGUE"},
    {title:"Harry Kane breaks Bundesliga scoring record",slug:"kane-record",content:"Harry Kane has broken the Bundesliga record for most goals in a single season, scoring his 37th goal of the campaign for Bayern Munich. The England captain has been in sensational form.",category:"RECORD"},
    {title:"Tactical analysis: How Inter Milan beat AC Milan in the Derby",slug:"tactical-derby-milan",content:"In-depth tactical analysis of the Milan derby. Inter's 3-5-2 system overwhelmed AC Milan's midfield, with Lautaro Martinez exploiting the spaces between the lines. Simone Inzaghi's tactical setup was masterful.",category:"TACTICAL"},
    {title:"Mohamed Salah: The evolution of a legend",slug:"salah-analysis",content:"Mohamed Salah continues to redefine what's possible for a winger in modern football. His intelligent movement, clinical finishing, and playmaking ability make him one of the most complete attackers in the world.",category:"PLAYER_ANALYSIS"},
  ];
  
  let newsCount = 0;
  for (const article of newsArticles) {
    await prisma.news.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title, content: article.content,
        excerpt: article.content.substring(0, 120) + "...",
        category: article.category, featured: newsCount < 4, published: true,
        views: Math.floor(Math.random() * 5000) + 100,
      },
      create: {
        title: article.title, slug: article.slug, content: article.content,
        excerpt: article.content.substring(0, 120) + "...",
        category: article.category, featured: newsCount < 4, published: true,
        views: Math.floor(Math.random() * 5000) + 100,
      },
    });
    newsCount++;
  }
  console.log("News:", newsCount);
  
  // Final counts
  console.log("\n=== FINAL COUNTS ===");
  console.log("Users:", await prisma.user.count());
  console.log("Leagues:", await prisma.league.count());
  console.log("Teams:", await prisma.team.count());
  console.log("Players:", await prisma.player.count());
  console.log("Matches:", await prisma.match.count());
  console.log("Standings:", await prisma.standing.count());
  console.log("News:", await prisma.news.count());
  console.log("Comments:", await prisma.comment.count());
}

main().catch(e => console.error("FATAL:", e))
  .finally(() => prisma.$disconnect());
