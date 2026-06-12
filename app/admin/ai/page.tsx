"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles, Brain, Zap, TrendingUp, Tv, RefreshCw, Copy, Check, Clock, Film,
  FileText, Hash, Download, Send, Lightbulb, Target, AlertTriangle, ArrowRight,
  BarChart3, Share2, Save, Eye, Globe, Smartphone, Book,
} from "lucide-react";
import { generateContent, loadGeneratedContents, saveGeneratedContent } from "@/lib/ai-generator";
import type { AIGeneratedContent, ContentType, PlatformType, AIGenerateRequest } from "@/lib/ai-generator";

export default function AdminAIPage() {
  const [contents, setContents] = useState<AIGeneratedContent[]>([]);
  const [activeTab, setActiveTab] = useState("generate");
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType>("match_analysis");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("all");
  const [topic, setTopic] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setContents(loadGeneratedContents());
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const request: AIGenerateRequest = {
        type: selectedType,
        platform: selectedPlatform,
        topic: topic || undefined,
        includeVisuals: true,
      };

      let content: AIGeneratedContent | null = null;

      // Try API first
      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });
        if (res.ok) content = await res.json();
      } catch { /* fallback to client-side generation */ }

      if (!content) {
        const { generateContent: localGenerate } = await import("@/lib/ai-generator");
        content = await localGenerate(request);
      }

      if (content) {
        saveGeneratedContent(content);
        setContents(loadGeneratedContents());
        setActiveTab("history");
      }
    } catch (e) {
      console.error("Generation failed:", e);
    } finally {
      setGenerating(false);
    }
  }

  async function handleBatchGenerate() {
    setGenerating(true);
    const types: ContentType[] = ["match_analysis", "tactical_idea", "tactical_error", "prediction", "concept_explanation"];

    for (const type of types) {
      try {
        const request: AIGenerateRequest = { type, platform: "all", topic: topic || undefined, includeVisuals: true };
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });
        if (res.ok) {
          const content = await res.json();
          saveGeneratedContent(content);
        }
      } catch { /* skip */ }
    }
    setContents(loadGeneratedContents());
    setGenerating(false);
    setActiveTab("history");
  }

  function publishContent(id: string) {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "published" as const, publishedAt: new Date().toISOString() } : c))
    );
    const raw = localStorage.getItem("football_world_ai_contents");
    if (raw) {
      const all = JSON.parse(raw);
      const updated = all.map((c: any) => c.id === id ? { ...c, status: "published", publishedAt: new Date().toISOString() } : c);
      localStorage.setItem("football_world_ai_contents", JSON.stringify(updated));
    }
  }

  async function copyToClipboard(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* ignore */ }
  }

  const typeOptions: { value: ContentType; label: string; icon: any }[] = [
    { value: "match_analysis", label: "تحليل مباراة", icon: Target },
    { value: "player_analysis", label: "تحليل لاعب", icon: Brain },
    { value: "tactical_idea", label: "فكرة تكتيكية", icon: Lightbulb },
    { value: "tactical_error", label: "خطأ تكتيكي", icon: AlertTriangle },
    { value: "concept_explanation", label: "شرح مفهوم", icon: Book },
    { value: "prediction", label: "توقع", icon: TrendingUp },
    { value: "news", label: "خبر", icon: FileText },
  ];

  const platformOptions: { value: PlatformType; label: string; icon: any }[] = [
    { value: "all", label: "جميع المنصات", icon: Globe },
    { value: "tiktok", label: "TikTok", icon: Smartphone },
    { value: "youtube_shorts", label: "YouTube Shorts", icon: Film },
    { value: "instagram", label: "Instagram", icon: Tv },
    { value: "article", label: "مقال", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            الذكاء الاصطناعي - توليد المحتوى
          </h1>
          <p className="text-muted-foreground">توليد محتوى كرة قدم تكتيكي احترافي تلقائياً</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="generate" className="gap-2">
            <Sparkles className="w-4 h-4" />
            توليد محتوى
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="w-4 h-4" />
            المحتوى المنشأ ({contents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6 mt-6">
          {generating && (
            <Card className="p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">جاري توليد المحتوى...</h3>
              <p className="text-muted-foreground">يقوم الذكاء الاصطناعي بإنشاء محتوى تكتيكي احترافي</p>
            </Card>
          )}

          {!generating && (
            <>
              <Card className="p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  إعدادات التوليد
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">نوع المحتوى</label>
                    <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ContentType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">المنصة المستهدفة</label>
                    <Select value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as PlatformType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">الموضوع (اختياري) - اتركه فارغاً للتوليد العشوائي</label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="مثال: ريال مدريد vs برشلونة - نهائي كأس الملك"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button onClick={handleGenerate} disabled={generating} className="gap-2 flex-1">
                    <Sparkles className="w-4 h-4" />
                    توليد محتوى واحد
                  </Button>
                  <Button onClick={handleBatchGenerate} disabled={generating} variant="secondary" className="gap-2">
                    <Zap className="w-4 h-4" />
                    توليد 5 محتويات (جميع الأنواع)
                  </Button>
                </div>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  إحصائيات سريعة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-accent/30 text-center">
                    <p className="text-2xl font-bold">{contents.length}</p>
                    <p className="text-xs text-muted-foreground">إجمالي المحتوى</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30 text-center">
                    <p className="text-2xl font-bold">{contents.filter((c) => c.status === "published").length}</p>
                    <p className="text-xs text-muted-foreground">منشور</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30 text-center">
                    <p className="text-2xl font-bold">
                      {contents.length > 0
                        ? Math.round(contents.reduce((s, c) => s + (c.viralScore || 0), 0) / contents.length)
                        : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">معدل الفيروسية</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/30 text-center">
                    <p className="text-2xl font-bold text-yellow-500">
                      {contents.filter((c) => (c.viralScore || 0) > 80).length}
                    </p>
                    <p className="text-xs text-muted-foreground">محتوى فيروسي</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {contents.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-bold text-lg mb-2">لا يوجد محتوى بعد</h3>
              <p className="text-muted-foreground mb-4">استخدم علامة التبويب "توليد محتوى" لإنشاء أول محتوى لك</p>
            </Card>
          ) : (
            contents.map((content) => (
              <Card key={content.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-[10px]">{content.type === "match_analysis" ? "تحليل مباراة" :
                        content.type === "player_analysis" ? "تحليل لاعب" :
                        content.type === "tactical_idea" ? "فكرة تكتيكية" :
                        content.type === "tactical_error" ? "خطأ تكتيكي" :
                        content.type === "concept_explanation" ? "شرح مفهوم" :
                        content.type === "prediction" ? "توقع" : "خبر"}</Badge>
                      {content.viralScore && content.viralScore > 80 && (
                        <Badge className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20">
                          <Zap className="w-3 h-3 ml-1" />
                          فيروسي!
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {content.status === "published" ? "منشور" : content.status === "ready" ? "جاهز" : "مسودة"}
                      </Badge>
                    </div>
                    <h3 className="font-bold">{content.titleAr}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{content.hookAr}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 mr-4">
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => copyToClipboard(content.scriptAr, `script-${content.id}`)} title="نسخ النص">
                      {copiedId === `script-${content.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => copyToClipboard(content.hashtags.join(" "), `hash-${content.id}`)} title="نسخ الهاشتاغات">
                      {copiedId === `hash-${content.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Hash className="w-4 h-4" />}
                    </Button>
                    {content.status !== "published" && (
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-green-500" onClick={() => publishContent(content.id)} title="نشر">
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {content.platform?.map((p) => (
                    <Badge key={p} variant="secondary" className="text-[10px] gap-1">
                      {p === "tiktok" ? <Smartphone className="w-3 h-3" /> :
                       p === "youtube_shorts" ? <Film className="w-3 h-3" /> :
                       p === "instagram" ? <Tv className="w-3 h-3" /> :
                       <FileText className="w-3 h-3" />}
                      {p}
                    </Badge>
                  ))}
                  <span className="text-xs text-muted-foreground mr-auto">
                    {new Date(content.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>

                {/* Expanded preview */}
                <details className="text-sm">
                  <summary className="cursor-pointer text-primary font-medium">عرض التفاصيل الكاملة</summary>
                  <div className="mt-3 space-y-3 p-4 rounded-xl bg-accent/20">
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">السكريبت</p>
                      <p className="text-sm">{content.scriptAr}</p>
                    </div>
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">الكابشن</p>
                      <p className="text-sm">{content.captionAr}</p>
                    </div>
                    {content.hashtags?.length > 0 && (
                      <div>
                        <p className="font-medium text-xs text-muted-foreground mb-1">الهاشتاغات</p>
                        <div className="flex flex-wrap gap-1">
                          {content.hashtags.map((h, i) => (
                            <Badge key={i} variant="outline" className="text-[10px]">{h}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {content.visualSuggestions?.length > 0 && (
                      <div>
                        <p className="font-medium text-xs text-muted-foreground mb-1">اقتراحات بصرية</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {content.visualSuggestions.map((v, i) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
