"use client";

import { motion } from "framer-motion";
import {
  Sparkles, MousePointer2, LayoutPanelLeft,
  StickyNote, Type, Shapes, PenTool,
  Crop, Smile, Plus, Undo2, Redo2, Hand, Palette
} from "lucide-react";
import { useIdeaStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DefaultColorStyle, GeoShapeGeoStyle } from "tldraw";

export default function Toolbar() {
  const { isSidebarOpen, toggleSidebar, isChatOpen, toggleChat, tldrawEditor, theme } = useIdeaStore();
  const [showColors, setShowColors] = useState(false);
  const [showShapes, setShowShapes] = useState(false);

  const colors = [
    { name: 'Black', value: 'black' },
    { name: 'Grey', value: 'grey' },
    { name: 'Red', value: 'red' },
    { name: 'Orange', value: 'orange' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Green', value: 'green' },
    { name: 'Light Blue', value: 'light-blue' },
    { name: 'Blue', value: 'blue' },
    { name: 'Violet', value: 'violet' },
    { name: 'Light Violet', value: 'light-violet' },
  ];

  const shapes = [
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'ellipse', label: 'Ellipse' },
    { id: 'triangle', label: 'Triangle' },
    { id: 'diamond', label: 'Diamond' },
    { id: 'cloud', label: 'Cloud' },
  ];

  const tools = [
    { id: "chat", icon: Sparkles, label: "AI Chat", onClick: toggleChat, active: isChatOpen, primary: true },
    { id: "select", icon: MousePointer2, label: "Select", onClick: () => tldrawEditor?.setCurrentTool('select'), active: tldrawEditor?.getCurrentToolId() === 'select' },
    { id: "hand", icon: Hand, label: "Hand", onClick: () => tldrawEditor?.setCurrentTool('hand'), active: tldrawEditor?.getCurrentToolId() === 'hand' },
    { id: "draw", icon: PenTool, label: "Draw", onClick: () => tldrawEditor?.setCurrentTool('draw'), active: tldrawEditor?.getCurrentToolId() === 'draw' },
    { id: "note", icon: StickyNote, label: "Sticky Note", onClick: () => tldrawEditor?.setCurrentTool('note'), active: tldrawEditor?.getCurrentToolId() === 'note' },
    { id: "text", icon: Type, label: "Text", onClick: () => tldrawEditor?.setCurrentTool('text'), active: tldrawEditor?.getCurrentToolId() === 'text' },
    {
      id: "shapes",
      icon: Shapes,
      label: "Shapes",
      onClick: () => {
        setShowShapes(!showShapes);
        setShowColors(false);
      },
      active: tldrawEditor?.getCurrentToolId() === 'geo' || showShapes
    },
    {
      id: "colors",
      icon: Palette,
      label: "Colors",
      onClick: () => {
        setShowColors(!showColors);
        setShowShapes(false);
      },
      active: showColors
    },
    {
      id: "attach", icon: Plus, label: "Attach", onClick: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
          const file = e.target.files?.[0];
          if (file && tldrawEditor) {
            try {
              // Use tldraw's external content API to drop the file onto the canvas
              await tldrawEditor.putExternalContent({
                type: 'files',
                files: [file],
                point: tldrawEditor.getViewportPageBounds().center,
                ignoreParent: false,
              });
            } catch (err) {
              console.error("Failed to attach file:", err);
            }
          }
        };
        input.click();
      }
    },
    { id: "ideas", icon: LayoutPanelLeft, label: "Sidebar", onClick: toggleSidebar, active: isSidebarOpen },
  ];

  return (
    <div className={cn(
      "fixed top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4",
      isSidebarOpen ? "left-[344px]" : "left-6"
    )}>
      <motion.div
        className="flex flex-col gap-1 p-2 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-md shadow-2xl border border-[var(--border)]"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        {tools.map((tool) => (
          <div key={tool.id} className="relative group">
            <button
              onClick={tool.onClick}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                tool.primary
                  ? "bg-gradient-to-br from-[#7c5cfc] to-[#c084fc] text-white shadow-lg mb-2 hover:scale-105"
                  : tool.active
                    ? "bg-[#7c5cfc]/10 text-[#7c5cfc]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              )}
            >
              <tool.icon size={tool.primary ? 20 : 18} />

              {/* Tooltip */}
              <div className="absolute left-14 scale-0 group-hover:scale-100 transition-transform origin-left bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-[60]">
                {tool.label}
              </div>
            </button>

            {/* Colors Menu (Side) */}
            {tool.id === 'colors' && showColors && (
              <div className="absolute left-14 top-0 flex flex-wrap gap-1.5 p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl w-32 z-[70]">
                {colors.map(c => (
                  <button
                    key={c.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tldrawEditor) {
                        tldrawEditor.setStyleForNextShapes(DefaultColorStyle, c.value as any);
                        // Also update selected shapes if any
                        tldrawEditor.updateShapes(
                          tldrawEditor.getSelectedShapes().map((s: any) => ({
                            id: s.id,
                            type: s.type,
                            props: { ...s.props, color: c.value as any }
                          }))
                        );
                      }
                      setShowColors(false);
                    }}
                    className="w-5 h-5 rounded-full border border-black/10 transition-transform hover:scale-125"
                    style={{ backgroundColor: c.value.replace(/-/g, '') }}
                    title={c.name}
                  />
                ))}
              </div>
            )}

            {/* Shapes Menu (Side) */}
            {tool.id === 'shapes' && showShapes && (
              <div className="absolute left-14 top-0 flex flex-col gap-1 p-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl w-32 z-[70]">
                {shapes.map(s => (
                  <button
                    key={s.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tldrawEditor) {
                        tldrawEditor.setCurrentTool('geo');
                        tldrawEditor.setStyleForNextShapes(GeoShapeGeoStyle, s.id as any);
                      }
                      setShowShapes(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                  >
                    <Shapes size={14} />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-col gap-1 p-2 rounded-2xl bg-[var(--bg-card)] shadow-2xl border border-[var(--border)]"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => tldrawEditor?.undo()}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={() => tldrawEditor?.redo()}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Redo2 size={18} />
        </button>
      </motion.div>
    </div>
  );
}
