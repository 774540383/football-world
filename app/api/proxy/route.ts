import { NextResponse } from "next/server";

const VPS_PROXY = "http://31.97.47.30:8085";
const VPS_PROXY_HTTPS = "https://srv1675350.hstgr.cloud";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "health";
  const query = searchParams.get("q") || "";
  const id = searchParams.get("id") || "";

  try {
    let vpsUrl: string;
    if (path === "stream" && id) {
      vpsUrl = `${VPS_PROXY}/stream?id=${encodeURIComponent(id)}`;
    } else if (path === "channels" || path === "api/channels") {
      vpsUrl = `${VPS_PROXY}/api/channels`;
    } else if (path === "play" && id) {
      vpsUrl = `${VPS_PROXY}/api/play/${encodeURIComponent(id)}`;
    } else if (path === "health") {
      vpsUrl = `${VPS_PROXY}/health`;
    } else if (path === "iptv.m3u") {
      vpsUrl = `${VPS_PROXY}/iptv.m3u${query ? `?q=${encodeURIComponent(query)}` : ""}`;
    } else {
      vpsUrl = `${VPS_PROXY}/${path}`;
    }

    // Streaming endpoints: use Web Streams API for efficiency
    if (path === "stream" || path === "play" || path === "iptv.m3u") {
      const backendRes = await fetch(vpsUrl, {
        signal: AbortSignal.timeout(60000),
        headers: {
          "Range": req.headers.get("range") || "",
        },
      });

      const headers = new Headers();
      backendRes.headers.forEach((value, key) => {
        if (!["content-encoding", "content-length", "transfer-encoding"].includes(key.toLowerCase())) {
          headers.set(key, value);
        }
      });
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "*");
      headers.set("Cache-Control", "public, max-age=30, stale-while-revalidate=300");

      if (backendRes.body) {
        const stream = backendRes.body;
        return new NextResponse(stream as any, {
          status: backendRes.status,
          statusText: backendRes.statusText,
          headers,
        });
      }

      return new NextResponse(backendRes.body, {
        status: backendRes.status,
        statusText: backendRes.statusText,
        headers,
      });
    }

    // JSON data endpoints
    const res = await fetch(vpsUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      return NextResponse.json({ error: "Proxy error", status: res.status }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("json") || path === "health" || path === "channels") {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": contentType || "text/plain", "Access-Control-Allow-Origin": "*" },
    });
  } catch (e: any) {
    if (e.name === "TimeoutError" || e.name === "AbortError") {
      return NextResponse.json({ error: "Proxy timeout" }, { status: 504 });
    }
    return NextResponse.json({ error: e.message || "Proxy request failed" }, { status: 502 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}
