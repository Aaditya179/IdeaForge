import { useState } from "react";
import AIBrainstormPanel from "../components/ui/AIBrainstormPanel.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import { USER } from "../data/store.js";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'DM Sans', sans-serif" },
  main: { marginLeft: 220, flex: 1 },
  topbar: {
    display: "flex", alignItems: "center", padding: "14px 32px",
    background: "#fff", borderBottom: "1px solid #eaeaf0", gap: 8,
    position: "sticky", top: 0, zIndex: 5,
  },
  breadcrumb: { fontSize: 13, color: "#888", cursor: "pointer", transition: "color 0.15s" },
  breadcrumbSep: { color: "#ccc", margin: "0 6px" },
  breadcrumbCurrent: { fontSize: 13, fontWeight: 600, color: "#0a0a1a" },
  searchBar: {
    marginLeft: "auto", display: "flex", alignItems: "center", gap: 8,
    background: "#f5f6fa", border: "1px solid #eaeaf0", borderRadius: 9,
    padding: "7px 14px", width: 220,
  },
  searchInput: {
    border: "none", outline: "none", background: "transparent",
    fontSize: 13, color: "#0a0a1a", flex: 1, fontFamily: "'DM Sans', sans-serif",
  },
  notifBtn: { fontSize: 20, cursor: "pointer", marginLeft: 8, background: "none", border: "none" },
  body: { padding: "24px 32px" },
  heroCard: {
    background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #eaeaf0",
    display: "flex", gap: 28, marginBottom: 24, alignItems: "flex-start",
  },
  heroImg: (gradient) => ({
    width: 110, height: 110, borderRadius: 16, background: gradient || "linear-gradient(135deg, #3b3bff, #7b5cff)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0,
  }),
  heroRight: { flex: 1 },
  sessionBadge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "rgba(39,174,96,0.1)", color: "#27ae60",
    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
    padding: "3px 10px", borderRadius: 20, marginBottom: 10,
  },
  sessionDot: { width: 6, height: 6, borderRadius: "50%", background: "#27ae60" },
  heroTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#0a0a1a", marginBottom: 6 },
  heroDesc: { fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16, maxWidth: 580 },
  heroActions: { display: "flex", gap: 10, marginBottom: 20 },
  btnNewIdea: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "10px 20px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 9, fontWeight: 600,
    fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 12px rgba(59,59,255,0.25)",
  },
  btnSecondary: {
    padding: "10px 18px", background: "#f5f5fa", color: "#555",
    border: "1px solid #eaeaf0", borderRadius: 9, fontWeight: 500,
    fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  heroStats: { display: "flex", gap: 28 },
  heroStatLabel: { fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 },
  heroStatValue: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#0a0a1a" },
  contentGrid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 22 },
  ideasHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14,
  },
  ideasTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#0a0a1a", display: "flex", alignItems: "center", gap: 8 },
  viewAll: { fontSize: 13, color: "#3b3bff", fontWeight: 600, cursor: "pointer" },
  noIdeas: { textAlign: "center", padding: "32px 0", color: "#bbb", fontSize: 14 },
  ideaCard: (rank, winner) => ({
    background: winner ? "linear-gradient(135deg, #fffbea, #fff9e0)" : "#fff",
    borderRadius: 14, padding: 18, border: winner ? "2px solid #f39c12" : "1px solid #eaeaf0",
    marginBottom: 10, display: "flex", gap: 14,
    borderLeft: winner ? "4px solid #f39c12" : rank === 1 ? "4px solid #3b3bff" : "1px solid #eaeaf0",
    position: "relative", transition: "box-shadow 0.15s",
  }),
  winnerBadge: {
    position: "absolute", top: -10, right: 14,
    background: "linear-gradient(135deg, #f39c12, #e67e22)",
    color: "#fff", fontSize: 11, fontWeight: 800,
    padding: "3px 12px", borderRadius: 20,
    letterSpacing: "0.06em",
  },
  ideaIconWrap: (bg) => ({
    width: 40, height: 40, borderRadius: 10, background: bg || "rgba(59,59,255,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
  }),
  ideaBody: { flex: 1 },
  ideaTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 },
  ideaTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#0a0a1a", flex: 1, lineHeight: 1.3 },
  ideaRank: { fontSize: 14, fontWeight: 800, color: "#ddd", fontFamily: "'Syne', sans-serif", marginLeft: 8 },
  ideaDesc: { fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 10 },
  ideaFooter: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  aiScoreTag: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#f39c12" },
  btnVote: (voted) => ({
    display: "flex", alignItems: "center", gap: 4,
    padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer",
    background: voted ? "rgba(59,59,255,0.1)" : "#f5f5fa",
    color: voted ? "#3b3bff" : "#888", fontWeight: voted ? 700 : 500,
    fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
  }),
  commentTag: { fontSize: 12, color: "#aaa", display: "flex", alignItems: "center", gap: 4 },
  analyticsCard: {
    background: "#fff", borderRadius: 14, padding: 18,
    border: "1px solid #eaeaf0", marginBottom: 14,
  },
  analyticsTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginBottom: 14 },
  barChart: { display: "flex", gap: 5, height: 90, alignItems: "flex-end", marginBottom: 7 },
  bar: (h, active) => ({
    flex: 1, borderRadius: "3px 3px 0 0",
    background: active ? "linear-gradient(180deg, #3b3bff, #7b5cff)" : "rgba(59,59,255,0.15)",
    height: `${h}%`, transition: "height 0.3s",
  }),
  barLabels: { display: "flex", gap: 5, fontSize: 9, color: "#aaa", justifyContent: "space-between" },
  distTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginTop: 16, marginBottom: 10 },
  distItem: { marginBottom: 10 },
  distHeader: { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#333", marginBottom: 4 },
  distBar: { height: 4, borderRadius: 2, background: "#f0f0f8" },
  distFill: (w, color) => ({ height: "100%", width: `${w}%`, borderRadius: 2, background: color }),
  actionsCard: { background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #eaeaf0" },
  actionsTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginBottom: 12 },
  btnWinning: (disabled) => ({
    width: "100%", padding: "11px",
    background: disabled ? "#e8e8f0" : "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: 9,
    fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 7,
    boxShadow: disabled ? "none" : "0 4px 14px rgba(59,59,255,0.28)",
    marginBottom: 8,
  }),
  btnClearWinner: {
    width: "100%", padding: "9px", background: "transparent", color: "#aaa",
    border: "1px solid #eaeaf0", borderRadius: 9, fontWeight: 500,
    fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  winnerAnnounce: {
    background: "linear-gradient(135deg, #fff9e0, #fffbea)",
    border: "1px solid #f39c12", borderRadius: 10,
    padding: "12px 14px", marginBottom: 12, fontSize: 13,
    color: "#7a4f00", lineHeight: 1.5,
  },
  selectHint: { fontSize: 11, color: "#aaa", marginBottom: 10, lineHeight: 1.5 },

  /* ── Add Idea Modal ── */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(10,10,30,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2000, padding: 20, backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#fff", borderRadius: 18, padding: 28,
    width: "100%", maxWidth: 500, fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 30px 80px rgba(0,0,0,0.25)", position: "relative",
    maxHeight: "90vh", overflowY: "auto",
  },
  modalClose: {
    position: "absolute", top: 14, right: 14, width: 28, height: 28,
    borderRadius: "50%", background: "#f5f5fa", border: "none",
    cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center",
    justifyContent: "center", color: "#888",
  },
  modalTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#0a0a1a", marginBottom: 4 },
  modalSub: { fontSize: 13, color: "#888", marginBottom: 22 },
  mField: { marginBottom: 16 },
  mLabel: { display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 },
  mInput: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e8e8f0",
    borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
    color: "#0a0a1a", boxSizing: "border-box", background: "#fff",
  },
  mTextarea: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e8e8f0",
    borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
    color: "#0a0a1a", boxSizing: "border-box", background: "#fff",
    resize: "vertical", minHeight: 90,
  },
  mFooter: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  mBtnCancel: {
    padding: "10px 20px", background: "transparent", color: "#555", border: "none",
    borderRadius: 9, fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  mBtnSubmit: {
    padding: "10px 24px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 12px rgba(59,59,255,0.3)",
  },
  mError: { fontSize: 12, color: "#e74c3c", marginTop: 4 },
};

