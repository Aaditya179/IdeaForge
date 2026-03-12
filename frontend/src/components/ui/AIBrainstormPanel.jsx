import { useState } from "react";
import { generateIdeas, evaluateIdea } from "../../services/gemini.js";

const S = {
  panel: { background: "#fff", borderRadius: 16, border: "1px solid #eaeaf0", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" },
  header: { background: "linear-gradient(135deg, #3b3bff 0%, #7b5cff 100%)", padding: "18px 20px", color: "#fff" },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 },
  headerTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8 },
  headerSub: { fontSize: 11, opacity: 0.75 },
  geminiTag: { background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" },
  body: { padding: 16 },
  genLabel: { fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 7 },
  promptRow: { display: "flex", gap: 8, marginBottom: 8 },
  promptInput: { flex: 1, padding: "9px 12px", border: "1.5px solid #e8e8f0", borderRadius: 9, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#0a0a1a", background: "#fff" },
  countSelect: { padding: "9px 10px", border: "1.5px solid #e8e8f0", borderRadius: 9, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#0a0a1a", background: "#fff", cursor: "pointer", width: 75 },
  btnGenerate: (loading) => ({
    width: "100%", padding: "11px",
    background: loading ? "#9b9bff" : "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13,
    cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: loading ? "none" : "0 4px 14px rgba(59,59,255,0.28)", transition: "all 0.2s",
  }),
  spinner: { width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  errorBox: { background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)", borderRadius: 9, padding: "9px 12px", fontSize: 12, color: "#c0392b", marginBottom: 12, display: "flex", gap: 7 },
  ideasList: { display: "flex", flexDirection: "column", gap: 9, marginTop: 12 },
  ideaCard: { background: "#fafaff", border: "1px solid #eaeaf8", borderRadius: 11, padding: 12, cursor: "pointer" },
  ideaCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  ideaTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#0a0a1a", flex: 1, lineHeight: 1.3 },
  scoreTag: { display: "flex", alignItems: "center", gap: 3, background: "rgba(255,190,0,0.12)", color: "#c8900a", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20, flexShrink: 0, marginLeft: 6 },
  ideaDesc: { fontSize: 11, color: "#777", lineHeight: 1.5, marginBottom: 9 },
  ideaActions: { display: "flex", gap: 7 },
  btnAdd: { flex: 1, padding: "7px", background: "#3b3bff", color: "#fff", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnEval: { padding: "7px 10px", background: "#f0f0ff", color: "#3b3bff", border: "1px solid #d8d8ff", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" },
  emptyState: { textAlign: "center", padding: "18px 0", color: "#bbb", fontSize: 12 },
  // Eval modal
  evalOverlay: { position: "fixed", inset: 0, background: "rgba(10,10,30,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20, backdropFilter: "blur(4px)" },
  evalModal: { background: "#fff", borderRadius: 18, padding: 26, width: "100%", maxWidth: 460, maxHeight: "85vh", overflowY: "auto", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 30px 80px rgba(0,0,0,0.25)", position: "relative" },
  evalClose: { position: "absolute", top: 14, right: 14, width: 26, height: 26, borderRadius: "50%", background: "#f5f5fa", border: "none", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" },
  evalTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#0a0a1a", marginBottom: 3, paddingRight: 30 },
  evalSub: { fontSize: 12, color: "#888", marginBottom: 18 },
  evalScoreRow: { display: "flex", gap: 10, marginBottom: 18 },
  evalScoreCard: (bg) => ({ flex: 1, background: bg, borderRadius: 11, padding: 13, textAlign: "center" }),
  evalScoreLabel: { fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 },
  evalScoreValue: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#0a0a1a" },
  evalSection: { marginBottom: 14 },
  evalSectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 7 },
  evalBarWrap: { marginBottom: 8 },
  evalBarLabel: { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 4 },
  evalBarBg: { height: 5, background: "#f0f0f8", borderRadius: 3 },
  evalBarFill: (w, color) => ({ height: "100%", width: `${w}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }),
  tagList: { display: "flex", flexWrap: "wrap", gap: 5 },
  tagGreen: { background: "rgba(39,174,96,0.1)", color: "#27ae60", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 },
  tagRed: { background: "rgba(231,76,60,0.08)", color: "#c0392b", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 },
  suggBox: { background: "rgba(59,59,255,0.05)", border: "1px solid rgba(59,59,255,0.15)", borderRadius: 9, padding: 12, fontSize: 12, color: "#3b3bff", lineHeight: 1.6, display: "flex", gap: 7 },
  loadingState: { textAlign: "center", padding: 36, color: "#888", fontSize: 13 },
};

if (!document.getElementById("gemini-spin-style")) {
  const s = document.createElement("style");
  s.id = "gemini-spin-style";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}

export default function AIBrainstormPanel({ roomTopic, onAddIdea }) {
  const [prompt, setPrompt] = useState(roomTopic || "");
  const [count, setCount] = useState("5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [evalIdea, setEvalIdea] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Please enter a topic."); return; }
    setLoading(true); setError(""); setIdeas([]);
    try {
      const result = await generateIdeas(prompt, "", parseInt(count));
      setIdeas(result);
    } catch (e) { setError(e.message || "Generation failed."); }
    finally { setLoading(false); }
  };

  const handleEvaluate = async (idea) => {
    setEvalIdea(idea); setEvalResult(null); setEvalLoading(true);
    try {
      const result = await evaluateIdea(idea.title, idea.description, prompt);
      setEvalResult(result);
    } catch (e) { setEvalResult({ error: e.message }); }
    finally { setEvalLoading(false); }
  };

  return (
    <div style={S.panel}>
      <div style={S.header}>
        <div style={S.headerTop}>
          <div style={S.headerTitle}>✦ AI Brainstorm</div>
          <span style={S.geminiTag}>Gemini 2.0</span>
        </div>
        <div style={S.headerSub}>Generate & evaluate ideas instantly</div>
      </div>
      <div style={S.body}>
        <div style={S.genLabel}>Topic / Prompt</div>
        <div style={S.promptRow}>
          <input style={S.promptInput} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. AI in Healthcare..." onKeyDown={(e) => e.key === "Enter" && handleGenerate()} />
          <select style={S.countSelect} value={count} onChange={(e) => setCount(e.target.value)}>
            {[3,5,8,10].map((n) => <option key={n} value={n}>{n} ideas</option>)}
          </select>
        </div>
        <button style={S.btnGenerate(loading)} onClick={handleGenerate} disabled={loading}>
          {loading ? <><div style={S.spinner} /> Generating...</> : "✦ Generate Ideas"}
        </button>
        {error && <div style={{ ...S.errorBox, marginTop: 10 }}>⚠️ {error}</div>}
        {ideas.length > 0 && (
          <div style={S.ideasList}>
            {ideas.map((idea, i) => (
              <div key={i} style={S.ideaCard}>
                <div style={S.ideaCardTop}>
                  <div style={S.ideaTitle}>{idea.title}</div>
                  <div style={S.scoreTag}>⚡ {idea.aiScore}</div>
                </div>
                <div style={S.ideaDesc}>{idea.description}</div>
                <div style={S.ideaActions}>
                  <button style={S.btnAdd} onClick={() => onAddIdea && onAddIdea(idea)}>+ Add to Room</button>
                  <button style={S.btnEval} onClick={() => handleEvaluate(idea)}>🔍 Evaluate</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && ideas.length === 0 && !error && (
          <div style={S.emptyState}>Enter a topic and generate AI ideas ✦</div>
        )}
      </div>

      {evalIdea && (
        <div style={S.evalOverlay} onClick={(e) => e.target === e.currentTarget && setEvalIdea(null)}>
          <div style={S.evalModal}>
            <button style={S.evalClose} onClick={() => setEvalIdea(null)}>✕</button>
            <div style={S.evalTitle}>AI Evaluation</div>
            <div style={S.evalSub}>{evalIdea.title}</div>
            {evalLoading && <div style={S.loadingState}><div style={{ ...S.spinner, margin: "0 auto 10px", width: 24, height: 24, borderWidth: 3 }} /> Evaluating with Gemini...</div>}
            {evalResult && !evalResult.error && (
              <>
                <div style={S.evalScoreRow}>
                  <div style={S.evalScoreCard("rgba(59,59,255,0.06)")}>
                    <div style={S.evalScoreLabel}>Overall Score</div>
                    <div style={S.evalScoreValue}>{evalResult.score}<span style={{ fontSize: 12, color: "#aaa" }}>/10</span></div>
                  </div>
                </div>
                <div style={S.evalSection}>
                  <div style={S.evalSectionTitle}>Metrics</div>
                  {[{ label: "Feasibility", value: evalResult.feasibility, color: "#3b3bff" }, { label: "Market Potential", value: evalResult.marketPotential, color: "#27ae60" }].map((m) => (
                    <div key={m.label} style={S.evalBarWrap}>
                      <div style={S.evalBarLabel}><span>{m.label}</span><span>{m.value}%</span></div>
                      <div style={S.evalBarBg}><div style={S.evalBarFill(m.value, m.color)} /></div>
                    </div>
                  ))}
                </div>
                <div style={S.evalSection}>
                  <div style={S.evalSectionTitle}>Strengths</div>
                  <div style={S.tagList}>{evalResult.strengths?.map((s) => <span key={s} style={S.tagGreen}>{s}</span>)}</div>
                </div>
                <div style={S.evalSection}>
                  <div style={S.evalSectionTitle}>Weaknesses</div>
                  <div style={S.tagList}>{evalResult.weaknesses?.map((w) => <span key={w} style={S.tagRed}>{w}</span>)}</div>
                </div>
                <div style={S.evalSection}>
                  <div style={S.evalSectionTitle}>💡 Suggestion</div>
                  <div style={S.suggBox}><span>→</span> {evalResult.suggestion}</div>
                </div>
              </>
            )}
            {evalResult?.error && <div style={S.errorBox}>⚠️ {evalResult.error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
