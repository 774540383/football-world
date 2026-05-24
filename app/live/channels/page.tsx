"use client";

import { useState } from "react";
import { ChannelCard } from "@/components/live/channel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getChannels } from "@/lib/streaming";
import { Tv, Search, Filter, Monitor, Radio, Wifi } from "lucide-react";

const categories = [
  { value: "all", label: "الكل", icon: Tv },
  { value: "sports", label: "رياضية", icon: Monitor },
  { value: "news", label: "أخبار", icon: Radio },
  { value: "entertainment", label: "ترفيه", icon: Tv },
];

export default function ChannelsPage() {
  const [channels] = useState(() => getChannels());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filtered = channels.filter((ch) => {
    const matchesSearch = ch.nameAr.includes(searchQuery) || ch.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || ch.category === activeCategory;
    const matchesFree = !showFreeOnly || ch.isFree;
    return matchesSearch && matchesCategory && matchesFree;
  });

  const featuredChannel = channels.find((ch) => ch.isFree && ch.active);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Tv className="w-8 h-8" />
            <h1 className="text-3xl font-black">القنوات الرياضية</h1>
          </div>
          <p className="text-white/70 text-lg">شاهد البث المباشر للقنوات والمباريات الرياضية</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن قناة..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
                className="gap-1.5"
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>
        <Button
          variant={showFreeOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFreeOnly(!showFreeOnly)}
          className="gap-1.5"
        >
          <Wifi className="w-4 h-4" />
          المجانية فقط
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Tv className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-bold text-lg mb-2">لا توجد قنوات</h3>
          <p className="text-muted-foreground">لم يتم العثور على قنوات تطابق بحثك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}

      <div className="rounded-2xl bg-accent/30 p-6 space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary" />
          كيفية إضافة البث المباشر
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">1. روابط IPTV (M3U/M3U8)</p>
            <p className="text-muted-foreground">أضف رابط قائمة IPTV الخاصة بك في لوحة التحكم. تدعم جميع أنواع البث.</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">2. يوتيوب مباشر</p>
            <p className="text-muted-foreground">أضف روابط يوتيوب للقنوات التي تبث مباشرة. مجاني ومستقر.</p>
          </div>
          <div className="p-3 rounded-xl bg-background/50">
            <p className="font-medium mb-1">3. روابط مباشرة</p>
            <p className="text-muted-foreground">أضف روابط مباشرة من خدمات البث المدفوعة مع خوادم قوية.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          * يمكنك إدارة جميع القنوات والبثوث من لوحة التحكم &rarr; إدارة البث المباشر
        </p>
      </div>
    </div>
  );
}
