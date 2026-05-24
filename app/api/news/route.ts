import { NextRequest, NextResponse } from "next/server";
import { getNewsFeed } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const news = await getNewsFeed({ category, limit });

    return NextResponse.json({
      data: news,
      total: news.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب الأخبار" }, { status: 500 });
  }
}
