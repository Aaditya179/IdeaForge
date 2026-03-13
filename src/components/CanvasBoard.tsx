"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { Plus, MousePointer } from "lucide-react";
import { useParams } from "next/navigation";
import { useIdeaStore } from "@/lib/store";
import IdeaCard from "./IdeaCard";
import AiMapNode from "./AiMapNode";
import ActivityFeed from "./ActivityFeed";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: Record<string, any> = {
  ideaCard: IdeaCard,
  aiMapNode: AiMapNode,
};

export default function CanvasBoard() {
  const { ideas, addIdea, mapNodes, mapEdges } = useIdeaStore();
  const params = useParams();
  const roomId = params.roomId as string;

  const initialNodes: Node[] = useMemo(
    () =>
      ideas.map((idea) => ({
        id: idea.id,
        type: "ideaCard",
        position: idea.position,
        data: { idea },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ideas]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Sync new ideas to canvas nodes
  const prevIdeasLength = useRef(ideas.length);
  useMemo(() => {
    if (ideas.length > prevIdeasLength.current) {
      const newIdea = ideas[0]; // newest is first (ordered by created_at desc)
      const newNode: Node = {
        id: newIdea.id,
        type: "ideaCard",
        position: newIdea.position,
        data: { idea: newIdea },
      };
      setNodes((prev) => [...prev, newNode]);
      prevIdeasLength.current = ideas.length;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideas.length]);

  // Sync AI map nodes into the canvas
  const prevMapNodesLength = useRef(0);
  useEffect(() => {
    if (mapNodes.length > prevMapNodesLength.current) {
      const newMapNodes = mapNodes.slice(prevMapNodesLength.current);
      const reactFlowNodes: Node[] = newMapNodes.map((mn) => ({
        id: mn.id,
        type: "aiMapNode",
        position: mn.position,
        data: {
          category: mn.category,
          label: mn.label,
          items: mn.items,
        },
      }));
      setNodes((prev) => [...prev, ...reactFlowNodes]);
    }
    prevMapNodesLength.current = mapNodes.length;
  }, [mapNodes, setNodes]);

  // Sync AI map edges into the canvas
  const prevMapEdgesLength = useRef(0);
  useEffect(() => {
    if (mapEdges.length > prevMapEdgesLength.current) {
      const newMapEdges = mapEdges.slice(prevMapEdgesLength.current);

      const EDGE_COLORS: Record<string, string> = {
        targetUsers: "rgba(56,189,248,0.5)",
        keyFeatures: "rgba(167,139,250,0.5)",
        revenueModel: "rgba(52,211,153,0.5)",
        competitors: "rgba(251,146,60,0.5)",
      };

      const reactFlowEdges: Edge[] = newMapEdges.map((me) => {
        const cat = me.target.split("-").pop() || "";
        return {
          id: me.id,
          source: me.source,
          target: me.target,
          animated: true,
          style: {
            stroke: EDGE_COLORS[cat] || "rgba(124,92,252,0.5)",
            strokeWidth: 2,
          },
        };
      });
      setEdges((prev) => [...prev, ...reactFlowEdges]);
    }
    prevMapEdgesLength.current = mapEdges.length;
  }, [mapEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: false,
            style: { stroke: "rgba(124,92,252,0.5)", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          animated: false,
          style: { stroke: "rgba(124,92,252,0.4)", strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={28}
          size={1}
          color="var(--grid-color)"
          style={{ opacity: 0.4 }}
        />
        <Controls position="bottom-right" showInteractive={false} />
        <MiniMap
          position="bottom-left"
          nodeColor={(node) => {
            if (node.type === "aiMapNode") return "rgba(56,189,248,0.5)";
            return "rgba(124,92,252,0.5)";
          }}
          maskColor="rgba(0,0,0,0.6)"
          style={{ width: 140, height: 90 }}
        />
      </ReactFlow>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => addIdea(roomId)}
        className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-2xl z-10"
        style={{
          background: "linear-gradient(135deg, #7c5cfc, #9b7cfd)",
          boxShadow: "0 8px 32px rgba(124,92,252,0.5)",
        }}
        title="Add new idea"
      >
        <Plus size={22} />
      </motion.button>

      {/* Canvas Hint */}
      {ideas.length === 0 && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 pointer-events-none select-none"
        >
          <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
            No ideas yet — click + to get started
          </p>
        </div>
      )}

      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium pointer-events-none select-none"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          backdropFilter: "blur(8px)",
          opacity: 0.8,
        }}
      >
        <MousePointer size={11} />
        Drag cards · Connect nodes · Scroll to zoom
      </div>

      <ActivityFeed />
    </div>
  );
}
