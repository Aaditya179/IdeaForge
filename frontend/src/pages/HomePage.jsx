import { useState } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import { ROOMS_DATA, CATEGORIES, USER } from "../data/store.js";

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'DM Sans', sans-serif" },
  main: { marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" },
  hero: {
    background: "linear-gradient(135deg, #eef0ff 0%, #f0eaff 100%)",
    padding: "40px 40px 32px", borderBottom: "1px solid #e0e0f0", position: "relative", overflow: "hidden",
  },
  heroBg: {
    position: "absolute", top: -80, right: -80, width: 300, height: 300,
    background: "radial-gradient(circle, rgba(59,59,255,0.08) 0%, transparent 70%)", pointerEvents: "none",
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36,
    color: "#0a0a1a", marginBottom: 20, lineHeight: 1.15, maxWidth: 600, position: "relative",
  },
  searchBar: {
    display: "flex", alignItems: "center", background: "#fff", borderRadius: 12,
    padding: "12px 20px", gap: 12, maxWidth: 560, border: "1px solid #e0e0f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 16, position: "relative",
  },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 15, color: "#0a0a1a", background: "transparent", fontFamily: "'DM Sans', sans-serif" },
  heroActions: { display: "flex", gap: 10, position: "relative" },
  btnPrimary: {
    padding: "11px 22px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 14,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(59,59,255,0.3)",
  },
  btnOutline: {
    padding: "11px 22px", background: "#fff", color: "#0a0a1a",
    border: "1px solid #ddd", borderRadius: 9, fontWeight: 500, fontSize: 14,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  content: { flex: 1, padding: "28px 40px", display: "flex", gap: 24 },
  mainCol: { flex: 1 },
  rightCol: { width: 260, flexShrink: 0 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#0a0a1a" },
  sortRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#555" },
  sortSelect: {
    border: "none", background: "transparent", color: "#3b3bff", fontWeight: 600,
    fontSize: 14, cursor: "pointer", outline: "none", fontFamily: "'DM Sans', sans-serif",
  },
  catFilters: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  catBtn: (active) => ({
    padding: "6px 14px", borderRadius: 20,
    border: active ? "none" : "1px solid #e0e0f0",
    background: active ? "linear-gradient(135deg, #3b3bff, #7b5cff)" : "#fff",
    color: active ? "#fff" : "#555", fontWeight: active ? 700 : 500,
    fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
  }),
  roomsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 },
  roomCard: {
    background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #eaeaf0",
    cursor: "pointer", transition: "box-shadow 0.2s",
  },
  roomCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  catBadge: (color) => ({ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, padding: "3px 8px", background: color + "15", borderRadius: 20 }),
  aiScore: { display: "flex", alignItems: "center", gap: 4, background: "rgba(255,190,0,0.1)", padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#c8900a" },
  roomTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#0a0a1a", marginBottom: 5, lineHeight: 1.3 },
  roomDesc: { fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  roomMeta: { display: "flex", gap: 12, fontSize: 12, color: "#888", marginBottom: 12 },
  roomActions: { display: "flex", gap: 8 },
  btnEnter: { flex: 1, padding: "8px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  btnDetails: { padding: "8px 12px", background: "#f5f5fa", color: "#555", border: "1px solid #eaeaf0", borderRadius: 8, fontWeight: 500, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  trendLabel: { display: "flex", alignItems: "center", gap: 8, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#0a0a1a", marginBottom: 14 },
  ideaCard: { background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #eaeaf0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  ideaItem: { borderRight: "1px solid #f0f0f8", paddingRight: 10 },
  ideaCat: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#3b3bff", textTransform: "uppercase", marginBottom: 3 },
  ideaTitle: { fontSize: 13, fontWeight: 700, color: "#0a0a1a", marginBottom: 4 },
  ideaAuthor: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888" },
  miniAvatar: { width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg, #aaa, #ccc)" },
  filterPanel: { background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #eaeaf0", marginBottom: 14 },
  filterTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginBottom: 10 },
  filterLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#333", marginBottom: 7, cursor: "pointer" },
  checkBox: (on) => ({ width: 15, height: 15, borderRadius: 4, border: on ? "none" : "2px solid #ddd", background: on ? "#3b3bff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }),
  newsCard: { background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #eaeaf0" },
  newsTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase", marginBottom: 12 },
  newsItem: { paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #f0f0f8" },
  newsLabel: { fontSize: 10, fontWeight: 700, color: "#3b3bff", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 },
  newsItemTitle: { fontSize: 13, fontWeight: 600, color: "#0a0a1a", lineHeight: 1.4, marginBottom: 2 },
  newsTime: { fontSize: 11, color: "#bbb" },
  emptyState: { textAlign: "center", padding: "40px 0", color: "#bbb", gridColumn: "1 / -1" },
};

const TRENDING = [
  { cat: "Sustainable Energy", title: "Decentralized Solar Grid", author: "Sarah M." },
  { cat: "Fintech", title: "AI-Driven Micro-lending", author: "Marcus K." },
  { cat: "Healthcare", title: "VR Rehabilitation Hub", author: "Elena P." },
];

const NEWS = [
  { label: "MARKETS", title: "AI chips reshape semiconductor landscape", time: "2 hours ago" },
  { label: "FUNDING", title: "Next-gen decentralized finance raises $200M", time: "5 hours ago" },
  { label: "TRENDING", title: "The sustainable agri-tech boom of 2024", time: "Yesterday" },
];

export default function HomePage({ onNavigate, onCreateRoom }) {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Trending");

  const filtered = ROOMS_DATA.filter((r) => {
    const catMatch = activeCat === "All" || r.cat === activeCat;
    const searchMatch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  }).sort((a, b) => {
    if (sort === "Trending") return parseFloat(b.score) - parseFloat(a.score);
    if (sort === "Newest") return new Date(b.date) - new Date(a.date);
    if (sort === "Most Active") return b.participants - a.participants;
    return 0;
  });

  return (
    <div style={S.layout}>
      <Sidebar currentPage="home" onNavigate={onNavigate} user={USER} />
      <div style={S.main}>
        {/* HERO */}
        <div style={S.hero}>
          <div style={S.heroBg} />
          <h1 style={S.heroTitle}>Hello, What Do You Want To Brainstorm Today?</h1>
          <div style={S.searchBar}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input style={S.searchInput} placeholder="Enter a room name or topic to start..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={S.heroActions}>
            <button style={S.btnPrimary} onClick={onCreateRoom}>✦ Create New Room</button>
            <button style={S.btnOutline} onClick={() => onNavigate("myrooms")}>Explore Topics</button>
            <button style={S.btnOutline} onClick={() => onNavigate("analytics")}>AI Recommendations</button>
          </div>
        </div>

        <div style={S.content}>
          <div style={S.mainCol}>
            {/* SECTION HEADER */}
            <div style={S.sectionHeader}>
              <div style={S.sectionTitle}>Featured Discovery Rooms</div>
              <div style={S.sortRow}>
                Sort by:
                <select style={S.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option>Trending</option><option>Newest</option><option>Most Active</option>
                </select>
              </div>
            </div>

            {/* CATEGORY FILTERS */}
            <div style={S.catFilters}>
              {CATEGORIES.map((c) => (
                <button key={c} style={S.catBtn(activeCat === c)} onClick={() => setActiveCat(c)}>{c}</button>
              ))}
            </div>

            {/* ROOMS */}
            <div style={S.roomsGrid}>
              {filtered.length === 0 ? (
                <div style={S.emptyState}>No rooms match your filter. Try another category.</div>
              ) : filtered.map((r) => (
                <div key={r.id} style={S.roomCard} onClick={() => onNavigate("room", r)}>
                  <div style={S.roomCardTop}>
                    <span style={S.catBadge(r.catColor)}>{r.cat}</span>
                    <span style={S.aiScore}>⚡ {r.score} AI Score</span>
                  </div>
                  <div style={S.roomTitle}>{r.title}</div>
                  <div style={S.roomDesc}>{r.description}</div>
                  <div style={S.roomMeta}>
                    <span>👥 {r.participants} Participants</span>
                    <span>💡 {r.ideas} Ideas</span>
                  </div>
                  <div style={S.roomActions}>
                    <button style={S.btnEnter} onClick={(e) => { e.stopPropagation(); onNavigate("room", r); }}>Enter Room</button>
                    <button style={S.btnDetails}>Details</button>
                  </div>
                </div>
              ))}
            </div>

            {/* TRENDING */}
            <div>
              <div style={S.trendLabel}>
                <span>📈</span> Trending Ideas
                <span style={{ marginLeft: "auto", fontSize: 13, color: "#3b3bff", cursor: "pointer", fontWeight: 600 }}>View all ideas →</span>
              </div>
              <div style={S.ideaCard}>
                {TRENDING.map((t, i) => (
                  <div key={t.title} style={i < 2 ? S.ideaItem : {}}>
                    <div style={S.ideaCat}>{t.cat}</div>
                    <div style={S.ideaTitle}>{t.title}</div>
                    <div style={S.ideaAuthor}><div style={S.miniAvatar} /> by {t.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div style={S.rightCol}>
            <div style={S.filterPanel}>
              <div style={S.filterTitle}>Categories</div>
              {CATEGORIES.slice(0, 5).map((c, i) => (
                <label key={c} style={S.filterLabel} onClick={() => setActiveCat(c)}>
                  <div style={S.checkBox(activeCat === c || (activeCat === "All" && i === 0))}>
                    {(activeCat === c || (activeCat === "All" && i === 0)) && <span style={{ color: "#fff", fontSize: 9 }}>✓</span>}
                  </div>
                  {c}
                </label>
              ))}
            </div>
            <div style={S.newsCard}>
              <div style={S.newsTitle}>Latest Business News</div>
              {NEWS.map((n, i) => (
                <div key={n.title} style={i < NEWS.length - 1 ? S.newsItem : {}}>
                  <div style={S.newsLabel}>{n.label}</div>
                  <div style={S.newsItemTitle}>{n.title}</div>
                  <div style={S.newsTime}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
