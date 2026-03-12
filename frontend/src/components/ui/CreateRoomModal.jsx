import { useState } from "react";

const S = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(10,10,30,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, backdropFilter: "blur(4px)", padding: "20px",
  },
  modal: {
    background: "#fff", borderRadius: 20, padding: "32px",
    width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto",
    position: "relative", boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
    fontFamily: "'DM Sans', sans-serif",
  },
  closeBtn: {
    position: "absolute", top: 20, right: 20, width: 30, height: 30,
    borderRadius: "50%", background: "#f5f5fa", border: "none", cursor: "pointer",
    fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#888",
  },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#0a0a1a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.5 },
  sectionTitle: { fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#3b3bff", textTransform: "uppercase", marginBottom: 18 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a1a", marginBottom: 7 },
  input: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e8e8f0", borderRadius: 10,
    fontSize: 14, color: "#0a0a1a", outline: "none", fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box", background: "#fff", transition: "border-color 0.15s",
  },
  inputFocus: { borderColor: "#3b3bff" },
  inputError: { borderColor: "#e74c3c" },
  textarea: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e8e8f0", borderRadius: 10,
    fontSize: 14, color: "#0a0a1a", outline: "none", fontFamily: "'DM Sans', sans-serif",
    boxSizing: "border-box", resize: "vertical", minHeight: 100, background: "#fff",
  },
  select: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e8e8f0", borderRadius: 10,
    fontSize: 14, color: "#0a0a1a", outline: "none", fontFamily: "'DM Sans', sans-serif",
    background: "#fff", cursor: "pointer", appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' strokeWidth='1.5'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  visibilityRow: { display: "flex", background: "#f5f5fa", borderRadius: 10, padding: 4 },
  visBtn: (active) => ({
    flex: 1, padding: "9px", borderRadius: 8, border: "none",
    background: active ? "#fff" : "transparent",
    color: active ? "#3b3bff" : "#888",
    fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
    transition: "all 0.15s",
  }),
  divider: { height: 1, background: "#f0f0f8", margin: "24px 0" },
  toggleRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: 16, background: "#fafaff", borderRadius: 12,
    border: "1px solid #eaeaf0", marginBottom: 10,
  },
  toggleLeft: { display: "flex", alignItems: "center", gap: 12 },
  toggleIconWrap: {
    width: 38, height: 38, borderRadius: 10, background: "rgba(59,59,255,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
  },
  toggleTitle: { fontSize: 14, fontWeight: 600, color: "#0a0a1a", marginBottom: 2 },
  toggleDesc: { fontSize: 12, color: "#888" },
  toggle: (on) => ({
    width: 46, height: 26, borderRadius: 13,
    background: on ? "#3b3bff" : "#ddd", cursor: "pointer",
    position: "relative", transition: "background 0.2s", flexShrink: 0, border: "none",
  }),
  toggleKnob: (on) => ({
    position: "absolute", top: 3, left: on ? 22 : 3,
    width: 20, height: 20, borderRadius: "50%", background: "#fff",
    transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  }),
  footer: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28, alignItems: "center" },
  btnCancel: {
    padding: "12px 24px", background: "transparent", color: "#555", border: "none",
    borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  btnCreate: {
    padding: "12px 28px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 4px 16px rgba(59,59,255,0.35)",
  },
  errorMsg: { fontSize: 12, color: "#e74c3c", marginTop: 5 },
  successOverlay: {
    position: "absolute", inset: 0, background: "#fff", borderRadius: 20,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 12,
  },
  successIcon: { fontSize: 56 },
  successTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#0a0a1a" },
  successSub: { fontSize: 14, color: "#888" },
  btnGoRoom: {
    marginTop: 8, padding: "12px 28px",
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 10,
    fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 4px 16px rgba(59,59,255,0.35)",
  },
};

const CAT_COLORS = {
  "AI & Tech": "#3b3bff", "Finance": "#f39c12", "Healthcare": "#9b5cff",
  "Environment": "#27ae60", "Startup": "#e74c3c", "HR": "#3b8bff",
};
const CAT_GRADIENTS = {
  "AI & Tech": "linear-gradient(135deg, #1a1a3a, #2d3566)",
  "Finance": "linear-gradient(135deg, #1a2a3a, #1a3a50)",
  "Healthcare": "linear-gradient(135deg, #1a1a3a, #2d3566)",
  "Environment": "linear-gradient(135deg, #1a3a1a, #2a6633)",
  "Startup": "linear-gradient(135deg, #2a1a2a, #3a2040)",
  "HR": "linear-gradient(135deg, #2a2a3a, #3a3a5a)",
};

