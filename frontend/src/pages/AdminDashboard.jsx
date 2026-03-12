import Sidebar from "../components/layout/Sidebar.jsx";
import { USER } from "../data/store.js";

const S = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f6fa",
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebar: {
    width: 220,
    background: "#fff",
    borderRight: "1px solid #eaeaf0",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px 20px",
    borderBottom: "1px solid #eaeaf0",
    marginBottom: 16,
  },
  logoIcon: {
    width: 34,
    height: 34,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 16,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 15,
    color: "#0a0a1a",
    lineHeight: 1.1,
  },
  logoSub: {
    fontSize: 10,
    color: "#888",
    letterSpacing: "0.04em",
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 20px",
    cursor: "pointer",
    background: active ? "rgba(59,59,255,0.07)" : "transparent",
    color: active ? "#3b3bff" : "#555",
    fontWeight: active ? 600 : 500,
    fontSize: 13,
    margin: "1px 8px",
    borderRadius: 8,
    transition: "background 0.15s",
  }),
  logoutItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 20px",
    cursor: "pointer",
    color: "#e74c3c",
    fontWeight: 500,
    fontSize: 13,
    marginTop: "auto",
    borderTop: "1px solid #eaeaf0",
    paddingTop: 16,
  },
  main: {
    marginLeft: 220,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    background: "#fff",
    borderBottom: "1px solid #eaeaf0",
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  topbarTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 20,
    color: "#0a0a1a",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f5f6fa",
    border: "1px solid #eaeaf0",
    borderRadius: 9,
    padding: "8px 16px",
    width: 260,
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
    color: "#0a0a1a",
    flex: 1,
    fontFamily: "'DM Sans', sans-serif",
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },
  userInfo: { textAlign: "right" },
  userName: { fontWeight: 600, fontSize: 13, color: "#0a0a1a" },
  userRole: { fontSize: 11, color: "#888" },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b3bff, #9b5cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
  },
  body: { padding: "24px 32px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    border: "1px solid #eaeaf0",
  },
  statLabel: { fontSize: 13, color: "#888", marginBottom: 8 },
  statIconWrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statIcon: (bg) => ({
    width: 38,
    height: 38,
    borderRadius: 10,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  }),
  statValue: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 28,
    color: "#0a0a1a",
    lineHeight: 1,
    margin: "10px 0 4px",
  },
  statChange: (positive) => ({
    fontSize: 12,
    color: positive ? "#27ae60" : "#e74c3c",
    fontWeight: 600,
  }),
  roomsSection: {},
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLeft: {},
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: "#0a0a1a",
    marginBottom: 2,
  },
  sectionSub: { fontSize: 13, color: "#888" },
  sectionActions: { display: "flex", gap: 10 },
  btnFilter: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 16px",
    background: "#fff",
    border: "1px solid #eaeaf0",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    color: "#555",
  },
  btnCreate: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 14px rgba(59,59,255,0.25)",
  },
  roomsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
  },
  roomCard: {
    background: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid #eaeaf0",
    cursor: "pointer",
    transition: "box-shadow 0.2s",
  },
  roomImg: (gradient) => ({
    height: 110,
    background: gradient,
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    padding: 12,
  }),
  statusBadge: (active) => ({
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "3px 9px",
    borderRadius: 20,
    background: active ? "rgba(39,174,96,0.9)" : "rgba(200,50,50,0.85)",
    color: "#fff",
  }),
  roomBody: { padding: 16 },
  roomCatRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  roomCatDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
  }),
  roomCat: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#888", textTransform: "uppercase" },
  roomTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    color: "#0a0a1a",
    marginBottom: 10,
    lineHeight: 1.3,
  },
  roomMeta: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    fontSize: 12,
    color: "#888",
    marginBottom: 14,
  },
  roomMetaRow: { display: "flex", alignItems: "center", gap: 6 },
  btnViewDetails: {
    width: "100%",
    padding: "9px",
    background: "#f5f5fa",
    color: "#333",
    border: "1px solid #eaeaf0",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "center",
    transition: "background 0.15s",
  },
  draftCard: {
    background: "#fff",
    borderRadius: 14,
    border: "2px dashed #e0e0f0",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  draftImg: {
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f9f9fc",
  },
  draftPlus: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#e8e8f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    color: "#aaa",
  },
  draftLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#aaa",
    textAlign: "center",
    padding: "8px 0",
  },
};

const stats = [
  { label: "Total Rooms", value: "128", change: "+12% this month", icon: "🏢", bg: "rgba(59,59,255,0.08)", pos: true },
  { label: "Total Ideas", value: "1,452", change: "+5% this week", icon: "💡", bg: "rgba(39,174,96,0.08)", pos: true },
  { label: "Active Participants", value: "342", change: "+8% today", icon: "👤", bg: "rgba(255,152,0,0.08)", pos: true },
  { label: "Top Idea Score", value: "9.8", change: "Steady performance", icon: "⭐", bg: "rgba(155,92,255,0.08)", pos: true },
];

