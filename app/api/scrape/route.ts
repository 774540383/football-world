
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  try {
    const { execSync } = require("child_process");
    const result = execSync("cd /opt/football-world-vps && node scraper.js 2>&1", {
      timeout: 120000,
      encoding: "utf-8",
    });
    return NextResponse.json({ success: true, output: result.slice(0, 2000) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
