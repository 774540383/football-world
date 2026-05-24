export const MAJOR_LEAGUES = [
  { id: 39, name: "الدوري الإنجليزي", nameEn: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png", country: "England" },
  { id: 140, name: "الدوري الإسباني", nameEn: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png", country: "Spain" },
  { id: 135, name: "الدوري الإيطالي", nameEn: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png", country: "Italy" },
  { id: 78, name: "الدوري الألماني", nameEn: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png", country: "Germany" },
  { id: 61, name: "الدوري الفرنسي", nameEn: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png", country: "France" },
  { id: 2, name: "دوري أبطال أوروبا", nameEn: "UEFA Champions League", logo: "https://media.api-sports.io/football/leagues/2.png", country: "Europe" },
  { id: 3, name: "كأس العالم", nameEn: "World Cup", logo: "https://media.api-sports.io/football/leagues/3.png", country: "International" },
  { id: 325, name: "الدوري السعودي", nameEn: "Saudi Pro League", logo: "https://media.api-sports.io/football/leagues/325.png", country: "Saudi Arabia" },
];

export const NEWS_CATEGORIES = [
  { value: "TRANSFERS", label: "انتقالات", labelEn: "Transfers" },
  { value: "MATCH_REPORT", label: "تقارير المباريات", labelEn: "Match Reports" },
  { value: "INJURY", label: "إصابات", labelEn: "Injuries" },
  { value: "RUMOR", label: "شائعات", labelEn: "Rumors" },
  { value: "INTERVIEW", label: "مقابلات", labelEn: "Interviews" },
  { value: "ANALYSIS", label: "تحليل", labelEn: "Analysis" },
  { value: "OFFICIAL", label: "رسمي", labelEn: "Official" },
  { value: "OTHER", label: "أخرى", labelEn: "Other" },
];

export const WORLD_CUP_INFO = {
  year: 2026,
  host: "USA, Canada, Mexico",
  startDate: "2026-06-11",
  endDate: "2026-07-19",
  teams: 48,
  matches: 104,
  groups: 12,
};

export const POSITIONS = [
  { value: "Goalkeeper", label: "حارس مرمى", labelEn: "Goalkeeper" },
  { value: "Defender", label: "مدافع", labelEn: "Defender" },
  { value: "Midfielder", label: "وسط", labelEn: "Midfielder" },
  { value: "Forward", label: "مهاجم", labelEn: "Forward" },
];

export const SITE_CONFIG = {
  name: "Football World",
  nameAr: "عالم كرة القدم",
  description: "منصة كرة القدم العالمية الأولى - مباريات مباشرة، أخبار، إحصائيات",
  descriptionEn: "The Ultimate Football Platform - Live Scores, News, Stats",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "ar",
  dir: "rtl",
};
