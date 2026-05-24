"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/live/video-player";
import { getMatchStreams, getAllMatchStreams } from "@/lib/streaming";
import { Play, Tv, Wifi, Monitor, AlertTriangle } from "lucide-react";
import type { MatchStream, StreamSource } from "@/lib/streaming";

interface MatchStreamSectionProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
}

export function MatchStreamSection({ matchId, homeTeam, awayTeam }: MatchStreamSectionProps) {
  const [activeSource, setActiveSource] = useState<StreamSource | null>(null);
  const [showAllStreams, setShowAllStreams] = useState(false);

  const matchStream = getMatchStreams(matchId);
  const allStreams = getAllMatchStreams();
  const otherStreams = allStreams.filter((s) => s.matchId !== matchId);

  if (!matchStream && !activeSource) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Tv className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-bold text-lg mb-2">بث المباراة</h3>
          <p className="text-muted-foreground text-sm mb-4">
            لا يتوفر بث مباشر لهذه المباراة حالياً
          </p>
          <p className="text-xs text-muted-foreground/60">
            يمكنك إضافة روابط البث من لوحة التحكم &rarr; إدارة البث المباشر
          </p>
          {otherStreams.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllStreams(!showAllStreams)}
              className="mt-4"
            >
              <Monitor className="w-4 h-4 ml-2" />
              بثوث أخرى متاحة
            </Button>
          )}
          {showAllStreams && (
            <div className="mt-4 space-y-2 text-right">
              {otherStreams.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-accent/50 text-sm">
                  <Badge variant={s.isLive ? "default" : "secondary"} className="text-[10px]">
                    {s.isLive ? "مباشر" : "قادم"}
                  </Badge>
                  <span>{s.titleAr}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  }

  const displaySource = activeSource || matchStream?.sources[0];

  if (!displaySource) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-primary" />
          <h3 className="font-bold">بث مباشر: {homeTeam} vs {awayTeam}</h3>
          <Badge className="bg-red-500/10 text-red-500 text-xs">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1" />
            مباشر
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {matchStream?.sources.map((source, idx) => (
            <Button
              key={source.id}
              variant={activeSource?.id === source.id ? "default" : "outline"}
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => setActiveSource(source)}
            >
              <Play className="w-3 h-3" />
              {idx === 0 ? "HD" : `بث ${idx + 1}`}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-black">
        <VideoPlayer sources={[displaySource]} autoPlay />
      </div>

      {displaySource.quality && displaySource.quality.length > 0 && (
        <div className="p-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
          <Wifi className="w-3 h-3 text-green-500" />
          <span>الجودة المتاحة: {displaySource.quality.join(" - ")}</span>
          <span className="mx-1">•</span>
          <span>اللغة: {matchStream?.languageAr || "العربية"}</span>
          {displaySource.backupUrls && displaySource.backupUrls.length > 0 && (
            <>
              <span className="mx-1">•</span>
              <span className="text-yellow-500">{displaySource.backupUrls.length} بث احتياطي</span>
            </>
          )}
        </div>
      )}

      <div className="p-3 bg-yellow-500/5 border-t border-yellow-500/10">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-yellow-500" />
          إذا توقف البث، جرب البث البديل من الأزرار أعلاه. يمكنك إضافة روابط بث إضافية من لوحة التحكم.
        </p>
      </div>
    </Card>
  );
}
