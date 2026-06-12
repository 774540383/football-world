#!/bin/bash
# =============================================
# Football World - VPS Proxy Restreamer Setup
# Optimized v2 - Multi-source, Caching, Monitoring
# =============================================
# Run: chmod +x setup.sh && ./setup.sh
# =============================================

set -e

echo "========================================"
echo "  Football World Proxy Restreamer Setup"
echo "========================================"

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

PROXY_PORT="${PROXY_PORT:-8085}"
PROXY_USERNAME="${PROXY_USERNAME:-admin}"
PROXY_PASSWORD="${PROXY_PASSWORD:-admin123}"
M3U_URL="${M3U_URL:-}"
XTREAM_USER="${XTREAM_USER:-92847429780}"
XTREAM_PASS="${XTREAM_PASS:-92748302883}"
XTREAM_BASE="${XTREAM_BASE:-http://smarts-on.to:2095}"
INSTALL_DIR="${INSTALL_DIR:-/opt/football-world-proxy}"

echo ""
echo "Step 1: Updating system..."
apt update -qq && apt upgrade -y -qq

echo ""
echo "Step 2: Installing Docker + tools..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
fi
if ! docker compose version &> /dev/null 2>&1; then
  apt install -y docker-compose-plugin
fi

echo ""
echo "Step 3: Creating proxy directory..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR/data"
mkdir -p "$INSTALL_DIR/cache"
mkdir -p "$INSTALL_DIR/nginx"
mkdir -p "$INSTALL_DIR/logs"
cd "$INSTALL_DIR"

echo ""
echo "Step 4: Creating custom proxy server..."
cat > server.js << 'SERVERJS'
const express = require("express");
const http = require("http");
const https = require("https");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8085;
const CACHE_TTL = parseInt(process.env.CACHE_TTL || "300", 10);
const MAX_BUFFER = 16 * 1024 * 1024; // 16MB per stream
const BUFFER_SIZE = parseInt(process.env.BUFFER_SIZE || "4194304", 10);

// IPTV config
const XTREAM_BASE = process.env.XTREAM_BASE || "http://smarts-on.to:2095";
const XTREAM_USER = process.env.XTREAM_USER || "";
const XTREAM_PASS = process.env.XTREAM_PASS || "";
const M3U_URL = process.env.M3U_URL || "";

// In-memory stream cache
const streamCache = new Map();
const cacheTimers = new Map();

// Stats
const stats = {
  started: Date.now(),
  channelsLoaded: 0,
  activeStreams: 0,
  totalClients: 0,
  bytesServed: 0,
  cacheHits: 0,
  cacheMisses: 0,
  errors: 0,
};

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

// === Health endpoint ===
app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    ok: true,
    uptime: (Date.now() - stats.started) / 1000,
    channels: stats.channelsLoaded,
    activeStreams: stats.activeStreams,
    activeClients: stats.totalClients,
    bytesServed: stats.bytesServed,
    cacheHits: stats.cacheHits,
    cacheMisses: stats.cacheMisses,
    errors: stats.errors,
    cacheSize: streamCache.size,
    memory: process.memoryUsage(),
  });
});

// === Channels list ===
app.get(["/channels", "/api/channels"], async (req, res) => {
  try {
    // Try loading from Xtream API first
    const xtreamUrl = `${XTREAM_BASE}/player_api.php?username=${XTREAM_USER}&password=${XTREAM_PASS}&action=get_live_streams`;
    const resp = await fetchWithTimeout(xtreamUrl, 10000);
    if (resp && Array.isArray(resp)) {
      stats.channelsLoaded = resp.length;
      return res.json({ channels: resp, total: resp.length, source: "xtream" });
    }

    // Fallback: try M3U
    if (M3U_URL) {
      const m3uResp = await fetchWithTimeout(M3U_URL, 10000);
      if (m3uResp) {
        const channels = parseM3U(m3uResp);
        stats.channelsLoaded = channels.length;
        return res.json({ channels, total: channels.length, source: "m3u" });
      }
    }
    res.json({ channels: [], total: 0, error: "No sources available" });
  } catch (e) {
    stats.errors++;
    res.status(500).json({ error: e.message });
  }
});

// === Categories ===
app.get(["/categories", "/api/categories"], async (req, res) => {
  try {
    const url = `${XTREAM_BASE}/player_api.php?username=${XTREAM_USER}&password=${XTREAM_PASS}&action=get_live_categories`;
    const resp = await fetchWithTimeout(url, 10000);
    res.json(resp || []);
  } catch (e) {
    res.json([]);
  }
});

