export type StreamType = hls | youtube | direct | embed | dash;
export type ChannelCategory = sports | news | entertainment | movies;

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
 status: online | offline | degraded;
 latency: number;
 lastChecked: number;
}

export interface IPTVChannel {
 id: number;
 name: string;
 icon: string;
 url: string;
 category: string;
}

const VPS_PROXY_HOST = 31.97.47.30;
const VPS_PROXY_PORT = 8085;

export function getVpsProxyBaseUrl(): string {
 return \http://\:\\;
}

function mapCategory(catId: string): ChannelCategory {
 const id = parseInt(catId) || 0;
 if (id === 377 || id === 378) return sports;
 if (id >= 100 && id < 200) return news;
 if (id >= 200 && id < 300) return entertainment;
 if (id >= 378) return sports;
 return entertainment;
}

function streamTypeFromUrl(url: string): StreamType {
 if (url.endsWith(.m3u8)) return hls;
 if (url.endsWith(.mpd)) return dash;
 if (url.includes(youtube.com) || url.includes(youtu.be)) return youtube;
 if (url.endsWith(.ts) || url.includes(/live/)) return direct;
 return hls;
}

export async function fetchIPTVChannels(search?: string): Promise<IPTVChannel[]> {
 try {
 const base = getVpsProxyBaseUrl();
 const url = search ? \\/channels?q=\\ : \\/channels\;
 const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
 if (!res.ok) throw new Error(Failed to fetch channels);
 const data = await res.json();
 return data.channels || [];
 } catch {
 return [];
 }
}

export async function fetchIPTVChannel(id: number): Promise<IPTVChannel | null> {
 const channels = await fetchIPTVChannels();
 return channels.find(c => c.id === id) || null;
}

export function iptvToChannel(iptv: IPTVChannel): Channel {
 const proxyUrl = \\/stream?id=\\;
 return {
 id: \iptv-\\,
 name: iptv.name.replace(/_/g,  ),
 nameAr: iptv.name.replace(/_/g,  ),
 logo: iptv.icon || ,
 category: mapCategory(iptv.category),
 categoryAr: رياضية,
 streams: [{
 id: \s-\\,
 name: iptv.name.replace(/_/g,  ),
 nameAr: iptv.name.replace(/_/g,  ),
 type: streamTypeFromUrl(iptv.url),
 url: proxyUrl,
 viaProxy: true,
 quality: [HD],
 }],
 active: true,
 isFree: true,
 country: ,
 countryAr: ,
 };
}

export const PUBLIC_TEST_STREAMS: StreamSource[] = [
 { id: test-hls-1, name: Test HLS (Apple), nameAr: اختبار HLS, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, quality: [1080p, 720p, 480p, 360p] },
 { id: test-hls-2, name: Test HLS (Mux), nameAr: اختبار HLS 2, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, quality: [720p, 480p] },
 { id: test-hls-3, name: Big Buck Bunny, nameAr: بث تجريبي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, quality: [1080p] },
];

