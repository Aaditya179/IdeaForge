"use client";

import { Suspense, useEffect, use } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TldrawCanvas from "@/components/TldrawCanvas";
import IdeaDetailsPanel from "@/components/IdeaDetailsPanel";
import Toolbar from "@/components/Toolbar";
import ChatBot from "@/components/ChatBot";
import { useIdeaStore } from "@/lib/store";
import AddIdeaModal from "@/components/AddIdeaModal";
import { useState } from "react";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

function AppShell({ roomId }: { roomId: string }) {
  const { selectedIdeaId, loading, fetchIdeas, subscribeToRoom, theme, setTheme, setRoomId, isAddModalOpen, setAddModalOpen } = useIdeaStore();

  useEffect(() => {
    if (roomId) {
      const init = async () => {
        setRoomId(roomId);
        await fetchIdeas(roomId);
        const unsubscribe = subscribeToRoom(roomId);
        return unsubscribe;
      };

      let unsubscribeFn: (() => void) | undefined;
      init().then(fn => { unsubscribeFn = fn; });

      return () => {
        if (unsubscribeFn) unsubscribeFn();
      };
    }
  }, [fetchIdeas, subscribeToRoom, roomId, setRoomId]);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("ideaforge-theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
      <ChatBot />
      <Sidebar />
      <Toolbar />

      <div className="flex h-screen w-screen flex-col">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          {/* Main Canvas */}
          <main className="relative flex-1 overflow-hidden">
            {/* Main Canvas - Always mounted to prevent state loss */}
            <TldrawCanvas roomId={roomId} />

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/50 backdrop-blur-sm">
                <Loader2
                  size={28}
                  className="animate-spin text-[#7c5cfc]"
                />
              </div>
            )}

            {/* Floating Add Idea Button */}
            {!loading && (
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setAddModalOpen(true);
                }}
                className="absolute bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#c084fc] text-white shadow-xl shadow-[#7c5cfc]/30 hover:scale-105 transition-transform z-10"
                title="Add New Idea"
              >
                <Plus size={24} />
              </button>
            )}

            <AddIdeaModal
              isOpen={isAddModalOpen}
              onClose={() => setAddModalOpen(false)}
            />
          </main>

          {/* Right Panel Overlay (Detail) */}
          <AnimatePresence>
            {selectedIdeaId && (
              <IdeaDetailsPanel />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = use(params);

  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 size={32} className="animate-spin text-[#7c5cfc]" />
      </div>
    }>
      <AppShell roomId={roomId} />
    </Suspense>
  );
}
