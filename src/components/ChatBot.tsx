"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Bot, Loader2, Sparkles } from "lucide-react";
import { useIdeaStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ── Custom Icons from User Snippet ── */
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const AttachIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

const ImageIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
);

const NoteIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const IdeaIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const SparkIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 6l1.5 4.5H18l-3.8 2.8 1.5 4.5L12 15l-3.7 2.8 1.5-4.5L6 10.5h4.5L12 6z" fill="currentColor" />
  </svg>
);

const SUGGESTIONS = [
  { label: '⚡ Brainstorm Ideas', prompt: 'Brainstorm 5 startup ideas in the fintech space' },
  { label: '🗺 Generate Roadmap', prompt: 'Generate a startup roadmap for my idea' },
  { label: '📋 Business Plan', prompt: 'Create a business plan outline' },
  { label: '🎯 Pitch Structure', prompt: 'Generate a startup pitch deck structure' },
];

export default function ChatBot() {
  const { isChatOpen, toggleChat, tldrawEditor } = useIdeaStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot", content: string }[]>([
    { role: "bot", content: "Hello! I'm IdeaForge AI. What brainstorm shall we drop on the canvas today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const newUserMessage = { role: "user" as const, content: textToSend.trim() };
    setInput("");
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMessage]
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response");

      const data = await response.json();
      const botText = data.text;

      // Parse ideas if present (hidden format [IDEAS_START] ... [IDEAS_END])
      const ideasMatch = botText.match(/\[IDEAS_START\]\n?([\s\S]*?)\n?\[IDEAS_END\]/);
      const cleanText = botText.replace(/\[IDEAS_START\][\s\S]*?\[IDEAS_END\]/g, "").trim();

      setMessages(prev => [...prev, { role: "bot", content: cleanText || "I've generated some ideas for the board!" }]);

      if (ideasMatch && ideasMatch[1]) {
        try {
          const generatedIdeas = JSON.parse(ideasMatch[1].trim());
          if (Array.isArray(generatedIdeas)) {
            const { roomId, currentRoom, addIdea } = useIdeaStore.getState();
            const targetRoomId = roomId || currentRoom?.id;

            for (const idea of generatedIdeas) {
              await addIdea(targetRoomId as string, {
                title: idea.title,
                description: idea.description,
                tags: ["AI Generated"]
              });
            }
          }
        } catch (err) {
          console.error("Failed to parse AI generated ideas:", err);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-6 top-24 bottom-6 w-[360px] z-40 flex flex-col rounded-3xl bg-[var(--bg-card)]/90 backdrop-blur-xl shadow-2xl border border-[var(--border)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-secondary)]/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-glow)] text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm">
                <SparkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight">IdeaForge Intelligence</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Ready to spark</span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-[var(--bg-hover)] rounded-xl text-[var(--text-muted)] transition-all hover:scale-105"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3.5", msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "h-9 w-9 rounded-[12px] flex items-center justify-center flex-shrink-0 border shadow-sm",
                  msg.role === "user" ? "bg-[var(--bg-tertiary)] border-[var(--border)]" : "bg-[var(--accent-glow)] border-[var(--accent)]/10 text-[var(--accent)]"
                )}>
                  {msg.role === "user" ? <User size={18} className="text-[var(--text-secondary)]" /> : <SparkIcon className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-4 rounded-[16px] text-[14px] leading-[1.6] max-w-[85%] shadow-sm transition-all",
                  msg.role === "user"
                    ? "bg-[var(--accent)] text-white rounded-tr-none shadow-[0_4px_12px_var(--accent-glow)]"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border)]"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3.5 animation-pulse">
                <div className="h-9 w-9 rounded-[12px] bg-[var(--accent-glow)] border border-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <SparkIcon className="w-5 h-5" />
                </div>
                <div className="bg-[var(--bg-tertiary)] border border-[var(--border)] p-4 rounded-[16px] rounded-tl-none">
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel Refactored to match provided CSS */}
          <div className="p-6 pt-2 border-t border-[var(--border)] bg-[var(--bg-secondary)]/80 backdrop-blur-sm">
            {/* Suggestion Chips */}
            <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.prompt)}
                  className="whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--accent-glow)] hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all flex-shrink-0 shadow-sm"
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className={cn(
              "rounded-[18px] border-[1.5px] transition-all duration-300 bg-[var(--bg-tertiary)]/50 overflow-hidden",
              inputFocused ? "border-[var(--accent)] bg-[var(--bg-secondary)] ring-[4px] ring-[var(--accent-glow)] shadow-lg" : "border-[var(--border)]"
            )}>
              <textarea
                className="w-full bg-transparent p-4 text-[14.5px] outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none leading-[1.6] min-h-[85px]"
                placeholder="Describe your innovation goal..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <div className="flex items-center justify-end px-4 pb-4">
                <div className="flex items-center gap-4">
                  {input.length > 0 && (
                    <span className="text-[11px] text-[var(--text-muted)] font-bold hidden sm:block uppercase tracking-widest">
                      ⌘ + Enter
                    </span>
                  )}
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className={cn(
                      "w-[38px] h-[38px] flex items-center justify-center rounded-[12px] transition-all transform active:scale-95",
                      input.trim()
                        ? "bg-[var(--accent)] text-white shadow-[0_4px_16px_var(--accent-glow)] hover:scale-[1.08] hover:shadow-[0_6px_20px_var(--accent-glow)]"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed opacity-50"
                    )}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
