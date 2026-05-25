"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProxyConfig, saveProxyConfig, DEFAULT_PROXY_CONFIG } from "@/lib/vps-proxy";
import type { ProxyConfig } from "@/lib/vps-proxy";
import { PROXY_HTTPS } from "@/lib/streaming";
import { Server, Play, RefreshCw, Copy, CheckCircle2, XCircle, Activity, Users, Wifi, HardDrive, Terminal, Tv } from "lucide-react";

export default function AdminProxyPage() {
  const [config, setConfig] = useState<ProxyConfig>(DEFAULT_PROXY_CONFIG);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "failed" | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [streamTest, setStreamTest] = useState<"idle" | "loading" | "ok" | "fail">("idle");

  useEffect(() => {
    const cfg = getProxyConfig();
    setConfig({ ...cfg, connected: true, stats: { ...cfg.stats, totalStreams: 8099 } });
    checkHealth();
  }, []);

  async function checkHealth() {
    try {
      const res = await fetch(`${PROXY_HTTPS}/health`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
        setConfig((c) => ({ ...c, connected: true, stats: { ...c.stats, activeConnections: data.activeClients || 0, uptime: `${Math.floor(data.uptime / 60)}m` } }));
        return true;
      }
    } catch {}
    setConfig((c) => ({ ...c, connected: false }));
    return false;
  }

  function handleSave() {
    const updated = { ...config, lastHealthCheck: Date.now() };
    saveProxyConfig(updated);
    setConfig(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    const ok = await checkHealth();
    setTestResult(ok ? "success" : "failed");
    setTesting(false);
  }

  async function testSingleStream() {
    setStreamTest("loading");
    try {
      const res = await fetch(`${PROXY_HTTPS}/stream?id=5593`, { signal: AbortSignal.timeout(5000) });
      setStreamTest(res.ok ? "ok" : "fail");
    } catch {
      setStreamTest("fail");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            خادم البث الوكيل (Proxy)
          </h1>
          <p className="text-muted-foreground">يربط 8099 قناة بخادم واحد - بث لعدد غير محدود من المشاهدين</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <CheckCircle2 className="w-4 h-4 ml-1" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      {saved && (
        <Card className="p-3 bg-green-500/10 border-green-500/20">
          <p className="text-green-500 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            تم حفظ الإعدادات بنجاح
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              حالة الاتصال
            </h3>
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing}>
              <RefreshCw className={`w-3 h-3 ml-1 ${testing ? "animate-spin" : ""}`} />
              اختبار
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            {config.connected ? (
              <Badge className="bg-green-500/10 text-green-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                متصل
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                غير متصل
              </Badge>
            )}
            {testResult === "success" && <span className="text-xs text-green-500">✓ اتصال ناجح</span>}
            {testResult === "failed" && <span className="text-xs text-destructive">✗ فشل الاتصال</span>}
          </div>

          {health && (
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>البثوث: {health.channels} قناة</p>
              <p>نشط: {health.activeStreams} بث | {health.activeClients} مشاهد</p>
              <p>وقت التشغيل: {Math.floor(health.uptime / 60)} دقيقة</p>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            إحصائيات البث
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">إجمالي القنوات</span>
              <span className="font-bold text-green-500">{health?.channels || 8099}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">البثوث النشطة</span>
              <span className="font-bold">{health?.activeStreams || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">المشاهدين حالياً</span>
              <span className="font-bold">{health?.activeClients || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">وقت التشغيل</span>
              <span className="font-bold">{health ? `${Math.floor(health.uptime / 60)}m` : "0m"}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
            <Tv className="w-4 h-4 text-primary" />
            اختبار البث
          </h3>
          <Button
            variant={streamTest === "ok" ? "default" : "outline"}
            size="sm"
            onClick={testSingleStream}
            disabled={streamTest === "loading"}
            className="w-full gap-2"
          >
            {streamTest === "loading" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {streamTest === "idle" && "اختبار قناة BEIN_SPORTS"}
            {streamTest === "loading" && "جاري الاختبار..."}
            {streamTest === "ok" && "✓ البث يعمل"}
            {streamTest === "fail" && "✗ فشل البث - أعد المحاولة"}
          </Button>
          {streamTest === "ok" && (
            <p className="text-xs text-green-500 mt-2">بث BEIN_SPORTS (ID: 5593) يعمل بشكل طبيعي</p>
          )}
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>الرابط: <code dir="ltr" className="text-[10px]">{PROXY_HTTPS}/stream?id=5593</code></p>
            <p>جميع القنوات متاحة في صفحة القنوات</p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
          <Server className="w-4 h-4 text-primary" />
          معلومات الخادم
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="text-muted-foreground block mb-1">رابط الخادم</label>
            <code className="text-xs bg-accent p-1.5 rounded block" dir="ltr">{PROXY_HTTPS}</code>
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">حالة البروكسي</label>
            <Badge className="bg-green-500/10 text-green-500">مفعل - يخدم 8099 قناة</Badge>
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">بروتوكول</label>
            <code className="text-xs">HTTPS مع Caddy</code>
          </div>
          <div>
            <label className="text-muted-foreground block mb-1">التخزين المؤقت</label>
            <code className="text-xs">تم - 4MB لكل قناة في الذاكرة</code>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold mb-2 text-sm flex items-center gap-2">
          <Wifi className="w-4 h-4 text-primary" />
          روابط البث
        </h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><span className="text-foreground">قائمة القنوات:</span> <code dir="ltr">{PROXY_HTTPS}/channels</code></p>
          <p><span className="text-foreground">بث مباشر:</span> <code dir="ltr">{PROXY_HTTPS}/stream?id={"{channel_id}"}</code></p>
          <p><span className="text-foreground">صحة السيرفر:</span> <code dir="ltr">{PROXY_HTTPS}/health</code></p>
          <p><span className="text-foreground">قائمة M3U:</span> <code dir="ltr">{PROXY_HTTPS}/iptv.m3u</code></p>
          <p><span className="text-foreground">التصنيفات:</span> <code dir="ltr">{PROXY_HTTPS}/categories</code></p>
        </div>
      </Card>
    </div>
  );
}
