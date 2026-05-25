"use client";

import { useState, useEffect } from "react";
import { ChannelCard } from "@/components/live/channel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchIPTVChannels, iptvToChannel, getChannels } from "@/lib/streaming";
import { Search, Monitor, Radio, Wifi, Tv, Loader2 } from "lucide-react";

const categories = [
  { value: "all", label: "الكل", icon: Radio },
  { value: "sports", label: "رياضية", icon: Monitor },
  { value: "news", label: "أخبار", icon: Radio },
  { value: "entertainment", label: "ترفيه", icon: Radio },
];

export default function ChannelsContent() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [iptvLoading, setIptvLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showIPTV, setShowIPTV] = useState(true);

  useEffect(() => {
    const fallback = getChannels();
    setChannels(fallback);

    fetchIPTVChannels().then((iptvChannels) => {
      if (iptvChannels.length > 0) {
        const converted = iptvChannels.map(iptvToChannel);
        const merged = [...converted, ...fallback];
        setChannels(merged);
      }
      setIptvLoading(false);
      setLoaded(true);
    }).catch(() => {
      setIptvLoading(false);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  const filtered = channels.filter((ch) => {
    const matchesSearch = ch.nameAr.includes(searchQuery) || ch.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || ch.category === activeCategory;
    const matchesFree = !showFreeOnly || ch.isFree;
    return matchesSearch && matchesCategory && matchesFree;
  });

  const displayed = showIPTV ? filtered : filtered.filter(ch => !ch.id.startsWith("iptv-"));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ابحث عن قناة..." className="pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button key={cat.value} variant={activeCategory === cat.value ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat.value)} className="gap-1.5">
                <Icon className="w-4 h-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>
        <Button variant={showFreeOnly ? "default" : "outline"} size="sm" onClick={() => setShowFreeOnly(!showFreeOnly)} className="gap-1.5">
          <Wifi className="w-4 h-4" />
          المجانية فقط
        </Button>
        <Button variant={showIPTV ? "default" : "outline"} size="sm" onClick={() => setShowIPTV(!showIPTV)} className="gap-1.5">
          <Tv className="w-4 h-4" />
          البث المباشر
        </Button>
      </div>

      {iptvLoading && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm">جاري تحميل القنوات المباشرة من خادم البث...</span>
        </div>
      )}

      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <Radio className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-bold text-lg mb-2">لا توجد قنوات</h3>
          <p className="text-muted-foreground">لم يتم العثور على قنوات تطابق بحثك</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {channels.length} قناة متاحة ({channels.filter(c => c.id.startsWith("iptv-")).length} مباشر)
            {searchQuery && ` - البحث: "${searchQuery}"`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </>
      )}

      <div className="rounded-2xl bg-accent/30 p-6 space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary" />
          كيفية إضافة البث المباشر
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">1. روابط IPTV (M3U/M3U8)</p>
            <p className="text-muted-foreground">أضف رابط قائمة IPTV الخاصة بك في لوحة التحكم.</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">2. يوتيوب مباشر</p>
            <p className="text-muted-foreground">أضف روابط يوتيوب للقنوات التي تبث مباشرة. مجاني ومستقر.</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">3. روابط مباشرة</p>
            <p className="text-muted-foreground">أضف روابط مباشرة من خدمات البث المدفوعة.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          * يمكنك إدارة جميع القنوات والبثوث من لوحة التحكم → إدارة البث المباشر
        </p>
      </div>
    </div>
  );
}
