import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.API_ENCRYPTION_KEY || "football-world-default-key-change-me";

export interface ApiKeyEntry {
  id: string;
  service: string;
  name: string;
  key: string;
  baseUrl?: string;
  active: boolean;
  createdAt: string;
  lastUsed: string | null;
}

export interface ServiceDefinition {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  baseUrl: string;
  fields: { key: string; label: string; labelAr: string; type: "text" | "password" }[];
}

export const AVAILABLE_SERVICES: ServiceDefinition[] = [
  {
    id: "api-football",
    name: "API-Football",
    nameAr: "API-Football",
    description: "Football data from api-sports.io (matches, teams, players, standings)",
    descriptionAr: "بيانات كرة القدم من api-sports.io (مباريات، فرق، لاعبين، ترتيب)",
    baseUrl: "https://v3.football.api-sports.io",
    fields: [
      { key: "API_FOOTBALL_KEY", label: "API Key", labelAr: "مفتاح API", type: "password" },
    ],
  },
  {
    id: "football-data-org",
    name: "Football-Data.org",
    nameAr: "Football-Data.org",
    description: "Competitions, matches, and standings from football-data.org",
    descriptionAr: "بطولات، مباريات وترتيب من football-data.org",
    baseUrl: "https://api.football-data.org/v4",
    fields: [
      { key: "FOOTBALL_DATA_ORG_KEY", label: "API Key", labelAr: "مفتاح API", type: "password" },
    ],
  },
  {
    id: "thesportsdb",
    name: "TheSportsDB",
    nameAr: "TheSportsDB",
    description: "Free sports data including images, videos, and event info",
    descriptionAr: "بيانات رياضية مجانية تشمل الصور والفيديو ومعلومات الأحداث",
    baseUrl: "https://www.thesportsdb.com/api/v1/json/3",
    fields: [
      { key: "SPORTSDB_KEY", label: "API Key", labelAr: "مفتاح API", type: "password" },
    ],
  },
  {
    id: "openligadb",
    name: "OpenLigaDB",
    nameAr: "OpenLigaDB",
    description: "Free German football league data (no API key needed)",
    descriptionAr: "بيانات كرة القدم الألمانية مجانية (بدون مفتاح API)",
    baseUrl: "https://api.openligadb.de",
    fields: [],
  },
];

function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function getStorageKey(): string {
  return "football_world_api_keys";
}

export function loadApiKeys(): ApiKeyEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return [];
    const decrypted = decrypt(raw);
    return JSON.parse(decrypted);
  } catch {
    return [];
  }
}

export function saveApiKeys(keys: ApiKeyEntry[]): void {
  if (typeof window === "undefined") return;
  const encrypted = encrypt(JSON.stringify(keys));
  localStorage.setItem(getStorageKey(), encrypted);
}

export function addApiKey(entry: Omit<ApiKeyEntry, "id" | "createdAt" | "lastUsed">): ApiKeyEntry[] {
  const keys = loadApiKeys();
  const newEntry: ApiKeyEntry = {
    ...entry,
    id: crypto.randomUUID?.() || Date.now().toString(36),
    createdAt: new Date().toISOString(),
    lastUsed: null,
  };
  keys.push(newEntry);
  saveApiKeys(keys);
  return keys;
}

export function updateApiKey(id: string, updates: Partial<ApiKeyEntry>): ApiKeyEntry[] {
  const keys = loadApiKeys();
  const idx = keys.findIndex((k) => k.id === id);
  if (idx === -1) return keys;
  keys[idx] = { ...keys[idx], ...updates };
  saveApiKeys(keys);
  return keys;
}

export function deleteApiKey(id: string): ApiKeyEntry[] {
  const keys = loadApiKeys();
  const filtered = keys.filter((k) => k.id !== id);
  saveApiKeys(filtered);
  return filtered;
}

export function getApiKeyByService(service: string): string | null {
  const keys = loadApiKeys();
  const entry = keys.find((k) => k.service === service && k.active);
  if (entry) {
    updateApiKey(entry.id, { lastUsed: new Date().toISOString() });
    const envKey = process.env[`API_KEY_${service.toUpperCase().replace(/-/g, "_")}`];
    return envKey || entry.key || null;
  }
  const envKey = process.env[`API_KEY_${service.toUpperCase().replace(/-/g, "_")}`];
  return envKey || null;
}

export function isApiConfigured(service: string): boolean {
  const envVar = `API_KEY_${service.toUpperCase().replace(/-/g, "_")}`;
  if (process.env[envVar]) return true;
  const keys = loadApiKeys();
  return keys.some((k) => k.service === service && k.active);
}
