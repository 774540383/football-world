import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@footballworld.com" },
    update: {},
    create: {
      name: "مدير الموقع",
      email: "admin@footballworld.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const leagues = [
    { apiId: 39, name: "Premier League", nameAr: "الدوري الإنجليزي الممتاز", country: "England", season: 2024, logo: "https://media.api-sports.io/football/leagues/39.png" },
    { apiId: 140, name: "La Liga", nameAr: "الدوري الإسباني", country: "Spain", season: 2024, logo: "https://media.api-sports.io/football/leagues/140.png" },
    { apiId: 135, name: "Serie A", nameAr: "الدوري الإيطالي", country: "Italy", season: 2024, logo: "https://media.api-sports.io/football/leagues/135.png" },
    { apiId: 78, name: "Bundesliga", nameAr: "الدوري الألماني", country: "Germany", season: 2024, logo: "https://media.api-sports.io/football/leagues/78.png" },
    { apiId: 61, name: "Ligue 1", nameAr: "الدوري الفرنسي", country: "France", season: 2024, logo: "https://media.api-sports.io/football/leagues/61.png" },
    { apiId: 2, name: "UEFA Champions League", nameAr: "دوري أبطال أوروبا", country: "Europe", season: 2024, logo: "https://media.api-sports.io/football/leagues/2.png" },
    { apiId: 325, name: "Saudi Pro League", nameAr: "الدوري السعودي", country: "Saudi Arabia", season: 2024, logo: "https://media.api-sports.io/football/leagues/325.png" },
  ];

  for (const league of leagues) {
    await prisma.league.upsert({
      where: { apiId: league.apiId },
      update: {},
      create: league,
    });
  }

  const sampleTeams = [
    { apiId: 50, name: "Manchester City", nameAr: "مانشستر سيتي", country: "England", leagueApiId: 39, logo: "https://media.api-sports.io/football/teams/50.png" },
    { apiId: 40, name: "Liverpool", nameAr: "ليفربول", country: "England", leagueApiId: 39, logo: "https://media.api-sports.io/football/teams/40.png" },
    { apiId: 541, name: "Real Madrid", nameAr: "ريال مدريد", country: "Spain", leagueApiId: 140, logo: "https://media.api-sports.io/football/teams/541.png" },
    { apiId: 529, name: "Barcelona", nameAr: "برشلونة", country: "Spain", leagueApiId: 140, logo: "https://media.api-sports.io/football/teams/529.png" },
    { apiId: 505, name: "Inter", nameAr: "إنتر ميلان", country: "Italy", leagueApiId: 135, logo: "https://media.api-sports.io/football/teams/505.png" },
    { apiId: 489, name: "AC Milan", nameAr: "إيه سي ميلان", country: "Italy", leagueApiId: 135, logo: "https://media.api-sports.io/football/teams/489.png" },
    { apiId: 157, name: "Bayern Munich", nameAr: "بايرن ميونخ", country: "Germany", leagueApiId: 78, logo: "https://media.api-sports.io/football/teams/157.png" },
    { apiId: 85, name: "Paris Saint Germain", nameAr: "باريس سان جيرمان", country: "France", leagueApiId: 61, logo: "https://media.api-sports.io/football/teams/85.png" },
    { apiId: 2933, name: "Al Nassr", nameAr: "النصر", country: "Saudi Arabia", leagueApiId: 325, logo: "https://media.api-sports.io/football/teams/2933.png" },
    { apiId: 2934, name: "Al Hilal", nameAr: "الهلال", country: "Saudi Arabia", leagueApiId: 325, logo: "https://media.api-sports.io/football/teams/2934.png" },
  ];

  for (const team of sampleTeams) {
    const league = await prisma.league.findUnique({ where: { apiId: team.leagueApiId } });
    await prisma.team.upsert({
      where: { apiId: team.apiId },
      update: {},
      create: {
        apiId: team.apiId,
        name: team.name,
        nameAr: team.nameAr,
        country: team.country,
        logo: team.logo,
        leagueId: league?.id,
      },
    });
  }

  const sampleNews = [
    {
      title: "ريال مدريد يحقق فوزاً كبيراً على برشلونة في الكلاسيكو",
      slug: "real-madrid-wins-classico",
      excerpt: "ريال مدريد يحقق فوزاً مثيراً على برشلونة في كلاسيكو الأرض",
      content: "<p>حقق نادي ريال مدريد فوزاً كبيراً على غريمه التقليدي برشلونة في مباراة الكلاسيكو التي أقيمت على ملعب سانتياغو برنابيو. انتهت المباراة بنتيجة 4-1 لصالح الملكي.</p><p>أهداف المباراة: سجل فينيسيوس جونيور هدفين، ورودريغو هدف، ومبابي هدف. بينما سجل ليفاندوفسكي هدف برشلونة الوحيد.</p>",
      image: "https://media.api-sports.io/football/teams/541.png",
      category: "MATCH_REPORT",
      featured: true,
      published: true,
    },
    {
      title: "مانشستر سيتي يتعاقد مع نجم جديد في الميركاتو الشتوي",
      slug: "man-city-new-signing",
      excerpt: "السيتي يدعم صفوفه بصفقة جديدة في فترة الانتقالات الشتوية",
      content: "<p>أعلن نادي مانشستر سيتي عن التعاقد مع لاعب جديد لدعم صفوفه في النصف الثاني من الموسم. الصفقة تأتي في إطار خطط الفريق للمنافسة على جميع البطولات.</p>",
      category: "TRANSFERS",
      featured: false,
      published: true,
    },
    {
      title: "كأس العالم 2026: استعدادات مكثفة في أمريكا وكندا والمكسيك",
      slug: "world-cup-2026-preparations",
      excerpt: "استعدادات مكثفة لاستضافة كأس العالم 2026 في 3 دول",
      content: "<p>تتواصل الاستعدادات لاستضافة كأس العالم 2026 في الولايات المتحدة وكندا والمكسيك، حيث من المتوقع أن تكون النسخة الأكبر في التاريخ بمشاركة 48 فريقاً.</p><p>سيتم إقامة 104 مباريات في 16 ملعباً موزعة على الدول الثلاث المستضيفة.</p>",
      image: "https://media.api-sports.io/football/leagues/3.png",
      category: "ANALYSIS",
      featured: true,
      published: true,
    },
  ];

  for (const news of sampleNews) {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: {
        ...news,
        authorId: admin?.id,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log("📧 Admin email: admin@footballworld.com");
  console.log("🔑 Admin password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
