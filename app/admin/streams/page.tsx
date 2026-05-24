"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getChannels, saveChannels, FALLBACK_CHANNELS } from "@/lib/streaming";
import type { Channel, StreamSource } from "@/lib/streaming";
import { Tv, Plus, Trash2, Edit2, Check, X, Wifi, WifiOff, Play, Save, Download, Upload } from "lucide-react";

export default function AdminStreamsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importUrl, setImportUrl] = useState("");
  const [importMessage, setImportMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    logo: "",
    category: "sports" as const,
    categoryAr: "رياضية",
    country: "",
    countryAr: "",
    streamUrl: "",
    streamType: "youtube" as const,
    streamName: "",
    streamNameAr: "",
    isFree: false,
  });

  useEffect(() => {
    setChannels(getChannels());
  }, []);

  function resetForm() {
    setForm({
      name: "", nameAr: "", logo: "", category: "sports", categoryAr: "رياضية",
      country: "", countryAr: "", streamUrl: "", streamType: "youtube",
      streamName: "", streamNameAr: "", isFree: false,
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleSave() {
    if (!form.name || !form.nameAr || !form.streamUrl) return;

    const stream: StreamSource = {
      id: Date.now().toString(36),
      name: form.streamName || form.name,
      nameAr: form.streamNameAr || form.nameAr,
      type: form.streamType,
      url: form.streamUrl,
    };

    if (editingId) {
      const updated = channels.map((ch) =>
        ch.id === editingId
          ? {
              ...ch,
              name: form.name,
              nameAr: form.nameAr,
              logo: form.logo,
              category: form.category,
              categoryAr: form.categoryAr,
              country: form.country,
              countryAr: form.countryAr,
              isFree: form.isFree,
              streams: [stream],
            }
          : ch
      );
      setChannels(updated);
      saveChannels(updated);
    } else {
      const newChannel: Channel = {
        id: Date.now().toString(36),
        name: form.name,
        nameAr: form.nameAr,
        logo: form.logo,
        category: form.category,
        categoryAr: form.categoryAr,
        streams: [stream],
        active: true,
        isFree: form.isFree,
        country: form.country,
        countryAr: form.countryAr,
      };
      const updated = [...channels, newChannel];
      setChannels(updated);
      saveChannels(updated);
    }

    resetForm();
  }

  function handleDelete(id: string) {
    const updated = channels.filter((ch) => ch.id !== id);
    setChannels(updated);
    saveChannels(updated);
  }

  function handleEdit(channel: Channel) {
    setForm({
      name: channel.name,
      nameAr: channel.nameAr,
      logo: channel.logo || "",
      category: channel.category,
      categoryAr: channel.categoryAr,
      country: channel.country,
      countryAr: channel.countryAr,
      streamUrl: channel.streams[0]?.url || "",
      streamType: channel.streams[0]?.type || "youtube",
      streamName: channel.streams[0]?.name || "",
      streamNameAr: channel.streams[0]?.nameAr || "",
      isFree: channel.isFree,
    });
    setEditingId(channel.id);
    setShowForm(true);
  }

  function handleExport() {
    const data = JSON.stringify(channels, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "football-world-channels.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportM3U() {
    if (!importUrl) return;
    setImportMessage("جاري التحميل...");
    try {
      const res = await fetch(importUrl);
      const text = await res.text();
      const lines = text.split("\n");
      let currentName = "";
      let currentNameAr = "";
      const imported: Channel[] = [];

      for (const line of lines) {
        if (line.startsWith("#EXTINF:")) {
          const nameMatch = line.match(/,(.+)/);
          if (nameMatch) {
            currentName = nameMatch[1].trim();
            currentNameAr = currentName;
          }
        } else if (line.startsWith("http") && currentName) {
          imported.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            name: currentName,
            nameAr: currentNameAr,
            logo: "",
            category: "sports",
            categoryAr: "رياضية",
            streams: [{ id: Date.now().toString(36), name: currentName, nameAr: currentNameAr, type: "hls", url: line.trim() }],
            active: true,
            isFree: true,
            country: "",
            countryAr: "",
          });
          currentName = "";
          currentNameAr = "";
        }
      }

      if (imported.length > 0) {
        const updated = [...channels, ...imported];
        setChannels(updated);
        saveChannels(updated);
        setImportMessage(`تم استيراد ${imported.length} قناة بنجاح!`);
      } else {
        setImportMessage("لم يتم العثور على قنوات في الرابط");
      }
    } catch {
      setImportMessage("فشل استيراد القنوات. تأكد من صحة الرابط.");
    }
  }

  function handleReset() {
    saveChannels(FALLBACK_CHANNELS);
    setChannels(FALLBACK_CHANNELS);
    setImportMessage("تم إعادة تعيين القنوات الافتراضية");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tv className="w-6 h-6 text-primary" />
            إدارة البث المباشر
          </h1>
          <p className="text-muted-foreground">أضف وأدر القنوات والبث المباشر للمباريات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Upload className="w-4 h-4 ml-1" />
            تصدير
          </Button>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة قناة
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">اسم القناة (إنجليزي)</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="beIN Sports" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">اسم القناة (عربي)</label>
              <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} placeholder="بي إن سبورت" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">شعار القناة (URL)</label>
              <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">التصنيف</label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any, categoryAr: e.target.value === "sports" ? "رياضية" : e.target.value === "news" ? "أخبار" : "ترفيه" })}>
                <option value="sports">رياضية</option>
                <option value="news">أخبار</option>
                <option value="entertainment">ترفيه</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الدولة</label>
              <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Qatar" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الدولة (عربي)</label>
              <Input value={form.countryAr} onChange={(e) => setForm({ ...form, countryAr: e.target.value })} placeholder="قطر" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">نوع البث</label>
              <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" value={form.streamType} onChange={(e) => setForm({ ...form, streamType: e.target.value as any })}>
                <option value="youtube">يوتيوب</option>
                <option value="hls">HLS (M3U8)</option>
                <option value="direct">رابط مباشر</option>
                <option value="embed">تضمين (Embed)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">رابط البث</label>
              <Input value={form.streamUrl} onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFree" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} className="rounded" />
              <label htmlFor="isFree" className="text-sm">قناة مجانية</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} size="sm">
              <Check className="w-4 h-4 ml-1" />
              {editingId ? "تحديث" : "إضافة"}
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm">
              <X className="w-4 h-4 ml-1" />
              إلغاء
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
          <Download className="w-4 h-4 text-primary" />
          استيراد قنوات من رابط M3U (IPTV)
        </h3>
        <div className="flex gap-2">
          <Input placeholder="أدخل رابط قائمة M3U..." value={importUrl} onChange={(e) => setImportUrl(e.target.value)} className="flex-1" />
          <Button onClick={handleImportM3U} variant="secondary" size="sm">استيراد</Button>
        </div>
        {importMessage && <p className="text-xs mt-2 text-muted-foreground">{importMessage}</p>}
        <p className="text-xs text-muted-foreground/60 mt-1">يمكنك استيراد قنوات IPTV من روابط M3U/M3U8 العامة أو الخاصة باشتراكك</p>
      </Card>

      <div className="grid gap-3">
        {channels.length === 0 ? (
          <Card className="p-8 text-center">
            <Tv className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">لا توجد قنوات</p>
            <p className="text-sm text-muted-foreground/60 mt-1">أضف قناة جديدة أو استورد من رابط IPTV</p>
          </Card>
        ) : (
          channels.map((channel) => (
            <Card key={channel.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center overflow-hidden">
                    {channel.logo ? <img src={channel.logo} className="w-full h-full object-contain" /> : <Tv className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{channel.nameAr}</h3>
                      {channel.isFree ? <Badge className="text-[10px] bg-green-500/10 text-green-500">مجاني</Badge> : <Badge variant="outline" className="text-[10px]">مدفوع</Badge>}
                      {channel.active ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-muted-foreground" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {channel.streams.length} بث | {channel.categoryAr} | {channel.countryAr}
                    </p>
                    {channel.streams[0] && (
                      <p className="text-xs text-muted-foreground/60 mt-0.5 truncate max-w-[300px]">{channel.streams[0].url}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => handleEdit(channel)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => handleDelete(channel.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
          إعادة تعيين القنوات الافتراضية
        </Button>
      </div>
    </div>
  );
}
