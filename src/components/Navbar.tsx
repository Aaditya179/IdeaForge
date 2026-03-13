"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, Bell, Settings, Sun, Moon, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIdeaStore } from "@/lib/store";
import RoomInfoModal from "./RoomInfoModal";

export default function Navbar() {
  const theme = useIdeaStore((state) => state.theme);
  const toggleTheme = useIdeaStore((state) => state.toggleTheme);
  const currentRoom = useIdeaStore((state) => state.currentRoom);
  const collaborators = useIdeaStore((state) => state.collaborators);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showUsersPanel, setShowUsersPanel] = useState(false);

  const collabList = Object.values(collaborators);
  const visibleCollabs = collabList.slice(0, 5);
  const remainingCount = collabList.length - 5;

  return (
    <header
      className="relative z-30 flex items-center justify-between px-5 py-3 border-b"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border)",
        height: "56px",
      }}
    >
      {/* Logo + Project Name */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #7c5cfc, #c084fc)" }}
          >
            <Lightbulb size={16} className="text-white" />
          </div>
          <span
            className="text-sm font-bold tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="gradient-text">IdeaForge</span>
          </span>
        </div>

        <div
          className="h-4 w-px"
          style={{ background: "var(--border)" }}
        />

        <div
          className="flex items-center gap-1.5 cursor-pointer group"
          onClick={() => setShowInfoModal(true)}
        >
          <span
            className="text-sm font-semibold transition-colors"
            style={{ color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {currentRoom?.title || "Loading..."}
          </span>
          <ChevronDown
            size={14}
            className="transition-transform group-hover:rotate-180"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
      </div>

      {/* Collaborators Avatar Group */}
      <div className="hidden md:flex items-center mr-auto px-4 relative">
        <div
          className="flex items-center -space-x-2 cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => setShowUsersPanel(!showUsersPanel)}
        >
          <AnimatePresence>
            {visibleCollabs.map((collab) => (
              <div key={collab.id} className="relative group/avatar">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="relative w-8 h-8 rounded-full border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-110 hover:z-10 overflow-hidden"
                  style={{ backgroundColor: collab.color }}
                >
                  {collab.avatar ? (
                    <img
                      src={collab.avatar}
                      alt={collab.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    collab.name.charAt(0).toUpperCase()
                  )}
                  {/* Active dot */}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[var(--bg-secondary)]" />
                </motion.div>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/avatar:opacity-100 pointer-events-none transition-all duration-200 -translate-y-1 group-hover/avatar:translate-y-0 z-50">
                  <div className="bg-gray-900/95 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xl border border-white/10 whitespace-nowrap">
                    {collab.name}
                  </div>
                </div>
              </div>
            ))}

            {remainingCount > 0 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-8 h-8 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] shadow-sm"
              >
                +{remainingCount}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Users Dropdown Panel */}
        <AnimatePresence>
          {showUsersPanel && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-4 mt-2 w-64 rounded-xl border shadow-2xl z-50 overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <UsersIcon size={14} className="text-[#7c5cfc]" />
                  Active Collaborators ({collabList.length})
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {collabList.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                        style={{ backgroundColor: collab.color }}
                      >
                        {collab.avatar ? (
                          <img src={collab.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          collab.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                        {collab.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>online</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleTheme()}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105 active:scale-95"
          style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              whileTap={{ rotate: 180 }}
            >
              <Sun size={14} className="text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              whileTap={{ rotate: -180 }}
            >
              <Moon size={14} className="text-indigo-400" />
            </motion.div>
          )}
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105"
          style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
        >
          <Bell size={14} style={{ color: "var(--text-secondary)" }} />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105"
          style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
        >
          <Settings size={14} style={{ color: "var(--text-secondary)" }} />
        </button>
      </div>

      <RoomInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </header>
  );
}
