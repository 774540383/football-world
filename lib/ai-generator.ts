export type ContentType = "match_analysis" | "player_analysis" | "tactical_idea" | "tactical_error" | "concept_explanation" | "prediction" | "news";
export type PlatformType = "tiktok" | "youtube_shorts" | "instagram" | "article" | "twitter" | "all";

export interface AIGenerateRequest {
  topic?: string;
  matchId?: string;
  teamId?: string;
  playerId?: string;
  type: ContentType;
  platform: PlatformType;
  language?: "ar" | "en";
  includeVisuals?: boolean;
}

export interface AIGeneratedContent {
  id?: string;
  title: string;
  titleAr: string;
  platform: PlatformType[];
  hook: string;
  hookAr: string;
  script: string;
  scriptAr: string;
  caption: string;
  captionAr: string;
  hashtags: string[];
  visualSuggestions: string[];
  viralScore?: number;
  type: ContentType;
  createdAt: string;
  status: "draft" | "ready" | "published";
  publishedAt?: string;
  platforms?: string[];
}

export interface AIDailyPlan {
  date: string;
  contents: AIGeneratedContent[];
  matches: { id: string; home: string; away: string; league: string; date: string }[];
  generatedAt: string;
}

const GENERATION_PROMPTS: Record<ContentType, { ar: string; en: string }> = {
  match_analysis: {
    ar: "تحليل تكتيكي عميق للمباراة",
    en: "Deep tactical analysis of the match",
  },
  player_analysis: {
    ar: "تحليل أداء اللاعب وأرقامه",
    en: "Player performance analysis and stats",
  },
  tactical_idea: {
    ar: "فكرة تكتيكية جديدة مع شرح",
    en: "New tactical idea with explanation",
  },
  tactical_error: {
    ar: "خطأ تكتيكي في المباراة وتحليله",
    en: "Tactical error in match and its analysis",
  },
  concept_explanation: {
    ar: "شرح مفهوم كروي بشكل مبسط",
    en: "Simple explanation of a football concept",
  },
  prediction: {
    ar: "توقع وتحليل للمباريات القادمة",
    en: "Prediction and analysis for upcoming matches",
  },
  news: {
    ar: "خبر وتحليل سريع",
    en: "News and quick analysis",
  },
};

export function getGenerationPrompt(type: ContentType, language: "ar" | "en"): string {
  const typePrompt = GENERATION_PROMPTS[type]?.[language] || GENERATION_PROMPTS.match_analysis[language];
  const systemPrompt = language === "ar" ? `أنت محرر محتوى كرة قدم محترف متخصص في التحليل التكتيكي.

المهمة: ${typePrompt}

القواعد:
- لا تكتب أخبار فقط، بل تحليل تكتيكي عميق
- اجعل كل فكرة مبنية على فهم داخل الملعب (pressing, build-up, transitions)
- استخدم لغة بسيطة لكنها احترافية
- اجعل كل محتوى قصير وقابل للنشر
- أضف Hook قوي في البداية
- أضف قيمة تحليلية حقيقية في المنتصف
- أنهِ بجملة مؤثرة أو سؤال للجمهور

يجب أن يكون الإخراج بصيغة JSON فقط:
{
  "title": "عنوان جذاب",
  "titleEn": "English title",
  "hook": "جملة افتتاحية قوية",
  "hookEn": "Strong opening hook in English",
  "script": "النص الكامل للفيديو أو المقال",
  "scriptEn": "Full script in English",
  "caption": "تعليق قصير للنشر",
  "captionEn": "Short caption for posting",
  "hashtags": ["هاشتاغ1", "هاشتاغ2"],
  "visualSuggestions": ["وصف المشهد البصري المطلوب"]
}`
    : `You are a professional football content editor specialized in tactical analysis.

Task: ${typePrompt}

Rules:
- Don't just write news, provide deep tactical analysis
- Base every idea on on-field understanding (pressing, build-up, transitions)
- Use simple yet professional language
- Keep content short and publishable
- Start with a strong hook
- Add real analytical value
- End with an impactful sentence or question for the audience

Output must be in JSON format only:
{
  "title": "Catchy title",
  "titleAr": "عنوان جذاب بالعربية",
  "hook": "Strong opening hook",
  "hookAr": "جملة افتتاحية قوية بالعربية",
  "script": "Full video or article script",
  "scriptAr": "النص الكامل بالعربية",
  "caption": "Short posting caption",
  "captionAr": "تعليق قصير للنشر بالعربية",
  "hashtags": ["hashtag1", "hashtag2"],
  "visualSuggestions": ["Description of the required visual scene"]
}`;
  return systemPrompt;
}

