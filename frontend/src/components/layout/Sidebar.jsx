const S = {
  sidebar: {
    width: 220,
    background: "#fff",
    borderRight: "1px solid #eaeaf0",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    position: "fixed",
    top: 0, left: 0, bottom: 0,
    zIndex: 10,
  },
  logoWrap: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "0 20px 20px", borderBottom: "1px solid #eaeaf0",
    marginBottom: 16, cursor: "pointer",
    userSelect: "none",
  },
  logoIcon: {
    width: 34, height: 34,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    borderRadius: 9, display: "flex", alignItems: "center",
    justifyContent: "center", color: "#fff", fontSize: 16, flexShrink: 0,
  },
  logoText: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#0a0a1a" },
  logoSub: { fontSize: 10, color: "#3b3bff", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 10,
    padding: "9px 20px", cursor: "pointer",
    background: active ? "rgba(59,59,255,0.07)" : "transparent",
    color: active ? "#3b3bff" : "#555",
    fontWeight: active ? 600 : 500, fontSize: 13,
    margin: "1px 8px", borderRadius: 8,
    transition: "background 0.15s", userSelect: "none",
  }),
  badge: {
    marginLeft: "auto", background: "#3b3bff", color: "#fff",
    borderRadius: 20, fontSize: 10, fontWeight: 700,
    padding: "2px 7px", minWidth: 18, textAlign: "center",
  },
  userSection: {
    marginTop: "auto", padding: "16px 20px 0",
    borderTop: "1px solid #eaeaf0",
    display: "flex", alignItems: "center", gap: 8,
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #3b3bff, #9b5cff)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  userName: { fontSize: 12, fontWeight: 700, color: "#0a0a1a" },
  userRole: { fontSize: 10, color: "#3b3bff", fontWeight: 600 },
  logoutBtn: {
    marginLeft: "auto", background: "none", border: "none",
    cursor: "pointer", fontSize: 14, color: "#ccc",
  },
};

const NAV_ITEMS = [
  { icon: "🏠", label: "Home", page: "home" },
  { icon: "📊", label: "Admin Dashboard", page: "admin" },
  { icon: "👤", label: "My Profile", page: "profile" },
  { icon: "💡", label: "My Brainstorm Rooms", page: "myrooms" },
  { icon: "📈", label: "Analytics", page: "analytics" },
  { icon: "🔔", label: "Notifications", page: "notifications", badge: 3 },
  { icon: "⚙️", label: "Settings", page: "settings" },
];

export default function Sidebar({ currentPage, onNavigate, user }) {
  return (
    <aside style={S.sidebar}>
      {/* LOGO — always goes home */}
      <div style={S.logoWrap} onClick={() => onNavigate("home")}>
        <div style={S.logoIcon}>⚡</div>
        <div>
          <div style={S.logoText}>IdeaForge</div>
          <div style={S.logoSub}>AI Brainstorming</div>
        </div>
      </div>

      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          style={S.navItem(currentPage === item.page)}
          onClick={() => onNavigate(item.page)}
        >
          <span>{item.icon}</span>
          {item.label}
          {item.badge && <span style={S.badge}>{item.badge}</span>}
        </div>
      ))}

      <div style={S.userSection}>
        <div style={S.userAvatar}>{user?.avatar || "A"}</div>
        <div>
          <div style={S.userName}>{user?.name || "Alex Johnson"}</div>
          <div style={S.userRole}>{user?.role || "Premium Plan"}</div>
        </div>
        <button style={S.logoutBtn} onClick={() => onNavigate("landing")} title="Logout">↗</button>
      </div>
    </aside>
  );
}
