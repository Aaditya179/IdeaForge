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
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 32px", background: "#fff", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#eaeaf0",
    position: "sticky" as const, top: 0, zIndex: 5,
  },
  topTitle: { fontWeight: 700, fontSize: 20, color: "#0a0a1a" },
  topRight: { display: "flex", alignItems: "center", gap: 12 },
  searchBar: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#f5f6fa", borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0", borderRadius: 9,
    padding: "8px 14px", width: 240,
  },
  searchInput: {
    border: "none", outline: "none", background: "transparent",
    fontSize: 13, color: "#0a0a1a", flex: 1, fontFamily: "'Inter', sans-serif",
  },
  btnCreate: {
    padding: "9px 18px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 9, fontWeight: 600,
    fontSize: 13, cursor: "pointer", fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 12px rgba(59,59,255,0.25)",
  },
  body: { padding: "28px 32px" },
  filterBar: {
    display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" as const, alignItems: "center",
  },
  filterLabel: { fontSize: 13, fontWeight: 600, color: "#555" },
  catBtn: (active: boolean) => ({
    padding: "7px 16px", borderRadius: 20,
    borderWidth: active ? "0" : "1px", borderStyle: "solid", borderColor: active ? "transparent" : "#e0e0f0",
    background: active ? "linear-gradient(135deg, #3b3bff, #7b5cff)" : "#fff",
    color: active ? "#fff" : "#555",
    fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.15s",
  } as const),
  statusRow: { display: "flex", gap: 8, marginLeft: "auto" },
  statusBtn: (active: boolean) => ({
    padding: "7px 14px", borderRadius: 20,
    borderWidth: active ? "0" : "1px", borderStyle: "solid", borderColor: active ? "transparent" : "#e0e0f0",
    background: active ? "#0a0a1a" : "#fff",
    color: active ? "#fff" : "#555",
    fontWeight: 500, fontSize: 13, cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  } as const),
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28,
  },
  statCard: {
    background: "#fff", borderRadius: 12, padding: "16px 20px",
    borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
    display: "flex", alignItems: "center", gap: 14,
  },
  statIcon: (bg: string) => ({
    width: 40, height: 40, borderRadius: 10, background: bg,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 as const,
  }),
  statValue: {
    fontWeight: 800, fontSize: 22, color: "#0a0a1a", lineHeight: 1,
  },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  sectionTitle: {
    fontWeight: 700, fontSize: 16, color: "#0a0a1a", marginBottom: 16,
  },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32,
  },
  card: {
    background: "#fff", borderRadius: 14, overflow: "hidden" as const,
    borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0", cursor: "pointer",
    transition: "box-shadow 0.2s, transform 0.2s",
  },
  cardImg: (gradient: string) => ({
    height: 100, background: gradient, position: "relative" as const,
    display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: 12,
  }),
  statusBadge: (active: boolean) => ({
    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const,
    padding: "3px 9px", borderRadius: 20,
    background: active ? "rgba(39,174,96,0.9)" : "rgba(200,50,50,0.85)", color: "#fff",
  }),
  scoreBadge: {
    background: "rgba(255,190,0,0.9)", color: "#7a4f00",
    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
    display: "flex", alignItems: "center", gap: 3,
  },
  cardBody: { padding: 16 },
  cardCatRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 5 },
  catDot: (color: string) => ({
    width: 7, height: 7, borderRadius: "50%", background: color,
  }),
  cardCat: { fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase" as const, letterSpacing: "0.08em" },
  cardTitle: {
    fontWeight: 700, fontSize: 15,
    color: "#0a0a1a", marginBottom: 8, lineHeight: 1.3,
  },
  cardMeta: { display: "flex", gap: 12, fontSize: 12, color: "#aaa", marginBottom: 12 },
  cardFooter: { display: "flex", gap: 8 },
  btnEnter: {
    flex: 1, padding: "8px",
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 8,
    fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
  },
  btnDets: {
    padding: "8px 12px", background: "#f5f5fa", color: "#555",
    borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0", borderRadius: 8, fontWeight: 500,
    fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
  },
  emptyState: {
    textAlign: "center" as const, padding: "60px 0", color: "#bbb",
    gridColumn: "1 / -1",
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, fontWeight: 600, color: "#aaa" },
  emptySub: { fontSize: 13, color: "#ccc", marginTop: 6 },
} as const;

