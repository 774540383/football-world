"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "plyr/dist/plyr.css";
import { Loader2, AlertTriangle, RefreshCw, Wifi, WifiOff, Layers, Server, Signal, SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import type { StreamSource, ConnectionQuality } from "@/lib/streaming";
import { HLS_LIVE_CONFIG, estimateConnectionQuality } from "@/lib/streaming";

interface VideoPlayerProps {
  sources: StreamSource[];
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  onError?: () => void;
}

type PlayerState = "loading" | "playing" | "paused" | "error" | "stalled";

export function VideoPlayer({ sources, poster, className = "", autoPlay = true, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const plyrRef = useRef<any>(null);
  const hlsRef = useRef<any>(null);
  const mpegtsRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recoveryAttemptRef = useRef(0);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSourceIdx, setCurrentSourceIdx] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>("unknown");
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const [bufferHealth, setBufferHealth] = useState(0);
  const [currentBitrate, setCurrentBitrate] = useState(0);

  const maxRetries = Math.max(sources.length * 2, 6);
  const currentSource = sources[currentSourceIdx] || sources[0];

  const tryNextSource = useCallback(() => {
    if (currentSourceIdx < sources.length - 1) {
      setCurrentSourceIdx((i) => i + 1);
      setError(null);
      setLoading(true);
      setPlayerState("loading");
      setRetryCount((c) => c + 1);
    } else if (retryCount < maxRetries) {
      setCurrentSourceIdx(0);
      setError(null);
      setLoading(true);
      setPlayerState("loading");
      setRetryCount((c) => c + 1);
    } else {
      setError("جميع مصادر البث غير متاحة حالياً. حاول مرة أخرى لاحقاً.");
      setLoading(false);
      setPlayerState("error");
      onError?.();
    }
  }, [currentSourceIdx, sources.length, retryCount, maxRetries, onError]);

  const startStallTimer = useCallback(() => {
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    stallTimerRef.current = setTimeout(() => {
      if (playerState === "playing" || playerState === "loading") {
        const video = videoRef.current;
        if (video && video.readyState < 3 && !video.paused) {
          recoveryAttemptRef.current += 1;
          if (recoveryAttemptRef.current > 3) {
            tryNextSource();
          } else {
            video.currentTime = video.currentTime;
          }
        }
      }
    }, 10000);
  }, [playerState, tryNextSource]);

  const cleanup = useCallback(() => {
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (mpegtsRef.current) { mpegtsRef.current.destroy(); mpegtsRef.current = null; }
    if (plyrRef.current) { plyrRef.current.destroy(); plyrRef.current = null; }
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    if (stallTimerRef.current) { clearTimeout(stallTimerRef.current); stallTimerRef.current = null; }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSource) return;

    let destroyed = false;
    setConnectionQuality(estimateConnectionQuality());

    async function initPlayer() {
      if (destroyed) return;
      cleanup();
      setLoading(true);
      setError(null);
      setPlayerState("loading");
      recoveryAttemptRef.current = 0;

      if (currentSource.type === "youtube") {
        setLoading(false);
        setPlayerState("playing");
        return;
      }

      if (currentSource.type === "embed") {
        setLoading(false);
        setPlayerState("playing");
        return;
      }

      if (currentSource.type === "ts") {
        try {
          const mpegts = (await import("mpegts.js")).default;
          if (mpegts.isSupported()) {
            const player = mpegts.createPlayer({
              type: "mse",
              url: currentSource.url,
              isLive: true,
              enableWorker: true,
            });
            mpegtsRef.current = player;
            player.attachMediaElement(video);
            player.load();
            player.play();

            player.on(mpegts.Events.LOADING_COMPLETE, () => { if (!destroyed) { setLoading(false); setPlayerState("playing"); } });
            player.on(mpegts.Events.ERROR, () => { if (!destroyed) tryNextSource(); });

            const Plyr = (await import("plyr")).default;
            plyrRef.current = new Plyr(video, {
              controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
            });
            return;
          }
        } catch { /* fallthrough */ }
      }

      try {
        if (currentSource.type === "hls" || currentSource.type === "ts") {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            const hls = new Hls({
              ...HLS_LIVE_CONFIG,
              startLevel: connectionQuality === "low" ? 2 : -1,
            });
            hlsRef.current = hls;

            hls.loadSource(currentSource.url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (!destroyed) {
                setLoading(false);
                setPlayerState("playing");
                if (autoPlay) video.play().catch(() => {});
              }
            });

            hls.on(Hls.Events.BUFFER_APPENDED, () => {
              if (!destroyed) {
                const hl = hls as any;
                const bufLen = hl.mediaBuffer?.length || 0;
                setBufferHealth(Math.round(bufLen));
              }
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_event: any, data: any) => {
              if (!destroyed && data.level >= 0) {
                const level = hls.levels[data.level];
                if (level) {
                  setCurrentBitrate(level.bitrate);
                  setCurrentSourceIdx(0);
                }
              }
            });

            hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
              if (destroyed) return;
              if (data.fatal) {
                hls.destroy();
                hlsRef.current = null;
                tryNextSource();
              }
            });

            hls.on(Hls.Events.FRAG_LOADING, () => {
              if (!destroyed) startStallTimer();
            });

            const Plyr = (await import("plyr")).default;
            plyrRef.current = new Plyr(video, {
              controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
              settings: ["quality", "speed"],
              quality: { default: 720, options: [1080, 720, 480, 360] },
            });
            return;
          }
        }

        video.src = currentSource.url;
        video.addEventListener("loadeddata", () => {
          if (!destroyed) { setLoading(false); setPlayerState("playing"); if (autoPlay) video.play().catch(() => {}); }
        });
        video.addEventListener("error", () => { if (!destroyed) tryNextSource(); });
        video.addEventListener("stalled", () => { if (!destroyed) startStallTimer(); });

        const Plyr = (await import("plyr")).default;
        plyrRef.current = new Plyr(video, {
          controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
        });
      } catch {
        if (!destroyed) tryNextSource();
      }
    }

    initPlayer();

    return () => {
      destroyed = true;
      cleanup();
    };
  }, [currentSource?.url, currentSource?.type, autoPlay, tryNextSource]);

  if (!currentSource) {
    return (
      <div className={`flex items-center justify-center h-64 bg-muted rounded-xl ${className}`}>
        <div className="text-center">
          <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">لا توجد مصادر بث متاحة</p>
        </div>
      </div>
    );
  }

  if (currentSource.type === "youtube") {
    const videoId = extractYoutubeId(currentSource.url);
    if (!videoId) {
      return <div className={`flex items-center justify-center h-64 bg-muted rounded-xl ${className}`}>
        <p className="text-muted-foreground">رابط يوتيوب غير صحيح</p>
      </div>;
    }
    return (
      <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (currentSource.type === "embed") {
    return (
      <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
        <iframe
          src={currentSource.url}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-white mt-2">جاري تحميل البث...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center p-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-white font-bold mb-2">عذراً، البث غير متاح</p>
            <p className="text-sm text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => { setRetryCount(0); setCurrentSourceIdx(0); setError(null); setLoading(true); setPlayerState("loading"); }}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      <video ref={videoRef} className="w-full h-full" poster={poster || currentSource.poster} playsInline controls={false} />

      {/* Status badges */}
      <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-1">
        {currentSource.viaProxy && (
          <span className="px-2 py-1 bg-blue-500/90 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <Server className="w-3 h-3" />
            Proxy
          </span>
        )}
        {playerState === "playing" && (
          <span className="px-2 py-1 bg-green-500/90 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <Signal className="w-3 h-3" />
            مباشر
          </span>
        )}
        {playerState === "stalled" && (
          <span className="px-2 py-1 bg-yellow-500/90 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            تحميل...
          </span>
        )}
        {connectionQuality === "low" && (
          <span className="px-2 py-1 bg-yellow-600/90 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <SignalLow className="w-3 h-3" />
            ضعيف
          </span>
        )}
        {connectionQuality === "medium" && (
          <span className="px-2 py-1 bg-yellow-500/90 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <SignalMedium className="w-3 h-3" />
            متوسط
          </span>
        )}
        {connectionQuality === "high" && (
          <span className="px-2 py-1 bg-green-500/90 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <SignalHigh className="w-3 h-3" />
            ممتاز
          </span>
        )}
        {currentSource.quality && currentSource.quality.length > 0 && (
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {currentSource.quality[0]}
          </span>
        )}
        {bufferHealth > 0 && (
          <span className="px-2 py-1 bg-purple-500/80 text-white text-xs rounded-lg font-medium">
            {bufferHealth}s
          </span>
        )}
      </div>

      {/* Source selector */}
      {sources.length > 1 && (
        <div className="absolute bottom-2 left-2 z-10 flex gap-1">
          {sources.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => { if (idx !== currentSourceIdx) { setCurrentSourceIdx(idx); setError(null); setLoading(true); setPlayerState("loading"); } }}
              className={`px-2 py-1 text-[10px] rounded font-medium transition-colors ${
                idx === currentSourceIdx ? "bg-primary text-white" : "bg-black/50 text-white/70 hover:bg-black/70"
              }`}
            >
              {idx === 0 ? "HD" : `بث ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}
