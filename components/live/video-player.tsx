"use client";

import { useEffect, useRef, useState } from "react";
import "plyr/dist/plyr.css";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import type { StreamSource } from "@/lib/streaming";

interface VideoPlayerProps {
  source: StreamSource;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ source, poster, className = "", autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setError(null);

    if (source.type === "youtube") {
      setLoading(false);
      return;
    }

    if (source.type === "embed") {
      setLoading(false);
      return;
    }

    async function initPlayer() {
      try {
        if (source.type === "hls") {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90,
            });
            hls.loadSource(source.url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setLoading(false);
              if (autoPlay) video.play().catch(() => {});
            });
            hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
              if (data.fatal) {
                setError("فشل تحميل البث. قد يكون الرابط غير صحيح أو البث غير متاح.");
                setLoading(false);
              }
            });

            const Plyr = (await import("plyr")).default;
            const player = new Plyr(video, {
              controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
              settings: ["quality", "speed"],
              quality: { default: 720, options: [1080, 720, 480, 360] },
            });

            return () => {
              hls.destroy();
              player.destroy();
            };
          } else {
            video.src = source.url;
            setLoading(false);
            const Plyr = (await import("plyr")).default;
            const player = new Plyr(video);
            return () => player.destroy();
          }
        } else {
          video.src = source.url;
          setLoading(false);
          const Plyr = (await import("plyr")).default;
          const player = new Plyr(video, {
            controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
          });
          return () => player.destroy();
        }
      } catch {
        setError("حدث خطأ في تحميل البث");
        setLoading(false);
      }
    }

    const cleanupPromise = initPlayer();
    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [source.url, source.type]);

  if (source.type === "youtube") {
    const videoId = extractYoutubeId(source.url);
    if (!videoId) {
      return (
        <div className="flex items-center justify-center h-64 bg-muted rounded-xl">
          <p className="text-muted-foreground">رابط يوتيوب غير صحيح</p>
        </div>
      );
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

  if (source.type === "embed") {
    return (
      <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
        <iframe
          src={source.url}
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
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      <video ref={videoRef} className="w-full h-full" poster={poster || source.poster} playsInline controls={false} />

      {source.quality && source.quality.length > 0 && (
        <div className="absolute bottom-2 left-2 z-10 flex gap-1">
          {source.quality.map((q) => (
            <span key={q} className="px-1.5 py-0.5 text-[10px] rounded font-medium bg-black/50 text-white/70">{q}</span>
          ))}
        </div>
      )}

      {source.backupUrls && source.backupUrls.length > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-1 bg-yellow-500/90 text-black text-xs rounded-lg font-medium">
            +{source.backupUrls.length} بديل
          </span>
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