/* ─── Static seed data ────────────────────────────────────────────────────── */
const SEED_IDEAS = [
  { id: 1, rank: 1, icon: "🩺", iconBg: "rgba(59,59,255,0.08)", title: "AI-Powered Differential Diagnosis Assistant", desc: "A specialized LLM trained on clinical journals to suggest rare diseases based on patient symptom logs and history.", aiScore: "9.8/10", votes: 342, comments: 12, voted: false, winner: false },
  { id: 2, rank: 2, icon: "📋", iconBg: "rgba(39,174,96,0.08)", title: "Automated Clinical Note Summarizer", desc: "Real-time transcription and structured medical record generation during doctor-patient consultations.", aiScore: "8.5/10", votes: 215, comments: 8, voted: false, winner: false },
  { id: 3, rank: 3, icon: "💊", iconBg: "rgba(255,152,0,0.08)", title: "Predictive Patient Flow Management", desc: "AI forecasting of ER wait times and bed availability based on historical admission data and current trends.", aiScore: "7.9/10", votes: 189, comments: 24, voted: false, winner: false },
];

const ICONS = ["🩺","📋","💊","🧬","🤖","🔬","💡","🚀","🌱","⚡","🎯","🧠"];
const ICON_BGS = ["rgba(59,59,255,0.08)","rgba(39,174,96,0.08)","rgba(255,152,0,0.08)","rgba(155,92,255,0.08)","rgba(231,76,60,0.08)"];
const BAR_DATA = [40, 65, 80, 100, 70, 50, 35];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function RoomDetail({ onNavigate, room }) {
  const roomTitle = room?.title || "AI for Health Tech";
  const roomDesc = room?.description || "Exploring and evaluating large language models to optimize patient diagnosis accuracy and streamline clinical administrative workflows.";
  const roomGradient = room?.gradient;

  const [ideas, setIdeas] = useState(SEED_IDEAS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTitleError, setNewTitleError] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [showWinnerPicker, setShowWinnerPicker] = useState(false);

  /* ── Filtered ideas by search ── */
  const filteredIdeas = ideas.filter((i) =>
    !searchQuery ||
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Vote ── */
  const handleVote = (id) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id
          ? { ...idea, voted: !idea.voted, votes: idea.voted ? idea.votes - 1 : idea.votes + 1 }
          : idea
      ).sort((a, b) => b.votes - a.votes)
        .map((idea, i) => ({ ...idea, rank: i + 1 }))
    );
  };

  /* ── Add idea from form ── */
  const handleAddManual = () => {
    if (!newTitle.trim()) { setNewTitleError(true); return; }
    setNewTitleError(false);
    const newIdea = {
      id: Date.now(),
      rank: ideas.length + 1,
      icon: ICONS[ideas.length % ICONS.length],
      iconBg: ICON_BGS[ideas.length % ICON_BGS.length],
      title: newTitle.trim(),
      desc: newDesc.trim() || "No description provided.",
      aiScore: "—",
      votes: 0,
      comments: 0,
      voted: false,
      winner: false,
    };
    setIdeas((prev) => [...prev, newIdea]);
    setNewTitle("");
    setNewDesc("");
    setShowAddModal(false);
  };

  /* ── Add idea from AI panel ── */
  const handleAddFromAI = (aiIdea) => {
    const newIdea = {
      id: Date.now(),
      rank: ideas.length + 1,
      icon: ICONS[ideas.length % ICONS.length],
      iconBg: ICON_BGS[ideas.length % ICON_BGS.length],
      title: aiIdea.title,
      desc: aiIdea.description,
      aiScore: `${aiIdea.aiScore}/10`,
      votes: 0,
      comments: 0,
      voted: false,
      winner: false,
    };
    setIdeas((prev) => [...prev, newIdea]);
  };

  /* ── Select winner ── */
  const handleSelectWinner = (ideaId) => {
    setIdeas((prev) => prev.map((i) => ({ ...i, winner: i.id === ideaId })));
    setSelectedWinner(ideas.find((i) => i.id === ideaId));
    setShowWinnerPicker(false);
  };

  const handleClearWinner = () => {
    setIdeas((prev) => prev.map((i) => ({ ...i, winner: false })));
    setSelectedWinner(null);
  };

  const currentWinner = ideas.find((i) => i.winner);
  const totalVotes = ideas.reduce((s, i) => s + i.votes, 0);

  return (
    <div style={S.layout}>
      <Sidebar currentPage="myrooms" onNavigate={onNavigate} user={USER} />

      <div style={S.main}>
        {/* TOPBAR */}
        <div style={S.topbar}>
          <span style={S.breadcrumb} onClick={() => onNavigate("myrooms")}>Rooms</span>
          <span style={S.breadcrumbSep}>/</span>
          <span style={S.breadcrumbCurrent}>{roomTitle}</span>
          <div style={S.searchBar}>
            <span>🔍</span>
            <input
              style={S.searchInput}
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <span style={{ cursor: "pointer", color: "#aaa", fontSize: 12 }} onClick={() => setSearchQuery("")}>✕</span>
            )}
          </div>
          <button style={S.notifBtn} onClick={() => onNavigate("notifications")}>🔔</button>
        </div>

        <div style={S.body}>
          {/* HERO */}
          <div style={S.heroCard}>
            <div style={S.heroImg(roomGradient)}>
              {room?.cat === "Healthcare" ? "🏥" : room?.cat === "Environment" ? "🌱" : room?.cat === "Finance" ? "💰" : room?.cat === "Startup" ? "🚀" : room?.cat === "HR" ? "👔" : "💡"}
            </div>
            <div style={S.heroRight}>
              <div style={S.sessionBadge}><div style={S.sessionDot} /> ACTIVE SESSION</div>
              <h1 style={S.heroTitle}>{roomTitle}</h1>
              <p style={S.heroDesc}>{roomDesc}</p>
              <div style={S.heroActions}>
                <button style={S.btnNewIdea} onClick={() => setShowAddModal(true)}>+ New Idea</button>
                <button style={S.btnSecondary} onClick={() => setShowAddModal(true)}>✦ AI Generate</button>
              </div>
              <div style={S.heroStats}>
                {[
                  { label: "Participants", value: `${room?.participants || 24} Users` },
                  { label: "Total Ideas", value: `${ideas.length} Submissions` },
                  { label: "Total Votes", value: totalVotes.toLocaleString() },
                  { label: "Category", value: room?.cat || "Healthcare" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={S.heroStatLabel}>{s.label}</div>
                    <div style={S.heroStatValue}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div style={S.contentGrid}>
            {/* IDEAS LIST */}
            <div>
              <div style={S.ideasHeader}>
                <div style={S.ideasTitle}>
                  🏆 {searchQuery ? `Results for "${searchQuery}"` : "Top Ranked Ideas"}
                  <span style={{ fontSize: 13, color: "#aaa", fontWeight: 400 }}>({filteredIdeas.length})</span>
                </div>
                <span style={S.viewAll} onClick={() => setSearchQuery("")}>
                  {searchQuery ? "Clear search" : `View all ${ideas.length} →`}
                </span>
              </div>

              {filteredIdeas.length === 0 ? (
                <div style={S.noIdeas}>
                  {searchQuery ? `No ideas match "${searchQuery}"` : "No ideas yet — be the first to add one!"}
                </div>
              ) : filteredIdeas.map((idea) => (
                <div key={idea.id} style={S.ideaCard(idea.rank, idea.winner)}>
                  {idea.winner && <div style={S.winnerBadge}>🏆 WINNER</div>}
                  <div style={S.ideaIconWrap(idea.iconBg)}>{idea.icon}</div>
                  <div style={S.ideaBody}>
                    <div style={S.ideaTitleRow}>
                      <div style={S.ideaTitle}>{idea.title}</div>
                      <div style={S.ideaRank}>#{idea.rank}</div>
                    </div>
                    <div style={S.ideaDesc}>{idea.desc}</div>
                    <div style={S.ideaFooter}>
                      {idea.aiScore !== "—" && (
                        <span style={S.aiScoreTag}>⚡ {idea.aiScore}</span>
                      )}
                      <button style={S.btnVote(idea.voted)} onClick={() => handleVote(idea.id)}>
                        👍 {idea.votes}
                      </button>
                      <span style={S.commentTag}>💬 {idea.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* AI PANEL */}
              <div style={{ marginBottom: 14 }}>
                <AIBrainstormPanel roomTopic={roomTitle} onAddIdea={handleAddFromAI} />
              </div>

              {/* ANALYTICS */}
              <div style={S.analyticsCard}>
                <div style={S.analyticsTitle}>📊 Analytics</div>
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 8, fontWeight: 600, letterSpacing: "0.06em" }}>IDEAS OVER TIME</div>
                <div style={S.barChart}>
                  {BAR_DATA.map((h, i) => <div key={i} style={S.bar(h, i === 3)} />)}
                </div>
                <div style={S.barLabels}>{DAYS.map((d) => <span key={d}>{d}</span>)}</div>
                <div style={S.distTitle}>VOTE DISTRIBUTION</div>
                {ideas.slice(0, 3).map((idea, i) => {
                  const pct = totalVotes > 0 ? Math.round((idea.votes / totalVotes) * 100) : 0;
                  return (
                    <div key={idea.id} style={S.distItem}>
                      <div style={S.distHeader}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{idea.title.split(" ").slice(0, 3).join(" ")}…</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={S.distBar}>
                        <div style={S.distFill(pct, ["#3b3bff","#27ae60","#e74c3c"][i])} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ROOM ACTIONS */}
              <div style={S.actionsCard}>
                <div style={S.actionsTitle}>ROOM ACTIONS</div>

                {currentWinner ? (
                  <>
                    <div style={S.winnerAnnounce}>
                      🏆 <strong>Winner selected!</strong><br />
                      "{currentWinner.title.slice(0, 50)}..."
                    </div>
                    <button style={S.btnClearWinner} onClick={handleClearWinner}>
                      ✕ Clear winner
                    </button>
                  </>
                ) : showWinnerPicker ? (
                  <>
                    <div style={S.selectHint}>Click an idea below to mark it as the winner:</div>
                    {ideas.map((idea) => (
                      <div
                        key={idea.id}
                        onClick={() => handleSelectWinner(idea.id)}
                        style={{
                          padding: "9px 12px", background: "#f9f9ff",
                          border: "1px solid #eaeaf8", borderRadius: 8,
                          marginBottom: 7, cursor: "pointer", fontSize: 13,
                          fontWeight: 600, color: "#333",
                          display: "flex", alignItems: "center", gap: 8,
                          transition: "background 0.15s",
                        }}
                      >
                        <span>#{idea.rank}</span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {idea.title}
                        </span>
                        <span style={{ color: "#3b3bff", fontSize: 12 }}>Select</span>
                      </div>
                    ))}
                    <button style={S.btnClearWinner} onClick={() => setShowWinnerPicker(false)}>Cancel</button>
                  </>
                ) : (
                  <button style={S.btnWinning(ideas.length === 0)} onClick={() => setShowWinnerPicker(true)} disabled={ideas.length === 0}>
                    🏆 Select Winning Idea
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD IDEA MODAL */}
      {showAddModal && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div style={S.modal}>
            <button style={S.modalClose} onClick={() => setShowAddModal(false)}>✕</button>
            <div style={S.modalTitle}>Add New Idea 💡</div>
            <div style={S.modalSub}>Share your idea with the room participants</div>
            <div style={S.mField}>
              <label style={S.mLabel}>Idea Title <span style={{ color: "#e74c3c" }}>*</span></label>
              <input
                style={{ ...S.mInput, borderColor: newTitleError ? "#e74c3c" : "#e8e8f0" }}
                placeholder="e.g. AI-Powered Diagnosis Tool"
                value={newTitle}
                onChange={(e) => { setNewTitle(e.target.value); setNewTitleError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
                autoFocus
              />
              {newTitleError && <div style={S.mError}>Title is required</div>}
            </div>
            <div style={S.mField}>
              <label style={S.mLabel}>Description</label>
              <textarea
                style={S.mTextarea}
                placeholder="Briefly explain your idea and its value..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>
            <div style={S.mFooter}>
              <button style={S.mBtnCancel} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button style={S.mBtnSubmit} onClick={handleAddManual}>Submit Idea →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
