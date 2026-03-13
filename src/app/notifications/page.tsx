"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useRooms } from "@/hooks/useRooms";
import { generateNotificationInsights } from "@/services/ai";
import { useAuth } from "@/context/AuthContext";

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Inter', sans-serif" },
  main: { marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" },
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 32px", background: "#fff", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#eaeaf0",
    position: "sticky" as const, top: 0, zIndex: 5,
  },
  topLeft: {},
  topTitle: { fontWeight: 700, fontSize: 20, color: "#0a0a1a" },
  topSub: { fontSize: 13, color: "#888", marginTop: 2 },
  topRight: { display: "flex", gap: 10 },
  btnMarkAll: {
    padding: "8px 16px", background: "#fff", borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
    borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", color: "#555",
  },
  body: { padding: "28px 32px", maxWidth: 800 },
  tabRow: {
    display: "flex", gap: 4, background: "#f0f0fa", borderRadius: 10,
    padding: 4, marginBottom: 24, width: "fit-content",
  },
  tab: (active: boolean) => ({
    padding: "8px 18px", borderRadius: 8, border: "none",
    background: active ? "#fff" : "transparent",
    color: active ? "#3b3bff" : "#888",
    fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
    transition: "all 0.15s",
  } as const),
  sectionTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa",
    textTransform: "uppercase" as const, marginBottom: 12, marginTop: 8,
  },
  notifCard: (read: boolean, color: string) => ({
    background: read ? "#fff" : `${color}08`,
    borderWidth: "1px", borderStyle: "solid", borderColor: read ? "#eaeaf0" : color + "25",
    borderLeftWidth: "4px", borderLeftStyle: "solid", borderLeftColor: read ? "#eaeaf0" : color,
    borderRadius: 12, padding: "16px 20px", marginBottom: 10,
    display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer",
    transition: "box-shadow 0.15s",
  } as const),
  notifIcon: (bg: string) => ({
    width: 38, height: 38, borderRadius: 10, background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, flexShrink: 0 as const,
  }),
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: 700, color: "#0a0a1a", marginBottom: 3 },
  notifMsg: { fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 6 },
  notifTime: { fontSize: 11, color: "#aaa", fontWeight: 600 },
  notifDot: (color: string) => ({
    width: 8, height: 8, borderRadius: "50%", background: color,
    flexShrink: 0 as const, marginTop: 6,
  }),
  aiSection: {
    background: "linear-gradient(135deg, #0d0d2b, #1a1050)",
    borderRadius: 14, padding: 22, marginBottom: 24, color: "#fff",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(59,59,255,0.25)",
  },
  aiHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
  },
  aiTitle: {
    fontWeight: 800, fontSize: 16,
    display: "flex", alignItems: "center", gap: 8,
  },
  geminiTag: {
    background: "rgba(255,255,255,0.12)", borderRadius: 20,
    fontSize: 11, fontWeight: 700, padding: "3px 10px", letterSpacing: "0.05em",
  },
  aiRefreshBtn: {
    padding: "7px 14px", background: "rgba(255,255,255,0.1)",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.2)", borderRadius: 8,
    color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 6,
  },
  aiGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  aiNotifCard: (type: string) => ({
    background: "rgba(255,255,255,0.07)",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10, padding: 14,
    borderLeftWidth: "3px", borderLeftStyle: "solid", borderLeftColor: type === "success" ? "#4ade80" : type === "warning" ? "#fbbf24" : "#818cf8",
  } as const),
  aiNotifTitle: { fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 },
  aiNotifMsg: { fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 },
  aiNotifTime: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 6 },
  spinner: {
    width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  loadingRow: { display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 14 },
  asideCard: {
    background: "#fff", borderRadius: 12, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0", padding: 12, width: 180, marginLeft: 20, textAlign: "center" as const
  },
  asideTitle: { fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase" as const, marginBottom: 10 },
  suggestedAvatar: { width: 32, height: 32, borderRadius: "50%", background: "#3b3bff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 12, fontWeight: 700 },
  suggestedName: { fontSize: 13, fontWeight: 700, color: "#0a0a1a", marginBottom: 4 },
  suggestedDesc: { fontSize: 11, color: "#888", lineHeight: 1.4, marginBottom: 10 },
  btnJoin: { padding: "6px 12px", background: "#0a0a1a", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }
} as const;

const STATIC_NOTIFICATIONS = [
  {
    id: 1, title: "New idea submitted", msg: "Sarah M. submitted 'Decentralized Solar Grid' in Sustainable Energy Solutions.", time: "2 min ago", icon: "💡", color: "#3b3bff", read: false, type: "activity",
  },
  {
    id: 2, title: "Room milestone reached", msg: "AI for Health Tech just hit 1,000 total votes! 🎉", time: "18 min ago", icon: "🏆", color: "#27ae60", read: false, type: "milestone",
  },
  {
    id: 3, title: "New participant joined", msg: "Marcus K. joined Future of Fintech brainstorm room.", time: "1 hour ago", icon: "👤", color: "#9b5cff", read: true, type: "activity",
  },
  {
    id: 4, title: "Room closing soon", msg: "Remote Work Culture room closes in 24 hours. Download summary before it ends.", time: "2 hours ago", icon: "⏰", color: "#f39c12", read: false, type: "alert",
  },
  {
    id: 5, title: "Weekly digest ready", msg: "Your brainstorming activity summary for the week is available.", time: "Yesterday", icon: "📊", color: "#3b3bff", read: true, type: "digest",
  },
  {
    id: 6, title: "Idea ranked #1", msg: "Your idea 'AI-Powered Diagnosis Assistant' is now the top-ranked idea in AI for Health Tech!", time: "2 days ago", icon: "⭐", color: "#e74c3c", read: true, type: "milestone",
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const { rooms } = useRooms();
  const [notifications, setNotifications] = useState(STATIC_NOTIFICATIONS);
  const [aiInsights, setAiInsights] = useState<any[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchInsights = async () => {
    if (!rooms || rooms.length === 0) return;
    setAiLoading(true);
    setAiInsights(null);
    try {
      const result = await generateNotificationInsights(rooms);
      setAiInsights(result);
    } catch (e: any) {
      setAiInsights([{ title: "Error", message: e.message, type: "warning", time: "just now" }]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      fetchInsights();
    }
  }, [rooms]);

  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: number) => setNotifications((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const filtered = activeTab === "All" ? notifications
    : activeTab === "Unread" ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === activeTab.toLowerCase());

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (authLoading) return null;

  return (
    <div style={S.layout}>
      <DashboardSidebar currentPage="notifications" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={S.topLeft}>
            <div style={S.topTitle}>Notifications {unreadCount > 0 && <span style={{ fontSize: 14, color: "#3b3bff" }}>({unreadCount} unread)</span>}</div>
            <div style={S.topSub}>Stay updated on your brainstorm activity</div>
          </div>
          <div style={S.topRight}>
            <button style={S.btnMarkAll} onClick={markAllRead}>Mark all read</button>
          </div>
        </div>

        <div style={S.body}>
          {/* AI INSIGHTS */}
          <div style={S.aiSection}>
            <div style={S.aiHeader}>
              <div style={S.aiTitle}>✦ AI-Powered Insights <span style={S.geminiTag}>Gemini 2.0</span></div>
              <button style={S.aiRefreshBtn} onClick={fetchInsights} disabled={aiLoading}>
                {aiLoading ? <div style={S.spinner} /> : "↺"} Refresh
              </button>
            </div>
            {aiLoading && (
              <div style={S.loadingRow}><div style={S.spinner} /> Analyzing your rooms with Gemini...</div>
            )}
            {aiInsights && (
              <div style={S.aiGrid}>
                {aiInsights.map((ins, i) => (
                  <div key={i} style={S.aiNotifCard(ins.type)}>
                    <div style={S.aiNotifTitle}>{ins.title}</div>
                    <div style={S.aiNotifMsg}>{ins.message}</div>
                    <div style={S.aiNotifTime}>{ins.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TABS */}
          <div style={S.tabRow}>
            {["All", "Unread", "Activity", "Milestone", "Alert"].map((t) => (
              <button key={t} style={S.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* NOTIFICATIONS */}
          <div style={S.sectionTitle}>Recent Activity</div>
          {(filtered || []).map((n) => (
            <div key={n.id} style={S.notifCard(n.read, n.color)} onClick={() => markRead(n.id)}>
              <div style={S.notifIcon(`${n.color}15`)}>{n.icon}</div>
              <div style={S.notifBody}>
                <div style={S.notifTitle}>{n.title}</div>
                <div style={S.notifMsg}>{n.msg}</div>
                <div style={S.notifTime}>{n.time}</div>
              </div>
              {!n.read && <div style={S.notifDot(n.color)} />}
              {rooms && rooms[0] && (
                <div style={S.asideCard}>
                  <div style={S.asideTitle}>Suggested Room</div>
                  <div style={S.suggestedAvatar}>{rooms[0].title.substring(0, 2).toUpperCase()}</div>
                  <div style={S.suggestedName}>{rooms[0].title}</div>
                  <div style={S.suggestedDesc}>Join the conversation and add your ideas to the mix.</div>
                  <button style={S.btnJoin} onClick={(e) => { e.stopPropagation(); router.push(`/room/${rooms[0].id}`); }}>View Room</button>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center" as const, padding: "40px 0", color: "#bbb" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔔</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>No notifications here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