export async function generateContent(request: AIGenerateRequest): Promise<AIGeneratedContent | null> {
  const lang = request.language || "ar";
  const prompt = getGenerationPrompt(request.type, lang);

  const fullPrompt = `${prompt}

${
  request.topic
    ? `\nالموضوع: ${request.topic}`
    : ""
}
${
  request.platform !== "all"
    ? `\nالمنصة المستهدفة: ${request.platform}`
    : "\nالمنصات المستهدفة: TikTok, YouTube Shorts, Instagram, Website"
}
${
  request.includeVisuals
    ? "\nيرجى اقتراح عناصر بصرية محددة (رسوم تكتيكية، لقطات، رسوم متحركة)"
    : ""
}

الرجاء إنشاء محتوى احترافي وجاهز للنشر.`;

  try {
    let data: any = null;

    // Try OpenCode CLI first (if available)
    try {
      const { execSync } = require("child_process");
      const result = execSync(
        `opencode prompt "${fullPrompt.replace(/"/g, '\\"')}" --format json`,
        { encoding: "utf-8", timeout: 30000 }
      );
      data = JSON.parse(result.trim());
    } catch { /* fall through to API */ }

    // Fallback: try OpenAI API via environment variable
    if (!data && typeof process !== "undefined" && process.env?.OPENAI_API_KEY) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: fullPrompt },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });
      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) data = JSON.parse(jsonMatch[0]);
    }

    // Final fallback: return generated template
    if (!data) {
      data = getFallbackContent(request);
    }

    return {
      id: crypto.randomUUID?.() || Date.now().toString(36),
      title: data.title || data.titleEn || "Match Analysis",
      titleAr: data.titleAr || data.title || "تحليل المباراة",
      platform: request.platform === "all" ? ["tiktok", "youtube_shorts", "instagram"] : [request.platform],
      hook: data.hook || data.hookEn || "",
      hookAr: data.hookAr || data.hook || "",
      script: data.script || data.scriptEn || "",
      scriptAr: data.scriptAr || data.script || "",
      caption: data.caption || data.captionEn || "",
      captionAr: data.captionAr || data.caption || "",
      hashtags: data.hashtags || [],
      visualSuggestions: data.visualSuggestions || [],
      viralScore: Math.floor(Math.random() * 40) + 60,
      type: request.type,
      createdAt: new Date().toISOString(),
      status: "draft",
    };
  } catch {
    return getFallbackContent(request) as AIGeneratedContent;
  }
}

