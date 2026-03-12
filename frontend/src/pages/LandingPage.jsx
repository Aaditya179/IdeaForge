const styles = {
  root: {
    background: "#0a0a0f",
    color: "#f0f0f8",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 60px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    position: "sticky",
    top: 0,
    background: "rgba(10,10,15,0.9)",
    backdropFilter: "blur(12px)",
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 20,
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
    padding: "100px 60px 80px",
    position: "relative",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: 700,
    height: 400,
    background:
      "radial-gradient(ellipse at center, rgba(59,59,255,0.18) 0%, transparent 70%)",
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
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 72,
    lineHeight: 1.05,
    margin: "0 auto 24px",
    maxWidth: 800,
    background: "linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.5) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroAccent: {
    color: "#5c5cff",
    WebkitTextFillColor: "#5c5cff",
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
    padding: "14px 32px",
    border: "none",
    borderRadius: 10,
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 0 40px rgba(59,59,255,0.35)",
  },
  btnHeroOutline: {
    padding: "14px 32px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    background: "rgba(255,255,255,0.04)",
    color: "#f0f0f8",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  mockup: {
    maxWidth: 900,
    margin: "60px auto 0",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
    background: "#13131f",
  },
  mockupBar: {
    background: "#1a1a2a",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  mockupDot: (color) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: color,
  }),
  mockupScreen: {
    padding: 24,
    minHeight: 300,
    background:
      "linear-gradient(135deg, #0f0f1a 0%, #131320 50%, #0f0f1a 100%)",
    display: "flex",
    gap: 16,
  },
  mockupCard: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.07)",
  },
  mockupCardTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#5c5cff",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 8,
  },
  mockupCardItem: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 6,
    padding: "8px 10px",
    marginBottom: 6,
    fontSize: 12,
    color: "rgba(240,240,248,0.7)",
  },
  trusted: {
    textAlign: "center",
    padding: "60px 60px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  trustedLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(240,240,248,0.3)",
    marginBottom: 28,
  },
  trustedLogos: {
    display: "flex",
    justifyContent: "center",
    gap: 48,
    flexWrap: "wrap",
  },
  trustedLogo: {
    fontSize: 15,
    fontWeight: 700,
    color: "rgba(240,240,248,0.25)",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "0.04em",
  },
  features: {
    padding: "80px 60px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  featuresHeader: {
    textAlign: "center",
    marginBottom: 56,
  },
  featuresTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 42,
    fontWeight: 800,
    marginBottom: 12,
  },
  featuresSub: {
    color: "rgba(240,240,248,0.5)",
    fontSize: 16,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20,
  },
  featureCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14,
    padding: 24,
    transition: "border-color 0.2s, background 0.2s",
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 13,
    color: "rgba(240,240,248,0.5)",
    lineHeight: 1.6,
  },
  howItWorks: {
    padding: "80px 60px",
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  howTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 42,
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 56,
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 40,
    maxWidth: 900,
    margin: "0 auto",
  },
  step: {
    textAlign: "center",
  },
  stepNum: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
  },
  stepDesc: {
    fontSize: 14,
    color: "rgba(240,240,248,0.5)",
    lineHeight: 1.6,
  },
  testimonials: {
    padding: "80px 60px",
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    alignItems: "center",
  },
  testimonialsLeft: {},
  testimonialsMeta: {
    fontSize: 13,
    color: "rgba(240,240,248,0.5)",
    marginBottom: 6,
  },
  testimonialsCount: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 36,
    color: "#5c5cff",
    marginBottom: 16,
  },
  testimonialsDesc: {
    fontSize: 15,
    color: "rgba(240,240,248,0.6)",
    lineHeight: 1.7,
  },
  testimonialsRight: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  testimonialCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 20,
  },
  testimonialText: {
    fontSize: 14,
    color: "rgba(240,240,248,0.7)",
    lineHeight: 1.6,
    marginBottom: 14,
  },
  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b3bff, #9b5cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
  },
  authorInfo: {
    fontSize: 12,
  },
  authorName: {
    fontWeight: 700,
    marginBottom: 2,
  },
  authorRole: {
    color: "rgba(240,240,248,0.4)",
  },
  cta: {
    margin: "0 60px 80px",
    padding: "64px",
    background: "linear-gradient(135deg, #1a1aff 0%, #5c2dff 100%)",
    borderRadius: 20,
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  ctaBg: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 300,
    height: 300,
    background: "rgba(255,255,255,0.05)",
    borderRadius: "50%",
  },
  ctaTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 40,
    marginBottom: 12,
    position: "relative",
  },
  ctaSub: {
    fontSize: 16,
    opacity: 0.75,
    marginBottom: 32,
    position: "relative",
  },
  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 14,
    position: "relative",
  },
  btnCtaWhite: {
    padding: "13px 28px",
    border: "none",
    borderRadius: 9,
    background: "#fff",
    color: "#1a1aff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  btnCtaOutline: {
    padding: "13px 28px",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: 9,
    background: "transparent",
    color: "#fff",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  footer: {
    padding: "40px 60px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    gap: 40,
  },
  footerBrand: {
    fontSize: 13,
    color: "rgba(240,240,248,0.4)",
    lineHeight: 1.6,
    marginTop: 10,
  },
  footerColTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 14,
    color: "rgba(240,240,248,0.9)",
  },
  footerLink: {
    display: "block",
    fontSize: 13,
    color: "rgba(240,240,248,0.4)",
    marginBottom: 8,
    textDecoration: "none",
    cursor: "pointer",
  },
  footerBottom: {
    padding: "20px 60px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    fontSize: 12,
    color: "rgba(240,240,248,0.3)",
    textAlign: "center",
  },
};

