#!/bin/bash
# =============================================
# Football World - VPS Proxy Restreamer Setup
# =============================================
# Run: chmod +x setup.sh && ./setup.sh
# =============================================

set -e

echo "========================================"
echo "  Football World Proxy Restreamer Setup"
echo "========================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

# Configurable variables
PROXY_PORT="${PROXY_PORT:-8085}"
PROXY_USERNAME="${PROXY_USERNAME:-admin}"
PROXY_PASSWORD="${PROXY_PASSWORD:-admin123}"
M3U_URL="${M3U_URL:-}"
INSTALL_DIR="${INSTALL_DIR:-/opt/football-world-proxy}"

echo ""
echo "Step 1: Updating system..."
apt update -qq && apt upgrade -y -qq

echo ""
echo "Step 2: Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
else
  echo "Docker already installed"
fi

echo ""
echo "Step 3: Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
  apt install -y docker-compose-plugin
fi

echo ""
echo "Step 4: Creating proxy directory..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR/data"
mkdir -p "$INSTALL_DIR/cache"
mkdir -p "$INSTALL_DIR/nginx"
cd "$INSTALL_DIR"

echo ""
echo "Step 5: Creating Docker Compose configuration..."
cat > docker-compose.yml << 'DOCKERCOMPOSE'
services:
  m3u-proxy:
    image: m3ue/m3u-proxy:latest
    container_name: m3u-proxy
    restart: unless-stopped
    ports:
      - "${PROXY_PORT}:8085"
    environment:
      - M3U_URL=${M3U_URL}
      - PROXY_USERNAME=${PROXY_USERNAME:-admin}
      - PROXY_PASSWORD=${PROXY_PASSWORD:-admin123}
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
      - m3u-proxy
DOCKERCOMPOSE

echo ""
echo "Step 6: Creating Nginx cache configuration..."
cat > nginx/nginx.conf << 'NGINXCONF'
events {
  worker_connections 1024;
}

http {
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=hls_cache:10m max_size=10g inactive=60m use_temp_path=off;

  server {
    listen 80;
    server_name _;

    # CORS headers
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
    add_header Access-Control-Allow-Headers "*";

    # Cache HLS segments (.ts) for 1 hour
    location ~ \.ts$ {
      proxy_pass http://m3u-proxy:8085;
      proxy_cache hls_cache;
      proxy_cache_valid 200 1h;
      proxy_cache_use_stale updating error timeout;
      proxy_cache_lock on;
      proxy_cache_background_update on;
      add_header X-Cache-Status $upstream_cache_status;

      # CORS
      add_header Access-Control-Allow-Origin "*";
    }

    # Don't cache playlists (always fresh)
    location ~ \.m3u8$ {
      proxy_pass http://m3u-proxy:8085;
      proxy_cache off;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;

      # CORS
      add_header Access-Control-Allow-Origin "*";
    }

    location / {
      proxy_pass http://m3u-proxy:8085;
      proxy_cache off;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;

      # CORS
      add_header Access-Control-Allow-Origin "*";
    }

    # Health check endpoint
    location /health {
      return 200 "OK";
      add_header Content-Type text/plain;
    }
  }
}
NGINXCONF

echo ""
echo "Step 7: Creating environment file..."
cat > .env << ENVFILE
PROXY_PORT=${PROXY_PORT}
PROXY_USERNAME=${PROXY_USERNAME}
PROXY_PASSWORD=${PROXY_PASSWORD}
M3U_URL=${M3U_URL}
ENVFILE

echo ""
echo "Step 8: Starting services..."
docker compose pull
docker compose up -d

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Proxy URL:        http://$(curl -s ifconfig.me):${PROXY_PORT}"
echo "Admin Username:   ${PROXY_USERNAME}"
echo "Admin Password:   ${PROXY_PASSWORD}"
echo "Health Check:     http://$(curl -s ifconfig.me)/health"
echo ""
echo "Channel List:     http://$(curl -s ifconfig.me):${PROXY_PORT}/iptv.m3u?username=${PROXY_USERNAME}&password=${PROXY_PASSWORD}"
echo ""
echo "To check logs:    docker compose -f $INSTALL_DIR/docker-compose.yml logs -f"
echo "To restart:       docker compose -f $INSTALL_DIR/docker-compose.yml restart"
echo "To stop:          docker compose -f $INSTALL_DIR/docker-compose.yml down"
echo ""
echo "Next: Add this proxy to your website admin panel at /admin/proxy"
echo ""