// === Stream proxy with caching ===
app.get(["/stream", "/api/play/:id"], async (req, res) => {
  const streamId = req.params.id || req.query.id;
  if (!streamId) return res.status(400).json({ error: "Missing stream ID" });

  stats.activeStreams++;
  stats.totalClients++;

  try {
    // Check cache first
    const cached = streamCache.get(streamId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL * 1000) {
      stats.cacheHits++;
      res.setHeader("Content-Type", cached.contentType || "video/mpegts");
      res.setHeader("X-Cache", "HIT");
      return res.send(cached.data);
    }

    stats.cacheMisses++;

    // Fetch from Xtream
    const streamUrl = `${XTREAM_BASE}/live/${XTREAM_USER}/${XTREAM_PASS}/${streamId}.ts`;
    const response = await fetchOriginal(streamUrl);

    if (!response || !response.body) {
      stats.errors++;
      return res.status(502).json({ error: "Failed to fetch stream" });
    }

    // Collect buffer for caching
    const chunks = [];
    let totalBytes = 0;

    for await (const chunk of response.body) {
      chunks.push(chunk);
      totalBytes += chunk.length;
      if (totalBytes > MAX_BUFFER) break; // Cap at 16MB
    }

    const buffer = Buffer.concat(chunks);
    const contentType = response.headers["content-type"] || "video/mpegts";

    // Cache it
    streamCache.set(streamId, {
      data: buffer,
      contentType,
      timestamp: Date.now(),
    });

    // Set TTL for cache entry
    if (cacheTimers.has(streamId)) clearTimeout(cacheTimers.get(streamId));
    cacheTimers.set(streamId, setTimeout(() => {
      streamCache.delete(streamId);
      cacheTimers.delete(streamId);
    }, CACHE_TTL * 1000));

    stats.bytesServed += buffer.length;
    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Cache", "MISS");
    res.send(buffer);
  } catch (e) {
    stats.errors++;
    res.status(502).json({ error: e.message });
  } finally {
    stats.activeStreams--;
  }
});

// === HLS proxy ===
app.get("/hls/:id/playlist.m3u8", async (req, res) => {
  const streamId = req.params.id;
  try {
    const xtreamUrl = `${XTREAM_BASE}/live/${XTREAM_USER}/${XTREAM_PASS}/${streamId}.m3u8`;
    const resp = await fetchWithTimeout(xtreamUrl, 10000, "text");
    if (resp) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.send(resp);
    } else {
      res.status(502).send("#EXTM3U\n#EXTINF:-1,Fallback\nstream?id=" + streamId);
    }
  } catch {
    res.status(502).send("#EXTM3U\n#EXTINF:-1,Error");
  }
});

