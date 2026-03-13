"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import CreateRoomModal from "@/components/CreateRoomModal";
import { CATEGORIES } from "@/lib/constants";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/context/AuthContext";

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Inter', sans-serif" },
  main: { marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" },
  hero: {
    background: "linear-gradient(135deg, #eef0ff 0%, #f0eaff 100%)",
    padding: "40px 40px 32px", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#e0e0f0", position: "relative", overflow: "hidden",
  },
  heroBg: {
    position: "absolute", top: -80, right: -80, width: 300, height: 300,
    background: "radial-gradient(circle, rgba(59,59,255,0.08) 0%, transparent 70%)", pointerEvents: "none",
  },
  heroTitle: {
    fontWeight: 800, fontSize: 36,
    color: "#0a0a1a", marginBottom: 20, lineHeight: 1.15, maxWidth: 600, position: "relative",
    letterSpacing: "-0.02em",
  },
  searchBar: {
    display: "flex", alignItems: "center", background: "#fff", borderRadius: 12,
    padding: "12px 20px", gap: 12, maxWidth: 560, borderWidth: "1px", borderStyle: "solid", borderColor: "#e0e0f0",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 16, position: "relative",
  },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 15, color: "#0a0a1a", background: "transparent", fontFamily: "'Inter', sans-serif" },
  heroActions: { display: "flex", gap: 10, position: "relative" },
  btnPrimary: {
    padding: "11px 22px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 14,
    cursor: "pointer", fontFamily: "'Inter', sans-serif", boxShadow: "0 4px 16px rgba(59,59,255,0.3)",
  },
  btnOutline: {
    padding: "11px 22px", background: "#fff", color: "#0a0a1a",
    borderWidth: "1px", borderStyle: "solid", borderColor: "#ddd", borderRadius: 9, fontWeight: 500, fontSize: 14,
    cursor: "pointer", fontFamily: "'Inter', sans-serif",
  },
  content: { flex: 1, padding: "28px 40px", display: "flex", gap: 24 },
  mainCol: { flex: 1 },
  rightCol: { width: 260, flexShrink: 0 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontWeight: 700, fontSize: 18, color: "#0a0a1a" },
  sortRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#555" },
  sortSelect: {
    border: "none", background: "transparent", color: "#3b3bff", fontWeight: 600,
    fontSize: 14, cursor: "pointer", outline: "none", fontFamily: "'Inter', sans-serif",
  },
  catFilters: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  catBtn: (active: boolean) => ({
    padding: "6px 14px", borderRadius: 20,
    borderWidth: active ? "0" : "1px", borderStyle: "solid", borderColor: active ? "transparent" : "#e0e0f0",
    background: active ? "linear-gradient(135deg, #3b3bff, #7b5cff)" : "#fff",
    color: active ? "#fff" : "#555", fontWeight: active ? 700 : 500,
    fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.15s",
  } as const),
  roomsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 },
  roomCard: {
    background: "#fff", borderRadius: 14, padding: 18, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
    cursor: "pointer", transition: "box-shadow 0.2s",
  },
  roomCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  catBadge: (color: string) => ({ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color, padding: "3px 8px", background: color + "15", borderRadius: 20 }),
  aiScore: { display: "flex", alignItems: "center", gap: 4, background: "rgba(255,190,0,0.1)", padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#c8900a" },
  roomTitle: { fontWeight: 700, fontSize: 15, color: "#0a0a1a", marginBottom: 5, lineHeight: 1.3 },
  roomDesc: { fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" as const },
  roomMeta: { display: "flex", gap: 12, fontSize: 12, color: "#888", marginBottom: 12 },
  roomActions: { display: "flex", gap: 8 },
  btnEnter: { flex: 1, padding: "8px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  btnDetails: { padding: "8px 12px", background: "#f5f5fa", color: "#555", borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0", borderRadius: 8, fontWeight: 500, fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  trendLabel: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 18, color: "#0a0a1a", marginBottom: 14 },
  ideaCard: { background: "#fff", borderRadius: 12, padding: 16, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  ideaItem: { borderRightWidth: "1px", borderRightStyle: "solid", borderRightColor: "#f0f0f8", paddingRight: 10 },
  ideaCat: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#3b3bff", textTransform: "uppercase" as const, marginBottom: 3 },
  ideaTitle: { fontSize: 13, fontWeight: 700, color: "#0a0a1a", marginBottom: 4 },
  ideaAuthor: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888" },
  miniAvatar: { width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg, #aaa, #ccc)" },
  filterPanel: { background: "#fff", borderRadius: 14, padding: 18, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0", marginBottom: 14 },
  filterTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase" as const, marginBottom: 10 },
  filterLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#333", marginBottom: 7, cursor: "pointer" },
  checkBox: (on: boolean) => ({ width: 15, height: 15, borderRadius: 4, border: on ? "none" : "2px solid #ddd", background: on ? "#3b3bff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } as const),
  newsCard: { background: "#fff", borderRadius: 12, padding: 16, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0" },
  newsTitle: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888", textTransform: "uppercase" as const, marginBottom: 12 },
  newsItem: { paddingBottom: 10, marginBottom: 10, borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#f0f0f8" },
  newsLabel: { fontSize: 10, fontWeight: 700, color: "#3b3bff", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 2 },
  newsItemTitle: { fontSize: 13, fontWeight: 600, color: "#0a0a1a", lineHeight: 1.4, marginBottom: 2 },
  newsTime: { fontSize: 11, color: "#bbb" },
  emptyState: { textAlign: "center", padding: "40px 0", color: "#bbb", gridColumn: "1 / -1" } as const,
} as const;

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

export default function DashboardPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Trending");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { rooms, loading: roomsLoading } = useRooms();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const filtered = (rooms || []).filter((r) => {
    const catMatch = activeCat === "All" || r.cat === activeCat;
    const searchMatch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  }).sort((a, b) => {
    if (sort === "Trending") return parseFloat(b.score) - parseFloat(a.score);
    if (sort === "Newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sort === "Most Active") return b.participants - a.participants;
    return 0;
  });

  if (authLoading) return null;

  return (
    <div style={S.layout}>
      <DashboardSidebar currentPage="home" />
      <div style={S.main}>
        {/* HERO */}
        <div style={S.hero}>
          <div style={S.heroBg} />
          <h1 style={S.heroTitle}>Hello, what do you want to brainstorm today?</h1>
          <div style={S.searchBar}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input style={S.searchInput} placeholder="Enter a room name or topic to start..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={S.heroActions}>
            <button style={S.btnPrimary} onClick={() => setShowCreateModal(true)}>✦ Create New Room</button>
            <button style={S.btnOutline} onClick={() => router.push("/myrooms")}>Explore Topics</button>
            <button style={S.btnOutline} onClick={() => router.push("/analytics")}>AI Recommendations</button>
          </div>
        </div>

        <div style={S.content}>
          <div style={S.mainCol}>
            <div style={S.sectionHeader}>
              <div style={S.sectionTitle}>Featured Discovery Rooms</div>
              <div style={S.sortRow}>
                Sort by:
                <select style={S.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option>Trending</option>
                  <option>Newest</option>
                  <option>Most Active</option>
                </select>
              </div>
            </div>

            <div style={S.catFilters}>
              {CATEGORIES.map((c: string) => (
                <button key={c} style={S.catBtn(activeCat === c)} onClick={() => setActiveCat(c)}>{c}</button>
              ))}
            </div>

            <div style={S.roomsGrid}>
              {roomsLoading ? (
                <div style={S.emptyState}>Loading rooms...</div>
              ) : filtered.length === 0 ? (
                <div style={S.emptyState}>No rooms match your search.</div>
              ) : filtered.map((r) => (
                <div key={r.id} style={S.roomCard} onClick={() => router.push(`/room/${r.id}`)}>
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
                    <button style={S.btnEnter} onClick={(e) => { e.stopPropagation(); router.push(`/room/${r.id}`); }}>Enter Room</button>
                    <button style={S.btnDetails} onClick={(e) => { e.stopPropagation(); }}>Details</button>
                  </div>
                </div>
              ))}
            </div>

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

          <div style={S.rightCol}>
            <div style={S.filterPanel}>
              <div style={S.filterTitle}>Quick Access</div>
              {CATEGORIES.slice(0, 5).map((c: string, i: number) => (
                <label key={c} style={S.filterLabel} onClick={() => setActiveCat(c)}>
                  <div style={S.checkBox(activeCat === c || (activeCat === "All" && i === 0))}>
                    {(activeCat === c || (activeCat === "All" && i === 0)) && <span style={{ color: "#fff", fontSize: 9 }}>✓</span>}
                  </div>
                  {c}
                </label>
              ))}
            </div>
            <div style={S.newsCard}>
              <div style={S.newsTitle}>Latest Market Data</div>
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

      {showCreateModal && (
        <CreateRoomModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
