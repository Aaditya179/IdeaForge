import React from "react";
import { useIdeaStore, type Idea } from "@/lib/store";
import { ThumbsUp, MessageSquare, Sparkles, Loader2, CheckCircle, Trash2, Network } from "lucide-react";

export interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const {
    ideas,
    voteIdea,
    expandIdea,
    aiExpansions,
    aiExpandingId,
    setSelectedIdeaId,
    setSidebarOpen,
    selectedIdeaId,
    deleteIdea,
    mapIdea,
    aiMappingId
  } = useIdeaStore();

  const isExpanding = aiExpandingId === idea.id;
  const isMapping = aiMappingId === idea.id;
  const expansion = aiExpansions[idea.id];

  const highestVotes = Math.max(...ideas.map(i => i.votes), 0);
  const isTopVoted = idea.votes > 0 && idea.votes >= highestVotes;
  const isSelected = selectedIdeaId === idea.id;

  const handleVote = (e: React.PointerEvent) => {
    e.stopPropagation();
    voteIdea(idea.id);
  };

  const handleExpand = (e: React.PointerEvent) => {
    e.stopPropagation();
    expandIdea(idea.id);
  };

  const handleComments = (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedIdeaId(idea.id);
    setSidebarOpen(true);
  };

  const handleDelete = (e: React.PointerEvent) => {
    e.stopPropagation();
    deleteIdea(idea.id);
  }

  return (
    <div
      className={`relative flex flex-col w-[320px] bg-[var(--bg-card)] border ${isTopVoted ? "border-[#7c5cfc] shadow-[0_0_15px_rgba(124,92,252,0.4)]" : isSelected ? "border-[#7c5cfc]" : "border-[var(--border)]"} rounded-2xl p-5 shadow-lg overflow-hidden transition-all duration-300 pointer-events-auto`}
      style={{
        color: "var(--text-primary)"
      }}
      onPointerDown={(e) => {
        // Allow clicks on buttons to register
        if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button') {
          // We might want to set selected here
          setSelectedIdeaId(idea.id);
        }
      }}
    >
      {/* Accent Header */}
      {isTopVoted ? (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-[0_2px_8px_rgba(255,190,0,0.4)]" />
      ) : (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7c5cfc] to-[#a78bfa]" />
      )}

      {/* Header with Title and Delete */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="font-bold text-lg leading-tight break-words flex-1">
          {idea.title}
        </h3>
        <button
          onPointerDown={handleDelete}
          className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-colors flex-shrink-0"
          title="Delete Idea"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mb-4 select-text" onPointerDown={(e) => e.stopPropagation()}>
        <p className="text-[var(--text-secondary)] text-sm whitespace-pre-wrap leading-relaxed">
          {idea.description}
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[var(--border)]">
        <button
          onPointerDown={handleComments}
          className="flex items-center gap-1.5 text-xs text-[var(--accent-light)] hover:bg-[#7c5cfc]/10 px-2.5 py-1.5 rounded-md transition-colors font-medium border border-[#7c5cfc]/20"
        >
          <MessageSquare size={14} />
          💬 Comments
        </button>

        <button
          onPointerDown={handleVote}
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#7c5cfc] bg-[#7c5cfc]/10 hover:bg-[#7c5cfc]/20 px-3 py-1.5 rounded-md transition-colors"
        >
          <ThumbsUp size={14} />
          {idea.votes}
        </button>
      </div>

      {/* AI Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
        <button
          onPointerDown={handleExpand}
          disabled={isExpanding}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs text-[#a78bfa] hover:bg-[#a78bfa]/10 px-2.5 py-1.5 rounded-md transition-colors font-medium border border-[#a78bfa]/30 disabled:opacity-50"
        >
          {isExpanding ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          ✨ Expand
        </button>
      </div>

      {/* AI Expansion Result */}
      {expansion && (
        <div
          className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar select-text"
          onPointerDown={(e) => e.stopPropagation()} // Stop propagation to allow text selection inside
        >
          <div><strong className="text-[#a78bfa] block mb-0.5">Problem:</strong> <span className="text-[var(--text-primary)]">{expansion.problemStatement}</span></div>
          <div><strong className="text-[#a78bfa] block mt-2 mb-0.5">Solution:</strong> <span className="text-[var(--text-primary)]">Expanded solution logic here (wait for API details)</span></div>
          {expansion.businessModel && <div><strong className="text-[#a78bfa] block mt-2 mb-0.5">Business Model:</strong> <span className="text-[var(--text-primary)]">{expansion.businessModel}</span></div>}
          {expansion.targetUsers && expansion.targetUsers.length > 0 && <div><strong className="text-[#a78bfa] block mt-2 mb-0.5">Target Users:</strong> <span className="text-[var(--text-primary)]">{expansion.targetUsers.join(", ")}</span></div>}
          {expansion.possibleFeatures && expansion.possibleFeatures.length > 0 && <div><strong className="text-[#a78bfa] block mt-2 mb-0.5">Features:</strong> <span className="text-[var(--text-primary)]">{expansion.possibleFeatures.join(", ")}</span></div>}
        </div>
      )}
    </div>
  );
}
