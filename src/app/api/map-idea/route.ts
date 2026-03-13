import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    const prompt = `Generate a comprehensive mind map data for this startup idea.

Idea:
Title: ${title}
Description: ${description}

Respond in the following JSON format exactly:
{
  "targetUsers": ["Segment 1", "Segment 2", "Segment 3"],
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "revenueModel": ["Model 1", "Model 2"],
  "competitors": ["Competitor 1", "Competitor 2"]
}`;

    const text = await generateAIResponse(prompt);

    // Improved cleaning: extract only the JSON part
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }
    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Ollama Map API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
