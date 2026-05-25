"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ChannelCard } from "@/components/live/channel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchIPTVChannels, iptvToChannel, fetchIPTVCategories, FALLBACK_CHANNELS } from "@/lib/streaming";
import { Search, Monitor, Radio, Wifi, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 30;

export default function ChannelsContent() {
  const [iptvChannels, setIptvChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const channels = await fetchIPTVChannels();
        if (cancelled) return;
        if (channels.length > 0) {
          setIptvChannels(channels);
        } else {
          setError("تعذر الاتصال بخادم البث. استخدم القنوات الافتراضية.");
        }
      } catch {
        if (!cancelled) setError("فشل تحميل القنوات");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const allChannels = useMemo(() => {
    if (iptvChannels.length > 0) {
      return iptvChannels.map(iptvToChannel);
    }
    return FALLBACK_CHANNELS;
  }, [iptvChannels]);

  const filtered = useMemo(() => {
    let result = allChannels;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((ch) =>
        ch.nameAr.toLowerCase().includes(q) || ch.name.toLowerCase().includes(q) || ch.id.includes(q)
      );
    }
    if (activeCategory !== "all") {
      result = result.filter((ch) => ch.category === activeCategory);
    }
    if (showFreeOnly) {
      result = result.filter((ch) => ch.isFree);
    }
    return result;
  }, [allChannels, searchQuery, activeCategory, showFreeOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageChannels = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, showFreeOnly]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">جاري تحميل القنوات...</p>
        <p className="text-xs text-muted-foreground mt-2">يتم جلب أكثر من 8000 قناة من الخادم</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            placeholder="ابحث عن قناة بالاسم أو الرقم..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant={showFreeOnly ? "default" : "outline"} size="sm" onClick={() => setShowFreeOnly(!showFreeOnly)} className="gap-1.5 shrink-0">
          <Wifi className="w-4 h-4" />
          المجانية فقط
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length > 0
            ? `${filtered.length} قناة ${searchQuery ? `(مطابقة لـ "${searchQuery}")` : ""}`
            : "لا توجد قنوات"}
        </span>
        {iptvChannels.length > 0 && (
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            متصل بخادم البث
          </span>
        )}
      </div>

      {/* Error notice */}
      {error && (
        <div className="p-4 rounded-xl bg-yellow-500/10 text-yellow-600 text-sm border border-yellow-500/20">
          {error}
        </div>
      )}

      {/* Channels grid */}
      {pageChannels.length === 0 ? (
        <div className="text-center py-16">
          <Radio className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-bold text-lg mb-2">لا توجد قنوات</h3>
          <p className="text-muted-foreground">لم يتم العثور على قنوات تطابق بحثك</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronRight className="w-4 h-4 ml-1" />
                السابق
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                صفحة {safePage} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                التالي
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Help section */}
      <div className="rounded-2xl bg-accent/30 p-6 space-y-3">
        <h3 className="font-bold flex items-center gap-2"><Monitor className="w-5 h-5 text-primary" />جميع القنوات متاحة عبر الخادم</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">البث المباشر</p>
            <p className="text-muted-foreground">جميع القنوات تبث مباشرة عبر خادمنا. اضغط على أي قناة للبدء.</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">مشاركة المشاهدة</p>
            <p className="text-muted-foreground">يدعم البث عدد غير محدود من المشاهدين في نفس الوقت بفضل خاصية التخزين المؤقت.</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">بحث سريع</p>
            <p className="text-muted-foreground">ابحث عن القنوات بالاسم. جرب: BEIN, SSC, ALKASS, SKY, ESPN</p>
          </div>
        </div>
      </div>
    </div>
  );
}
