"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useRooms } from "@/hooks/useRooms";
import { generateRoomSummary, RoomSummary } from "@/services/ai";
import { useAuth } from "@/context/AuthContext";

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Inter', sans-serif" },
  main: { marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" },
  topbar: {
    padding: "16px 32px", background: "#fff", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#eaeaf0",
    position: "sticky" as const, top: 0, zIndex: 5,
  },
  topTitle: { fontWeight: 700, fontSize: 20, color: "#0a0a1a" },
  body: { padding: "28px 32px" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24,
  },
  statCard: {
    background: "#fff", borderRadius: 14, padding: 20, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
  },
  statLabel: { fontSize: 13, color: "#888", marginBottom: 10 },
  statValue: {
    fontWeight: 800, fontSize: 28, color: "#0a0a1a",
  },
  statChange: (pos: boolean) => ({
    fontSize: 12, color: pos ? "#27ae60" : "#e74c3c", fontWeight: 600, marginTop: 4,
  }),
  contentGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20,
  },
  card: {
    background: "#fff", borderRadius: 14, padding: 22, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
  },
  cardTitle: {
    fontWeight: 700, fontSize: 15, color: "#0a0a1a", marginBottom: 18,
    display: "flex", alignItems: "center", gap: 8,
  },
  barChart: {
    display: "flex", gap: 8, height: 140, alignItems: "flex-end", marginBottom: 10,
  },
  barCol: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 6 },
  bar: (h: number, color: string) => ({
    width: "100%", borderRadius: "5px 5px 0 0",
    background: color, height: `${h}%`, minHeight: 4, transition: "height 0.6s ease",
  }),
  barLabel: { fontSize: 11, color: "#aaa", fontWeight: 600 },
  barValue: { fontSize: 11, color: "#555", fontWeight: 700 },
  roomRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 0", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#f5f5f8",
  },
  roomLeft: { display: "flex", alignItems: "center", gap: 12 },
  roomIcon: (bg: string) => ({
    width: 36, height: 36, borderRadius: 9, background: bg,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
  }),
  roomName: { fontSize: 14, fontWeight: 600, color: "#0a0a1a", marginBottom: 2 },
  roomMeta: { fontSize: 12, color: "#aaa" },
  roomScore: {
    fontWeight: 700, fontSize: 15,
    color: "#3b3bff",
  },
  aiCard: {
    background: "linear-gradient(135deg, #0d0d2b, #1a1050)",
    borderRadius: 14, padding: 22, color: "#fff", marginBottom: 20,
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(59,59,255,0.3)",
    gridColumn: "1 / -1",
  },
  aiCardTitle: {
    fontWeight: 800, fontSize: 16,
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
    color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, marginBottom: 8,
  },
  aiText: { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 },
  aiInsightItem: {
    display: "flex", alignItems: "flex-start", gap: 8,
    fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 8, lineHeight: 1.5,
  },
  aiBtnRefresh: {
    marginTop: 16, padding: "8px 18px",
    background: "rgba(255,255,255,0.12)", color: "#fff",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.2)", borderRadius: 8,
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
    display: "flex", alignItems: "center", gap: 6,
  },
  spinner: {
    width: 14, height: 14,
    borderWidth: "2px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  progressItem: { marginBottom: 14 },
  progressHeader: {
    display: "flex", justifyContent: "space-between",
    fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 5,
  },
  progressBg: { height: 6, background: "#f0f0f8", borderRadius: 3 },
  progressFill: (w: number, color: string) => ({
    height: "100%", width: `${w}%`, background: color, borderRadius: 3, transition: "width 0.8s ease",
  }),
  roomSelect: {
    padding: "8px 14px", borderRadius: 9, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
    fontSize: 13, fontWeight: 600, color: "#3b3bff", outline: "none",
    cursor: "pointer", background: "#fff", fontFamily: "'Inter', sans-serif"
  },
} as const;

const COLORS = ["#3b3bff", "#27ae60", "#f39c12", "#9b5cff", "#e74c3c"];
const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
const IDEAS_OVER_TIME = [22, 38, 65, 52, 78, 91];
const PARTICIPANTS_OVER_TIME = [10, 18, 25, 32, 40, 52];