export default function MyRoomsPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const { rooms, loading } = useRooms();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const filtered = (rooms || []).filter((r) => {
    const catMatch = activeCat === "All" || r.cat === activeCat;
    const statusMatch =
      activeStatus === "All" ||
      (activeStatus === "Active" && r.status === "Active") ||
      (activeStatus === "Closed" && r.status !== "Active");
    const searchMatch =
      !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.cat.toLowerCase().includes(search.toLowerCase());

    // In a real app we'd filter by user ownership
    // For now showing all rooms the user has "access" to (which is all in this prototype)
    return catMatch && statusMatch && searchMatch;
  });

  const totalIdeas = (rooms || []).reduce((s, r) => s + (r.ideas || 0), 0);
  const activeRooms = (rooms || []).filter((r) => r.status === "Active").length;

  if (authLoading) return null;

  return (
    <div style={S.layout}>
      <DashboardSidebar currentPage="myrooms" />
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={S.topTitle}>My Brainstorm Rooms</div>
          <div style={S.topRight}>
            <div style={S.searchBar}>
              <span>🔍</span>
              <input
                style={S.searchInput}
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button style={S.btnCreate} onClick={() => setShowCreateModal(true)}>+ New Room</button>
          </div>
        </div>

        <div style={S.body}>
          {/* STATS */}
          <div style={S.statsRow}>
            {[
              { label: "Total Rooms", value: rooms?.length || 0, icon: "🏢", bg: "rgba(59,59,255,0.08)" },
              { label: "Active Rooms", value: activeRooms, icon: "✅", bg: "rgba(39,174,96,0.08)" },
              { label: "Total Ideas", value: totalIdeas, icon: "💡", bg: "rgba(255,152,0,0.08)" },
              { label: "Collaborators", value: (rooms || []).reduce((s, r) => s + (r.participants || 0), 0), icon: "👥", bg: "rgba(155,92,255,0.08)" },
            ].map((s) => (
              <div key={s.label} style={S.statCard}>
                <div style={S.statIcon(s.bg)}>{s.icon}</div>
                <div>
                  <div style={S.statValue}>{s.value}</div>
                  <div style={S.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div style={S.filterBar}>
            <span style={S.filterLabel}>Category:</span>
            {CATEGORIES.map((c) => (
              <button key={c} style={S.catBtn(activeCat === c)} onClick={() => setActiveCat(c)}>{c}</button>
            ))}
            <div style={S.statusRow}>
              {["All", "Active", "Closed"].map((s) => (
                <button key={s} style={S.statusBtn(activeStatus === s)} onClick={() => setActiveStatus(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* GRID */}
          <div style={S.sectionTitle}>
            {filtered.length} room{filtered.length !== 1 ? "s" : ""} found
          </div>
          <div style={S.grid}>
            {loading ? (
              <div style={S.emptyState}>
                <div style={S.emptyIcon}>⏳</div>
                <div style={S.emptyText}>Loading your rooms...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={S.emptyState}>
                <div style={S.emptyIcon}>🔍</div>
                <div style={S.emptyText}>No rooms found here. Create one!</div>
                <div style={S.emptySub}>Try changing the category or status filter</div>
              </div>
            ) : filtered.map((r) => (
              <div key={r.id} style={S.card} onClick={() => router.push(`/room/${r.id}`)}>
                <div style={S.cardImg(r.gradient)}>
                  <span style={S.statusBadge(r.status === "Active")}>{r.status}</span>
                  <span style={S.scoreBadge}>⚡ {r.score}</span>
                </div>
                <div style={S.cardBody}>
                  <div style={S.cardCatRow}>
                    <div style={S.catDot(r.catColor)} />
                    <span style={S.cardCat}>{r.cat}</span>
                  </div>
                  <div style={S.cardTitle}>{r.title}</div>
                  <div style={S.cardMeta}>
                    <span>👥 {r.participants}</span>
                    <span>💡 {r.ideas} ideas</span>
                    <span>📅 {r.date}</span>
                  </div>
                  <div style={S.cardFooter}>
                    <button style={S.btnEnter} onClick={(e) => { e.stopPropagation(); router.push(`/room/${r.id}`); }}>
                      Enter Room
                    </button>
                    <button style={S.btnDets}>Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateRoomModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
