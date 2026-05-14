import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert educational content creator who specializes in making learning fun and engaging, similar to Duolingo or Google's Learn My Way.

Your task: Transform the provided educational material into an engaging, easy-to-understand interactive course.

IMPORTANT: Generate ALL content in the specified language. If the language is Indonesian, write in Indonesian. If Spanish, write in Spanish. Etc.

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "courseTitle": "string - catchy course title",
  "courseDescription": "string - 1-2 sentence description of what students will learn",
  "emoji": "string - single emoji representing the topic",
  "color": "string - one of: #6366f1, #ec4899, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444, #06b6d4",
  "sections": [
    {
      "id": 1,
      "title": "string - section title",
      "cards": [
        {
          "id": 1,
          "type": "story|explanation|example|tip",
          "title": "string - card title",
          "content": "string - main explanation (2-4 sentences, conversational, engaging)",
          "emoji": "string - single relevant emoji",
          "highlight": "string - one key phrase or concept to emphasize (max 8 words)",
          "visual": "string - describe a simple illustration or diagram that would help explain this concept (1 sentence)"
        }
      ],
      "quiz": [
        {
          "id": 1,
          "question": "string - clear question about the section content",
          "options": ["string", "string", "string", "string"],
          "correct": 0,
          "explanation": "string - brief explanation of why this answer is correct (1-2 sentences)"
        }
      ]
    }
  ]
}

Rules:
- Create 2-4 sections, each covering a distinct aspect of the topic
- Each section: 3-5 cards + 3-4 quiz questions
- Card types should vary: start with story for context, add explanation for concepts, example for clarity, tip for practical use
- Story cards: use narrative/storytelling format ("Imagine you are...", "Once there was...")
- Example cards: show concrete real-world examples
- Tip cards: practical advice students can immediately use
- Quiz questions should test understanding, not just recall
- Make content engaging, fun, and accessible
- Use simple language appropriate for general learners`;

export async function POST(request) {
  try {
    const { content, language, title } = await request.json();

    if (!content || content.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: "Content too short. Please provide more material." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Language to use for ALL content: ${language || "English"}

Course Title: ${title || "Untitled Course"}

Material to transform:
${content.slice(0, 8000)}`,
        },
      ],
    });

    const responseText = message.content[0].text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    const course = JSON.parse(jsonMatch[0]);
    course.id = Date.now().toString();
    course.createdAt = new Date().toISOString();
    course.progress = {};

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Learn API error:", error);

    if (error.status === 401) {
      return NextResponse.json(
        { success: false, error: "Invalid API key. Please set ANTHROPIC_API_KEY." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate course" },
      { status: 500 }
    );
  }
}
