export interface ProxyConfig {
  enabled: boolean;
  vpsHost: string;
  vpsPort: number;
  proxyType: "m3u-proxy" | "stream-share" | "custom";
  m3uUrl: string;
  username: string;
  password: string;
  xtreamBaseUrl?: string;
  xtreamUsername?: string;
  xtreamPassword?: string;
  apiKey: string;
  healthEndpoint: string;
  connected: boolean;
  lastHealthCheck: number;
  stats: {
    activeConnections: number;
    totalStreams: number;
    bandwidthUsage: string;
    uptime: string;
  };
}

export const DEFAULT_PROXY_CONFIG: ProxyConfig = {
  enabled: true,
  vpsHost: "srv1675350.hstgr.cloud",
  vpsPort: 443,
  proxyType: "stream-share",
  m3uUrl: "https://srv1675350.hstgr.cloud/iptv.m3u",
  username: "admin",
  password: "admin123",
  xtreamBaseUrl: "https://srv1675350.hstgr.cloud",
  xtreamUsername: "92847429780",
  xtreamPassword: "92748302883",
  apiKey: "",
  healthEndpoint: "/health",
  connected: false,
  lastHealthCheck: 0,
  stats: {
    activeConnections: 0,
    totalStreams: 8099,
    bandwidthUsage: "0 MB",
    uptime: "0m",
  },
};

export const LOAD_BALANCING_STRATEGIES = [
  { id: "round-robin", name: "Round Robin", nameAr: "تناوبي" },
  { id: "least-connections", name: "Least Connections", nameAr: "أقل اتصال" },
  { id: "geolocation", name: "Geolocation", nameAr: "الموقع الجغرافي" },
] as const;

export function getProxyConfig(): ProxyConfig {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("football_world_proxy");
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
  }
  return DEFAULT_PROXY_CONFIG;
}

export function saveProxyConfig(config: ProxyConfig) {
  if (typeof window !== "undefined") {
    localStorage.setItem("football_world_proxy", JSON.stringify(config));
  }
}

export function buildStreamUrl(channelId: string, config: ProxyConfig): string {
  if (!config.enabled || !config.vpsHost) return "";
  const base = `https://${config.vpsHost}`;
  if (config.proxyType === "stream-share") {
    return `${base}/stream/${channelId}`;
  }
  return `${base}/hls/${channelId}/playlist.m3u8`;
}

export const PROXY_SETUP_COMMANDS = `# === VPS Proxy Setup Script ===
# Run on fresh Ubuntu 22.04+ VPS

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose
sudo apt install -y docker-compose-plugin

# 4. Create proxy directory
mkdir -p ~/proxy && cd ~/proxy

# 5. Create docker-compose.yml (paste from below)
# 6. Start proxy
docker compose up -d

# 7. Check logs
docker compose logs -f

# Your proxy is now running!
# Admin UI: http://YOUR_VPS_IP:8085
# Default login: admin / admin123`;

export const DOCKER_COMPOSE_YML = `version: "3.8"

services:
  m3u-proxy:
    image: m3ue/m3u-proxy:latest
    container_name: m3u-proxy
    restart: unless-stopped
    ports:
      - "8085:8085"
    environment:
      - M3U_URL=\${M3U_URL}
      - PROXY_USERNAME=\${PROXY_USERNAME:-admin}
      - PROXY_PASSWORD=\${PROXY_PASSWORD:-admin123}
      - PROXY_PORT=8085
      - CACHE_ENABLED=true
      - CACHE_TTL=300
      - MAX_CONNECTIONS_PER_STREAM=0
      - ENABLE_STATS=true
    volumes:
      - ./data:/app/data
      - ./cache:/app/cache
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Optional: Nginx reverse proxy with caching
  nginx-cache:
    image: nginx:alpine
    container_name: nginx-cache
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./cache:/var/cache/nginx
    depends_on:
      - m3u-proxy`;

export const NGINX_CONF = `events {
  worker_connections 1024;
}

http {
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=hls_cache:10m max_size=10g inactive=60m;

  server {
    listen 80;
    server_name _;

    # Cache HLS segments (.ts) for 1 hour
    location ~ \\.ts$ {
      proxy_pass http://m3u-proxy:8085;
      proxy_cache hls_cache;
      proxy_cache_valid 200 1h;
      proxy_cache_use_stale updating error timeout;
      proxy_cache_lock on;
      add_header X-Cache-Status $upstream_cache_status;
    }

    # Don't cache playlists (always fresh)
    location ~ \\.m3u8$ {
      proxy_pass http://m3u-proxy:8085;
      proxy_cache off;
    }

    location / {
      proxy_pass http://m3u-proxy:8085;
      proxy_cache off;
    }
  }
}`;
