"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProxyConfig, saveProxyConfig, DEFAULT_PROXY_CONFIG } from "@/lib/vps-proxy";
import type { ProxyConfig } from "@/lib/vps-proxy";
import { Server, RefreshCw, CheckCircle2, XCircle, Activity, Users, Wifi, Tv, Loader2 } from "lucide-react";

export default function AdminProxyPage() {
  const [config, setConfig] = useState<ProxyConfig>(DEFAULT_PROXY_CONFIG);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "failed" | null>(null);
  const [channelsCount, setChannelsCount] = useState<number | null>(null);
  const [testStreamStatus, setTestStreamStatus] = useState<string>("");

  useEffect(() => {
    setConfig(getProxyConfig());
    checkProxyStatus();
  }, []);

  async function checkProxyStatus() {
    try {
      const res = await fetch("http://31.97.47.30:8085/health", { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        setConfig(c => ({ ...c, connected: true, lastHealthCheck: Date.now() }));
        const chRes = await fetch("http://31.97.47.30:8085/channels", { signal: AbortSignal.timeout(10000) });
        if (chRes.ok) {
          const data = await chRes.json();
          setChannelsCount(data.total);
        }
      } else {
        setConfig(c => ({ ...c, connected: false }));
      }
    } catch {
      setConfig(c => ({ ...c, connected: false }));
    }
  }

  function handleSave() {
    saveProxyConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("http://31.97.47.30:8085/health", { signal: AbortSignal.timeout(5000) });
      setTestResult(res.ok ? "success" : "failed");
    } catch {
      setTestResult("failed");
    }
    setTesting(false);
  }

  async function testStream() {
    setTestStreamStatus("Testing stream...");
    try {
      const res = await fetch("http://31.97.47.30:8085/stream?id=5593", { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        setTestStreamStatus("OK - BEIN_SPORTS (5593)");
      } else {
        setTestStreamStatus("FAILED: " + res.status);
      }
    } catch {
      setTestStreamStatus("FAILED to connect");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            VPS Proxy Server
          </h1>
          <p className="text-muted-foreground">IPTV to Web proxy manager - connect your site to unlimited viewers</p>
        </div>
        <Button onClick={handleSave} size="sm">
          <CheckCircle2 className="w-4 h-4 ml-1" />
          Save Settings
        </Button>
      </div>

      {saved && (
        <Card className="p-3 bg-green-500/10 border-green-500/20">
          <p className="text-green-500 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Settings saved successfully
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-2">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
            <Server className="w-4 h-4 text-primary" />
            Server Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Server IP</label>
              <Input value="31.97.47.30" dir="ltr" disabled />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Port</label>
              <Input value="8085" dir="ltr" disabled />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">IPTV Status</label>
              <Input value="Active (3 months VIP)" disabled />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Available Channels</label>
              <Input value={channelsCount !== null ? channelsCount + " channels" : "loading..."} disabled />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Connection Status
          </h3>
          <div className="flex items-center gap-3 mb-3">
            {config.connected ? (
              <Badge className="bg-green-500/10 text-green-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Disconnected
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing}>
              <RefreshCw className={"w-3 h-3 ml-1 " + (testing ? "animate-spin" : "")} />
              Test
            </Button>
          </div>
          {testResult === "success" && <span className="text-xs text-green-500">OK</span>}
          {testResult === "failed" && <span className="text-xs text-destructive">FAILED</span>}
          {config.lastHealthCheck > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Last check: {new Date(config.lastHealthCheck).toLocaleString()}
            </p>
          )}
          <div className="mt-3">
            <Button size="sm" className="w-full" onClick={testStream}>
              <Tv className="w-4 h-4 ml-1" />
              Test Stream
            </Button>
            {testStreamStatus && <p className="text-xs mt-2">{testStreamStatus}</p>}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-accent/30">
            <div className="text-muted-foreground">Total Channels</div>
            <div className="font-bold text-lg">{channelsCount !== null ? channelsCount : "..."}</div>
          </div>
          <div className="p-3 rounded-xl bg-accent/30">
            <div className="text-muted-foreground">Sports Channels</div>
            <div className="font-bold text-lg">{channelsCount !== null ? "974+" : "..."}</div>
          </div>
          <div className="p-3 rounded-xl bg-accent/30">
            <div className="text-muted-foreground">BeIN Channels</div>
            <div className="font-bold text-lg">232</div>
          </div>
          <div className="p-3 rounded-xl bg-accent/30">
            <div className="text-muted-foreground">Subscription</div>
            <div className="font-bold text-lg text-green-500">Active</div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold mb-2 text-sm flex items-center gap-2">
          <Wifi className="w-4 h-4 text-primary" />
          Stream URLs
        </h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><span className="text-foreground">Health:</span> <code dir="ltr">http://31.97.47.30:8085/health</code></p>
          <p><span className="text-foreground">Channels List:</span> <code dir="ltr">http://31.97.47.30:8085/channels</code></p>
          <p><span className="text-foreground">Stream:</span> <code dir="ltr">http://31.97.47.30:8085/stream?id=858</code></p>
          <p><span className="text-foreground">M3U Playlist:</span> <code dir="ltr">http://31.97.47.30:8085/iptv.m3u</code></p>
        </div>
      </Card>
    </div>
  );
}
