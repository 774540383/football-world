"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "plyr/dist/plyr.css";
import { Loader2, AlertTriangle, RefreshCw, Wifi, WifiOff, Layers } from "lucide-react";
import type { StreamSource } from "@/lib/streaming";

interface VideoPlayerProps {
  sources: StreamSource[];
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  onError?: () => void;
}

export function VideoPlayer({ sources, poster, className = "", autoPlay = true, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const plyrRef = useRef<any>(null);
  const hlsRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSourceIdx, setCurrentSourceIdx] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = sources.length + 2;

  const currentSource = sources[currentSourceIdx] || sources[0];

  const tryNextSource = useCallback(() => {
    if (currentSourceIdx < sources.length - 1) {
      setCurrentSourceIdx((i) => i + 1);
      setError(null);
      setLoading(true);
      setRetryCount((c) => c + 1);
    } else if (retryCount < maxRetries) {
      setCurrentSourceIdx(0);
      setError(null);
      setLoading(true);
      setRetryCount((c) => c + 1);
    } else {
      setError("جميع مصادر البث غير متاحة حالياً. حاول مرة أخرى لاحقاً.");
      setLoading(false);
      onError?.();
    }
  }, [currentSourceIdx, sources.length, retryCount, maxRetries, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSource) return;

    let destroyed = false;

    async function initPlayer() {
      if (destroyed) return;
      setLoading(true);
      setError(null);

      if (currentSource.type === "youtube") {
        setLoading(false);
        return;
      }

      if (currentSource.type === "embed") {
        setLoading(false);
        return;
      }

      try {
        if (currentSource.type === "hls") {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            if (hlsRef.current) {
              hlsRef.current.destroy();
              hlsRef.current = null;
            }

            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90,
              maxBufferLength: 60,
              maxMaxBufferLength: 120,
              startLevel: -1,
              manifestLoadingMaxRetry: 5,
              levelLoadingMaxRetry: 5,
              fragLoadingMaxRetry: 5,
            });
            hlsRef.current = hls;

            hls.loadSource(currentSource.url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (!destroyed) {
                setLoading(false);
                if (autoPlay) video.play().catch(() => {});
              }
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (_event: any, data: any) => {
              if (!destroyed && !loading && data.level >= 0) {
                const level = hls.levels[data.level];
                if (level) {
                  console.log(`Switched to ${level.height}p`);
                }
              }
            });

            hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
              if (destroyed) return;
              if (data.fatal) {
                hls.destroy();
                hlsRef.current = null;
                if (!destroyed) tryNextSource();
              }
            });

            const Plyr = (await import("plyr")).default;
            if (plyrRef.current) plyrRef.current.destroy();
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
          if (!destroyed) {
            setLoading(false);
            if (autoPlay) video.play().catch(() => {});
          }
        });
        video.addEventListener("error", () => {
          if (!destroyed) tryNextSource();
        });

        const Plyr = (await import("plyr")).default;
        if (plyrRef.current) plyrRef.current.destroy();
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (plyrRef.current) {
        plyrRef.current.destroy();
        plyrRef.current = null;
      }
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
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
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
              onClick={() => { setRetryCount(0); setCurrentSourceIdx(0); setError(null); setLoading(true); }}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      <video ref={videoRef} className="w-full h-full" poster={poster || currentSource.poster} playsInline controls={false} />

      {/* Source indicator */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {currentSourceIdx > 0 && (
          <span className="px-2 py-1 bg-green-500/90 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            بديل {currentSourceIdx}
          </span>
        )}
        {currentSource.quality && currentSource.quality.length > 0 && (
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-lg font-medium flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {currentSource.quality[0]}
          </span>
        )}
      </div>

      {/* Source selector */}
      {sources.length > 1 && (
        <div className="absolute bottom-2 left-2 z-10 flex gap-1">
          {sources.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => { if (idx !== currentSourceIdx) { setCurrentSourceIdx(idx); setError(null); setLoading(true); } }}
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
