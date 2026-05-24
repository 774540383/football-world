export const FALLBACK_LEAGUES = [
  { id: "l1", apiId: 39, name: "Premier League", nameAr: "الدوري الإنجليزي", type: "league", logo: "https://media.api-sports.io/football/leagues/39.png", country: "England", season: 2025 },
  { id: "l2", apiId: 140, name: "La Liga", nameAr: "الدوري الإسباني", type: "league", logo: "https://media.api-sports.io/football/leagues/140.png", country: "Spain", season: 2025 },
  { id: "l3", apiId: 135, name: "Serie A", nameAr: "الدوري الإيطالي", type: "league", logo: "https://media.api-sports.io/football/leagues/135.png", country: "Italy", season: 2025 },
  { id: "l4", apiId: 78, name: "Bundesliga", nameAr: "الدوري الألماني", type: "league", logo: "https://media.api-sports.io/football/leagues/78.png", country: "Germany", season: 2025 },
  { id: "l5", apiId: 61, name: "Ligue 1", nameAr: "الدوري الفرنسي", type: "league", logo: "https://media.api-sports.io/football/leagues/61.png", country: "France", season: 2025 },
  { id: "l6", apiId: 2, name: "UEFA Champions League", nameAr: "دوري أبطال أوروبا", type: "league", logo: "https://media.api-sports.io/football/leagues/2.png", country: "Europe", season: 2025 },
  { id: "l7", apiId: 325, name: "Saudi Pro League", nameAr: "الدوري السعودي", type: "league", logo: "https://media.api-sports.io/football/leagues/325.png", country: "Saudi Arabia", season: 2025 },
];

export const FALLBACK_TEAMS = [
  { id: "t1", apiId: 50, name: "Manchester City", nameAr: "مانشستر سيتي", logo: "https://media.api-sports.io/football/teams/50.png", country: "England", leagueId: "l1" },
  { id: "t2", apiId: 33, name: "Manchester United", nameAr: "مانشستر يونايتد", logo: "https://media.api-sports.io/football/teams/33.png", country: "England", leagueId: "l1" },
  { id: "t3", apiId: 40, name: "Liverpool", nameAr: "ليفربول", logo: "https://media.api-sports.io/football/teams/40.png", country: "England", leagueId: "l1" },
  { id: "t4", apiId: 42, name: "Arsenal", nameAr: "أرسنال", logo: "https://media.api-sports.io/football/teams/42.png", country: "England", leagueId: "l1" },
  { id: "t5", apiId: 49, name: "Chelsea", nameAr: "تشيلسي", logo: "https://media.api-sports.io/football/teams/49.png", country: "England", leagueId: "l1" },
  { id: "t6", apiId: 529, name: "Barcelona", nameAr: "برشلونة", logo: "https://media.api-sports.io/football/teams/529.png", country: "Spain", leagueId: "l2" },
  { id: "t7", apiId: 541, name: "Real Madrid", nameAr: "ريال مدريد", logo: "https://media.api-sports.io/football/teams/541.png", country: "Spain", leagueId: "l2" },
  { id: "t8", apiId: 532, name: "Atletico Madrid", nameAr: "أتلتيكو مدريد", logo: "https://media.api-sports.io/football/teams/532.png", country: "Spain", leagueId: "l2" },
  { id: "t9", apiId: 496, name: "Inter Milan", nameAr: "إنتر ميلان", logo: "https://media.api-sports.io/football/teams/496.png", country: "Italy", leagueId: "l3" },
  { id: "t10", apiId: 489, name: "AC Milan", nameAr: "إي سي ميلان", logo: "https://media.api-sports.io/football/teams/489.png", country: "Italy", leagueId: "l3" },
  { id: "t11", apiId: 505, name: "Juventus", nameAr: "يوفنتوس", logo: "https://media.api-sports.io/football/teams/505.png", country: "Italy", leagueId: "l3" },
  { id: "t12", apiId: 157, name: "Bayern Munich", nameAr: "بايرن ميونخ", logo: "https://media.api-sports.io/football/teams/157.png", country: "Germany", leagueId: "l4" },
  { id: "t13", apiId: 165, name: "Borussia Dortmund", nameAr: "بوروسيا دورتموند", logo: "https://media.api-sports.io/football/teams/165.png", country: "Germany", leagueId: "l4" },
  { id: "t14", apiId: 85, name: "PSG", nameAr: "باريس سان جيرمان", logo: "https://media.api-sports.io/football/teams/85.png", country: "France", leagueId: "l5" },
  { id: "t15", apiId: 91, name: "Monaco", nameAr: "موناكو", logo: "https://media.api-sports.io/football/teams/91.png", country: "France", leagueId: "l5" },
  { id: "t16", apiId: 2994, name: "Al-Hilal", nameAr: "الهلال", logo: "https://media.api-sports.io/football/teams/2994.png", country: "Saudi Arabia", leagueId: "l7" },
  { id: "t17", apiId: 2933, name: "Al-Nassr", nameAr: "النصر", logo: "https://media.api-sports.io/football/teams/2933.png", country: "Saudi Arabia", leagueId: "l7" },
  { id: "t18", apiId: 2895, name: "Al-Ittihad", nameAr: "الاتحاد", logo: "https://media.api-sports.io/football/teams/2895.png", country: "Saudi Arabia", leagueId: "l7" },
];

