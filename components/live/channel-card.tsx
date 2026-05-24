"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Tv, Wifi, WifiOff, Star, ExternalLink } from "lucide-react";
import { VideoPlayer } from "@/components/live/video-player";
import type { Channel, StreamSource } from "@/lib/streaming";

interface ChannelCardProps {
  channel: Channel;
  featured?: boolean;
}

export function ChannelCard({ channel, featured = false }: ChannelCardProps) {
  const [playing, setPlaying] = useState(false);
  const [selectedStream, setSelectedStream] = useState<StreamSource | null>(null);

  const handlePlay = (stream?: StreamSource) => {
    const s = stream || channel.streams[0];
    if (s) {
      setSelectedStream(s);
      setPlaying(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={featured ? "lg:col-span-2 lg:row-span-2" : ""}
      >
        <Card className={`group relative overflow-hidden hover-lift ${featured ? "h-full" : ""}`}>
          {playing && selectedStream ? (
            <div className="relative">
              <VideoPlayer source={selectedStream} autoPlay />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPlaying(false); setSelectedStream(null); }}
                className="absolute top-2 right-2 z-20 bg-black/50 text-white hover:bg-black/70"
              >
                إغلاق
              </Button>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center p-2 shrink-0 overflow-hidden">
                  {channel.logo ? (
                    <img src={channel.logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Tv className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold truncate ${featured ? "text-lg" : ""}`}>{channel.nameAr}</h3>
                    {channel.isFree ? (
                      <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-500">مجاني</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">مدفوع</Badge>
                    )}
                    {featured && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{channel.countryAr}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{channel.categoryAr}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {channel.active ? (
                    <span className="flex items-center gap-1 text-xs text-green-500">
                      <Wifi className="w-3 h-3" />
                      مباشر
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <WifiOff className="w-3 h-3" />
                      غير متاح
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {channel.streams.map((stream, idx) => (
                  <button
                    key={stream.id}
                    onClick={() => handlePlay(stream)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    {stream.nameAr} {stream.quality ? `(${stream.quality[0]})` : ""}
                  </button>
                ))}
              </div>

              {channel.streams.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">لا توجد بثوث متاحة</p>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
}
