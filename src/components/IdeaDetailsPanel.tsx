"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ThumbsUp, Sparkles, CheckCircle,
  Tag, Calendar, Trash2, Share2, Copy, Edit2,
  Target, Users, Layers, Briefcase, Loader2, Network, MessageSquare, Send
} from "lucide-react";
import { useIdeaStore } from "@/lib/store";
import { cn, getTagColor } from "@/lib/utils";
import { useEffect } from "react";

export default function IdeaDetailsPanel() {
  const ideas = useIdeaStore((state) => state.ideas);
  const selectedIdeaId = useIdeaStore((state) => state.selectedIdeaId);
  const setSelectedIdeaId = useIdeaStore((state) => state.setSelectedIdeaId);
  const voteIdea = useIdeaStore((state) => state.voteIdea);
  const deleteIdea = useIdeaStore((state) => state.deleteIdea);
  const updateIdea = useIdeaStore((state) => state.updateIdea);
  const expandIdea = useIdeaStore((state) => state.expandIdea);
  const aiExpansions = useIdeaStore((state) => state.aiExpansions);
  const aiExpandingId = useIdeaStore((state) => state.aiExpandingId);
  const mapIdea = useIdeaStore((state) => state.mapIdea);
  const aiMappingId = useIdeaStore((state) => state.aiMappingId);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const idea = ideas.find((i) => i.id === selectedIdeaId);
  const comments = useIdeaStore((state) => state.comments);
  const fetchComments = useIdeaStore((state) => state.fetchComments);
  const addComment = useIdeaStore((state) => state.addComment);

  useEffect(() => {
    if (selectedIdeaId) {
      fetchComments(selectedIdeaId);
    }
  }, [selectedIdeaId, fetchComments]);

  if (!idea) return null;

  const expansion = aiExpansions[idea.id];
  const isExpanding = aiExpandingId === idea.id;
  const isMapping = aiMappingId === idea.id;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${idea.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTitleSave = () => {
    if (editTitle.trim()) {
      updateIdea(idea.id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleStartEditTitle = () => {
    setEditTitle(idea.title);
    setIsEditingTitle(true);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await addComment(idea.id, commentInput.trim());
    setCommentInput("");
  };

  const ideaComments = comments[idea.id] || [];

  return (
    <AnimatePresence>
      <motion.aside
        key={idea.id}
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed top-24 right-6 bottom-6 w-80 z-40 flex flex-col rounded-3xl bg-[var(--bg-card)] shadow-2xl border border-[var(--border)] overflow-hidden"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Idea Details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyLink}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              style={{ color: "var(--text-muted)" }}
              title="Copy link"
            >
              {copied ? <Copy size={12} className="text-emerald-400" /> : <Share2 size={12} />}
            </button>
            <button
              onClick={() => deleteIdea(idea.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-500/10 transition-colors"
              style={{ color: "var(--text-muted)" }}
              title="Delete idea"
            >
              <Trash2 size={12} />
            </button>
            <button
              onClick={() => setSelectedIdeaId(null)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Title */}
          <div className="px-4 pt-4 pb-2">
            {isEditingTitle ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                className="w-full text-base font-bold bg-transparent outline-none border-b pb-1"
                style={{
                  color: "var(--text-primary)",
                  borderColor: "var(--accent)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              />
            ) : (
              <div
                className="group flex items-start gap-2 cursor-text"
                onClick={handleStartEditTitle}
              >
                <h2
                  className="flex-1 text-base font-bold leading-snug"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {idea.title}
                </h2>
                <Edit2
                  size={12}
                  className="mt-1 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0"
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="px-4 flex items-center gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
              <Calendar size={10} />
              {idea.createdAt}
            </div>
          </div>

          {/* Vote bar */}
          <div
            className="mx-4 mb-4 flex items-center gap-3 p-3 rounded-xl"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => voteIdea(idea.id)}
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "rgba(124,92,252,0.15)", color: "var(--accent-light)" }}
              >
                <ThumbsUp size={14} />
              </div>
              <div>
                <p className="text-base font-bold leading-none" style={{ color: "var(--accent-light)" }}>
                  {idea.votes}
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  votes
                </p>
              </div>
            </button>
          </div>

          {/* Description */}
          <div className="px-4 mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Description
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {idea.description}
            </p>
          </div>

          {/* Tags */}
          <div className="px-4 mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={11} style={{ color: "var(--text-muted)" }} />
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Tags
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {idea.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", getTagColor(tag))}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* AI Actions */}
          <div className="px-4 mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              AI Actions
            </p>
            {!expansion && !isExpanding && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => expandIdea(idea.id)}
                className="flex w-full items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: "rgba(124,92,252,0.15)",
                  border: "1px solid rgba(124,92,252,0.3)",
                  color: "var(--accent-light)",
                }}
              >
                <Sparkles size={14} />
                Expand with AI
              </motion.button>
            )}

            {/* Map on Canvas button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => mapIdea(idea.id)}
              disabled={isMapping}
              className="flex w-full items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all mt-2"
              style={{
                background: "rgba(56,189,248,0.12)",
                border: "1px solid rgba(56,189,248,0.25)",
                color: "#38bdf8",
              }}
            >
              {isMapping ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Mapping...
                </>
              ) : (
                <>
                  <Network size={14} />
                  Map on Canvas
                </>
              )}
            </motion.button>

            {isExpanding && (
              <div
                className="flex items-center justify-center gap-2 py-4 rounded-xl"
                style={{
                  background: "rgba(124,92,252,0.06)",
                  border: "1px solid rgba(124,92,252,0.15)",
                }}
              >
                <Loader2
                  size={16}
                  className="animate-spin"
                  style={{ color: "var(--accent-light)" }}
                />
                <span className="text-xs font-medium" style={{ color: "var(--accent-light)" }}>
                  AI is thinking...
                </span>
              </div>
            )}
          </div>

          {/* AI Expansion Results */}
          {expansion && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="px-4 pb-4 space-y-3"
            >
              {/* Divider */}
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={12} style={{ color: "var(--accent-light)" }} />
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-light)" }}>
                  AI Expansion
                </p>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              {/* Problem Statement */}
              <AiSection
                icon={Target}
                title="Problem Statement"
                color="#f97316"
              >
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {expansion.problemStatement}
                </p>
              </AiSection>

              {/* Target Users */}
              <AiSection
                icon={Users}
                title="Target Users"
                color="#38bdf8"
              >
                <ul className="space-y-1">
                  {expansion.targetUsers.map((user, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                      <span className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ background: "#38bdf8" }} />
                      {user}
                    </li>
                  ))}
                </ul>
              </AiSection>

              {/* Features */}
              <AiSection
                icon={Layers}
                title="Possible Features"
                color="#a78bfa"
              >
                <ul className="space-y-1.5">
                  {expansion.possibleFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                      <span
                        className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded text-[9px] font-bold"
                        style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}
                      >
                        {i + 1}
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </AiSection>

              {/* Business Model */}
              <AiSection
                icon={Briefcase}
                title="Business Model"
                color="#34d399"
              >
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {expansion.businessModel}
                </p>
              </AiSection>

              {/* Re-expand button */}
              <button
                onClick={() => expandIdea(idea.id)}
                className="flex w-full items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-medium transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(124,92,252,0.08)",
                  border: "1px solid rgba(124,92,252,0.15)",
                  color: "var(--text-muted)",
                }}
              >
                <Sparkles size={10} />
                Regenerate
              </button>
            </motion.div>
          )}

          {/* Comments Section */}
          <div className="px-4 py-6 border-t mt-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={14} style={{ color: "var(--text-muted)" }} />
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Comments ({ideaComments.length})
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {ideaComments.length === 0 ? (
                <p className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
                  No comments yet. Be the first to spark a conversation!
                </p>
              ) : (
                ideaComments.map((comment) => (
                  <div key={comment.id} className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#c084fc] flex items-center justify-center text-[8px] font-bold text-white uppercase">
                        {comment.userId[0]}
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: "var(--text-primary)" }}>
                        {comment.userId === "Anonymous" ? "Member" : comment.userId.slice(0, 8)}
                      </span>
                      <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-[12px] pl-7 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="relative">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 rounded-xl text-xs outline-none transition-all border"
                style={{
                  background: "var(--bg-tertiary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#7c5cfc] transition-all hover:scale-110 disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

/* ─── Reusable section card for AI results ─── */
function AiSection({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}20`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={12} style={{ color }} />
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}
