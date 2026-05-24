export type StreamType = "hls" | "youtube" | "direct" | "embed" | "dash";
export type ChannelCategory = "sports" | "news" | "entertainment" | "movies";

export interface StreamSource {
  id: string;
  name: string;
  nameAr: string;
  type: StreamType;
  url: string;
  poster?: string;
  quality?: string[];
  backupUrls?: string[];
}

export interface Channel {
  id: string;
  name: string;
  nameAr: string;
  logo: string;
  category: ChannelCategory;
  categoryAr: string;
  streams: StreamSource[];
  active: boolean;
  isFree: boolean;
  country: string;
  countryAr: string;
}

export interface MatchStream {
  id: string;
  matchId: string;
  title: string;
  titleAr: string;
  sources: StreamSource[];
  isLive: boolean;
  language: string;
  languageAr: string;
  isFeatured: boolean;
  autoFailover: boolean;
  healthCheckUrl?: string;
}

export interface StreamHealth {
  sourceId: string;
  status: "online" | "offline" | "degraded";
  latency: number;
  lastChecked: number;
}

export const FALLBACK_CHANNELS: Channel[] = [
  {
    id: "ch1",
    name: "beIN Sports HD 1",
    nameAr: "بي إن سبورت HD 1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/BeIN_Sports_Logo_2015.svg/1200px-BeIN_Sports_Logo_2015.svg.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s1", name: "Main Stream", nameAr: "البث الرئيسي", type: "youtube", url: "https://www.youtube.com/watch?v=VIDEO_ID", poster: "", quality: ["1080p", "720p", "480p"] },
    ],
    active: true,
    isFree: false,
    country: "Qatar",
    countryAr: "قطر",
  },
  {
    id: "ch2",
    name: "Al Kass Sports",
    nameAr: "الكأس الرياضية",
    logo: "https://upload.wikimedia.org/wikipedia/ar/thumb/7/7b/Alkass_logo.svg/1200px-Alkass_logo.svg.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s2", name: "YouTube Live", nameAr: "يوتيوب مباشر", type: "youtube", url: "https://www.youtube.com/watch?v=alkass", poster: "" },
    ],
    active: true,
    isFree: true,
    country: "Qatar",
    countryAr: "قطر",
  },
  {
    id: "ch3",
    name: "SSC Sports",
    nameAr: "SSC الرياضية",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Saudi_Sports_Company_%28SSC%29_logo.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s3", name: "Main Stream", nameAr: "البث الرئيسي", type: "hls", url: "https://example.com/ssc/playlist.m3u8", poster: "", quality: ["1080p", "720p"] },
    ],
    active: true,
    isFree: false,
    country: "Saudi Arabia",
    countryAr: "المملكة العربية السعودية",
  },
  {
    id: "ch4",
    name: "Abu Dhabi Sports",
    nameAr: "أبو ظبي الرياضية",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Abu_Dhabi_Sports_Channel_logo.svg/1200px-Abu_Dhabi_Sports_Channel_logo.svg.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s4", name: "YouTube", nameAr: "يوتيوب", type: "youtube", url: "https://www.youtube.com/@ADSportsTV", poster: "" },
    ],
    active: true,
    isFree: true,
    country: "UAE",
    countryAr: "الإمارات العربية المتحدة",
  },
  {
    id: "ch5",
    name: "Sky Sports",
    nameAr: "سكاي سبورتس",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sky_Sports_logo.svg/1200px-Sky_Sports_logo.svg.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s5", name: "Main Stream", nameAr: "البث الرئيسي", type: "hls", url: "https://example.com/skysports/playlist.m3u8", poster: "", quality: ["1080p", "720p", "480p"] },
    ],
    active: true,
    isFree: false,
    country: "UK",
    countryAr: "المملكة المتحدة",
  },
  {
    id: "ch6",
    name: "ESPN",
    nameAr: "إي إس بي إن",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/1200px-ESPN_wordmark.svg.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s6", name: "Main Stream", nameAr: "البث الرئيسي", type: "hls", url: "https://example.com/espn/playlist.m3u8", poster: "" },
    ],
    active: true,
    isFree: false,
    country: "USA",
    countryAr: "الولايات المتحدة",
  },
  {
    id: "ch7",
    name: "MBC Sports",
    nameAr: "MBC الرياضية",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/MBC_Group_logo.svg/1200px-MBC_Group_logo.svg.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s7", name: "YouTube", nameAr: "يوتيوب", type: "youtube", url: "https://www.youtube.com/@MBCSports", poster: "" },
    ],
    active: true,
    isFree: true,
    country: "Middle East",
    countryAr: "الشرق الأوسط",
  },
  {
    id: "ch8",
    name: "TV3 Sport",
    nameAr: "تي في 3 سبورت",
    logo: "",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s8", name: "HLS Stream", nameAr: "بث HLS", type: "hls", url: "https://example.com/tv3/playlist.m3u8", poster: "" },
    ],
    active: true,
    isFree: false,
    country: "Denmark",
    countryAr: "الدنمارك",
  },
];

export const FALLBACK_MATCH_STREAMS: MatchStream[] = [
  {
    id: "ms1",
    matchId: "m1",
    title: "Manchester Derby - Live",
    titleAr: "ديربي مانشستر - مباشر",
    sources: [
      { id: "ms1s1", name: "HD Stream", nameAr: "بث عالي الجودة", type: "youtube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", quality: ["1080p", "720p"] },
      { id: "ms1s2", name: "SD Stream", nameAr: "بث عادي", type: "hls", url: "https://example.com/stream1/playlist.m3u8", quality: ["480p", "360p"] },
    ],
    isLive: true,
    language: "Arabic",
    languageAr: "العربية",
    isFeatured: true,
    autoFailover: true,
  },
  {
    id: "ms2",
    matchId: "m3",
    title: "El Clasico - Live",
    titleAr: "الكلاسيكو - مباشر",
    sources: [
      { id: "ms2s1", name: "HD Stream", nameAr: "بث عالي الجودة", type: "youtube", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", quality: ["1080p", "720p"] },
      { id: "ms2s2", name: "Backup", nameAr: "بث احتياطي", type: "hls", url: "https://example.com/stream2/playlist.m3u8", quality: ["720p", "480p"] },
    ],
    isLive: true,
    language: "Arabic",
    languageAr: "العربية",
    isFeatured: true,
    autoFailover: true,
  },
];

export const IPTV_SAMPLE_URLS = [
  { name: "Free IPTV (Sample)", url: "https://example.com/free.m3u", type: "m3u" },
  { name: "IPTV-Org (Sample)", url: "https://example.com/iptv.m3u", type: "m3u" },
];

export function getChannels(): Channel[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("football_world_channels");
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
  }
  return FALLBACK_CHANNELS;
}

export function saveChannels(channels: Channel[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("football_world_channels", JSON.stringify(channels));
  }
}

export function getMatchStreams(matchId: string): MatchStream | undefined {
  const allStreams = FALLBACK_MATCH_STREAMS;
  return allStreams.find((s) => s.matchId === matchId);
}

export function getAllMatchStreams(): MatchStream[] {
  return FALLBACK_MATCH_STREAMS;
}