const features = [
  {
    icon: "💡",
    bg: "rgba(255,200,50,0.1)",
    title: "AI Idea Generator",
    desc: "Generate hundreds of unique concepts based on emerging market trends and user signals.",
  },
  {
    icon: "🧠",
    bg: "rgba(100,100,255,0.1)",
    title: "Brainstorm Rooms",
    desc: "Collaborate in real-time with your team in digital war rooms with sticky notes and voting.",
  },
  {
    icon: "📊",
    bg: "rgba(50,200,150,0.1)",
    title: "AI Evaluation",
    desc: "Get instant feedback, market sizing, and feasibility scores for every idea you generate.",
  },
  {
    icon: "🚀",
    bg: "rgba(255,100,100,0.1)",
    title: "Startup Plan Builder",
    desc: "Transform winning ideas into actionable business roadmaps and ready-to-share pitch decks.",
  },
];

const testimonials = [
  {
    text: "IdeaForge helped us pivot our entire product strategy in just one weekend. The AI scoring is scary accurate.",
    name: "Sarah Chen",
    role: "Founder, Prism AI",
  },
  {
    text: "The collaborative rooms make remote brainstorming feel as energetic as being in a real war room.",
    name: "Marcus Wright",
    role: "Creative Director, Proxi",
  },
];

