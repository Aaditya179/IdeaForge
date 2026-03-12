import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import { ROOMS_DATA, USER } from "../data/store.js";
import { generateRoomSummary } from "../services/gemini.js";

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'DM Sans', sans-serif" },
  main: { marginLeft: 220, flex: 1 },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 32px", background: "#fff", borderBottom: "1px solid #eaeaf0",
    position: "sticky", top: 0, zIndex: 5,
  },
  topTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#0a0a1a" },
  topSub: { fontSize: 13, color: "#888", marginTop: 2 },
  body: { padding: "28px 32px" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24,
  },
  statCard: {
    background: "#fff", borderRadius: 14, padding: 20, border: "1px solid #eaeaf0",
  },
  statLabel: { fontSize: 13, color: "#888", marginBottom: 10 },
  statValue: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#0a0a1a",
  },
  statChange: (pos) => ({
    fontSize: 12, color: pos ? "#27ae60" : "#e74c3c", fontWeight: 600, marginTop: 4,
  }),
  contentGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20,
  },
  card: {
    background: "#fff", borderRadius: 14, padding: 22, border: "1px solid #eaeaf0",
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#0a0a1a", marginBottom: 18,
    display: "flex", alignItems: "center", gap: 8,
  },
  barChart: {
    display: "flex", gap: 8, height: 140, alignItems: "flex-end", marginBottom: 10,
  },
  barCol: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 6 },
  bar: (h, color) => ({
    width: "100%", borderRadius: "5px 5px 0 0",
    background: color, height: `${h}%`, minHeight: 4, transition: "height 0.6s ease",
  }),
  barLabel: { fontSize: 11, color: "#aaa", fontWeight: 600 },
  barValue: { fontSize: 11, color: "#555", fontWeight: 700 },
  legend: { display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10 },
  legendItem: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" },
  legendDot: (color) => ({ width: 8, height: 8, borderRadius: "50%", background: color }),
  roomRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 0", borderBottom: "1px solid #f5f5f8",
  },
  roomLeft: { display: "flex", alignItems: "center", gap: 12 },
  roomIcon: (bg) => ({
    width: 36, height: 36, borderRadius: 9, background: bg,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
  }),
  roomName: { fontSize: 14, fontWeight: 600, color: "#0a0a1a", marginBottom: 2 },
  roomMeta: { fontSize: 12, color: "#aaa" },
  roomScore: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
    color: "#3b3bff",
  },
  aiCard: {
    background: "linear-gradient(135deg, #0d0d2b, #1a1050)",
    borderRadius: 14, padding: 22, color: "#fff", marginBottom: 20,
    border: "1px solid rgba(59,59,255,0.3)",
    gridColumn: "1 / -1",
  },
  aiCardTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16,
    marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
  },
  aiGeminiTag: {
    background: "rgba(255,255,255,0.12)", borderRadius: 20,
    fontSize: 11, fontWeight: 700, padding: "3px 10px", letterSpacing: "0.05em",
  },
  aiBody: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  aiSection: {
    background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 16,
  },
  aiSectionTitle: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8,
  },
  aiText: { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 },
  aiInsightItem: {
    display: "flex", alignItems: "flex-start", gap: 8,
    fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 8, lineHeight: 1.5,
  },
  aiBtnRefresh: {
    marginTop: 16, padding: "8px 18px",
    background: "rgba(255,255,255,0.12)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8,
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center", gap: 6,
  },
  spinner: {
    width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  progressItem: { marginBottom: 14 },
  progressHeader: {
    display: "flex", justifyContent: "space-between",
    fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 5,
  },
  progressBg: { height: 6, background: "#f0f0f8", borderRadius: 3 },
  progressFill: (w, color) => ({
    height: "100%", width: `${w}%`, background: color, borderRadius: 3, transition: "width 0.8s ease",
  }),
};

if (!document.getElementById("spin-kf")) {
  const st = document.createElement("style");
  st.id = "spin-kf";
  st.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(st);
}

const COLORS = ["#3b3bff", "#27ae60", "#f39c12", "#9b5cff", "#e74c3c"];
const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
const IDEAS_OVER_TIME = [22, 38, 65, 52, 78, 91];
const PARTICIPANTS_OVER_TIME = [10, 18, 25, 32, 40, 52];