const rooms = [
  {
    cat: "Healthcare",
    catColor: "#9b5cff",
    title: "AI for Health Tech",
    gradient: "linear-gradient(135deg, #1a1a3a, #2d3566)",
    status: true,
    participants: 24,
    ideas: 85,
    date: "Oct 12, 2023",
  },
  {
    cat: "Environment",
    catColor: "#27ae60",
    title: "Sustainable Energy",
    gradient: "linear-gradient(135deg, #1a3a1a, #2a6633)",
    status: true,
    participants: 18,
    ideas: 42,
    date: "Oct 10, 2023",
  },
  {
    cat: "HR",
    catColor: "#3b3bff",
    title: "Remote Work Culture",
    gradient: "linear-gradient(135deg, #2a2a3a, #3a3a5a)",
    status: false,
    participants: 45,
    ideas: 120,
    date: "Oct 05, 2023",
  },
  {
    cat: "Finance",
    catColor: "#f39c12",
    title: "Future of Fintech",
    gradient: "linear-gradient(135deg, #1a2a3a, #1a3a50)",
    status: true,
    participants: 30,
    ideas: 67,
    date: "Oct 01, 2023",
  },
  {
    cat: "Startup",
    catColor: "#e74c3c",
    title: "Growth Hacking Ideas",
    gradient: "linear-gradient(135deg, #2a1a2a, #3a2040)",
    status: true,
    participants: 52,
    ideas: 114,
    date: "Sep 28, 2023",
  },
];

const navItems = [
  { icon: "⚙️", label: "Dashboard", active: true },
  { icon: "💡", label: "My Brainstorm Rooms" },
  { icon: "➕", label: "Create Room" },
  { icon: "📊", label: "Analytics" },
  { icon: "🔔", label: "Notifications" },
  { icon: "⚙️", label: "Settings" },
];

export default function AdminDashboard({ onNavigate, onCreateRoom }) {
  return (
    <div style={S.layout}>
      <Sidebar currentPage="admin" onNavigate={onNavigate} user={USER} />
      <div style={{ ...S.main, marginLeft: 220 }}>
        {/* TOPBAR */}
        <div style={S.topbar}>
          <div style={S.topbarTitle}>Welcome back, Admin</div>
          <div style={S.topbarRight}>
            <div style={S.searchBar}>
              <span>🔍</span>
              <input style={S.searchInput} placeholder="Search rooms or ideas..." />
            </div>
            <div style={{ fontSize: 20, cursor: "pointer" }}>🔔</div>
            <div style={S.userChip}>
              <div style={S.userInfo}>
                <div style={S.userName}>Alex Johnson</div>
                <div style={S.userRole}>Super Admin</div>
              </div>
              <div style={S.userAvatar}>AJ</div>
            </div>
          </div>
        </div>

        <div style={S.body}>
          {/* STATS */}
          <div style={S.statsGrid}>
            {stats.map((s) => (
              <div key={s.label} style={S.statCard}>
                <div style={S.statLabel}>{s.label}</div>
                <div style={S.statIconWrap}>
                  <div>
                    <div style={S.statValue}>{s.value}</div>
                    <div style={S.statChange(s.pos)}>↗ {s.change}</div>
                  </div>
                  <div style={S.statIcon(s.bg)}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ROOMS */}
          <div style={S.roomsSection}>
            <div style={S.sectionHeader}>
              <div style={S.sectionLeft}>
                <div style={S.sectionTitle}>Brainstorm Rooms</div>
                <div style={S.sectionSub}>Manage and monitor active brainstorming sessions</div>
              </div>
              <div style={S.sectionActions}>
                <button style={S.btnFilter}>⚙ Filter</button>
                <button style={S.btnCreate} onClick={onCreateRoom}>
                  + Create New Room
                </button>
              </div>
            </div>
            <div style={S.roomsGrid}>
              {rooms.map((r) => (
                <div
                  key={r.title}
                  style={S.roomCard}
                  onClick={() => onNavigate("room", r)}
                >
                  <div style={S.roomImg(r.gradient)}>
                    <span style={S.statusBadge(r.status)}>
                      {r.status ? "Active" : "Closed"}
                    </span>
                  </div>
                  <div style={S.roomBody}>
                    <div style={S.roomCatRow}>
                      <div style={S.roomCatDot(r.catColor)} />
                      <span style={S.roomCat}>{r.cat}</span>
                    </div>
                    <div style={S.roomTitle}>{r.title}</div>
                    <div style={S.roomMeta}>
                      <div style={S.roomMetaRow}>👥 {r.participants} Participants  💡 {r.ideas} Ideas</div>
                      <div style={S.roomMetaRow}>📅 Created {r.date}</div>
                    </div>
                    <button style={S.btnViewDetails}>View Room Details</button>
                  </div>
                </div>
              ))}

              {/* DRAFT */}
              <div style={S.draftCard} onClick={onCreateRoom}>
                <div style={S.draftImg}>
                  <div style={S.draftPlus}>+</div>
                </div>
                <div style={S.draftLabel}>New Room Template</div>
                <div style={{ padding: "0 16px 16px" }}>
                  <div style={S.roomCatRow}>
                    <span style={{ ...S.roomCat, color: "#ccc" }}>UNCATEGORIZED</span>
                  </div>
                  <div style={{ ...S.roomTitle, color: "#bbb", fontStyle: "italic" }}>
                    Custom Session Name
                  </div>
                  <div style={{ ...S.roomMeta, color: "#ccc" }}>
                    <div style={S.roomMetaRow}>👥 0 Participants  💡 0 Ideas</div>
                    <div style={S.roomMetaRow}>📅 Draft Room</div>
                  </div>
                  <button style={{ ...S.btnViewDetails, color: "#bbb", borderStyle: "dashed" }}>
                    Start Drafting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