export const FALLBACK_CHANNELS: Channel[] = [
 {
 id: ch1,
 name: beIN Sports HD 1,
 nameAr: بي إن سبورت HD 1,
 logo: https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/BeIN_Sports_Logo_2015.svg/1200px-BeIN_Sports_Logo_2015.svg.png,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s1, name: Test Stream 1, nameAr: بث تجريبي 1, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [1080p, 720p, 480p] },
 { id: s1b, name: Test Stream 2, nameAr: بث تجريبي 2, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [720p, 480p] },
 ],
 active: true,
 isFree: false,
 country: Qatar,
 countryAr: قطر,
 },
 {
 id: ch2,
 name: Al Kass Sports,
 nameAr: الكأس الرياضية,
 logo: https://upload.wikimedia.org/wikipedia/ar/thumb/7/7b/Alkass_logo.svg/1200px-Alkass_logo.svg.png,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s2, name: Test HLS, nameAr: بث تجريبي HLS, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster:  },
 ],
 active: true,
 isFree: true,
 country: Qatar,
 countryAr: قطر,
 },
 {
 id: ch3,
 name: SSC Sports,
 nameAr: SSC الرياضية,
 logo: https://upload.wikimedia.org/wikipedia/commons/0/0b/Saudi_Sports_Company_%28SSC%29_logo.png,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s3, name: Main Stream, nameAr: البث الرئيسي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [1080p, 720p] },
 ],
 active: true,
 isFree: false,
 country: Saudi Arabia,
 countryAr: المملكة العربية السعودية,
 },
 {
 id: ch4,
 name: Abu Dhabi Sports,
 nameAr: أبو ظبي الرياضية,
 logo: https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Abu_Dhabi_Sports_Channel_logo.svg/1200px-Abu_Dhabi_Sports_Channel_logo.svg.png,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s4, name: Test Stream, nameAr: بث تجريبي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [1080p, 720p, 480p, 360p] },
 { id: s4b, name: Backup, nameAr: احتياطي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster:  },
 ],
 active: true,
 isFree: true,
 country: UAE,
 countryAr: الإمارات العربية المتحدة,
 },
 {
 id: ch5,
 name: Sky Sports,
 nameAr: سكاي سبورتس,
 logo: https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sky_Sports_logo.svg/1200px-Sky_Sports_logo.svg.png,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s5, name: Main Stream, nameAr: البث الرئيسي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [1080p, 720p, 480p] },
 ],
 active: true,
 isFree: false,
 country: UK,
 countryAr: المملكة المتحدة,
 },
 {
 id: ch6,
 name: ESPN,
 nameAr: إي إس بي إن,
 logo: https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/1200px-ESPN_wordmark.svg.png,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s6, name: Test HLS, nameAr: بث تجريبي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [720p, 480p] },
 ],
 active: true,
 isFree: false,
 country: USA,
 countryAr: الولايات المتحدة,
 },
 {
 id: ch7,
 name: MBC Sports,
 nameAr: MBC الرياضية,
 logo: https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/MBC_Group_logo.svg/1200px-MBC_Group_logo.svg.png,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s7, name: Test HLS, nameAr: بث تجريبي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [1080p, 720p] },
 ],
 active: true,
 isFree: true,
 country: Middle East,
 countryAr: الشرق الأوسط,
 },
 {
 id: ch8,
 name: FIFA+ Test,
 nameAr: تجربة FIFA+,
 logo: ,
 category: sports,
 categoryAr: رياضية,
 streams: [
 { id: s8, name: Test HLS, nameAr: بث تجريبي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster: , quality: [1080p, 720p, 480p] },
 { id: s8b, name: Backup, nameAr: احتياطي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, poster:  },
 ],
 active: true,
 isFree: true,
 country: International,
 countryAr: عالمي,
 },
];

export const FALLBACK_MATCH_STREAMS: MatchStream[] = [
 {
 id: ms1,
 matchId: m1,
 title: Manchester Derby - Live,
 titleAr: ديربي مانشستر - مباشر,
 sources: [
 { id: ms1s1, name: HD Stream, nameAr: بث عالي الجودة, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, quality: [1080p, 720p] },
 { id: ms1s2, name: SD Stream, nameAr: بث عادي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, quality: [480p, 360p] },
 ],
 isLive: true,
 language: Arabic,
 languageAr: العربية,
 isFeatured: true,
 autoFailover: true,
 },
 {
 id: ms2,
 matchId: m3,
 title: El Clasico - Live,
 titleAr: الكلاسيكو - مباشر,
 sources: [
 { id: ms2s1, name: HD Stream, nameAr: بث عالي الجودة, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, quality: [1080p, 720p] },
 { id: ms2s2, name: Backup, nameAr: بث احتياطي, type: hls, url: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8, quality: [720p, 480p] },
 ],
 isLive: true,
 language: Arabic,
 languageAr: العربية,
 isFeatured: true,
 autoFailover: true,
 },
];

export const IPTV_SAMPLE_URLS = [
 { name: Free IPTV (Sample), url: https://example.com/free.m3u, type: m3u },
 { name: IPTV-Org (Sample), url: https://example.com/iptv.m3u, type: m3u },
];

export function getChannels(): Channel[] {
 if (typeof window !== undefined) {
 try {
 const raw = localStorage.getItem(football_world_channels);
 if (raw) return JSON.parse(raw);
 } catch { /* ignore */ }
 }
 return FALLBACK_CHANNELS;
}

export function saveChannels(channels: Channel[]) {
 if (typeof window !== undefined) {
 localStorage.setItem(football_world_channels, JSON.stringify(channels));
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
 if (typeof window === undefined) return source.url;
 try {
 const raw = localStorage.getItem(football_world_proxy);
 if (!raw) return source.url;
 const config = JSON.parse(raw);
 if (!config.enabled || !config.vpsHost) return source.url;
 return \http://\:\/stream?id=\\;
 } catch {
 return source.url;
 }
}

export function applyProxyToChannels(channels: Channel[]): Channel[] {
 if (typeof window === undefined) return channels;
 try {
 const raw = localStorage.getItem(football_world_proxy);
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
