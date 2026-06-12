export type StreamType = "hls" | "youtube" | "direct" | "embed" | "dash" | "ts" | "webrtc" | "websocket";
export type ChannelCategory = "sports" | "news" | "entertainment" | "movies";
export type ConnectionQuality = "low" | "medium" | "high" | "unknown";

// ====== PROXY CONFIG ======
export const PROXY_HTTPS = "https://srv1675350.hstgr.cloud";
export const PROXY_HOST = "srv1675350.hstgr.cloud";
export const PROXY_DIRECT = "https://srv1675350.hstgr.cloud";
export const VERCEL_PROXY_PREFIX = "/api/proxy";

// ====== STREAMING OPTIMIZATION ======
export const STREAM_BUFFER_DEFAULTS = {
  live: { maxBufferLength: 30, backBufferLength: 30, maxMaxBufferLength: 60 },
  vod: { maxBufferLength: 60, backBufferLength: 90, maxMaxBufferLength: 120 },
};

export const HLS_LIVE_CONFIG = {
  enableWorker: true,
  lowLatencyMode: true,
  backBufferLength: 30,
  maxBufferLength: 30,
  maxMaxBufferLength: 60,
  liveSyncDurationCount: 3,
  liveMaxLatencyDurationCount: 6,
  startLevel: -1,
  manifestLoadingMaxRetry: 10,
  levelLoadingMaxRetry: 10,
  fragLoadingMaxRetry: 10,
  manifestLoadingTimeOut: 15000,
  levelLoadingTimeOut: 10000,
  fragLoadingTimeOut: 10000,
  abrEwmaDefaultEstimate: 500000,
  abrBandWidthFactor: 0.8,
  abrBandWidthUpFactor: 0.7,
  maxFragLookUpTolerance: 0.25,
};

export function estimateConnectionQuality(): ConnectionQuality {
  if (typeof navigator === "undefined") return "unknown";
  const conn = (navigator as any).connection;
  if (!conn) return "unknown";
  const down = conn.downlink || 0;
  if (down < 0.5) return "low";
  if (down < 3) return "medium";
  return "high";
}

export function getProxyUrls(channelId: string, preferDirect = true): string[] {
  const quality = estimateConnectionQuality();
  const useDirect = preferDirect && quality !== "low";
  const urls: string[] = [];
  if (useDirect) {
    urls.push(`${PROXY_DIRECT}/stream?id=${channelId}`);
  }
  urls.push(`${VERCEL_PROXY_PREFIX}?path=stream&id=${channelId}`);
  urls.push(`${PROXY_DIRECT}/hls/${channelId}/playlist.m3u8`);
  return urls;
}

export interface IPTVChannel {
  id: number;
  name: string;
  icon: string;
  category: string;
  epg?: string;
}

export interface IPTVCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

