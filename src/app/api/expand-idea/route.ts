import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    const prompt = `Expand this startup idea into:

- problem
- solution
- key features
- target users
- potential business model

Idea:
Title: ${title}
Description: ${description}

Respond in the following JSON format exactly:
{
  "problemStatement": "A clear description of the problem",
  "targetUsers": ["User segment 1", "User segment 2"],
  "possibleFeatures": ["Feature 1", "Feature 2"],
  "businessModel": "Description of the business model"
}`;

    const text = await generateAIResponse(prompt);

    // Parse the JSON response
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Ollama Expand API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
