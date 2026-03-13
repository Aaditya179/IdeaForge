import { generateAIResponse } from "@/lib/ai";

export interface GeneratedIdea {
  rank: number;
  title: string;
  description: string;
  aiScore: string;
  votes: number;
  comments: number;
  isGenerated: boolean;
}

export async function generateIdeas(topic: string, context = "", count = 5): Promise<GeneratedIdea[]> {
  const prompt = `You are an AI brainstorming assistant helping innovators generate startup ideas.
Topic: "${topic}"
${context ? `Context: ${context}` : ""}
Generate exactly ${count} unique, creative, actionable startup ideas related to this topic.
Respond ONLY with a valid JSON array. No markdown, no explanation.
Each object must have: "title" (max 8 words), "description" (1-2 sentences), "aiScore" (float 7.0-9.9).
[{"title":"...", "description":"...", "aiScore": 8.4}, ...]`;

  const raw = await generateAIResponse(prompt);
  const ideas = JSON.parse(raw.replace(/```json|```/g, "").trim());

  return ideas.map((idea: any, i: number) => ({
    rank: i + 1,
    title: idea.title,
    description: idea.description,
    aiScore: Number(idea.aiScore).toFixed(1),
    votes: 0,
    comments: 0,
    isGenerated: true,
  }));
}

export interface EvaluationResult {
  score: number;
  feasibility: number;
  marketPotential: number;
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
}

export async function evaluateIdea(ideaTitle: string, ideaDescription: string, roomTopic: string): Promise<EvaluationResult> {
  const prompt = `You are an expert startup evaluator. Evaluate this idea for: "${roomTopic}".
Idea Title: "${ideaTitle}"
Idea Description: "${ideaDescription}"
Respond ONLY with valid JSON (no markdown):
{"score":<float 1-10>,"feasibility":<int 0-100>,"marketPotential":<int 0-100>,"strengths":[str,str,str],"weaknesses":[str,str],"suggestion":"<one actionable sentence>"}`;

  const raw = await generateAIResponse(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

export interface RoomSummary {
  summary: string;
  topTheme: string;
  recommendation: string;
  insights: string[];
}

export async function generateRoomSummary(roomTitle: string, ideas: any[]): Promise<RoomSummary> {
  const ideaList = ideas.map((i, idx) => `${idx + 1}. ${i.title}: ${i.desc || i.description}`).join("\n");
  const prompt = `You are an AI analyst. Summarize the brainstorm session for room: "${roomTitle}".
Ideas submitted:
${ideaList}
Respond ONLY with valid JSON (no markdown):
{"summary":"<2-3 sentence overview>","topTheme":"<main theme word>","recommendation":"<best next step>","insights":[str,str,str]}`;

  const raw = await generateAIResponse(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

export async function generateNotificationInsights(rooms: any[]) {
  const prompt = `Given these brainstorm rooms: ${rooms.map(r => r.title).join(", ")}, generate 4 AI-powered notification messages for the user.
Respond ONLY with a JSON array: [{"title":"...","message":"...","type":"info|success|warning","time":"X min ago"}]`;

  const raw = await generateAIResponse(prompt);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}
