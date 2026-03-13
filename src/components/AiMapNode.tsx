"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";
import { Users, Layers, DollarSign, Swords } from "lucide-react";

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; gradient: string }
> = {
  targetUsers: {
    icon: Users,
    color: "#38bdf8",
    gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
  },
  keyFeatures: {
    icon: Layers,
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
  },
  revenueModel: {
    icon: DollarSign,
    color: "#34d399",
    gradient: "linear-gradient(135deg, #059669, #34d399)",
  },
  competitors: {
    icon: Swords,
    color: "#fb923c",
    gradient: "linear-gradient(135deg, #ea580c, #fb923c)",
  },
};

type MapNodeData = {
  category: string;
  label: string;
  items: string[];
};

export default memo(function AiMapNode({ data }: NodeProps) {
  const { category, label, items } = data as MapNodeData;
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.keyFeatures;
  const Icon = config.icon;

  return (
    <div style={{ width: 220 }}>
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: Math.random() * 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: `1.5px solid ${config.color}40`,
          boxShadow: `0 0 0 1px ${config.color}10, 0 8px 24px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Category header */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: `${config.color}12` }}
        >
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg"
            style={{ background: config.gradient }}
          >
            <Icon size={12} className="text-white" />
          </div>
          <p
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: config.color }}
          >
            {label}
          </p>
        </div>

        {/* Items list */}
        <div className="px-3 py-2.5 space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: config.color }}
              />
              <p
                className="text-[11px] leading-snug"
                style={{ color: "var(--text-secondary)" }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});
