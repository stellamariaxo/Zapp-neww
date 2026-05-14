import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

const DIFFICULTY_GUIDE = {
  kids: `
- Audience: children aged 6–11
- Use very simple words; never more than 2 syllables unless necessary
- Short sentences (max 15 words each)
- Heavy use of relatable analogies (toys, games, animals, food)
- Story cards should feel like a fairy tale
- Quiz options should be clearly worded, no trick questions`,

  beginner: `
- Audience: teenagers aged 12–15 or adult beginners
- Clear, friendly language; avoid jargon or always define it
- Medium sentence length; some analogies still helpful
- Examples from everyday life and popular culture`,

  intermediate: `
- Audience: students aged 16–18 or self-learners
- Balanced mix of accessible language and proper terminology
- Explanations can assume basic literacy in the subject
- Examples can include more domain-specific scenarios`,

  advanced: `
- Audience: university students or professionals learning a new area
- Use correct academic/industry terminology throughout
- Explanations can include nuance, edge cases, and comparisons
- Quiz questions should require synthesis, not just recall`,

  expert: `
- Audience: specialists, researchers, or professional practitioners
- Precise, technical language is expected and required
- Assume high prior knowledge; go deep, not wide
- Include counterarguments, limitations, or research context where relevant
- Quiz questions should test critical evaluation and application`,
};

const BASE_SYSTEM = `You are an expert instructional designer who creates world-class interactive learning experiences — like Duolingo, Khan Academy, and Google's Learn My Way combined.

Your task: Transform the provided raw educational material into a fully structured interactive course.

CRITICAL RULES:
1. Generate ALL text content in the specified language. English material → output in target language.
2. Return ONLY raw JSON — no markdown fences, no commentary, no preamble.
3. Keep card content concise but rich: 2–4 sentences per card.
4. Story cards MUST use first-person or narrative style ("Imagine you are…", "Meet Alex, who…").
5. Example cards MUST show concrete, real-world scenarios with specifics.
6. Tip cards MUST give immediately actionable, practical advice.
7. Quiz correct answers should rotate positions (not always index 0 or 1).
8. All four quiz options must be plausible — avoid obviously wrong decoys.

OUTPUT JSON SCHEMA (return exactly this structure):
{
  "courseTitle": "string",
  "courseDescription": "string (1–2 sentences, engaging, describes what learner gains)",
  "emoji": "string (1 emoji representing the subject)",
  "color": "string (pick one: #6366f1 | #ec4899 | #f59e0b | #10b981 | #3b82f6 | #8b5cf6 | #ef4444 | #06b6d4 | #14b8a6 | #f97316)",
  "sections": [
    {
      "id": 1,
      "title": "string",
      "cards": [
        {
          "id": 1,
          "type": "story | explanation | example | tip",
          "emoji": "string (1 relevant emoji)",
          "title": "string (catchy card title)",
          "content": "string (2–4 sentences, engaging and educational)",
          "highlight": "string (the single most important takeaway, ≤ 10 words)",
          "visual": "string (describe a simple illustration/diagram that would clarify this concept, 1 sentence)"
        }
      ],
      "quiz": [
        {
          "id": 1,
          "question": "string (tests understanding, not just recall)",
          "options": ["string", "string", "string", "string"],
          "correct": 0,
          "explanation": "string (explains WHY this answer is correct, 1–2 sentences)"
        }
      ]
    }
  ]
}`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, language, title, difficulty = "beginner" } = body;

    if (!content || content.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: "Content too short. Please provide at least a paragraph of material." },
        { status: 400 }
      );
    }

    const diffGuide = DIFFICULTY_GUIDE[difficulty] || DIFFICULTY_GUIDE.beginner;
    const userPrompt = `Target Language: ${language || "English"}
Difficulty Level: ${difficulty}
${diffGuide}

Course Title (suggested): ${title || "Untitled Course"}

--- MATERIAL TO TRANSFORM ---
${content.slice(0, 8000)}
--- END MATERIAL ---

Now generate the full course JSON. Remember: output ONLY raw JSON.`;

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 5000,
      system: [
        {
          type: "text",
          text: BASE_SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0].text.trim();

    // Extract JSON — handle cases where the model wraps in markdown
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Non-JSON response from AI:", raw.slice(0, 300));
      throw new Error("AI returned unexpected format. Please try again.");
    }

    let course;
    try {
      course = JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error("Failed to parse AI response as JSON. Please try again.");
    }

    // Validate minimum shape
    if (!course.sections || !Array.isArray(course.sections) || course.sections.length === 0) {
      throw new Error("AI generated an empty course. Please provide more detailed material.");
    }

    // Attach server-side metadata
    course.id         = Date.now().toString();
    course.createdAt  = new Date().toISOString();
    course.progress   = {};
    course.difficulty = difficulty;

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Learn API error:", error.message);

    const status = error.status === 401 ? 401 : 500;
    const msg =
      error.status === 401
        ? "Invalid API key. Set ANTHROPIC_API_KEY in .env.local."
        : error.message || "Failed to generate course. Please try again.";

    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
