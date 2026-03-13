"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const styles = {
  root: {
    background: "#0a0a0f",
    color: "#f0f0f8",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 60px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    position: "sticky",
    top: 0,
    background: "rgba(10,10,15,0.8)",
    backdropFilter: "blur(12px)",
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 800,
    fontSize: 20,
    letterSpacing: "-0.02em",
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
  navLinks: {
    display: "flex",
    gap: 32,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: "rgba(240,240,248,0.6)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "color 0.2s",
  },
  navActions: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  btnOutline: {
    padding: "9px 22px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 8,
    background: "transparent",
    color: "#f0f0f8",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "9px 22px",
    border: "none",
    borderRadius: 8,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  hero: {
    textAlign: "center",
    padding: "120px 60px 80px",
    position: "relative",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 1000,
    height: 600,
    background:
      "radial-gradient(ellipse at center, rgba(59,59,255,0.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(59,59,255,0.12)",
    border: "1px solid rgba(59,59,255,0.3)",
    borderRadius: 20,
    padding: "5px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#8b8bff",
    marginBottom: 28,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontWeight: 900,
    fontSize: 72,
    lineHeight: 1.05,
    margin: "0 auto 24px",
    maxWidth: 800,
    background: "linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.5) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.04em",
  },
  heroSub: {
    fontSize: 18,
    color: "rgba(240,240,248,0.55)",
    maxWidth: 520,
    margin: "0 auto 44px",
    lineHeight: 1.6,
  },
  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 14,
  },
  btnHeroPrimary: {
    padding: "16px 36px",
    border: "none",
    borderRadius: 12,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 20px 40px rgba(59,59,255,0.3)",
  },
  btnHeroOutline: {
    padding: "16px 36px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    color: "#f0f0f8",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
  },
  features: {
    padding: "100px 60px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 24,
  },
  featureCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 32,
    transition: "transform 0.3s ease, background 0.3s ease",
  },
} as const;

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div style={styles.root}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          IdeaForge
        </div>
        <ul style={styles.navLinks}>
          {["Product", "AI Tools", "Rooms", "Pricing"].map((l) => (
            <li key={l}>
              <a style={styles.navLink}>{l}</a>
            </li>
          ))}
        </ul>
        <div style={styles.navActions}>
          <button style={styles.btnOutline} onClick={() => router.push("/login")}>
            Log In
          </button>
          <button style={styles.btnPrimary} onClick={() => router.push("/login")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroLabel}>🚀 The Future of Collaborative Brainstorming</div>
        <h1 style={styles.heroTitle}>
          Ignite Your Next <br />
          <span style={{ color: "#7b5cff", WebkitTextFillColor: "#7b5cff" }}>Big Idea</span>
        </h1>
        <p style={styles.heroSub}>
          The AI-powered war room for innovators. Capture, connect, and crystallize thoughts into reality with real-time multiplayer canvassing.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.btnHeroPrimary} onClick={() => router.push("/login")}>
            Start Creating →
          </button>
          <button style={styles.btnHeroOutline}>View Showcase</button>
        </div>
      </section>

      {/* FEATURES PREVIEW */}
      <section style={styles.features}>
        <div style={styles.featuresGrid}>
          {[
            { icon: "💡", title: "AI Generation", color: "orange" },
            { icon: "🧠", title: "Smart Mapping", color: "blue" },
            { icon: "📊", title: "Market Insights", color: "green" },
            { icon: "🚀", title: "Roadmap Tools", color: "purple" },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "rgba(240,240,248,0.5)", lineHeight: 1.6 }}>
                Advanced neural engines to help you expand every seed of thought.
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 13, color: "rgba(240,240,248,0.3)" }}>
        © 2025 IdeaForge Lab. All rights reserved.
      </footer>
    </div>
  );
}