export default function CreateRoomModal({ onClose, onRoomCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("AI & Tech");
  const [limit, setLimit] = useState("25");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("1 hour");
  const [visibility, setVisibility] = useState("public");
  const [anon, setAnon] = useState(true);
  const [voting, setVoting] = useState(true);
  const [editing, setEditing] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [focused, setFocused] = useState("");

  const handleCreate = () => {
    if (!title.trim()) { setTitleError(true); return; }
    setTitleError(false);
    const newRoom = {
      id: `room-${Date.now()}`,
      title: title.trim(),
      cat: category,
      catColor: CAT_COLORS[category] || "#3b3bff",
      gradient: CAT_GRADIENTS[category] || "linear-gradient(135deg, #1a1a3a, #2d3566)",
      status: true,
      participants: 1,
      ideas: 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: description || `A brainstorm session exploring ${category} ideas.`,
      score: "—",
      isNew: true,
    };
    setCreatedRoom(newRoom);
    setSuccess(true);
  };

  const handleGoToRoom = () => {
    if (onRoomCreated) onRoomCreated(createdRoom);
    onClose();
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && !success && onClose()}>
      <div style={S.modal}>
        {/* SUCCESS STATE */}
        {success && createdRoom && (
          <div style={S.successOverlay}>
            <div style={S.successIcon}>🚀</div>
            <div style={S.successTitle}>Room Created!</div>
            <div style={S.successSub}>"{createdRoom.title}" is ready for brainstorming</div>
            <button style={S.btnGoRoom} onClick={handleGoToRoom}>Enter Room →</button>
            <button style={{ ...S.btnCancel, marginTop: 4 }} onClick={onClose}>Go Back to Dashboard</button>
          </div>
        )}

        {!success && (
          <>
            <button style={S.closeBtn} onClick={onClose}>✕</button>
            <h2 style={S.title}>Create Brainstorm Room</h2>
            <p style={S.subtitle}>Start a collaborative space where participants can share and develop innovative ideas.</p>

            <div style={S.sectionTitle}>1. Room Details</div>

            <div style={S.field}>
              <label style={S.label}>Room Title <span style={{ color: "#e74c3c" }}>*</span></label>
              <input
                style={{ ...S.input, ...(focused === "title" ? S.inputFocus : {}), ...(titleError ? S.inputError : {}) }}
                placeholder="e.g. Future of Fintech 2024"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
                onFocus={() => setFocused("title")}
                onBlur={() => setFocused("")}
              />
              {titleError && <div style={S.errorMsg}>Room title is required</div>}
            </div>

            <div style={{ ...S.row, ...S.field }}>
              <div>
                <label style={S.label}>Topic / Category</label>
                <select style={S.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {Object.keys(CAT_COLORS).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Participants Limit</label>
                <input
                  style={{ ...S.input, ...(focused === "limit" ? S.inputFocus : {}) }}
                  type="number" value={limit} min={1} max={500}
                  onChange={(e) => setLimit(e.target.value)}
                  onFocus={() => setFocused("limit")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            <div style={S.field}>
              <label style={S.label}>Description</label>
              <textarea
                style={S.textarea}
                placeholder="Briefly describe the objective of this session..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={S.row}>
              <div>
                <label style={S.label}>Room Duration</label>
                <select style={S.select} value={duration} onChange={(e) => setDuration(e.target.value)}>
                  {["30 minutes", "1 hour", "2 hours", "4 hours", "Unlimited"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Visibility</label>
                <div style={S.visibilityRow}>
                  <button style={S.visBtn(visibility === "public")} onClick={() => setVisibility("public")}>Public</button>
                  <button style={S.visBtn(visibility === "private")} onClick={() => setVisibility("private")}>Private</button>
                </div>
              </div>
            </div>

            <div style={S.divider} />

            <div style={S.sectionTitle}>2. Idea Rules</div>
            {[
              { icon: "👤", title: "Allow anonymous ideas", desc: "Participants can post without revealing identity", state: anon, toggle: () => setAnon(!anon) },
              { icon: "👍", title: "Enable idea voting", desc: "Users can upvote or downvote suggestions", state: voting, toggle: () => setVoting(!voting) },
              { icon: "✏️", title: "Real-time editing", desc: "Allow participants to edit submitted ideas", state: editing, toggle: () => setEditing(!editing) },
            ].map((item) => (
              <div key={item.title} style={S.toggleRow}>
                <div style={S.toggleLeft}>
                  <div style={S.toggleIconWrap}>{item.icon}</div>
                  <div>
                    <div style={S.toggleTitle}>{item.title}</div>
                    <div style={S.toggleDesc}>{item.desc}</div>
                  </div>
                </div>
                <button style={S.toggle(item.state)} onClick={item.toggle}>
                  <div style={S.toggleKnob(item.state)} />
                </button>
              </div>
            ))}

            <div style={S.footer}>
              <button style={S.btnCancel} onClick={onClose}>Cancel</button>
              <button style={S.btnCreate} onClick={handleCreate}>Create Room 🚀</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
