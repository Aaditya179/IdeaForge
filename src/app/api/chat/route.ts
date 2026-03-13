import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Format interaction history for Ollama prompt
    const history = messages.map((m: any) =>
      `${m.role === "bot" ? "AI" : "User"}: ${m.content}`
    ).join("\n");

    const prompt = `You are an AI assistant for IdeaForge, a startup brainstorming platform.
The user might ask you to generate ideas. 
If you generate ideas, please include them at the end of your response in this hidden format:
[IDEAS_START]
[{"title": "Idea Title", "description": "Idea Description"}]
[IDEAS_END]

Here is the conversation history:
${history}

AI:`;

    const text = await generateAIResponse(prompt);

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Ollama Chat API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
