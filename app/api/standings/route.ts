import { NextRequest, NextResponse } from "next/server";
import { getStandings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const leagueId = searchParams.get("leagueId");
    const season = searchParams.get("season") ? parseInt(searchParams.get("season")!) : undefined;

    if (!leagueId) {
      return NextResponse.json({ error: "leagueId مطلوب" }, { status: 400 });
    }

    const standings = await getStandings(leagueId, season);

    return NextResponse.json({ data: standings });
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب الترتيب" }, { status: 500 });
  }
}