// === Clear cache ===
app.post(["/reload", "/api/reload", "/api/clear-cache"], (req, res) => {
  streamCache.clear();
  cacheTimers.forEach((t) => clearTimeout(t));
  cacheTimers.clear();
  res.json({ ok: true, cleared: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Football World Proxy running on port ${PORT}`);
  setInterval(() => {
    // Periodic stats log
    const mem = process.memoryUsage();
    console.log(`[stats] channels=${stats.channelsLoaded} streams=${stats.activeStreams} clients=${stats.totalClients} cache=${streamCache.size} mem=${Math.round(mem.rss/1024/1024)}MB`);
  }, 60000);
});

function fetchWithTimeout(url, ms, format = "json") {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.get(url, { timeout: ms }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (format === "json") {
          try { resolve(JSON.parse(data)); } catch { resolve(data); }
        } else {
          resolve(data);
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function fetchOriginal(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, { timeout: 15000 }, (res) => {
      resolve(res);
    }).on("error", reject).on("timeout", function() { this.destroy(); reject(new Error("Timeout")); });
  });
}

function parseM3U(content) {
  const channels = [];
  const lines = content.split("\n");
  let current = {};
  for (const line of lines) {
    if (line.startsWith("#EXTINF:")) {
      const m = line.match(/tvg-id="([^"]*)".*,(.+)/);
      current = { name: m ? m[2].trim() : "Unknown", id: m ? m[1] : "" };
    } else if (line.startsWith("http") && current.name) {
      channels.push({ ...current, url: line.trim() });
      current = {};
    }
  }
  return channels;
}
SERVERJS

echo ""
echo "Step 5: Creating package.json..."
cat > package.json << 'PKGJSON'
{
  "name": "football-world-proxy",
  "version": "2.0.0",
  "private": true,
  "dependencies": {
    "express": "^4.21.0",
    "http-proxy-middleware": "^3.0.3"
  }
}
PKGJSON

echo ""
echo "Step 6: Creating Dockerfile..."
cat > Dockerfile << 'DOCKERFILE'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js .
EXPOSE 8085
CMD ["node", "server.js"]
DOCKERFILE

echo ""
echo "Step 7: Creating Docker Compose configuration..."
cat > docker-compose.yml << 'DOCKERCOMPOSE'
services:
  iptv-proxy:
    build: .
    container_name: iptv-proxy
    restart: unless-stopped
    ports:
      - "${PROXY_PORT}:8085"
    environment:
      - PORT=8085
      - XTREAM_BASE=${XTREAM_BASE}
      - XTREAM_USER=${XTREAM_USER}
      - XTREAM_PASS=${XTREAM_PASS}
      - M3U_URL=${M3U_URL}
      - CACHE_TTL=300
      - BUFFER_SIZE=16777216
      - NODE_ENV=production
    volumes:
      - ./cache:/app/cache
      - ./logs:/app/logs
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 512M

  nginx-cache:
    image: nginx:alpine
    container_name: nginx-cache
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./cache:/var/cache/nginx
    depends_on:
      - iptv-proxy
    deploy:
      resources:
        limits:
          memory: 512M

  # Optional: Prometheus Node Exporter for monitoring
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
    deploy:
      resources:
        limits:
          memory: 128M
DOCKERCOMPOSE

echo ""
echo "Step 8: Creating Nginx cache configuration..."
cat > nginx/nginx.conf << 'NGINXCONF'
events {
  worker_connections 4096;
  multi_accept on;
  use epoll;
}

http {
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=hls_cache:50m max_size=20g inactive=120m use_temp_path=off;
  proxy_cache_path /var/cache/nginx/ts levels=1:2 keys_zone=ts_cache:100m max_size=50g inactive=60m use_temp_path=off;

  upstream proxy_backend {
    server iptv-proxy:8085 max_fails=3 fail_timeout=30s;
    keepalive 64;
  }

  server {
    listen 80;
    server_name _;
    client_max_body_size 100m;
    proxy_buffer_size 128k;
    proxy_buffers 32 128k;
    proxy_busy_buffers_size 256k;
    sendfile on;
    tcp_nopush on;

    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "*" always;

    # Health check
    location /health {
      proxy_pass http://iptv-proxy:8085/health;
      proxy_cache off;
      proxy_read_timeout 5s;
    }

    # Cache TS segments for 1 hour
    location ~ \.ts$ {
      proxy_pass http://iptv-proxy:8085;
      proxy_cache ts_cache;
      proxy_cache_valid 200 1h;
      proxy_cache_use_stale updating error timeout;
      proxy_cache_lock on;
      proxy_cache_background_update on;
      proxy_read_timeout 30s;
      add_header X-Cache-Status $upstream_cache_status;
    }

    # Don't cache playlists
    location ~ \.m3u8$ {
      proxy_pass http://iptv-proxy:8085;
      proxy_cache off;
      proxy_read_timeout 15s;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # API endpoints - cache channels list for 5 min
    location /api/ {
      proxy_pass http://iptv-proxy:8085;
      proxy_cache hls_cache;
      proxy_cache_valid 200 5m;
      proxy_read_timeout 15s;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # Stream proxy - no cache (handled by app)
    location ~ ^/(stream|hls)/ {
      proxy_pass http://iptv-proxy:8085;
      proxy_cache off;
      proxy_read_timeout 120s;
      proxy_buffering off;
      proxy_request_buffering off;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    # Default
    location / {
      proxy_pass http://iptv-proxy:8085;
      proxy_cache off;
      proxy_read_timeout 30s;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
}
NGINXCONF

echo ""
echo "Step 9: Creating environment file..."
cat > .env << ENVFILE
PROXY_PORT=${PROXY_PORT}
PROXY_USERNAME=${PROXY_USERNAME}
PROXY_PASSWORD=${PROXY_PASSWORD}
M3U_URL=${M3U_URL}
XTREAM_BASE=${XTREAM_BASE}
XTREAM_USER=${XTREAM_USER}
XTREAM_PASS=${XTREAM_PASS}
ENVFILE

echo ""
echo "Step 10: Building and starting services..."
docker compose build --no-cache
docker compose up -d

echo ""
echo "Step 11: Setting up monitoring (daily reboot + log rotate)..."
cat > /etc/cron.d/football-world-proxy << CRON
# Rotate proxy logs daily
0 4 * * * root docker exec iptv-proxy sh -c "kill -USR1 1" >/dev/null 2>&1
# Health check every 5 minutes
*/5 * * * * root curl -s http://localhost:8085/health >/dev/null 2>&1 || docker compose -f ${INSTALL_DIR}/docker-compose.yml restart
# Clear old cache weekly
0 3 * * 0 root curl -s -X POST http://localhost:8085/api/clear-cache >/dev/null 2>&1
CRON

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_VPS_IP")
echo "Proxy URL:        https://${PUBLIC_IP}"
echo "Health Check:     https://${PUBLIC_IP}/health"
echo "Channels API:     https://${PUBLIC_IP}/api/channels"
echo ""
echo "To check logs:    docker compose -f ${INSTALL_DIR}/docker-compose.yml logs -f"
echo "To restart:       docker compose -f ${INSTALL_DIR}/docker-compose.yml restart"
echo "To stop:          docker compose -f ${INSTALL_DIR}/docker-compose.yml down"
echo ""
echo "⚡ Optimization tips:"
echo "  - Increase BUFFER_SIZE in .env for better caching (default 16MB)"
echo "  - Add more IPTV sources in server.js for redundancy"
echo "  - Set up Cloudflare CDN for global caching"
echo ""
