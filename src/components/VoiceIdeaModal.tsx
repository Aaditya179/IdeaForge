"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Sparkles, Loader2 } from "lucide-react";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { useIdeaStore } from "@/lib/store";

interface VoiceIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceIdeaModal({ isOpen, onClose }: VoiceIdeaModalProps) {
  const { addIdea } = useIdeaStore();
  const { status, transcript, interimTranscript, start, stop, reset, isSupported } =
    useSpeechRecognition();
  const [saving, setSaving] = useState(false);

  const isListening = status === "listening";
  const fullText = (transcript + interimTranscript).trim();

  const handleToggle = () => {
    if (isListening) {
      stop();
    } else {
      reset();
      start();
    }
  };

  const handleSave = async () => {
    if (!fullText) return;
    setSaving(true);

    // Use the first sentence as title, rest as description
    const sentences = fullText.split(/(?<=[.!?])\s+/);
    const title = sentences[0]?.replace(/[.!?]+$/, "").trim() || "Voice Idea";
    const description = sentences.length > 1 ? sentences.slice(1).join(" ").trim() : fullText;

    await addIdea({
      title: title.slice(0, 80),
      description,
      tags: ["Product"],
    });

    setSaving(false);
    reset();
    onClose();
  };

  const handleClose = () => {
    if (isListening) stop();
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-[420px] rounded-2xl overflow-hidden"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{
                  background: isListening
                    ? "linear-gradient(135deg, #ef4444, #f97316)"
                    : "linear-gradient(135deg, #7c5cfc, #c084fc)",
                }}
              >
                <Mic size={14} className="text-white" />
              </div>
              <div>
                <h3
                  className="text-sm font-bold"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Voice to Idea
                </h3>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {!isSupported
                    ? "Not supported in this browser"
                    : isListening
                      ? "Listening... speak your idea"
                      : "Click the mic to start"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            {/* Mic Button */}
            <div className="flex justify-center mb-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                disabled={!isSupported}
                className="relative flex h-20 w-20 items-center justify-center rounded-full transition-all"
                style={{
                  background: isListening
                    ? "linear-gradient(135deg, #ef4444, #f97316)"
                    : "linear-gradient(135deg, #7c5cfc, #9b7cfd)",
                  boxShadow: isListening
                    ? "0 0 0 8px rgba(239,68,68,0.15), 0 0 40px rgba(239,68,68,0.3)"
                    : "0 0 0 8px rgba(124,92,252,0.1), 0 0 40px rgba(124,92,252,0.2)",
                }}
              >
                {isListening ? (
                  <MicOff size={28} className="text-white" />
                ) : (
                  <Mic size={28} className="text-white" />
                )}

                {/* Pulsing ring animation when listening */}
                {isListening && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: "2px solid rgba(239,68,68,0.4)" }}
                      animate={{ scale: [1, 1.5, 1.5], opacity: [0.6, 0, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: "2px solid rgba(239,68,68,0.3)" }}
                      animate={{ scale: [1, 1.8, 1.8], opacity: [0.4, 0, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                  </>
                )}
              </motion.button>
            </div>

            {/* Status indicator */}
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-1.5 mb-4"
              >
                <span className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      className="block w-1 rounded-full"
                      style={{ background: "#ef4444" }}
                      animate={{
                        height: [6, 16, 6],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </span>
                <span className="text-[11px] font-medium ml-1" style={{ color: "#ef4444" }}>
                  Recording
                </span>
              </motion.div>
            )}

            {/* Transcript area */}
            <div
              className="min-h-[100px] max-h-[160px] overflow-y-auto rounded-xl p-4 mb-4"
              style={{
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
              }}
            >
              {fullText ? (
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {transcript}
                  {interimTranscript && (
                    <span style={{ color: "var(--text-muted)" }}>{interimTranscript}</span>
                  )}
                </p>
              ) : (
                <p
                  className="text-xs text-center pt-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  {isListening
                    ? "Start speaking — your words will appear here..."
                    : "Press the microphone button and describe your idea"}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-[var(--bg-hover)]"
                style={{
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!fullText || saving}
                className="flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #7c5cfc, #9b7cfd)",
                  boxShadow: fullText ? "0 4px 20px rgba(124,92,252,0.35)" : "none",
                }}
              >
                {saving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Sparkles size={13} />
                )}
                {saving ? "Saving..." : "Create Idea"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
