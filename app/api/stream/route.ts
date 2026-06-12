
import { NextRequest, NextResponse } from "next/server";

// Proxy bridge for IPTV streams
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("id");
  const url = req.nextUrl.searchParams.get("url");
  
  if (!channelId && !url) {
    return NextResponse.json({ error: "Missing id or url" }, { status: 400 });
  }

  // Build the VPS proxy URL
  let proxyUrl;
  if (channelId) {
    proxyUrl = `http://31.97.47.30:8085/stream?id=${channelId}`;
  } else {
    proxyUrl = decodeURIComponent(url!);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: "Proxy error" }, { status: 502 });
    }

    // Forward the stream
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("content-type") || "video/mp2t");
    headers.set("Cache-Control", "no-cache, no-store");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "*");

    return new Response(response.body, {
      status: 200,
      statusText: "OK",
      headers,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
