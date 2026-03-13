"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { useIdeaStore } from "@/lib/store";

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddIdeaModal({ isOpen, onClose }: AddIdeaModalProps) {
  const { addIdea } = useIdeaStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await addIdea({
        title: title.trim(),
        description: description.trim(),
        tags: ["Idea"],
      });
      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      setError("Failed to add idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#c084fc] text-white">
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Add New Idea</h3>
                <p className="text-xs text-[var(--text-muted)]">Share your brainstorm with the room</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">
                Idea Title <span className="text-red-500">*</span>
              </label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. AI-Powered Diagnosis Tool"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full rounded-2xl border bg-[var(--bg-tertiary)] px-5 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)]/50 focus:border-[#7c5cfc] focus:ring-4 focus:ring-[#7c5cfc]/10 ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" : "border-[var(--border)]"
                  }`}
              />
              {error && <p className="ml-1 text-[10px] font-medium text-red-500">{error}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">
                Description
              </label>
              <textarea
                placeholder="Briefly explain your idea..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-5 py-3.5 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)]/50 focus:border-[#7c5cfc] focus:ring-4 focus:ring-[#7c5cfc]/10"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[var(--bg-tertiary)] py-3 text-sm font-bold text-[var(--text-primary)] transition-all hover:bg-[var(--bg-hover)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#c084fc] py-3 text-sm font-bold text-white shadow-lg shadow-[#7c5cfc]/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Add to Room
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