function getFallbackContent(request: AIGenerateRequest): AIGeneratedContent {
  const templates: Record<ContentType, AIGeneratedContent> = {
    match_analysis: {
      id: Date.now().toString(36), title: "How Team X Dominated Midfield", titleAr: "كيف سيطر فريق X على وسط الملعب",
      platform: ["tiktok", "youtube_shorts", "instagram"],
      hook: "Watch how they completely controlled the game from midfield!", hookAr: "شاهد كيف سيطروا على المباراة بالكامل من الوسط!",
      script: "In this match, Team X used a 4-3-3 formation with a high press that forced 15 turnovers in the opponent's half...",
      scriptAr: "في هذه المباراة، استخدم فريق X تشكيلة 4-3-3 مع ضغط عالي أجبر المنافس على 15 خطأ في نصف ملعبه...",
      caption: "Tactical breakdown of the match. What would you do differently?", captionAr: "تحليل تكتيكي للمباراة. ماذا كنت ستفعل بشكل مختلف؟",
      hashtags: ["#تكتيك", "#تحليل_مباراة", "#كرة_قدم", "#TacticalAnalysis"],
      visualSuggestions: ["Formation graphic (4-3-3)", "Pressing zones heatmap", "Key pass connections"],
      viralScore: 85, type: "match_analysis", createdAt: new Date().toISOString(), status: "draft",
    },
    player_analysis: {
      id: Date.now().toString(36), title: "Player X's Complete Performance Analysis", titleAr: "تحليل أداء اللاعب X الكامل",
      platform: ["tiktok", "youtube_shorts", "instagram"],
      hook: "90 minutes, 120 touches, 1 goal - but the numbers don't tell the full story!", hookAr: "90 دقيقة، 120 لمسة، هدف واحد - لكن الأرقام لا تروي القصة كاملة!",
      script: "Player X had an outstanding performance with 92% pass accuracy, 4 key passes, and 3 successful dribbles...",
      scriptAr: "اللاعب X قدم أداءً استثنائياً بدقة تمرير 92%، 4 تمريرات حاسمة، و 3 مراوغات ناجحة...",
      caption: "Complete breakdown of Player X's performance. Rate his game!",
      captionAr: "تحليل كامل لأداء اللاعب X. قيم مستواه!",
      hashtags: ["#لاعب", "#تحليل_أداء", "#كرة_قدم", "#PlayerAnalysis"],
      visualSuggestions: ["Player heatmap", "Passing network diagram", "Shot map"],
      viralScore: 78, type: "player_analysis", createdAt: new Date().toISOString(), status: "draft",
    },
    tactical_idea: {
      id: Date.now().toString(36), title: "The Inverted Fullback Revolution", titleAr: "ثورة الظهير المعكوس",
      platform: ["tiktok", "youtube_shorts", "instagram"],
      hook: "This tactical innovation changed modern football forever!", hookAr: "هذا الابتكار التكتيكي غيّر كرة القدم الحديثة إلى الأبد!",
      script: "The inverted fullback moves into midfield when in possession, creating a numerical advantage...",
      scriptAr: "الظهير المعكوس يتقدم إلى خط الوسط عند الاستحواذ، مما يخلق تفوقاً عددياً...",
      caption: "Tactical innovation explained. Would this work in your team?", captionAr: "ابتكار تكتيكي مشروح. هل سينجح هذا في فريقك؟",
      hashtags: ["#تكتيك", "#كرة_قدم", "#تحليل", "#TacticalInnovation"],
      visualSuggestions: ["Tactical board animation", "Before/after positioning", "Zone diagram"],
      viralScore: 92, type: "tactical_idea", createdAt: new Date().toISOString(), status: "draft",
    },
    tactical_error: {
      id: Date.now().toString(36), title: "The Defensive Gap That Cost the Match", titleAr: "الثغرة الدفاعية التي كلفت المباراة",
      platform: ["tiktok", "youtube_shorts", "instagram"],
      hook: "One positioning mistake. One goal. Game over.", hookAr: "خطأ تمركز واحد. هدف واحد. انتهت المباراة.",
      script: "In the 67th minute, the left-back pushed too high without cover, leaving a massive gap behind...",
      scriptAr: "في الدقيقة 67، تقدم الظهير الأيسر بدون غطاء، تاركاً ثغرة كبيرة خلفه...",
      caption: "Tactical error analysis. Learn from others' mistakes!", captionAr: "تحليل خطأ تكتيكي. تعلم من أخطاء الآخرين!",
      hashtags: ["#خطأ_تكتيكي", "#تحليل", "#كرة_قدم", "#TacticalMistake"],
      visualSuggestions: ["Pause frame of the mistake", "Defensive line animation", "Correct positioning overlay"],
      viralScore: 88, type: "tactical_error", createdAt: new Date().toISOString(), status: "draft",
    },
    concept_explanation: {
      id: Date.now().toString(36), title: "What is Gegenpressing?", titleAr: "ما هو الكاونتر بريس (الضغط المرتد)؟",
      platform: ["tiktok", "youtube_shorts", "instagram"],
      hook: "You've heard the term, but do you really understand gegenpressing?", hookAr: "سمعت المصطلح، لكن هل تفهم حقاً معنى الضغط المرتد؟",
      script: "Gegenpressing is the art of pressing immediately after losing the ball, within 5 seconds...",
      scriptAr: "الضغط المرتد هو فن الضغط فور فقدان الكرة، خلال 5 ثوانٍ...",
      caption: "Football concept explained simply. Save this for later!", captionAr: "مفهوم كروي شرح ببساطة. احفظه للمستقبل!",
      hashtags: ["#شروحات", "#تكتيك", "#كرة_قدم", "#FootballConcepts"],
      visualSuggestions: ["Animated tactical board", "Real match examples", "Player movement lines"],
      viralScore: 82, type: "concept_explanation", createdAt: new Date().toISOString(), status: "draft",
    },
    prediction: {
      id: Date.now().toString(36), title: "Champions League Quarter-Final Predictions", titleAr: "توقعات ربع نهائي دوري أبطال أوروبا",
      platform: ["tiktok", "youtube_shorts", "instagram"],
      hook: "I analyzed every quarter-final matchup - here's who advances!", hookAr: "حللت كل مباريات ربع النهائي - إليك من سيتأهل!",
      script: "Based on current form, head-to-head records, and tactical analysis, here are my predictions...",
      scriptAr: "بناءً على المستوى الحالي، سجل المواجهات المباشرة، والتحليل التكتيكي، إليك توقعاتي...",
      caption: "Match predictions with tactical reasoning. Do you agree?", captionAr: "توقعات المباريات مع التحليل التكتيكي. هل تتفق؟",
      hashtags: ["#توقعات", "#دوري_أبطال_أوروبا", "#تحليل", "#Predictions"],
      visualSuggestions: ["Bracket graphic", "Head-to-head stats", "Form table"],
      viralScore: 75, type: "prediction", createdAt: new Date().toISOString(), status: "draft",
    },
    news: {
      id: Date.now().toString(36), title: "Breaking: Star Player Transfer Confirmed", titleAr: "عاجل: انتقال نجم مؤكد",
      platform: ["tiktok", "youtube_shorts", "instagram"],
      hook: "It's official - the biggest transfer of the summer is confirmed!", hookAr: "رسمي - أكبر صفقة في الصيف تم تأكيدها!",
      script: "The club announced the signing of the star player for a record fee of €120M...",
      scriptAr: "أعلن النادي عن التعاقد مع النجم القادم مقابل 120 مليون يورو...",
      caption: "Breaking transfer news with tactical analysis of how he fits in.",
      captionAr: "خبر انتقال عاجل مع تحليل تكتيكي لكيفية انسجامه.",
      hashtags: ["#عاجل", "#انتقالات", "#كرة_قدم", "#TransferNews"],
      visualSuggestions: ["Announcement graphic", "Player stats card", "Tactical fit animation"],
      viralScore: 90, type: "news", createdAt: new Date().toISOString(), status: "draft",
    },
  };
  return { ...templates[request.type] };
}

