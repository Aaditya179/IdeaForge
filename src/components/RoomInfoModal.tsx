"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Lightbulb, Info } from "lucide-react";
import { useIdeaStore } from "@/lib/store";

interface RoomInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomInfoModal({ isOpen, onClose }: RoomInfoModalProps) {
  const { currentRoom } = useIdeaStore();

  if (!currentRoom) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md overflow-hidden rounded-[28px] shadow-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)"
            }}
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-br from-[#7c5cfc] to-[#c084fc] p-6">
              <div className="flex justify-between items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <Lightbulb size={24} className="text-white" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentRoom.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-[#7c5cfc]" />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    About this Room
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {currentRoom.description || "No description provided for this innovation room."}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={12} className="text-[#38bdf8]" />
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Active</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {currentRoom.participants} <span className="text-xs font-normal">Members</span>
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb size={12} className="text-[#a78bfa]" />
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Ideas</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {currentRoom.ideas} <span className="text-xs font-normal">Created</span>
                  </p>
                </div>
              </div>

              {/* Footer Meta */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-medium">
                  <Calendar size={13} />
                  Created {new Date(currentRoom.created_at).toLocaleDateString()}
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                  LIVE SESSION
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
