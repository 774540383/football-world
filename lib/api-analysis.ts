export interface ServiceRecommendation {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  url: string;
  pricing: ServicePricing;
  endpoints: string[];
  priority: "critical" | "recommended" | "optional";
  currentStatus: "configured" | "missing" | "partial";
}

export interface ServicePricing {
  free: boolean;
  freeTier: string;
  paid: string;
  monthlyCost: string;
  recommendedTier: string;
}

export const SERVICE_RECOMMENDATIONS: ServiceRecommendation[] = [
  {
    id: "api-football",
    name: "API-Football (api-sports.io)",
    nameAr: "API-Football",
    description: "Complete football data API covering 200+ leagues, live scores, standings, player stats, transfers, and H2H. This is the MAIN data source for your project.",
    descriptionAr: "واجهة برمجة تطبيقات كرة قدم شاملة تغطي أكثر من 200 دوري، نتائج مباشرة، ترتيب، إحصائيات لاعبين، انتقالات، ومواجهات مباشرة. هذا هو مصدر البيانات الرئيسي لمشروعك.",
    url: "https://www.api-sports.io/pricing",
    pricing: {
      free: false,
      freeTier: "لا يوجد",
      paid: "يبدأ من $24.99/شهر (100 طلب/يوم) → $199.99/شهر (غير محدود)",
      monthlyCost: "$24.99 - $199.99",
      recommendedTier: "$49.99/شهر (500 طلب/يوم) - كافٍ للموقع",
    },
    endpoints: ["/fixtures", "/standings", "/teams", "/players", "/leagues", "/predictions"],
    priority: "critical",
    currentStatus: "missing",
  },
  {
    id: "football-data-org",
    name: "Football-Data.org",
    nameAr: "Football-Data.org",
    description: "Free tier available with limited requests. Covers major European leagues with matches, standings, and team data.",
    descriptionAr: "طبقة مجانية متاحة مع عدد محدود من الطلبات. تغطي الدوريات الأوروبية الكبرى مع المباريات والترتيب وبيانات الفرق.",
    url: "https://www.football-data.org/pricing",
    pricing: {
      free: true,
      freeTier: "10 طلبات/دقيقة, 1000 طلب/يوم",
      paid: "€12/شهر (50 طلب/دقيقة) → €64/شهر (غير محدود)",
      monthlyCost: "€0 - €64",
      recommendedTier: "مجاني (كبديل أو مصدر ثانوي)",
    },
    endpoints: ["/competitions", "/matches", "/standings", "/teams", "/players"],
    priority: "recommended",
    currentStatus: "missing",
  },
  {
    id: "thesportsdb",
    name: "TheSportsDB",
    nameAr: "TheSportsDB",
    description: "Free sports database with images, videos, event info, and team badges. Great for visual content (logos, player photos, stadium images).",
    descriptionAr: "قاعدة بيانات رياضية مجانية مع صور وفيديو ومعلومات أحداث وشعارات الفرق. ممتاز للمحتوى البصري (شعارات، صور لاعبين، صور ملاعب).",
    url: "https://www.thesportsdb.com/pricing",
    pricing: {
      free: true,
      freeTier: "1000 طلب/يوم, صور بجودة متوسطة",
      paid: "$1/شهر (10,000 طلب/يوم, صور عالية الجودة)",
      monthlyCost: "$0 - $1",
      recommendedTier: "مجاني أو $1/شهر (للحصول على صور عالية الجودة)",
    },
    endpoints: ["/lookupteam", "/lookupplayer", "/eventsnext.php", "/eventresults.php"],
    priority: "recommended",
    currentStatus: "missing",
  },
  {
    id: "openai",
    name: "OpenAI API",
    nameAr: "OpenAI API",
    description: "AI text generation for the content system. Use GPT-4o-mini for cheap content generation ($0.15/1M input tokens).",
    descriptionAr: "توليد نصوص بالذكاء الاصطناعي لنظام المحتوى. استخدم GPT-4o-mini لتوليد محتوى رخيص ($0.15/1M رمز إدخال).",
    url: "https://platform.openai.com/pricing",
    pricing: {
      free: false,
      freeTier: "ائتمان $5 للتجربة (ينتهي بعد 3 شهور)",
      paid: "GPT-4o-mini: $0.15/1M input, GPT-4o: $2.50/1M input",
      monthlyCost: "~$2-10 (حسب حجم المحتوى)",
      recommendedTier: "GPT-4o-mini (الأرخص والأسرع)",
    },
    endpoints: ["/v1/chat/completions", "/v1/embeddings"],
    priority: "critical",
    currentStatus: "missing",
  },
  {
    id: "iptv-xtream",
    name: "Xtream Codes API (IPTV)",
    nameAr: "Xtream Codes API",
    description: "Already subscribed! Your IPTV provider (smarts-on.to:2095) uses Xtream API. This is the source of 8000+ channels.",
    descriptionAr: "مشترك بالفعل! مزود IPTV الخاص بك (smarts-on.to:2095) يستخدم Xtream API. هذا هو مصدر أكثر من 8000 قناة.",
    url: "http://smarts-on.to:2095",
    pricing: {
      free: false,
      freeTier: "لا يوجد",
      paid: "VIP 3 شهور (مشترك فيه بالفعل)",
      monthlyCost: "مدفوع مسبقاً",
      recommendedTier: "مشترك بالفعل - جيد",
    },
    endpoints: ["/player_api.php", "/live/", "/series/"],
    priority: "critical",
    currentStatus: "configured",
  },
  {
    id: "highlight-video",
    name: "Highlight Video API (HighlightsFootball)",
    nameAr: "API فيديوهات المباريات",
    description: "Short video highlights of matches - great for TikTok/Reels content alongside AI-generated scripts.",
    descriptionAr: "ملخصات فيديو قصيرة للمباريات - ممتاز لمحتوى TikTok/Reels إلى جانب النصوص المولدة بالذكاء الاصطناعي.",
    url: "https://www.highlightsfootball.com/api",
    pricing: {
      free: true,
      freeTier: "مجاني للاستخدام الشخصي",
      paid: "مخططات تجارية حسب الطلب",
      monthlyCost: "$0",
      recommendedTier: "مجاني",
    },
    endpoints: ["/videos", "/highlights", "/matches"],
    priority: "optional",
    currentStatus: "missing",
  },
  {
    id: "youtube-data",
    name: "YouTube Data API v3",
    nameAr: "YouTube Data API",
    description: "Embed match highlights, tutorials, and analysis videos from YouTube. Free quota of 10,000 units/day.",
    descriptionAr: "تضمين ملخصات المباريات والدروس التعليمية وفيديوهات التحليل من يوتيوب. حصة مجانية 10,000 وحدة/يوم.",
    url: "https://developers.google.com/youtube/v3",
    pricing: {
      free: true,
      freeTier: "10,000 وحدة/يوم (مجاني)",
      paid: "وحدات إضافية $0.03/1000 وحدة",
      monthlyCost: "$0",
      recommendedTier: "مجاني",
    },
    endpoints: ["/search", "/videos", "/playlistItems"],
    priority: "optional",
    currentStatus: "missing",
  },
];

