import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    const prompt = `Generate a mind map for this idea.

Idea:
Title: ${title}
Description: ${description}

Return JSON format exactly:
{
 "centralIdea": "${title}",
 "branches": [
   {
     "title": "Problem & Market",
     "nodes": ["Node 1", "Node 2"]
   },
   {
     "title": "Features",
     "nodes": ["Node 1", "Node 2"]
   },
   {
     "title": "Business Model",
     "nodes": ["Node 1", "Node 2"]
   }
 ]
}`;

    const text = await generateAIResponse(prompt);
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Ollama Map API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
