"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const S = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    fontFamily: "'Inter', sans-serif",
  },
  left: {
    flex: 1,
    background: "linear-gradient(135deg, #0d0d2b 0%, #1a1050 50%, #0d1a3a 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px",
    position: "relative",
    overflow: "hidden",
  },
  glow1: {
    position: "absolute", top: -100, left: -100,
    width: 400, height: 400,
    background: "radial-gradient(circle, rgba(59,59,255,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute", bottom: -80, right: -80,
    width: 300, height: 300,
    background: "radial-gradient(circle, rgba(123,92,255,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  leftLogo: {
    display: "flex", alignItems: "center", gap: 12,
    marginBottom: 60,
  },
  logoIcon: {
    width: 42, height: 42,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, color: "#fff",
  },
  logoText: {
    fontWeight: 800, fontSize: 22, color: "#fff",
  },
  leftTitle: {
    fontWeight: 800, fontSize: 44,
    color: "#fff", lineHeight: 1.1, marginBottom: 20,
    background: "linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.5))",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  leftSub: {
    fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 48, maxWidth: 380,
  },
  featList: { display: "flex", flexDirection: "column", gap: 16 },
  featItem: {
    display: "flex", alignItems: "center", gap: 14,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "14px 18px",
  },
  featIcon: {
    width: 36, height: 36, borderRadius: 9,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
  },
  featTitle: { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 },
  featDesc: { fontSize: 12, color: "rgba(255,255,255,0.45)" },
  right: {
    width: 480,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px 48px",
  },
  formTitle: {
    fontWeight: 800, fontSize: 28,
    color: "#0a0a1a", marginBottom: 6,
  },
  formSub: { fontSize: 14, color: "#888", marginBottom: 36 },
  tabRow: {
    display: "flex", background: "#f5f5fa", borderRadius: 10,
    padding: 4, marginBottom: 28,
  },
  tab: (active: boolean) => ({
    flex: 1, padding: "9px", border: "none", borderRadius: 8,
    background: active ? "#fff" : "transparent",
    color: active ? "#3b3bff" : "#888",
    fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
    transition: "all 0.15s",
  }),
  field: { marginBottom: 16 },
  label: {
    display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6,
  },
  input: {
    width: "100%", padding: "12px 14px",
    borderWidth: "1.5px", borderStyle: "solid", borderColor: "#e8e8f0",
    borderRadius: 10,
    fontSize: 14, outline: "none", fontFamily: "'Inter', sans-serif",
    color: "#0a0a1a", boxSizing: "border-box" as const, background: "#fff",
    transition: "border-color 0.15s",
  },
  inputFocus: { borderColor: "#3b3bff" },
  btnSubmit: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 10,
    fontWeight: 700, fontSize: 15, cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 18px rgba(59,59,255,0.35)",
    marginBottom: 20,
    transition: "opacity 0.15s",
  },
  divider: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
    fontSize: 12, color: "#ccc",
  },
  divLine: { flex: 1, height: 1, background: "#eee" },
  socialRow: { display: "flex", gap: 10 },
  btnSocial: {
    flex: 1, padding: "11px",
    background: "#f9f9fc", border: "1px solid #e8e8f0", borderRadius: 10,
    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#333",
  },
  bottomText: {
    textAlign: "center", fontSize: 13, color: "#888", marginTop: 24,
  },
  bottomLink: {
    color: "#3b3bff", fontWeight: 600, cursor: "pointer", background: "none", border: "none",
    fontSize: 13,
  },
  errorBox: {
    background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)",
    borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c0392b", marginBottom: 16,
  },
} as const;

const FEATURES = [
  { icon: "💡", bg: "rgba(255,200,50,0.15)", title: "AI Idea Generator", desc: "Generate hundreds of unique startup concepts" },
  { icon: "🧠", bg: "rgba(100,100,255,0.15)", title: "Real-time Collaboration", desc: "Brainstorm with your team in live rooms" },
  { icon: "📊", bg: "rgba(39,174,96,0.15)", title: "AI Evaluation", desc: "Get instant feasibility and market scores" },
];

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const { signIn, signUp, user, loading: initialLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialLoading && user) {
      router.push("/dashboard");
    }
  }, [user, initialLoading, router]);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (tab === "signup" && !name) { setError("Please enter your name."); return; }

    setAuthLoading(true);
    setError("");

    try {
      if (tab === "signup") {
        const { error: signUpError } = await signUp(email, password, name);
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  if (initialLoading) return null;

  return (
    <div style={S.root}>
      {/* LEFT */}
      <div style={S.left}>
        <div style={S.glow1} /><div style={S.glow2} />
        <div style={S.leftLogo}>
          <div style={S.logoIcon}>⚡</div>
          <div style={S.logoText}>IdeaForge</div>
        </div>
        <h1 style={S.leftTitle}>Where Great<br />Ideas Begin</h1>
        <p style={S.leftSub}>
          Join the community of innovators using AI-powered brainstorming to turn sparks into startups.
        </p>
        <div style={S.featList}>
          {FEATURES.map((f) => (
            <div key={f.title} style={S.featItem}>
              <div style={{ ...S.featIcon, background: f.bg }}>{f.icon}</div>
              <div>
                <div style={S.featTitle}>{f.title}</div>
                <div style={S.featDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={S.right}>
        <div style={S.formTitle}>{tab === "login" ? "Welcome back 👋" : "Create account ✦"}</div>
        <div style={S.formSub}>
          {tab === "login" ? "Sign in to your IdeaForge workspace" : "Start your free brainstorming journey"}
        </div>

        <div style={S.tabRow}>
          <button style={S.tab(tab === "login")} onClick={() => { setTab("login"); setError(""); }}>Log In</button>
          <button style={S.tab(tab === "signup")} onClick={() => { setTab("signup"); setError(""); }}>Sign Up</button>
        </div>

        {error && <div style={S.errorBox}>⚠️ {error}</div>}

        {tab === "signup" && (
          <div style={S.field}>
            <label style={S.label}>Full Name</label>
            <input
              style={{ ...S.input, ...(focused === "name" ? S.inputFocus : {}) }}
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
            />
          </div>
        )}

        <div style={S.field}>
          <label style={S.label}>Email Address</label>
          <input
            style={{ ...S.input, ...(focused === "email" ? S.inputFocus : {}) }}
            placeholder="alex@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused("")}
          />
        </div>

        <div style={S.field}>
          <label style={S.label}>Password</label>
          <input
            style={{ ...S.input, ...(focused === "pw" ? S.inputFocus : {}) }}
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("pw")}
            onBlur={() => setFocused("")}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button style={S.btnSubmit} onClick={handleSubmit} disabled={authLoading}>
          {authLoading ? "Please wait..." : (tab === "login" ? "Sign In →" : "Create Account →")}
        </button>

        <div style={S.divider}>
          <div style={S.divLine} /> or <div style={S.divLine} />
        </div>

        <div style={S.bottomText}>
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            style={S.bottomLink}
            onClick={() => { setTab(tab === "login" ? "signup" : "login"); setError(""); }}
          >
            {tab === "login" ? "Sign up free" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