async function fetchFrom(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchIPTVChannels(): Promise<IPTVChannel[]> {
  const urls = [
    `${PROXY_DIRECT}/api/channels`,
    `${PROXY_DIRECT}/channels`,
    `${VERCEL_PROXY_PREFIX}?path=channels`,
    `${VERCEL_PROXY_PREFIX}?path=api/channels`,
  ];
  for (const url of urls) {
    try {
      const data = await fetchFrom(url);
      const channels = data?.channels || data?.data || data;
      if (Array.isArray(channels) && channels.length > 0) return channels;
    } catch { /* try next */ }
  }
  return [];
}

export async function fetchIPTVCategories(): Promise<IPTVCategory[]> {
  try {
    const res = await fetch(`${PROXY_DIRECT}/api/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Proxy not reachable");
    return await res.json();
  } catch {
    return [];
  }
}

export function iptvToChannel(iptv: IPTVChannel): Channel {
  const quality = estimateConnectionQuality();
  const useDirect = quality !== "low";
  return {
    id: `iptv-${iptv.id}`,
    name: iptv.name,
    nameAr: iptv.name,
    logo: iptv.icon || "",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      {
        id: `iptv-src-${iptv.id}`,
        name: `${iptv.name} HD`,
        nameAr: `${iptv.name}`,
        type: "ts",
        url: `${PROXY_DIRECT}/stream?id=${iptv.id}`,
        viaProxy: true,
        proxyId: "vps",
        quality: ["HD"],
        backupUrls: useDirect
          ? [`${VERCEL_PROXY_PREFIX}?path=stream&id=${iptv.id}`, `${PROXY_DIRECT}/hls/${iptv.id}/playlist.m3u8`]
          : [`${VERCEL_PROXY_PREFIX}?path=stream&id=${iptv.id}`],
      },
    ],
    active: true,
    isFree: true,
    country: "",
    countryAr: "",
  };
}

export interface StreamSource {
  id: string;
  name: string;
  nameAr: string;
  type: StreamType;
  url: string;
  poster?: string;
  quality?: string[];
  backupUrls?: string[];
  viaProxy?: boolean;
  proxyId?: string;
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

export const PUBLIC_TEST_STREAMS: StreamSource[] = [
  { id: "test-hls-1", name: "Test HLS (Apple)", nameAr: "اختبار HLS", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: ["1080p", "720p", "480p", "360p"] },
  { id: "test-hls-2", name: "Test HLS (Mux)", nameAr: "اختبار HLS 2", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: ["720p", "480p"] },
  { id: "test-hls-3", name: "Big Buck Bunny", nameAr: "بث تجريبي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: ["1080p"] },
];

export const FALLBACK_CHANNELS: Channel[] = [
  {
    id: "ch1",
    name: "beIN Sports HD 1",
    nameAr: "بي إن سبورت HD 1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/BeIN_Sports_Logo_2015.svg/1200px-BeIN_Sports_Logo_2015.svg.png",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s1", name: "Test Stream 1", nameAr: "بث تجريبي 1", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["1080p", "720p", "480p"] },
      { id: "s1b", name: "Test Stream 2", nameAr: "بث تجريبي 2", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["720p", "480p"] },
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
      { id: "s2", name: "Test HLS", nameAr: "بث تجريبي HLS", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "" },
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
      { id: "s3", name: "Main Stream", nameAr: "البث الرئيسي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["1080p", "720p"] },
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
      { id: "s4", name: "Test Stream", nameAr: "بث تجريبي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["1080p", "720p", "480p", "360p"] },
      { id: "s4b", name: "Backup", nameAr: "احتياطي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "" },
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
      { id: "s5", name: "Main Stream", nameAr: "البث الرئيسي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["1080p", "720p", "480p"] },
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
      { id: "s6", name: "Test HLS", nameAr: "بث تجريبي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["720p", "480p"] },
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
      { id: "s7", name: "Test HLS", nameAr: "بث تجريبي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["1080p", "720p"] },
    ],
    active: true,
    isFree: true,
    country: "Middle East",
    countryAr: "الشرق الأوسط",
  },
  {
    id: "ch8",
    name: "FIFA+ Test",
    nameAr: "تجربة FIFA+",
    logo: "",
    category: "sports",
    categoryAr: "رياضية",
    streams: [
      { id: "s8", name: "Test HLS", nameAr: "بث تجريبي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "", quality: ["1080p", "720p", "480p"] },
      { id: "s8b", name: "Backup", nameAr: "احتياطي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "" },
    ],
    active: true,
    isFree: true,
    country: "International",
    countryAr: "عالمي",
  },
];

export const FALLBACK_MATCH_STREAMS: MatchStream[] = [
  {
    id: "ms1",
    matchId: "m1",
    title: "Manchester Derby - Live",
    titleAr: "ديربي مانشستر - مباشر",
    sources: [
      { id: "ms1s1", name: "HD Stream", nameAr: "بث عالي الجودة", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: ["1080p", "720p"] },
      { id: "ms1s2", name: "SD Stream", nameAr: "بث عادي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: ["480p", "360p"] },
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
      { id: "ms2s1", name: "HD Stream", nameAr: "بث عالي الجودة", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: ["1080p", "720p"] },
      { id: "ms2s2", name: "Backup", nameAr: "بث احتياطي", type: "hls", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: ["720p", "480p"] },
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

export function getProxySourceUrl(source: StreamSource): string {
  if (typeof window === "undefined") return source.url;
  try {
    const raw = localStorage.getItem("football_world_proxy");
    if (!raw) return source.url;
    const config = JSON.parse(raw);
    if (!config.enabled || !config.vpsHost) return source.url;
    const base = `https://${config.vpsHost}`;
    if (config.proxyType === "stream-share") {
      return `${base}/stream/${source.id}`;
    }
    return `${base}/hls/${source.id}/playlist.m3u8`;
  } catch {
    return source.url;
  }
}

export function applyProxyToChannels(channels: Channel[]): Channel[] {
  if (typeof window === "undefined") return channels;
  try {
    const raw = localStorage.getItem("football_world_proxy");
    if (!raw) return channels;
    const config = JSON.parse(raw);
    if (!config.enabled || !config.vpsHost) return channels;

    return channels.map((ch) => ({
      ...ch,
      streams: ch.streams.map((s) => ({
        ...s,
        viaProxy: true,
        url: getProxySourceUrl(s),
      })),
    }));
  } catch {
    return channels;
  }
}

export function getChannelsWithProxy(): Channel[] {
  const channels = getChannels();
  return applyProxyToChannels(channels);
}