export default function AnalyticsPage() {
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [summary, setSummary] = useState<RoomSummary | { error: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { rooms, loading: roomsLoading } = useRooms();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!selectedRoomId && rooms && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  const selectedRoom = rooms?.find((r) => r.id === selectedRoomId);

  const fetchSummary = async (room: any) => {
    if (!room) return;
    setAiLoading(true);
    setSummary(null);
    try {
      // In a real app we'd fetch actual ideas for this room
      const ideas = [
        { title: "AI Diagnosis Assistant", description: "LLM for rare disease detection" },
        { title: "Clinical Note Summarizer", description: "Automated medical record generation" },
        { title: "Patient Flow AI", description: "ER wait time prediction" },
      ];
      const result = await generateRoomSummary(room.title, ideas);
      setSummary(result);
    } catch (e: any) {
      setSummary({ error: e.message });
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      fetchSummary(selectedRoom);
    }
  }, [selectedRoomId, rooms]);

  const totalIdeas = (rooms || []).reduce((s, r) => s + (r.ideas || 0), 0);
  const totalPart = (rooms || []).reduce((s, r) => s + (r.participants || 0), 0);

  if (authLoading) return null;

  return (
    <div style={S.layout}>
      <DashboardSidebar currentPage="analytics" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={S.topTitle}>AI Room Analytics</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Generate deep insights from your brainstorm sessions</div>
          </div>
          <select
            style={S.roomSelect}
            value={selectedRoomId}
            onChange={(e) => {
              setSelectedRoomId(e.target.value);
              setSummary(null);
            }}
          >
            {rooms?.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>

        <div style={S.body}>
          {roomsLoading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading analytics...</div>
          ) : rooms?.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
              No rooms created yet. Create a room to see analytics!
            </div>
          ) : (
            <>
              {/* STATS */}
              <div style={S.statsGrid}>
                {[
                  { label: "Total Ideas Generated", value: totalIdeas, change: "+18% this month", pos: true },
                  { label: "Active Participants", value: totalPart, change: "+8% today", pos: true },
                  { label: "Brainstorm Rooms", value: rooms.length, change: "+2 this week", pos: true },
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
                    <span style={S.aiGeminiTag}>Ollama</span>
                    <select
                      style={{
                        marginLeft: "auto", padding: "5px 10px", borderRadius: 7,
                        background: "rgba(255,255,255,0.12)", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.2)",
                        color: "#fff", fontSize: 12, cursor: "pointer", outline: "none",
                        fontFamily: "'Inter', sans-serif",
                      }}
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                    >
                      {rooms?.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                    </select>
                  </div>

                  {aiLoading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
                      <div style={S.spinner} /> Generating AI analysis with Ollama...
                    </div>
                  )}

                  {summary && !('error' in summary) && (
                    <div style={S.aiBody}>
                      <div style={S.aiSection}>
                        <div style={S.aiSectionTitle}>Summary</div>
                        <div style={S.aiText}>{summary.summary}</div>
                        <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                          Top Theme: <span style={{ color: "#a0a0ff", fontWeight: 700 }}>{summary.topTheme}</span>
                        </div>
                      </div>
                      <div style={S.aiSection}>
                        <div style={S.aiSectionTitle}>Recommendation</div>
                        <div style={{ ...S.aiText, color: "#a0ffb0" }}>→ {summary.recommendation}</div>
                      </div>
                      <div style={S.aiSection}>
                        <div style={S.aiSectionTitle}>Key Insights</div>
                        {summary.insights?.map((ins, i) => (
                          <div key={i} style={S.aiInsightItem}>
                            <span style={{ color: "#6060ff", fontWeight: 700 }}>✦</span> {ins}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {summary && 'error' in summary && (
                    <div style={{ color: "#ff8080", fontSize: 13 }}>⚠️ {summary.error}</div>
                  )}

                  <button style={S.aiBtnRefresh} onClick={() => fetchSummary(selectedRoom)} disabled={aiLoading}>
                    {aiLoading ? <div style={S.spinner} /> : "↺"} Regenerate Analysis
                  </button>
                </div>
              </div>

              {/* CHARTS ROW */}
              <div style={S.contentGrid}>
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

                <div style={S.card}>
                  <div style={S.cardTitle}>🏆 Top Performing Rooms</div>
                  {rooms.slice(0, 5).map((r, i) => (
                    <div key={r.id} style={{ ...S.roomRow, borderBottom: i < 4 ? "1px solid #f5f5f8" : "none" }}>
                      <div style={S.roomLeft}>
                        <div style={S.roomIcon(`${r.catColor || "#3b3bff"}15`)}>{["🏥", "🌱", "👔", "💰", "🚀"][i % 5]}</div>
                        <div>
                          <div style={S.roomName}>{r.title}</div>
                          <div style={S.roomMeta}>{r.participants} participants · {r.ideas} ideas</div>
                        </div>
                      </div>
                      <div style={S.roomScore}>{r.score}</div>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <div style={S.cardTitle}>📊 Category Distribution</div>
                  {rooms.slice(0, 5).map((r, i) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
