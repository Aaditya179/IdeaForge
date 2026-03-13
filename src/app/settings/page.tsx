"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Inter', sans-serif" },
  main: { marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" },
  topbar: {
    display: "flex", alignItems: "center", padding: "16px 32px",
    background: "#fff", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#eaeaf0",
    position: "sticky" as const, top: 0, zIndex: 5,
  },
  topTitle: { fontWeight: 700, fontSize: 20, color: "#0a0a1a" },
  body: { padding: "28px 32px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 },
  settingsNav: {
    background: "#fff", borderRadius: 14, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
    padding: "12px 8px", height: "fit-content", position: "sticky" as const, top: 88,
  },
  settingsNavItem: (active: boolean) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
    borderRadius: 8, cursor: "pointer", fontSize: 13,
    background: active ? "rgba(59,59,255,0.07)" : "transparent",
    color: active ? "#3b3bff" : "#555",
    fontWeight: active ? 600 : 500, margin: "1px 0",
    transition: "background 0.15s",
  } as const),
  card: {
    background: "#fff", borderRadius: 14, borderWidth: "1px", borderStyle: "solid", borderColor: "#eaeaf0",
    padding: 28, marginBottom: 16,
  },
  cardTitle: {
    fontWeight: 700, fontSize: 17,
    color: "#0a0a1a", marginBottom: 4,
  },
  cardSub: { fontSize: 13, color: "#888", marginBottom: 22 },
  divider: { height: 1, background: "#f0f0f8", margin: "20px 0" },
  profileTop: {
    display: "flex", alignItems: "center", gap: 20, marginBottom: 24,
  },
  bigAvatar: {
    width: 72, height: 72, borderRadius: "50%",
    background: "linear-gradient(135deg, #3b3bff, #9b5cff)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 26, fontWeight: 800, flexShrink: 0 as const,
  },
  avatarInfo: {},
  avatarName: { fontWeight: 800, fontSize: 18, color: "#0a0a1a" },
  avatarRole: { fontSize: 13, color: "#888", marginBottom: 8 },
  btnChangePhoto: {
    padding: "7px 16px", background: "#f5f5fa", borderWidth: "1px", borderStyle: "solid", borderColor: "#e0e0f0",
    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", color: "#555",
  },
  fieldRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 },
  input: {
    width: "100%", padding: "11px 14px", borderWidth: "1.5px", borderStyle: "solid", borderColor: "#e8e8f0",
    borderRadius: 9, fontSize: 14, outline: "none",
    fontFamily: "'Inter', sans-serif", color: "#0a0a1a",
    boxSizing: "border-box" as const, background: "#fff", transition: "border-color 0.15s",
  },
  btnSave: {
    padding: "11px 24px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 9,
    fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 12px rgba(59,59,255,0.25)",
  },
  toggleRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 0", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "#f5f5f8",
  },
  toggleInfo: {},
  toggleTitle: { fontSize: 14, fontWeight: 600, color: "#0a0a1a", marginBottom: 2 },
  toggleDesc: { fontSize: 12, color: "#888" },
  toggle: (on: boolean) => ({
    width: 44, height: 24, borderRadius: 12,
    background: on ? "#3b3bff" : "#ddd", cursor: "pointer",
    position: "relative" as const, transition: "background 0.2s", border: "none", flexShrink: 0 as const,
  }),
  knob: (on: boolean) => ({
    position: "absolute" as const, top: 2, left: on ? 21 : 2,
    width: 20, height: 20, borderRadius: "50%", background: "#fff",
    transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  }),
  planCard: {
    background: "linear-gradient(135deg, #0d0d2b, #1a1050)",
    borderRadius: 14, padding: 22, color: "#fff", marginBottom: 0,
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(59,59,255,0.3)",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  planBadge: {
    background: "rgba(255,255,255,0.15)", borderRadius: 20,
    fontSize: 11, fontWeight: 700, padding: "3px 12px", color: "#c0c0ff",
    letterSpacing: "0.06em", marginBottom: 8, display: "inline-block",
  },
  planName: { fontWeight: 800, fontSize: 20, marginBottom: 4 },
  planDesc: { fontSize: 13, color: "rgba(255,255,255,0.55)" },
  btnUpgrade: {
    padding: "11px 22px", background: "linear-gradient(135deg, #ffd700, #ffa500)",
    color: "#0a0a1a", border: "none", borderRadius: 9,
    fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif",
    whiteSpace: "nowrap" as const,
  },
  dangerCard: {
    background: "rgba(231,76,60,0.04)", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(231,76,60,0.15)",
    borderRadius: 14, padding: 22,
  },
  dangerTitle: {
    fontWeight: 700, fontSize: 16,
    color: "#c0392b", marginBottom: 6,
  },
  dangerSub: { fontSize: 13, color: "#888", marginBottom: 16 },
  btnDanger: {
    padding: "10px 20px", background: "transparent", color: "#e74c3c",
    borderWidth: "1px", borderStyle: "solid", borderColor: "#e74c3c", borderRadius: 9,
    fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Inter', sans-serif",
    marginRight: 10,
  },
  savedBanner: {
    background: "rgba(39,174,96,0.1)", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(39,174,96,0.3)",
    borderRadius: 9, padding: "10px 16px", fontSize: 13, color: "#27ae60",
    fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
  },
} as const;

