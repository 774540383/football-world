
import { NextRequest, NextResponse } from "next/server";
import { generateContent, generateDailyContent, AIGeneratedContent } from "@/lib/ai-generator";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60;

// GET /api/ai/daily - Get daily content plan
export async function GET(req: NextRequest) {
  try {
    const contents = await prisma.aIContent.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ contents });
  } catch (e) {
    return NextResponse.json({ contents: [] });
  }
}

// POST /api/ai/daily - Generate daily content
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const language = body.language || "ar";
    const matchLimit = body.matchLimit || 5;

    // Fetch today's matches from DB
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const matches = await prisma.match.findMany({
      where: {
        date: { gte: today, lt: tomorrow },
        status: { in: ["SCHEDULED", "LIVE"] },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
      },
      take: matchLimit,
    });

    const matchData = matches.map((m) => ({
      id: m.id,
      home: m.homeTeam?.name || "Home",
      away: m.awayTeam?.name || "Away",
      league: m.league?.name || "",
      date: m.date.toISOString(),
    }));

    // Generate daily content
    const plan = await generateDailyContent(matchData, language);

    // Save to database
    const saved: AIGeneratedContent[] = [];
    for (const content of plan.contents) {
      try {
        const dbContent = await prisma.aIContent.create({
          data: {
            title: content.title,
            titleAr: content.titleAr,
            type: content.type,
            platform: content.platform.join(","),
            hook: content.hook,
            hookAr: content.hookAr,
            script: content.script,
            scriptAr: content.scriptAr,
            caption: content.caption,
            captionAr: content.captionAr,
            hashtags: content.hashtags.join(","),
            visualSuggestions: content.visualSuggestions.join(","),
            viralScore: content.viralScore || 0,
            status: "draft",
            metadata: JSON.stringify({ matchId: matchData[0]?.id || "" }),
          },
        });
        saved.push({ ...content, id: dbContent.id });
      } catch (e) {
        console.error("Save error:", e);
      }
    }

    return NextResponse.json({
      success: true,
      count: saved.length,
      matches: matchData,
      contents: saved,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
