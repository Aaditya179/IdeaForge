"use client";

import { useIdeaStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2 } from "lucide-react";

export default function CollaboratorCursors() {
  const collaborators = useIdeaStore((state) => state.collaborators);
  const tldrawEditor = useIdeaStore((state) => state.tldrawEditor);
  const myPresenceId = useIdeaStore((state) => state.myPresenceId);

  if (!tldrawEditor) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {Object.values(collaborators)
          .filter((collab) => collab.id !== myPresenceId)
          .map((collab) => {
            if (!collab.cursor) return null;

            // We need to transform canvas coordinates to screen coordinates
            if (!Number.isFinite(collab.cursor.x) || !Number.isFinite(collab.cursor.y)) return null;
            const point = tldrawEditor.pageToViewport(collab.cursor);
            if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;

            return (
              <motion.div
                key={collab.id}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  x: point.x,
                  y: point.y
                }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                className="absolute left-0 top-0 flex flex-col items-start gap-1"
              >
                <MousePointer2
                  size={20}
                  style={{
                    color: collab.color,
                    fill: collab.color,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                  }}
                />
                <div
                  className="flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg whitespace-nowrap"
                  style={{ backgroundColor: collab.color }}
                >
                  {(collab as any).avatar && (
                    <img
                      src={(collab as any).avatar}
                      className="w-3.5 h-3.5 rounded-full object-cover border border-white/20"
                      alt=""
                    />
                  )}
                  {collab.name}
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