export async function generateDailyContent(
  matches: { id: string; home: string; away: string; league: string; date: string }[],
  language: "ar" | "en" = "ar"
): Promise<AIDailyPlan> {
  const types: ContentType[] = ["match_analysis", "tactical_idea", "tactical_error", "prediction"];
  const contents: AIGeneratedContent[] = [];

  for (const match of matches.slice(0, 5)) {
    for (const type of types) {
      const content = await generateContent({
        topic: language === "ar" ? `${match.home} vs ${match.away} - ${match.league}` : `${match.home} vs ${match.away} - ${match.league}`,
        type,
        platform: "all",
        language,
      });
      if (content) contents.push(content);
    }
  }

  return {
    date: new Date().toISOString(),
    contents,
    matches,
    generatedAt: new Date().toISOString(),
  };
}

export function getLocalStorageKey(): string {
  return "football_world_ai_contents";
}

export function saveGeneratedContent(content: AIGeneratedContent): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(getLocalStorageKey());
    const contents: AIGeneratedContent[] = raw ? JSON.parse(raw) : [];
    contents.unshift(content);
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(contents.slice(0, 200)));
  } catch { /* ignore */ }
}

export function loadGeneratedContents(): AIGeneratedContent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getLocalStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function generateHashTag(text: string): string {
  const words = text.split(" ");
  return "#" + words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}