export interface SetupChecklist {
  task: string;
  taskAr: string;
  service: string;
  priority: "critical" | "high" | "medium" | "low";
  timeRequired: string;
  steps: string[];
  done: boolean;
}

export const SETUP_CHECKLIST: SetupChecklist[] = [
  {
    task: "Subscribe to API-Football",
    taskAr: "الاشتراك في API-Football",
    service: "api-sports.io",
    priority: "critical",
    timeRequired: "10 دقائق",
    steps: [
      "Go to https://www.api-sports.io/pricing",
      "Choose 'Supa Plan' ($49.99/month - 500 requests/day)",
      "Register and get your API key",
      "Add key in admin panel (/admin/api-keys) or Vercel env vars",
    ],
    done: false,
  },
  {
    task: "Subscribe to OpenAI API",
    taskAr: "الاشتراك في OpenAI API",
    service: "OpenAI",
    priority: "critical",
    timeRequired: "10 دقائق",
    steps: [
      "Go to https://platform.openai.com/api-keys",
      "Create an account and add payment method",
      "Create a new API key",
      "Add OPENAI_API_KEY to Vercel environment variables",
      "Test AI content generation from admin panel",
    ],
    done: false,
  },
  {
    task: "Setup Football-Data.org (Free alternative)",
    taskAr: "إعداد Football-Data.org (بديل مجاني)",
    service: "football-data.org",
    priority: "high",
    timeRequired: "5 دقائق",
    steps: [
      "Go to https://www.football-data.org/register",
      "Register for free account",
      "Copy API key from dashboard",
      "Add as secondary source in admin panel",
    ],
    done: false,
  },
  {
    task: "Setup TheSportsDB for images",
    taskAr: "إعداد TheSportsDB للصور",
    service: "thesportsdb.com",
    priority: "medium",
    timeRequired: "5 دقائق",
    steps: [
      "Go to https://www.thesportsdb.com/free_sports_api",
      "Free API key available on registration",
      "Add to admin panel to auto-fetch logos and player images",
    ],
    done: false,
  },
  {
    task: "Renew IPTV subscription",
    taskAr: "تجديد اشتراك IPTV",
    service: "smarts-on.to",
    priority: "critical",
    timeRequired: "15 دقائق",
    steps: [
      "Current subscription is VIP 3 months",
      "Check expiration date in IPTV provider panel",
      "Renew before expiry to avoid service interruption",
      "VPS Proxy auto-connects to Xtream API, no code changes needed",
    ],
    done: false,
  },
  {
    task: "Setup PostgreSQL database (Neon/Supabase)",
    taskAr: "إعداد قاعدة بيانات PostgreSQL",
    service: "Supabase or Neon",
    priority: "high",
    timeRequired: "30 دقائق",
    steps: [
      "Sign up at https://supabase.com or https://neon.tech",
      "Create a new project (free tier)",
      "Copy DATABASE_URL connection string",
      "Add to Vercel env: vercel env add DATABASE_URL production",
      "Run: npx prisma db push",
      "Run: npx prisma db seed",
    ],
    done: false,
  },
  {
    task: "Activate real data flow",
    taskAr: "تفعيل تدفق البيانات الحقيقية",
    service: "API-Football + Database",
    priority: "high",
    timeRequired: "1 ساعة",
    steps: [
      "After setting up API-Football and Database:",
      "Modify lib/data.ts to prioritize API-Football over fallback",
      "Set up cron job to fetch daily matches: GET /api/sync/matches",
      "Set up cron job to fetch live scores every 60 seconds",
      "Test all pages with real data",
    ],
    done: false,
  },
];

export function getEstimatedMonthlyCost(services: string[]): { total: string; breakdown: { name: string; cost: string }[] } {
  const pricing: Record<string, string> = {
    "api-football": "$49.99",
    "openai": "$5-10",
    "football-data-org": "$0 (free tier)",
    "thesportsdb": "$0-1",
    "iptv-xtream": "مدفوع مسبقاً",
  };

  return {
    total: "~$55-60/شهر",
    breakdown: services
      .filter((s) => pricing[s])
      .map((s) => ({
        name: SERVICE_RECOMMENDATIONS.find((r) => r.id === s)?.name || s,
        cost: pricing[s],
      })),
  };
}
