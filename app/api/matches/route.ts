import { NextRequest, NextResponse } from "next/server";
import { getMatches } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const leagueId = searchParams.get("leagueId") || undefined;
    const teamId = searchParams.get("teamId") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const date = searchParams.get("date") || undefined;

    const matches = await getMatches({ status, leagueId, teamId, limit, date });

    return NextResponse.json({
      data: matches,
      total: matches.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب المباريات" }, { status: 500 });
  }
}
