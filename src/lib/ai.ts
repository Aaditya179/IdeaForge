export async function generateAIResponse(prompt: string) {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "phi3:mini",
        prompt: prompt,
        stream: false
      })
    });

    if (!res.ok) {
      if (res.status === 404) {
        return "Local AI model is not available. Please start Ollama.";
      }
      throw new Error(`Ollama API error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.response;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Local AI model is not available. Please start Ollama.";
  }
}
