"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/services/rooms";
import { CAT_COLORS } from "@/lib/constants";

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
    fontFamily: "'Inter', sans-serif",
  },
  closeBtn: {
    position: "absolute", top: 20, right: 20, width: 30, height: 30,
    borderRadius: "50%", background: "#f5f5fa", border: "none", cursor: "pointer",
    fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#888",
  },
  title: { fontWeight: 800, fontSize: 24, color: "#0a0a1a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.5 },
  sectionTitle: { fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "#3b3bff", textTransform: "uppercase", marginBottom: 18 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#0a0a1a", marginBottom: 7 },
  input: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e8e8f0", borderRadius: 10,
    fontSize: 14, color: "#0a0a1a", outline: "none", fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box" as const, background: "#fff", transition: "border-color 0.15s",
  },
  inputFocus: { borderColor: "#3b3bff" },
  inputError: { borderColor: "#e74c3c" },
  textarea: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e8e8f0", borderRadius: 10,
    fontSize: 14, color: "#0a0a1a", outline: "none", fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box" as const, resize: "vertical" as const, minHeight: 100, background: "#fff",
  },
  select: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e8e8f0", borderRadius: 10,
    fontSize: 14, color: "#0a0a1a", outline: "none", fontFamily: "'Inter', sans-serif",
    background: "#fff", cursor: "pointer", appearance: "none" as const,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' strokeWidth='1.5'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  visibilityRow: { display: "flex", background: "#f5f5fa", borderRadius: 10, padding: 4 },
  visBtn: (active: boolean) => ({
    flex: 1, padding: "9px", borderRadius: 8, border: "none",
    background: active ? "#fff" : "transparent",
    color: active ? "#3b3bff" : "#888",
    fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
    transition: "all 0.15s",
  } as const),
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
  toggle: (on: boolean) => ({
    width: 46, height: 26, borderRadius: 13,
    background: on ? "#3b3bff" : "#ddd", cursor: "pointer",
    position: "relative", transition: "background 0.2s", flexShrink: 0, border: "none",
  } as const),
  toggleKnob: (on: boolean) => ({
    position: "absolute", top: 3, left: on ? 22 : 3,
    width: 20, height: 20, borderRadius: "50%", background: "#fff",
    transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  } as const),
  footer: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28, alignItems: "center" },
  btnCancel: {
    padding: "12px 24px", background: "transparent", color: "#555", border: "none",
    borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "'Inter', sans-serif",
  },
  btnCreate: {
    padding: "12px 28px", background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
    cursor: "pointer", fontFamily: "'Inter', sans-serif",
    display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 4px 16px rgba(59,59,255,0.35)",
  },
  errorMsg: { fontSize: 12, color: "#e74c3c", marginTop: 5 },
  successOverlay: {
    position: "absolute", inset: 0, background: "#fff", borderRadius: 20,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 16, padding: "40px", textAlign: "center",
    zIndex: 10,
  } as const,
  successIcon: { fontSize: 80 },
  successTitle: { fontWeight: 800, fontSize: 32, color: "#0a0a1a" },
  successSub: { fontSize: 16, color: "#888", maxWidth: 300, lineHeight: 1.5 },
  btnGoRoom: {
    marginTop: 16, padding: "16px 36px",
    background: "linear-gradient(135deg, #3b3bff, #7b5cff)",
    color: "#fff", border: "none", borderRadius: 12,
    fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Inter', sans-serif",
    boxShadow: "0 6px 24px rgba(59,59,255,0.4)",
  },
} as const;

interface CreateRoomModalProps {
  onClose: () => void;
  onRoomCreated?: (room: any) => void;
}

export default function CreateRoomModal({ onClose, onRoomCreated }: CreateRoomModalProps) {
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
  const [createdRoom, setCreatedRoom] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [focused, setFocused] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim()) { setTitleError(true); return; }
    setTitleError(false);
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const newRoom = await createRoom({
        title: title.trim(),
        category,
        limit,
        description,
        duration,
      });

      setCreatedRoom(newRoom);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToRoom = () => {
    if (onRoomCreated) onRoomCreated(createdRoom);
    router.push(`/room/${createdRoom.id}`);
    onClose();
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && !success && onClose()}>
      <div style={S.modal}>
        {success && createdRoom && (
          <div style={S.successOverlay}>
            <div style={S.successIcon}>🚀</div>
            <div style={S.successTitle}>Room Created!</div>
            <div style={S.successSub}>"{createdRoom.title}" is ready and waiting for everyone's input.</div>
            <button style={S.btnGoRoom} onClick={handleGoToRoom}>Enter Room →</button>
            <button style={{ ...S.btnCancel, padding: "12px 24px", marginTop: 4 }} onClick={onClose}>Go Back to Dashboard</button>
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

            {errorMsg && <div style={{ ...S.errorMsg, textAlign: "center", marginBottom: 12 }}>{errorMsg}</div>}
            <div style={S.footer}>
              <button style={S.btnCancel} onClick={onClose} disabled={isSubmitting}>Cancel</button>
              <button style={S.btnCreate} onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Room 🚀"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
