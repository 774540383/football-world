import { NextResponse } from "next/server";
import { generateContent } from "@/lib/ai-generator";
import type { AIGenerateRequest } from "@/lib/ai-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body: AIGenerateRequest = await req.json();
    if (!body.type) {
      return NextResponse.json({ error: "Missing required field: type" }, { status: 400 });
    }

    const content = await generateContent(body);
    if (!content) {
      return NextResponse.json({ error: "Content generation failed" }, { status: 500 });
    }

    return NextResponse.json(content);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Generation failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "AI Content Generator API",
    version: "1.0",
    endpoints: {
      POST: "/api/ai/generate",
    },
    types: ["match_analysis", "player_analysis", "tactical_idea", "tactical_error", "concept_explanation", "prediction", "news"],
    platforms: ["tiktok", "youtube_shorts", "instagram", "article", "twitter", "all"],
  });
}
