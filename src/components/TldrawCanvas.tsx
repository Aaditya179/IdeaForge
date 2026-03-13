"use client";

import { useIdeaStore } from "@/lib/store";
import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import CollaboratorCursors from "./CollaboratorCursors";

export default function TldrawCanvas({ roomId: propRoomId }: { roomId?: string }) {
  const setTldrawEditor = useIdeaStore((state) => state.setTldrawEditor);
  const tldrawEditor = useIdeaStore((state) => state.tldrawEditor);
  const theme = useIdeaStore((state) => state.theme);
  const updateMyCursor = useIdeaStore((state) => state.updateMyCursor);
  const storeRoomId = useIdeaStore((state) => state.roomId);
  const roomId = propRoomId || storeRoomId;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track local cursor movement
  useEffect(() => {
    if (!tldrawEditor) return;

    const handlePointerMove = () => {
      const { x, y } = tldrawEditor.inputs.currentPagePoint;
      updateMyCursor(x, y, null);
    };

    // Throttled updates to presence
    const interval = setInterval(handlePointerMove, 100);

    return () => clearInterval(interval);
  }, [tldrawEditor, updateMyCursor]);

  useEffect(() => {
    if (tldrawEditor) {
      try {
        tldrawEditor.user.updateUserPreferences({
          colorScheme: theme === "dark" ? "dark" : "light"
        } as any);
      } catch (e) {
        console.warn("Failed to set colorScheme, trying isDarkMode", e);
        try {
          (tldrawEditor.user as any).updateUserPreferences({ isDarkMode: theme === "dark" });
        } catch (e2) {
          console.error("Failed to set theme", e2);
        }
      }
    }
  }, [theme, tldrawEditor]);

  // Handle drawing broadcast logic (keeping this as it's general canvas collaboration)
  useEffect(() => {
    if (!tldrawEditor) return;

    useIdeaStore.setState({
      onDrawingUpdate: (payload: any) => {
        tldrawEditor.store.mergeRemoteChanges(() => {
          const { changes } = payload;
          Object.entries(changes.added || {}).forEach(([id, record]) => {
            tldrawEditor.store.put([record as any]);
          });
          Object.entries(changes.updated || {}).forEach(([id, item]) => {
            const [from, to] = item as [any, any];
            tldrawEditor.store.put([to as any]);
          });
          Object.keys(changes.removed || {}).forEach((id) => {
            tldrawEditor.store.remove([id as any]);
          });
        });
      }
    });

    const pendingChanges = { added: {} as any, updated: {} as any, removed: {} as any };
    let hasPending = false;
    let throttleTimeout: NodeJS.Timeout | null = null;

    const cleanup = tldrawEditor.store.listen((change: any) => {
      if (change.source !== 'user') return;

      const { broadcastDrawing } = useIdeaStore.getState();

      // Handle Added
      Object.entries((change.changes.added || {}) as Record<string, any>).forEach(([id, record]: [string, any]) => {
        if (record.x !== undefined && !Number.isFinite(record.x)) record.x = 0;
        if (record.y !== undefined && !Number.isFinite(record.y)) record.y = 0;
        pendingChanges.added[id] = record;
        hasPending = true;
      });

      // Handle Updated
      Object.entries((change.changes.updated || {}) as Record<string, any>).forEach(([id, item]: [string, any]) => {
        const [prev, next] = item;
        if (next.typeName === 'shape') {
          const nextShape = next as any;
          const prevShape = prev as any;
          if (!Number.isFinite(nextShape.x)) nextShape.x = prevShape.x || 0;
          if (!Number.isFinite(nextShape.y)) nextShape.y = prevShape.y || 0;
        }
        pendingChanges.updated[id] = item;
        hasPending = true;
      });

      // Handle Removed
      Object.keys(change.changes.removed).forEach((id) => {
        pendingChanges.removed[id] = change.changes.removed[id];
        hasPending = true;
      });

      if (hasPending && !throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          broadcastDrawing({ changes: { ...pendingChanges } });
          // Clear pending
          pendingChanges.added = {};
          pendingChanges.updated = {};
          pendingChanges.removed = {};
          hasPending = false;
          throttleTimeout = null;
        }, 100); // 10hz update rate for drawings
      }
    }, { scope: 'document', signals: false });

    return () => {
      cleanup();
      useIdeaStore.setState({ onDrawingUpdate: null });
    };
  }, [tldrawEditor]);

  const handleMount = useCallback((editor: Editor) => {
    setTldrawEditor(editor);
    editor.updateInstanceState({ isGridMode: true });

    try {
      editor.user.updateUserPreferences({
        colorScheme: theme === "dark" ? "dark" : "light"
      } as any);
    } catch (e) {
      try {
        (editor.user as any).updateUserPreferences({ isDarkMode: theme === "dark" });
      } catch (e2) { }
    }

    const camera = editor.getCamera();
    if (camera.x === 0 && camera.y === 0 && camera.z === 1) {
      editor.setCamera({ x: 0, y: 0, z: 1 });
    }
  }, [setTldrawEditor, theme]);

  const components = useMemo(() => ({}), []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--bg-primary)]">
      <div className="absolute inset-0">
        <Tldraw
          onMount={handleMount}
          hideUi={true}
          components={components}
        />
        <CollaboratorCursors />
      </div>
    </div>
  );
}