export const FALLBACK_PLAYERS = [
  { id: "p1", apiId: 154, name: "Erling Haaland", nameAr: "إيرلينغ هالاند", position: "Forward", number: 9, photo: "https://media.api-sports.io/football/players/154.png", teamId: "t1", goals: 15, assists: 3, appearances: 17 },
  { id: "p2", apiId: 1100, name: "Kevin De Bruyne", nameAr: "كيفن دي بروين", position: "Midfielder", number: 17, photo: "https://media.api-sports.io/football/players/1100.png", teamId: "t1", goals: 3, assists: 8, appearances: 15 },
  { id: "p3", apiId: 282, name: "Mohamed Salah", nameAr: "محمد صلاح", position: "Forward", number: 11, photo: "https://media.api-sports.io/football/players/282.png", teamId: "t3", goals: 12, assists: 6, appearances: 16 },
  { id: "p4", apiId: 2135, name: "Kylian Mbappe", nameAr: "كيليان مبابي", position: "Forward", number: 9, photo: "https://media.api-sports.io/football/players/2135.png", teamId: "t7", goals: 14, assists: 4, appearances: 18 },
  { id: "p5", apiId: 1232, name: "Vinicius Jr", nameAr: "فينيسيوس جونيور", position: "Forward", number: 7, photo: "https://media.api-sports.io/football/players/1232.png", teamId: "t7", goals: 8, assists: 5, appearances: 15 },
  { id: "p6", apiId: 319, name: "Lamine Yamal", nameAr: "لامين يامال", position: "Forward", number: 19, photo: "https://media.api-sports.io/football/players/319.png", teamId: "t6", goals: 5, assists: 7, appearances: 14 },
  { id: "p7", apiId: 551, name: "Jude Bellingham", nameAr: "جود بيلينغهام", position: "Midfielder", number: 5, photo: "https://media.api-sports.io/football/players/551.png", teamId: "t7", goals: 7, assists: 3, appearances: 16 },
  { id: "p8", apiId: 352, name: "Bukayo Saka", nameAr: "بوكايو ساكا", position: "Forward", number: 7, photo: "https://media.api-sports.io/football/players/352.png", teamId: "t4", goals: 6, assists: 5, appearances: 15 },
  { id: "p9", apiId: 337, name: "Phil Foden", nameAr: "فيل فودين", position: "Midfielder", number: 47, photo: "https://media.api-sports.io/football/players/337.png", teamId: "t1", goals: 5, assists: 4, appearances: 16 },
  { id: "p10", apiId: 631, name: "Jamal Musiala", nameAr: "جمال موسيالا", position: "Midfielder", number: 42, photo: "https://media.api-sports.io/football/players/631.png", teamId: "t12", goals: 6, assists: 4, appearances: 15 },
  { id: "p11", apiId: 984, name: "Cristiano Ronaldo", nameAr: "كريستيانو رونالدو", position: "Forward", number: 7, photo: "https://media.api-sports.io/football/players/984.png", teamId: "t17", goals: 10, assists: 3, appearances: 14 },
  { id: "p12", apiId: 1015, name: "Karim Benzema", nameAr: "كريم بنزيما", position: "Forward", number: 9, photo: "https://media.api-sports.io/football/players/1015.png", teamId: "t18", goals: 8, assists: 2, appearances: 13 },
];

function generateMatchId(i: number) { return `m${i}`; }

