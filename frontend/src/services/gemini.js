const GEMINI_API_KEY = "AIzaSyBhMhBVxFEQuABL4X_oLdz-gWB4lXmFCWU"; // <-- Replace with your key
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function callGemini(prompt, temperature = 0.9, maxTokens = 1500) {
  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, topP: 0.95, maxOutputTokens: maxTokens },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error: ${res.status}`);
  }
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return raw.replace(/```json|```/g, "").trim();
}

export async function generateIdeas(topic, context = "", count = 5) {
  const prompt = `You are an AI brainstorming assistant helping innovators generate startup ideas.
Topic: "${topic}"
${context ? `Context: ${context}` : ""}
Generate exactly ${count} unique, creative, actionable startup ideas related to this topic.
Respond ONLY with a valid JSON array. No markdown, no explanation.
Each object must have: "title" (max 8 words), "description" (1-2 sentences), "aiScore" (float 7.0-9.9).
[{"title":"...", "description":"...", "aiScore": 8.4}, ...]`;
  const raw = await callGemini(prompt);
  const ideas = JSON.parse(raw);
  return ideas.map((idea, i) => ({
    rank: i + 1,
    title: idea.title,
    description: idea.description,
    aiScore: Number(idea.aiScore).toFixed(1),
    votes: 0,
    comments: 0,
    isGenerated: true,
  }));
}

export async function evaluateIdea(ideaTitle, ideaDescription, roomTopic) {
  const prompt = `You are an expert startup evaluator. Evaluate this idea for: "${roomTopic}".
Idea Title: "${ideaTitle}"
Idea Description: "${ideaDescription}"
Respond ONLY with valid JSON (no markdown):
{"score":<float 1-10>,"feasibility":<int 0-100>,"marketPotential":<int 0-100>,"strengths":[str,str,str],"weaknesses":[str,str],"suggestion":"<one actionable sentence>"}`;
  const raw = await callGemini(prompt, 0.4, 600);
  return JSON.parse(raw);
}

export async function generateRoomSummary(roomTitle, ideas) {
  const ideaList = ideas.map((i, idx) => `${idx+1}. ${i.title}: ${i.desc || i.description}`).join("\n");
  const prompt = `You are an AI analyst. Summarize the brainstorm session for room: "${roomTitle}".
Ideas submitted:
${ideaList}
Respond ONLY with valid JSON (no markdown):
{"summary":"<2-3 sentence overview>","topTheme":"<main theme word>","recommendation":"<best next step>","insights":[str,str,str]}`;
  const raw = await callGemini(prompt, 0.5, 800);
  return JSON.parse(raw);
}

export async function generateNotificationInsights(rooms) {
  const prompt = `Given these brainstorm rooms: ${rooms.map(r=>r.title).join(", ")}, generate 4 AI-powered notification messages for the user.
Respond ONLY with a JSON array: [{"title":"...","message":"...","type":"info|success|warning","time":"X min ago"}]`;
  const raw = await callGemini(prompt, 0.7, 600);
  return JSON.parse(raw);
}
