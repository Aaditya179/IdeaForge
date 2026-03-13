"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import CreateRoomModal from "@/components/CreateRoomModal";
import { CATEGORIES } from "@/lib/constants";
import { useRooms } from "@/hooks/useRooms";
import { useAuth } from "@/context/AuthContext";

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" },
  main: { marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" },
  hero: {
    background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)",
    padding: "60px 40px 48px", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "var(--border)", position: "relative", overflow: "hidden",
  },
  heroBg: {
    position: "absolute", top: -80, right: -80, width: 400, height: 400,
    background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", pointerEvents: "none",
  },
  heroTitle: {
    fontWeight: 800, fontSize: 42,
    color: "var(--text-primary)", marginBottom: 24, lineHeight: 1.1, maxWidth: 650, position: "relative",
    letterSpacing: "-0.03em",
  },
  searchBar: {
    display: "flex", alignItems: "center", background: "var(--bg-secondary)", borderRadius: 16,
    padding: "14px 24px", gap: 14, maxWidth: 600, borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.04)", marginBottom: 20, position: "relative",
  },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 16, color: "var(--text-primary)", background: "transparent", fontFamily: "inherit" },
  heroActions: { display: "flex", gap: 12, position: "relative" },
  btnPrimary: {
    padding: "12px 26px", background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
    color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15,
    cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 20px var(--accent-glow)", transition: "all 0.2s"
  },
  btnOutline: {
    padding: "12px 26px", background: "var(--bg-secondary)", color: "var(--text-primary)",
    borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)", borderRadius: 12, fontWeight: 600, fontSize: 15,
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s"
  },
  content: { flex: 1, padding: "32px 40px", display: "flex", gap: 28 },
  mainCol: { flex: 1 },
  rightCol: { width: 280, flexShrink: 0, display: "flex", flexDirection: "column" as const, gap: 24 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.01em" },
  sortRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--text-secondary)", fontWeight: 500 },
  sortSelect: {
    border: "none", background: "transparent", color: "var(--accent)", fontWeight: 700,
    fontSize: 15, cursor: "pointer", outline: "none", fontFamily: "inherit",
  },
  catFilters: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 },
  catBtn: (active: boolean) => ({
    padding: "8px 18px", borderRadius: 24,
    borderWidth: "1.5px", borderStyle: "solid", borderColor: active ? "var(--accent)" : "var(--border)",
    background: active ? "var(--accent)" : "var(--bg-secondary)",
    color: active ? "#fff" : "var(--text-secondary)", fontWeight: active ? 700 : 600,
    fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
    boxShadow: active ? "0 4px 12px var(--accent-glow)" : "none",
  } as const),
  roomsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 },
  roomCard: {
    background: "var(--bg-card)", borderRadius: 18, padding: 22, borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)",
    cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
  },
  roomCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  catBadge: (color: string) => ({ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const, color, padding: "4px 10px", background: color + "20", borderRadius: 20 }),
  aiScore: { display: "flex", alignItems: "center", gap: 5, background: "rgba(255,190,0,0.15)", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 800, color: "#b68305" },
  roomTitle: { fontWeight: 800, fontSize: 18, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.25 },
  roomDesc: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" as const },
  roomMeta: { display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)", marginBottom: 18, fontWeight: 500 },
  roomActions: { display: "flex", gap: 10 },
  btnEnter: { flex: 1, padding: "10px", background: "linear-gradient(135deg, var(--accent), var(--accent-light))", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" },
  btnDetails: { padding: "10px 14px", background: "var(--bg-tertiary)", color: "var(--text-secondary)", borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  trendLabel: { display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 20, color: "var(--text-primary)", marginBottom: 18 },
  ideaCard: { background: "var(--bg-card)", borderRadius: 16, padding: 20, borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" },
  ideaItem: { borderRightWidth: "1px", borderRightStyle: "solid", borderRightColor: "var(--border)", paddingRight: 16 },
  ideaCat: { fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: "var(--accent)", textTransform: "uppercase" as const, marginBottom: 4 },
  ideaTitle: { fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 },
  ideaAuthor: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", fontWeight: 500 },
  miniAvatar: { width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-light), var(--accent))", opacity: 0.8 },
  filterPanel: { background: "var(--bg-card)", borderRadius: 18, padding: 22, borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" },
  filterTitle: { fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" as const, marginBottom: 16 },
  filterLabel: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-secondary)", marginBottom: 10, cursor: "pointer", fontWeight: 600, transition: "color 0.2s" },
  checkBox: (on: boolean) => ({ width: 18, height: 18, borderRadius: 6, border: on ? "none" : "2px solid var(--border)", background: on ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } as const),
  newsCard: { background: "var(--bg-card)", borderRadius: 18, padding: 22, borderWidth: "1.5px", borderStyle: "solid", borderColor: "var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" },
  newsTitle: { fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" as const, marginBottom: 16 },
  newsItem: { paddingBottom: 14, marginBottom: 14, borderBottomWidth: "1.5px", borderBottomStyle: "solid", borderBottomColor: "var(--border)" },
  newsLabel: { fontSize: 11, fontWeight: 800, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 4 },
  newsItemTitle: { fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 4 },
  newsTime: { fontSize: 12, color: "var(--text-muted)", fontWeight: 500 },
  emptyState: { textAlign: "center", padding: "60px 0", color: "var(--text-muted)", gridColumn: "1 / -1", fontSize: 16, fontWeight: 500 } as const,
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
            <span style={{ fontSize: 18, color: "var(--text-muted)" }}>🔍</span>
            <input style={S.searchInput} placeholder="Enter a room name or topic to start..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={S.heroActions}>
            <button style={S.btnPrimary} onClick={() => setShowCreateModal(true)}>✦ Create New Room</button>
            <button style={S.btnOutline} onClick={() => router.push("/myrooms")}>Explore Topics</button>
            <button style={S.btnOutline} onClick={() => router.push("/analytics")}>AI Recommendations</button>
          </div>
        </div>

        <div style={S.content}>
          <div style={{ ...S.mainCol, maxWidth: 1200 }}>
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

            <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={S.catFilters}>
                  {CATEGORIES.map((c: string) => (
                    <button key={c} style={S.catBtn(activeCat === c)} onClick={() => setActiveCat(c)}>{c}</button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 20, overflowX: "auto", paddingBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", alignSelf: "center", marginRight: 8 }}>Quick Access:</div>
                  {CATEGORIES.slice(0, 5).map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setActiveCat(c)}
                      style={{
                        padding: "6px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                        background: activeCat === c ? "var(--accent-glow)" : "var(--bg-tertiary)",
                        color: activeCat === c ? "var(--accent)" : "var(--text-secondary)",
                        border: activeCat === c ? "1px solid var(--accent)" : "1px solid var(--border)",
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      {c}
                    </button>
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

                <div style={S.trendLabel}>
                  <span style={{ color: "var(--accent)" }}>📈</span> Trending Ideas
                  <span style={{ marginLeft: "auto", fontSize: 14, color: "var(--accent)", cursor: "pointer", fontWeight: 700 }}>View all ideas →</span>
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

              {/* Quick Links Integrated into Sidebar or Filter Row */}
              <div style={{ width: 240, flexShrink: 0, display: "none" }}>
                {/* Hidden to focus content left */}
              </div>
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
