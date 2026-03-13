"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, ChevronRight, Lightbulb,
  TrendingUp, Clock, Star, Hash, X, Mic
} from "lucide-react";
import { useIdeaStore, Idea } from "@/lib/store";
import { cn, getTagColor } from "@/lib/utils";
import VoiceIdeaModal from "./VoiceIdeaModal";

const ALL_TAGS = ["AI", "UX", "Product", "Design", "Research", "Marketing", "Engineering", "Strategy"];

function SidebarIdeaItem({ idea, isSelected, onClick }: {
  idea: Idea;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { comments } = useIdeaStore();
  const commentCount = comments[idea.id]?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      onClick={onClick}
      className={cn(
        "group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all",
        isSelected ? "bg-[var(--accent-glow)] border-[var(--accent)]/30" : "hover:bg-[var(--bg-hover)] border-transparent"
      )}
      style={{ border: "1px solid transparent" }}
    >
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors shadow-sm",
          isSelected ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-light)] text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
        )}
      >
        <Lightbulb size={14} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-[var(--text-primary)] truncate leading-tight">
          {idea.title}
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[var(--text-muted)] font-bold">
              ▲ {idea.votes}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-bold opacity-70">
              💬 {commentCount}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] italic font-bold truncate max-w-[80px]">
            {idea.createdBy}
          </span>
        </div>
      </div>

      <ChevronRight
        size={14}
        className={cn(
          "flex-shrink-0 mt-2 transition-all text-[var(--accent)]",
          isSelected ? "rotate-90 opacity-100" : "opacity-0 group-hover:opacity-50"
        )}
      />
    </motion.div>
  );
}

export default function Sidebar() {
  const ideas = useIdeaStore((state) => state.ideas);
  const selectedIdeaId = useIdeaStore((state) => state.selectedIdeaId);
  const activeTag = useIdeaStore((state) => state.activeTag);
  const setSelectedIdeaId = useIdeaStore((state) => state.setSelectedIdeaId);
  const setActiveTag = useIdeaStore((state) => state.setActiveTag);
  const addIdea = useIdeaStore((state) => state.addIdea);
  const isSidebarOpen = useIdeaStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useIdeaStore((state) => state.setSidebarOpen);
  const setAddModalOpen = useIdeaStore((state) => state.setAddModalOpen);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "starred">("trending");
  const [voiceOpen, setVoiceOpen] = useState(false);

  const filteredIdeas = ideas
    .filter((idea) => {
      const matchSearch = idea.title.toLowerCase().includes(search.toLowerCase()) ||
        idea.description.toLowerCase().includes(search.toLowerCase());
      const matchTag = !activeTag || idea.tags.includes(activeTag);
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (sortBy === "trending") return b.votes - a.votes;
      return 0;
    });

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 bottom-0 w-80 z-40 flex flex-col bg-[var(--bg-card)]/90 backdrop-blur-xl shadow-2xl border-r border-[var(--border)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Brainstorm Ideas</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-[var(--bg-hover)] rounded-xl text-[var(--text-muted)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] shadow-sm">
              <Search size={15} className="text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[14px] outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] font-medium"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={14} className="text-[var(--text-muted)]" />
                </button>
              )}
            </div>
          </div>

          {/* Sort Tabs */}
          <div className="flex px-3 py-2 gap-1">
            {([
              { id: "trending", icon: TrendingUp, label: "Top" },
              { id: "newest", icon: Clock, label: "New" },
              { id: "starred", icon: Star, label: "Saved" },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setSortBy(id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                  sortBy === id ? "bg-[#7c5cfc] text-white shadow-md shadow-[#7c5cfc]/20" : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                )}
              >
                <Icon size={10} />
                {label}
              </button>
            ))}
          </div>

          {/* Tags Filter */}
          <div className="px-3 pb-2">
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all",
                    activeTag === tag ? getTagColor(tag) : "bg-[var(--bg-tertiary)] border-transparent text-[var(--text-muted)] hover:border-[var(--border)]"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Ideas List */}
          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5 mt-2">
            {filteredIdeas.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-8 gap-2">
                <Lightbulb size={24} className="text-[var(--text-muted)] opacity-20" />
                <p className="text-xs text-[var(--text-muted)] text-center">No ideas match</p>
              </div>
            ) : (
              filteredIdeas.map((idea) => (
                <SidebarIdeaItem
                  key={idea.id}
                  idea={idea}
                  isSelected={selectedIdeaId === idea.id}
                  onClick={() => setSelectedIdeaId(selectedIdeaId === idea.id ? null : idea.id)}
                />
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3 border-t border-[var(--border)] flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setAddModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-[#7c5cfc] to-[#c084fc] shadow-lg shadow-[#7c5cfc]/20"
            >
              <Plus size={15} />
              New Idea
            </motion.button>
            <button
              onClick={() => setVoiceOpen(true)}
              className="h-[42px] w-[42px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[#ef4444] to-[#f97316] text-white shadow-lg shadow-red-500/20"
            >
              <Mic size={16} />
            </button>
          </div>

          <VoiceIdeaModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
