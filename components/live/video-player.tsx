"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { Loader2, AlertTriangle, RefreshCw, Monitor, Maximize } from "lucide-react";
import type { StreamSource } from "@/lib/streaming";

interface VideoPlayerProps {
  source: StreamSource;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ source, poster, className = "", autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const plyrRef = useRef<Plyr | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuality, setCurrentQuality] = useState<string>("auto");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setError(null);

    if (source.type === "youtube") {
      setLoading(false);
      return;
    }

    if (source.type === "hls" && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backbufferLength: 90,
      });
      hls.loadSource(source.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        if (autoPlay) video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError("فشل تحميل البث. قد يكون الرابط غير صحيح أو البث غير متاح.");
          setLoading(false);
        }
      });

      if (!plyrRef.current) {
        plyrRef.current = new Plyr(video, {
          controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
          settings: ["quality", "speed"],
          quality: { default: 720, options: [1080, 720, 480, 360] },
          i18n: {
            restart: "إعادة التشغيل",
            rewind: "إرجاع",
            play: "تشغيل",
            pause: "إيقاف",
            fastForward: "تقديم",
            seek: "بحث",
            seekLabel: "{current} من {duration}",
            played: "تم التشغيل",
            buffered: "تم التخزين",
            currentTime: "الوقت الحالي",
            duration: "المدة",
            volume: "مستوى الصوت",
            mute: "كتم الصوت",
            unmute: "إلغاء كتم الصوت",
            enableCaptions: "تفعيل الترجمة",
            disableCaptions: "إلغاء الترجمة",
            download: "تحميل",
            enterFullscreen: "شاشة كاملة",
            exitFullscreen: "خروج من الشاشة الكاملة",
            frameTitle: "مشغل الفيديو",
            captions: "الترجمة",
            settings: "الإعدادات",
            menuBack: "العودة للقائمة السابقة",
            speed: "السرعة",
            normal: "عادي",
            quality: "الجودة",
            loop: "حلقة",
          },
        });
      }

      return () => {
        hls.destroy();
        plyrRef.current?.destroy();
        plyrRef.current = null;
      };
    } else if (source.type === "direct" || source.type === "dash") {
      video.src = source.url;
      setLoading(false);
      if (!plyrRef.current) {
        plyrRef.current = new Plyr(video, {
          controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "fullscreen"],
          i18n: {
            play: "تشغيل",
            pause: "إيقاف",
            volume: "مستوى الصوت",
            mute: "كتم الصوت",
            enterFullscreen: "شاشة كاملة",
            exitFullscreen: "خروج من الشاشة الكاملة",
          },
        });
      }
      return () => {
        plyrRef.current?.destroy();
        plyrRef.current = null;
      };
    } else if (source.type === "embed") {
      setLoading(false);
    }

    setLoading(false);
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

      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster || source.poster}
        playsInline
        controls={false}
      />

      {source.quality && source.quality.length > 0 && (
        <div className="absolute bottom-2 left-2 z-10 flex gap-1">
          {source.quality.map((q) => (
            <span
              key={q}
              className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                currentQuality === q ? "bg-primary text-white" : "bg-black/50 text-white/70"
              }`}
            >
              {q}
            </span>
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
