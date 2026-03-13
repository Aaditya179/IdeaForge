"use client";

import { useIdeaStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActivityFeed() {
  const { activityFeed } = useIdeaStore();
  const [visibleMessages, setVisibleMessages] = useState(activityFeed);

  useEffect(() => {
    setVisibleMessages(activityFeed.slice(0, 5));
  }, [activityFeed]);

  return (
    <div className="fixed bottom-20 left-6 z-40 pointer-events-none flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {visibleMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto"
          >
            <Info size={12} className="text-[#7c5cfc]" />
            <span className="text-[11px] font-medium text-white/90">
              {msg.message}
            </span>
            <span className="text-[9px] text-white/40 ml-2">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
