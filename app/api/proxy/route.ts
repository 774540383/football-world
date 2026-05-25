import { NextResponse } from "next/server";

const VPS_PROXY = "http://31.97.47.30:8085";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "health";
  const query = searchParams.get("q") || "";
  const id = searchParams.get("id") || "";

  try {
    let url = `${VPS_PROXY}/${path}`;
    if (query) url += `?q=${encodeURIComponent(query)}`;
    if (id) url += `?id=${encodeURIComponent(id)}`;

    // For streaming, we need to proxy the response as-is
    if (path === "stream" || path === "iptv.m3u") {
      const backendRes = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const headers = new Headers(backendRes.headers);
      headers.set("Access-Control-Allow-Origin", "*");
      return new NextResponse(backendRes.body, {
        status: backendRes.status,
        statusText: backendRes.statusText,
        headers,
      });
    }

    // For JSON data
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      return NextResponse.json({ error: "Proxy error", status: res.status }, { status: res.status });
    }

    // Health endpoint
    if (path === "health") {
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Channels list
    if (path === "channels") {
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Default
    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": res.headers.get("Content-Type") || "text/plain" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Proxy request failed" },
      { status: 502 }
    );
  }
}