function formatDate(daysFromNow: number, hour: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export const FALLBACK_MATCHES = (() => {
  const now = new Date();
  const h = now.getHours();
  const matches = [
    { id: generateMatchId(1), apiId: 1001, leagueId: "l1", status: "LIVE", minute: 67, homeTeamId: "t1", awayTeamId: "t2", homeScore: 2, awayScore: 1, date: formatDate(0, h - 1), round: "GW 16" },
    { id: generateMatchId(2), apiId: 1002, leagueId: "l1", status: "LIVE", minute: 34, homeTeamId: "t3", awayTeamId: "t4", homeScore: 1, awayScore: 0, date: formatDate(0, h - 2), round: "GW 16" },
    { id: generateMatchId(3), apiId: 1003, leagueId: "l2", status: "LIVE", minute: 82, homeTeamId: "t6", awayTeamId: "t7", homeScore: 2, awayScore: 2, date: formatDate(0, h - 1), round: "La Liga RD 17" },
    { id: generateMatchId(4), apiId: 1004, leagueId: "l2", status: "SCHEDULED", minute: 0, homeTeamId: "t8", awayTeamId: "t6", homeScore: null, awayScore: null, date: formatDate(1, 20), round: "La Liga RD 18" },
    { id: generateMatchId(5), apiId: 1005, leagueId: "l1", status: "SCHEDULED", minute: 0, homeTeamId: "t5", awayTeamId: "t1", homeScore: null, awayScore: null, date: formatDate(1, 21), round: "GW 17" },
    { id: generateMatchId(6), apiId: 1006, leagueId: "l3", status: "SCHEDULED", minute: 0, homeTeamId: "t9", awayTeamId: "t10", homeScore: null, awayScore: null, date: formatDate(1, 19), round: "Serie A RD 16" },
    { id: generateMatchId(7), apiId: 1007, leagueId: "l4", status: "SCHEDULED", minute: 0, homeTeamId: "t12", awayTeamId: "t13", homeScore: null, awayScore: null, date: formatDate(2, 17), round: "Bundesliga RD 14" },
    { id: generateMatchId(8), apiId: 1008, leagueId: "l5", status: "FINISHED", minute: 90, homeTeamId: "t14", awayTeamId: "t15", homeScore: 3, awayScore: 1, date: formatDate(-1, 21), round: "Ligue 1 RD 15" },
    { id: generateMatchId(9), apiId: 1009, leagueId: "l7", status: "FINISHED", minute: 90, homeTeamId: "t16", awayTeamId: "t17", homeScore: 2, awayScore: 0, date: formatDate(-2, 20), round: "SPL RD 13" },
    { id: generateMatchId(10), apiId: 1010, leagueId: "l1", status: "SCHEDULED", minute: 0, homeTeamId: "t2", awayTeamId: "t5", homeScore: null, awayScore: null, date: formatDate(3, 18), round: "GW 17" },
  ];
  return matches;
})();

export const FALLBACK_STANDINGS = [
  { id: "s1", leagueId: "l1", season: 2025, position: 1, teamId: "t3", played: 16, won: 13, drawn: 2, lost: 1, goalsFor: 38, goalsAgainst: 12, points: 41 },
  { id: "s2", leagueId: "l1", season: 2025, position: 2, teamId: "t4", played: 16, won: 11, drawn: 3, lost: 2, goalsFor: 35, goalsAgainst: 14, points: 36 },
  { id: "s3", leagueId: "l1", season: 2025, position: 3, teamId: "t1", played: 16, won: 10, drawn: 4, lost: 2, goalsFor: 36, goalsAgainst: 15, points: 34 },
  { id: "s4", leagueId: "l1", season: 2025, position: 4, teamId: "t5", played: 16, won: 9, drawn: 3, lost: 4, goalsFor: 28, goalsAgainst: 18, points: 30 },
  { id: "s5", leagueId: "l1", season: 2025, position: 5, teamId: "t2", played: 16, won: 8, drawn: 2, lost: 6, goalsFor: 25, goalsAgainst: 22, points: 26 },
  { id: "s6", leagueId: "l2", season: 2025, position: 1, teamId: "t7", played: 17, won: 14, drawn: 2, lost: 1, goalsFor: 42, goalsAgainst: 13, points: 44 },
  { id: "s7", leagueId: "l2", season: 2025, position: 2, teamId: "t6", played: 17, won: 12, drawn: 3, lost: 2, goalsFor: 40, goalsAgainst: 16, points: 39 },
  { id: "s8", leagueId: "l2", season: 2025, position: 3, teamId: "t8", played: 17, won: 10, drawn: 5, lost: 2, goalsFor: 30, goalsAgainst: 14, points: 35 },
];

export const FALLBACK_NEWS = [
  { id: "n1", title: "Manchester City beat United in dramatic derby", titleAr: "مانشستر سيتي يفوز على يونايتد في ديربي دراماتيكي", slug: "city-win-derby", excerpt: "A thrilling Manchester derby saw City come from behind to win 2-1 at the Etihad.", content: "Full match report...", category: "MATCH_REPORT", image: "https://media.api-sports.io/football/teams/50.png", published: true, featured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "n2", title: "Barcelona thrash Real Madrid in El Clasico", titleAr: "برشلونة يسحق ريال مدريد في الكلاسيكو", slug: "barcelona-win-clasico", excerpt: "Barcelona dominated El Clasico with a stunning 4-0 victory at the Camp Nou.", content: "Full match report...", category: "MATCH_REPORT", image: "https://media.api-sports.io/football/teams/529.png", published: true, featured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "n3", title: "Mbappe scores hat-trick in Champions League", titleAr: "مبابي يسجل هاتريك في دوري أبطال أوروبا", slug: "mbappe-hattrick-ucl", excerpt: "Kylian Mbappe scored three goals as Real Madrid cruised to victory.", content: "Match report...", category: "MATCH_REPORT", image: "https://media.api-sports.io/football/players/2135.png", published: true, featured: false, createdAt: new Date(), updatedAt: new Date() },
  { id: "n4", title: "Liverpool extend lead at top of Premier League", titleAr: "ليفربول يوسع الفارق في صدارة الدوري الإنجليزي", slug: "liverpool-extend-lead", excerpt: "Liverpool maintained their impressive form with a 3-0 win over Newcastle.", content: "Match report...", category: "MATCH_REPORT", image: "https://media.api-sports.io/football/teams/40.png", published: true, featured: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "n5", title: "Salah wins Player of the Month", titleAr: "صلاح يفوز بجائزة أفضل لاعب في الشهر", slug: "salah-potm", excerpt: "Mohamed Salah has been awarded the Premier League Player of the Month for his outstanding performances.", content: "News article...", category: "OFFICIAL", image: "https://media.api-sports.io/football/players/282.png", published: true, featured: false, createdAt: new Date(), updatedAt: new Date() },
];

export const FALLBACK_WORLD_CUP_GROUPS = [
  { name: "A", teams: ["Brazil", "Portugal", "South Korea", "Ghana"] },
  { name: "B", teams: ["Argentina", "France", "Denmark", "Australia"] },
  { name: "C", teams: ["England", "Netherlands", "Senegal", "Ecuador"] },
  { name: "D", teams: ["Germany", "Spain", "Japan", "Cameroon"] },
  { name: "E", teams: ["Italy", "Croatia", "Switzerland", "Saudi Arabia"] },
  { name: "F", teams: ["Belgium", "Morocco", "Serbia", "USA"] },
  { name: "G", teams: ["Uruguay", "Mexico", "Poland", "Tunisia"] },
  { name: "H", teams: ["Colombia", "Nigeria", "Sweden", "Iran"] },
  { name: "I", teams: ["Portugal (2)", "Egypt", "Paraguay", "Iraq"] },
  { name: "J", teams: ["France (2)", "Chile", "Algeria", "Japan (2)"] },
  { name: "K", teams: ["Netherlands (2)", "Ivory Coast", "Wales", "Canada"] },
  { name: "L", teams: ["Spain (2)", "Czech Rep", "Norway", "New Zealand"] },
];

export function getFallbackLeagues() {
  return FALLBACK_LEAGUES;
}

export function getFallbackTeams() {
  return FALLBACK_TEAMS;
}

export function getFallbackPlayers() {
  return FALLBACK_PLAYERS;
}

export function getFallbackMatches() {
  return FALLBACK_MATCHES.map((m) => {
    const homeTeam = FALLBACK_TEAMS.find((t) => t.id === m.homeTeamId);
    const awayTeam = FALLBACK_TEAMS.find((t) => t.id === m.awayTeamId);
    const league = FALLBACK_LEAGUES.find((l) => l.id === m.leagueId);
    return { ...m, homeTeam, awayTeam, league, events: [], homeStats: null, awayStats: null };
  });
}

export function getFallbackStandings(leagueId?: string) {
  const data = leagueId ? FALLBACK_STANDINGS.filter((s) => s.leagueId === leagueId) : FALLBACK_STANDINGS;
  return data.map((s) => {
    const team = FALLBACK_TEAMS.find((t) => t.id === s.teamId);
    return { ...s, team };
  });
}

export function getFallbackNews() {
  return FALLBACK_NEWS.map((n) => ({ ...n, author: { name: "Football World", image: null }, team: null }));
}