const SETTINGS_NAV = [
  { icon: "👤", label: "Profile" },
  { icon: "🔔", label: "Notifications" },
  { icon: "🔒", label: "Privacy & Security" },
  { icon: "💳", label: "Billing & Plan" },
  { icon: "🎨", label: "Appearance" },
  { icon: "⚡", label: "AI Preferences" },
];

const NOTIFICATION_TOGGLES = [
  { title: "New idea submissions", desc: "Get notified when someone submits to your room", key: "ideas" },
  { title: "Room milestones", desc: "Celebrate when your room hits vote milestones", key: "milestones" },
  { title: "Weekly digest", desc: "Receive a weekly summary of your brainstorm activity", key: "digest" },
  { title: "New participants", desc: "Alert when someone joins your brainstorm room", key: "participants" },
  { title: "AI recommendations", desc: "Receive AI-powered idea suggestions for your rooms", key: "ai" },
] as const;

export default function SettingsPage() {
  const { user, loading: authLoading, updateProfile, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("Profile");
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    ideas: true, milestones: true, digest: false, participants: true, ai: true,
  });
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "Building the future of collaborative innovation.",
    company: "IdeaForge Inc.",
    role: "Product Lead",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      setForm((prev) => ({
        ...prev,
        name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
        email: user?.email || "",
      }));
    }
  }, [user, authLoading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg("");
    setSaved(false);

    try {
      const { error } = await updateProfile({
        full_name: form.name,
        bio: form.bio,
        company: form.company,
        role: form.role,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading) return null;

  return (
    <div style={S.layout}>
      <DashboardSidebar currentPage="settings" />
      <div style={S.main}>
        <div style={S.topbar}>
          <div style={S.topTitle}>Settings</div>
        </div>

        <div style={S.body}>
          <div style={S.settingsNav}>
            {SETTINGS_NAV.map((item) => (
              <div
                key={item.label}
                style={S.settingsNavItem(activeSection === item.label)}
                onClick={() => setActiveSection(item.label)}
              >
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>

          <div>
            {saved && (
              <div style={S.savedBanner}>✓ Changes saved successfully!</div>
            )}

            {errorMsg && (
              <div style={{ ...S.savedBanner, background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", color: "#c0392b" }}>⚠️ {errorMsg}</div>
            )}

            {activeSection === "Profile" && (
              <>
                <div style={S.card}>
                  <div style={S.cardTitle}>Profile Information</div>
                  <div style={S.cardSub}>Update your personal details and public profile</div>
                  <div style={S.profileTop}>
                    <div style={S.bigAvatar}>{(form.name?.[0] || form.email?.[0] || "U").toUpperCase()}</div>
                    <div style={S.avatarInfo}>
                      <div style={S.avatarName}>{form.name}</div>
                      <div style={S.avatarRole}>{form.email}</div>
                      <button style={S.btnChangePhoto}>Change Photo</button>
                    </div>
                  </div>
                  <div style={S.divider} />
                  <div style={S.fieldRow}>
                    <div>
                      <label style={S.label}>Full Name</label>
                      <input style={S.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={S.label}>Email Address (Cannot be changed)</label>
                      <input style={{ ...S.input, background: "#f5f5fa", color: "#888", cursor: "not-allowed" }} value={form.email} disabled />
                    </div>
                  </div>
                  <div style={S.fieldRow}>
                    <div>
                      <label style={S.label}>Company</label>
                      <input style={S.input} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    </div>
                    <div>
                      <label style={S.label}>Role</label>
                      <input style={S.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                    </div>
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Bio</label>
                    <textarea
                      style={{ ...S.input, minHeight: 80, resize: "vertical" }}
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    />
                  </div>
                  <button style={S.btnSave} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
                <div style={S.dangerCard}>
                  <div style={S.dangerTitle}>Danger Zone</div>
                  <div style={S.dangerSub}>These actions are irreversible. Please proceed with caution.</div>
                  <button style={{ ...S.btnDanger, color: "#3b3bff", borderColor: "#3b3bff", marginBottom: 12 }} onClick={handleSignOut}>Sign Out</button>
                  <br />
                  <button style={S.btnDanger}>Delete Account</button>
                  <button style={S.btnDanger}>Export Data</button>
                </div>
              </>
            )}

            {activeSection === "Notifications" && (
              <div style={S.card}>
                <div style={S.cardTitle}>Notification Preferences</div>
                <div style={S.cardSub}>Choose what updates you want to receive</div>
                {NOTIFICATION_TOGGLES.map((item, i) => (
                  <div key={item.key} style={{ ...S.toggleRow, borderBottom: i < NOTIFICATION_TOGGLES.length - 1 ? "1px solid #f5f5f8" : "none" }}>
                    <div style={S.toggleInfo}>
                      <div style={S.toggleTitle}>{item.title}</div>
                      <div style={S.toggleDesc}>{item.desc}</div>
                    </div>
                    <button
                      style={S.toggle(toggles[item.key])}
                      onClick={() => setToggles((t) => ({ ...t, [item.key]: !t[item.key] }))}
                    >
                      <div style={S.knob(toggles[item.key])} />
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button style={S.btnSave} onClick={handleSave}>Save Preferences</button>
                </div>
              </div>
            )}

            {activeSection === "Billing & Plan" && (
              <>
                <div style={S.planCard}>
                  <div>
                    <div style={S.planBadge}>CURRENT PLAN</div>
                    <div style={S.planName}>Premium Plan ✦</div>
                    <div style={S.planDesc}>Unlimited rooms · AI generation · Priority support</div>
                  </div>
                  <button style={S.btnUpgrade}>⚡ Upgrade to Enterprise</button>
                </div>
                <div style={{ ...S.card, marginTop: 16 }}>
                  <div style={S.cardTitle}>Billing History</div>
                  <div style={S.cardSub}>View your past invoices and payment details</div>
                  {["Dec 2023", "Nov 2023", "Oct 2023"].map((m) => (
                    <div key={m} style={{ ...S.toggleRow }}>
                      <div>
                        <div style={S.toggleTitle}>Premium Plan — {m}</div>
                        <div style={S.toggleDesc}>Monthly subscription · $29.00</div>
                      </div>
                      <button style={{ ...S.btnDanger, color: "#3b3bff", borderColor: "#3b3bff" }}>Download</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeSection === "AI Preferences" && (
              <div style={S.card}>
                <div style={S.cardTitle}>AI Preferences</div>
                <div style={S.cardSub}>Customize how IdeaForge AI assists your brainstorming</div>
                {[
                  { title: "Auto-generate ideas on room creation", desc: "The AI will suggest starter ideas when you open a new room", key: "autoGen" },
                  { title: "AI evaluation for every idea", desc: "Automatically score feasibility and market potential", key: "autoEval" },
                  { title: "Session summary on room close", desc: "Generate an AI-written executive summary when sessions end", key: "summary" },
                  { title: "Smart notifications", desc: "AI-powered insights about your room activity", key: "smartNotif" },
                ].map((item, i, arr) => (
                  <div key={item.key} style={{ ...S.toggleRow, borderBottom: i < arr.length - 1 ? "1px solid #f5f5f8" : "none" }}>
                    <div>
                      <div style={S.toggleTitle}>{item.title}</div>
                      <div style={S.toggleDesc}>{item.desc}</div>
                    </div>
                    <button
                      style={S.toggle(i < 2)}
                      onClick={() => { }}
                    >
                      <div style={S.knob(i < 2)} />
                    </button>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <button style={S.btnSave} onClick={handleSave}>Save AI Settings</button>
                </div>
              </div>
            )}

            {(activeSection === "Privacy & Security" || activeSection === "Appearance") && (
              <div style={S.card}>
                <div style={S.cardTitle}>{activeSection}</div>
                <div style={S.cardSub}>These settings are coming soon in the next update.</div>
                <div style={{ fontSize: 48, marginTop: 20, textAlign: "center" }}>🔧</div>
                <div style={{ textAlign: "center", color: "#aaa", fontSize: 14, marginTop: 10 }}>Under construction</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