export default function AnalyticsPage({ onNavigate }) {
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(ROOMS_DATA[0]);

  const fetchSummary = async (room) => {
    setAiLoading(true);
    setAiSummary(null);
    try {
      const ideas = [
        { title: "AI Diagnosis Assistant", desc: "LLM for rare disease detection" },
        { title: "Clinical Note Summarizer", desc: "Automated medical record generation" },
        { title: "Patient Flow AI", desc: "ER wait time prediction" },
      ];
      const result = await generateRoomSummary(room.title, ideas);
      setAiSummary(result);
    } catch (e) {
      setAiSummary({ error: e.message });
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => { fetchSummary(selectedRoom); }, []);

  const totalIdeas = ROOMS_DATA.reduce((s, r) => s + r.ideas, 0);
  const totalPart = ROOMS_DATA.reduce((s, r) => s + r.participants, 0);

  return (
    <div style={S.layout}>
      <Sidebar currentPage="analytics" onNavigate={onNavigate} user={USER} />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topTitle}>Analytics</div>
            <div style={S.topSub}>Track performance across all your brainstorm sessions</div>
          </div>
        </div>

        <div style={S.body}>
          {/* STATS */}
          <div style={S.statsGrid}>
            {[
              { label: "Total Ideas Generated", value: totalIdeas, change: "+18% this month", pos: true },
              { label: "Active Participants", value: totalPart, change: "+8% today", pos: true },
              { label: "Brainstorm Rooms", value: ROOMS_DATA.length, change: "+2 this week", pos: true },
              { label: "Avg AI Score", value: "9.1", change: "Steady performance", pos: true },
            ].map((s) => (
              <div key={s.label} style={S.statCard}>
                <div style={S.statLabel}>{s.label}</div>
                <div style={S.statValue}>{s.value}</div>
                <div style={S.statChange(s.pos)}>↗ {s.change}</div>
              </div>
            ))}
          </div>

          {/* AI INSIGHT CARD */}
          <div style={{ ...S.contentGrid, gridTemplateColumns: "1fr" }}>
            <div style={S.aiCard}>
              <div style={S.aiCardTitle}>
                ✦ AI Session Summary
                <span style={S.aiGeminiTag}>Gemini 2.0</span>
                <select
                  style={{
                    marginLeft: "auto", padding: "5px 10px", borderRadius: 7,
                    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff", fontSize: 12, cursor: "pointer", outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  value={selectedRoom.id}
                  onChange={(e) => {
                    const room = ROOMS_DATA.find((r) => r.id === e.target.value);
                    setSelectedRoom(room);
                    fetchSummary(room);
                  }}
                >
                  {ROOMS_DATA.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>

              {aiLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                  <div style={S.spinner} /> Generating AI analysis with Gemini...
                </div>
              )}

              {aiSummary && !aiSummary.error && (
                <div style={S.aiBody}>
                  <div style={S.aiSection}>
                    <div style={S.aiSectionTitle}>Summary</div>
                    <div style={S.aiText}>{aiSummary.summary}</div>
                    <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                      Top Theme: <span style={{ color: "#a0a0ff", fontWeight: 700 }}>{aiSummary.topTheme}</span>
                    </div>
                  </div>
                  <div style={S.aiSection}>
                    <div style={S.aiSectionTitle}>Recommendation</div>
                    <div style={{ ...S.aiText, color: "#a0ffb0" }}>→ {aiSummary.recommendation}</div>
                  </div>
                  <div style={S.aiSection}>
                    <div style={S.aiSectionTitle}>Key Insights</div>
                    {aiSummary.insights?.map((ins, i) => (
                      <div key={i} style={S.aiInsightItem}>
                        <span style={{ color: "#6060ff", fontWeight: 700 }}>✦</span> {ins}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiSummary?.error && (
                <div style={{ color: "#ff8080", fontSize: 13 }}>⚠️ {aiSummary.error}</div>
              )}

              <button style={S.aiBtnRefresh} onClick={() => fetchSummary(selectedRoom)} disabled={aiLoading}>
                {aiLoading ? <div style={S.spinner} /> : "↺"} Regenerate Analysis
              </button>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div style={S.contentGrid}>
            {/* Ideas over time */}
            <div style={S.card}>
              <div style={S.cardTitle}>📈 Ideas Submitted Over Time</div>
              <div style={S.barChart}>
                {IDEAS_OVER_TIME.map((v, i) => (
                  <div key={i} style={S.barCol}>
                    <div style={S.barValue}>{v}</div>
                    <div style={S.bar((v / 100) * 100, i === 5 ? "#3b3bff" : "rgba(59,59,255,0.2)")} />
                    <div style={S.barLabel}>{MONTHS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants growth */}
            <div style={S.card}>
              <div style={S.cardTitle}>👥 Participant Growth</div>
              <div style={S.barChart}>
                {PARTICIPANTS_OVER_TIME.map((v, i) => (
                  <div key={i} style={S.barCol}>
                    <div style={S.barValue}>{v}</div>
                    <div style={S.bar((v / 60) * 100, i === 5 ? "#27ae60" : "rgba(39,174,96,0.2)")} />
                    <div style={S.barLabel}>{MONTHS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top rooms */}
            <div style={S.card}>
              <div style={S.cardTitle}>🏆 Top Performing Rooms</div>
              {ROOMS_DATA.slice(0, 5).map((r, i) => (
                <div key={r.id} style={{ ...S.roomRow, borderBottom: i < 4 ? "1px solid #f5f5f8" : "none" }}>
                  <div style={S.roomLeft}>
                    <div style={S.roomIcon(`${r.catColor}15`)}>{["🏥","🌱","👔","💰","🚀"][i]}</div>
                    <div>
                      <div style={S.roomName}>{r.title}</div>
                      <div style={S.roomMeta}>{r.participants} participants · {r.ideas} ideas</div>
                    </div>
                  </div>
                  <div style={S.roomScore}>{r.score}</div>
                </div>
              ))}
            </div>

            {/* Category distribution */}
            <div style={S.card}>
              <div style={S.cardTitle}>📊 Category Distribution</div>
              {ROOMS_DATA.map((r, i) => (
                <div key={r.id} style={S.progressItem}>
                  <div style={S.progressHeader}>
                    <span>{r.title}</span>
                    <span>{r.ideas} ideas</span>
                  </div>
                  <div style={S.progressBg}>
                    <div style={S.progressFill((r.ideas / 120) * 100, COLORS[i % COLORS.length])} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
