"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProxyConfig, saveProxyConfig, DEFAULT_PROXY_CONFIG, PROXY_SETUP_COMMANDS, DOCKER_COMPOSE_YML, NGINX_CONF } from "@/lib/vps-proxy";
import type { ProxyConfig } from "@/lib/vps-proxy";
import { Server, Play, Square, RefreshCw, Copy, CheckCircle2, XCircle, Activity, Users, Wifi, HardDrive, Terminal } from "lucide-react";

export default function AdminProxyPage() {
  const [config, setConfig] = useState<ProxyConfig>(DEFAULT_PROXY_CONFIG);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "failed" | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setConfig(getProxyConfig());
  }, []);

  function handleSave() {
    const updated = { ...config, lastHealthCheck: Date.now() };
    saveProxyConfig(updated);
    setConfig(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function testConnection() {
    if (!config.vpsHost) return;
    setTesting(true);
    setTestResult(null);

    try {
      const url = `http://${config.vpsHost}:${config.vpsPort}${config.healthEndpoint}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        setTestResult("success");
        saveProxyConfig({ ...config, connected: true, lastHealthCheck: Date.now() });
      } else {
        setTestResult("failed");
        saveProxyConfig({ ...config, connected: false });
      }
    } catch {
      setTestResult("failed");
      saveProxyConfig({ ...config, connected: false });
    }
    setTesting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            خادم البث الوكيل (Proxy)
          </h1>
          <p className="text-muted-foreground">اربط موقعك بسيرفر وسيط لبث لا نهائي من اشتراك IPTV واحد</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCommands(!showCommands)}>
            <Terminal className="w-4 h-4 ml-1" />
            أوامر التنصيب
          </Button>
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

      {showCommands && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              أوامر تنصيب Proxy على VPS
            </h3>
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(PROXY_SETUP_COMMANDS); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
              <Copy className="w-4 h-4 ml-1" />
              {copied ? "تم النسخ" : "نسخ الكل"}
            </Button>
          </div>
          <pre className="bg-black text-green-400 p-4 rounded-xl text-xs overflow-x-auto max-h-80 leading-relaxed">{PROXY_SETUP_COMMANDS}</pre>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
          <Server className="w-4 h-4 text-primary" />
          إعدادات الاتصال بالسيرفر الوكيل
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={config.enabled} onChange={(e) => setConfig({ ...config, enabled: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm">{config.enabled ? "السيرفر الوكيل مفعل" : "غير مفعل"}</span>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">نوع البروكسي</label>
            <select className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm" value={config.proxyType} onChange={(e) => setConfig({ ...config, proxyType: e.target.value as any })}>
              <option value="m3u-proxy">M3U Proxy (مستقر)</option>
              <option value="stream-share">Stream Share (متعدد)</option>
              <option value="custom">مخصص (Custom)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">IP السيرفر</label>
            <Input value={config.vpsHost} onChange={(e) => setConfig({ ...config, vpsHost: e.target.value })} placeholder="192.168.1.1" dir="ltr" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">المنفذ (Port)</label>
            <Input type="number" value={config.vpsPort} onChange={(e) => setConfig({ ...config, vpsPort: parseInt(e.target.value) || 8085 })} dir="ltr" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">رابط IPTV (M3U)</label>
            <Input value={config.m3uUrl} onChange={(e) => setConfig({ ...config, m3uUrl: e.target.value })} placeholder="http://provider.com/get.php?username=xxx&password=xxx&type=m3u_plus" dir="ltr" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">اسم المستخدم</label>
            <Input value={config.username} onChange={(e) => setConfig({ ...config, username: e.target.value })} dir="ltr" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">كلمة المرور</label>
            <Input type="password" value={config.password} onChange={(e) => setConfig({ ...config, password: e.target.value })} dir="ltr" />
          </div>

          {config.proxyType === "stream-share" && (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">رابط Xtream الأساسي</label>
                <Input value={config.xtreamBaseUrl || ""} onChange={(e) => setConfig({ ...config, xtreamBaseUrl: e.target.value })} placeholder="http://provider.com:1234" dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">مستخدم Xtream</label>
                <Input value={config.xtreamUsername || ""} onChange={(e) => setConfig({ ...config, xtreamUsername: e.target.value })} dir="ltr" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">كلمة Xtream</label>
                <Input type="password" value={config.xtreamPassword || ""} onChange={(e) => setConfig({ ...config, xtreamPassword: e.target.value })} dir="ltr" />
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              حالة الاتصال
            </h3>
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing || !config.vpsHost}>
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

          {config.lastHealthCheck > 0 && (
            <p className="text-xs text-muted-foreground">
              آخر فحص: {new Date(config.lastHealthCheck).toLocaleString("ar-SA")}
            </p>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            إحصائيات البث
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">الاتصالات النشطة</span>
              <span className="font-bold">{config.stats.activeConnections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">إجمالي البثوث</span>
              <span className="font-bold">{config.stats.totalStreams}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">استخدام الباندويث</span>
              <span className="font-bold">{config.stats.bandwidthUsage}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">مدة التشغيل</span>
              <span className="font-bold">{config.stats.uptime}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            إعدادات Docker
          </h3>
          <div className="text-xs text-muted-foreground space-y-2">
            <p>انقر على "أوامر التنصيب" في الأعلى لرؤية الأوامر الكاملة.</p>
            <div className="bg-accent rounded-lg p-2 mt-2">
              <p className="font-medium text-foreground mb-1">ملخص سريع:</p>
              <code className="block text-[10px]">ssh root@YOUR_VPS_IP</code>
              <code className="block text-[10px]">curl -fsSL https://get.docker.com | sh</code>
              <code className="block text-[10px]">mkdir -p ~/proxy && cd ~/proxy</code>
              <code className="block text-[10px]">nano docker-compose.yml</code>
              <code className="block text-[10px]">docker compose up -d</code>
            </div>
            <p className="mt-1">بعد التنصيب، اختبر الاتصال من الزر أعلاه.</p>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-bold mb-2 text-sm flex items-center gap-2">
          <Wifi className="w-4 h-4 text-primary" />
          روابط البث المتوقعة بعد التنصيب
        </h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><span className="text-foreground">مشغل HLS:</span> <code dir="ltr">http://{config.vpsHost || "YOUR_VPS_IP"}:{config.vpsPort}/hls/{"{channel_id}"}/playlist.m3u8</code></p>
          <p><span className="text-foreground">قائمة القنوات:</span> <code dir="ltr">http://{config.vpsHost || "YOUR_VPS_IP"}:{config.vpsPort}/iptv.m3u?username={config.username}&password={config.password}</code></p>
          <p><span className="text-foreground">صحة السيرفر:</span> <code dir="ltr">http://{config.vpsHost || "YOUR_VPS_IP"}:{config.vpsPort}/health</code></p>
          <p className="text-yellow-500 mt-1">⚠ البثوث ستشتغل تلقائياً في صفحة القنوات بعد تفعيل البروكسي</p>
        </div>
      </Card>
    </div>
  );
}
