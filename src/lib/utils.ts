import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export const TAG_COLORS: Record<string, string> = {
  "AI": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "UX": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Product": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Design": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "Research": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Marketing": "bg-red-500/20 text-red-300 border-red-500/30",
  "Engineering": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Strategy": "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
}