export default function LandingPage({ onNavigate }) {
  return (
    <div style={styles.root}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>⚡</div>
          IdeaForge
        </div>
        <ul style={styles.navLinks}>
          {["Product", "AI Tools", "Brainstorm Rooms", "Resources", "Pricing"].map(
            (l) => (
              <li key={l}>
                <a style={styles.navLink}>{l}</a>
              </li>
            )
          )}
        </ul>
        <div style={styles.navActions}>
          <button style={styles.btnOutline} onClick={() => onNavigate("login")}>
            Log In
          </button>
          <button style={styles.btnPrimary} onClick={() => onNavigate("login")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroLabel}>⚡ AI-Powered Brainstorming Platform</div>
        <h1 style={styles.heroTitle}>
          Build the{" "}
          <span style={styles.heroAccent}>Next Big Idea</span>
        </h1>
        <p style={styles.heroSub}>
          Unlock the power of AI-driven brainstorming to turn fragments of
          thoughts into structured startup plans with real-time collaboration.
        </p>
        <div style={styles.heroButtons}>
          <button
            style={styles.btnHeroPrimary}
            onClick={() => onNavigate("login")}
          >
            Start Brainstorming →
          </button>
          <button style={styles.btnHeroOutline}>Explore Demo</button>
        </div>

        {/* MOCKUP */}
        <div style={styles.mockup}>
          <div style={styles.mockupBar}>
            <div style={styles.mockupDot("#ff5f57")} />
            <div style={styles.mockupDot("#ffbd2e")} />
            <div style={styles.mockupDot("#28c840")} />
          </div>
          <div style={styles.mockupScreen}>
            {["AI Suggestions", "Top Ideas", "Analytics"].map((title, i) => (
              <div key={i} style={styles.mockupCard}>
                <div style={styles.mockupCardTitle}>{title}</div>
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    style={{
                      ...styles.mockupCardItem,
                      opacity: 1 - j * 0.2,
                    }}
                  >
                    {"▓".repeat(8 + i * 4 - j * 2)} {"░".repeat(4)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED */}
      <section style={styles.trusted}>
        <div style={styles.trustedLabel}>Trusted by innovators at world-class companies</div>
        <div style={styles.trustedLogos}>
          {["Velocity", "Prism AI", "Foundry", "Summit", "Orbit"].map((n) => (
            <span key={n} style={styles.trustedLogo}>{n}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.features}>
        <div style={styles.featuresHeader}>
          <h2 style={styles.featuresTitle}>Everything you need to ship faster</h2>
          <p style={styles.featuresSub}>
            Powerful tools designed to enhance your creative workflow and validate your boldest concepts.
          </p>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, background: f.bg }}>{f.icon}</div>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.howItWorks}>
        <h2 style={styles.howTitle}>How It Works</h2>
        <div style={styles.stepsGrid}>
          {[
            {
              n: "1",
              title: "Create",
              desc: "Start a new room and invite your team or AI collaborators to the session.",
            },
            {
              n: "2",
              title: "Generate",
              desc: "Use our multi-modal AI to branch out ideas and explore hundreds of variations.",
            },
            {
              n: "3",
              title: "Transform",
              desc: "Instantly convert your best concepts into a full-scale business execution plan.",
            },
          ].map((s) => (
            <div key={s.n} style={styles.step}>
              <div style={styles.stepNum}>{s.n}</div>
              <div style={styles.stepTitle}>{s.title}</div>
              <div style={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={styles.testimonials}>
        <div style={styles.testimonialsLeft}>
          <div style={styles.testimonialsMeta}>Innovate Together</div>
          <div style={styles.testimonialsCount}>50,000+</div>
          <p style={styles.testimonialsDesc}>
            Join a community of founders, product managers, and creative thinkers
            using IdeaForge to shape the future.
          </p>
        </div>
        <div style={styles.testimonialsRight}>
          {testimonials.map((t) => (
            <div key={t.name} style={styles.testimonialCard}>
              <p style={styles.testimonialText}>"{t.text}"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.avatar}>{t.name[0]}</div>
                <div style={styles.authorInfo}>
                  <div style={styles.authorName}>{t.name}</div>
                  <div style={styles.authorRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={styles.cta}>
        <div style={styles.ctaBg} />
        <h2 style={styles.ctaTitle}>Start Building Your Next Big Idea</h2>
        <p style={styles.ctaSub}>
          Join thousands of entrepreneurs using IdeaForge to turn sparks into startups. No credit card required.
        </p>
        <div style={styles.ctaButtons}>
          <button style={styles.btnCtaWhite} onClick={() => onNavigate("login")}>
            Get Started Free
          </button>
          <button style={styles.btnCtaOutline}>Schedule a Demo</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>⚡</div>
            IdeaForge
          </div>
          <p style={styles.footerBrand}>
            For creativity. From the spark to the final roadmap, we empower innovators everywhere.
          </p>
        </div>
        {[
          { title: "Product", links: ["Generator", "Evaluation", "Collaboration", "Integrations"] },
          { title: "Resources", links: ["Documentation", "Guides", "Case Studies", "API"] },
          { title: "Social", links: ["Twitter", "LinkedIn", "GitHub"] },
        ].map((col) => (
          <div key={col.title}>
            <div style={styles.footerColTitle}>{col.title}</div>
            {col.links.map((l) => (
              <a key={l} style={styles.footerLink}>{l}</a>
            ))}
          </div>
        ))}
      </footer>
      <div style={styles.footerBottom}>
        © 2024 IdeaForge. All rights reserved. — Terms · Privacy
      </div>
    </div>
  );
}
