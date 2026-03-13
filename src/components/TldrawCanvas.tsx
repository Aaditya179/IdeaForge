import { useIdeaStore } from "@/lib/store";
import { Tldraw, Editor, createShapeId, type TLShape } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import CollaboratorCursors from "./CollaboratorCursors";
import { IdeaShapeUtil } from "./tldraw/IdeaShapeUtil";
import { MapNodeShapeUtil } from "./tldraw/MapNodeShapeUtil";
import { MapEdgeShapeUtil } from "./tldraw/MapEdgeShapeUtil";

const shapeUtils = [IdeaShapeUtil, MapNodeShapeUtil, MapEdgeShapeUtil];

export default function TldrawCanvas({ roomId: propRoomId }: { roomId?: string }) {
  const ideas = useIdeaStore((state) => state.ideas);
  const mapNodes = useIdeaStore((state) => state.mapNodes);
  const mapEdges = useIdeaStore((state) => state.mapEdges);
  const setTldrawEditor = useIdeaStore((state) => state.setTldrawEditor);
  const tldrawEditor = useIdeaStore((state) => state.tldrawEditor);
  const theme = useIdeaStore((state) => state.theme);
  const updateMyCursor = useIdeaStore((state) => state.updateMyCursor);
  const updateIdea = useIdeaStore((state) => state.updateIdea);
  const storeRoomId = useIdeaStore((state) => state.roomId);
  const roomId = propRoomId || storeRoomId;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync ideas from store to tldraw canvas
  useEffect(() => {
    if (!tldrawEditor || !ideas.length) return;

    const shapesToCreate: any[] = [];
    const shapesToUpdate: any[] = [];

    const selectedIds = tldrawEditor.getSelectedShapeIds();

    ideas.forEach((idea) => {
      const shapeId = createShapeId(`idea-${idea.id}`);

      // SKIP update if the shape is currently being manipulated (selected)
      if (selectedIds.includes(shapeId)) return;

      const existingShape = tldrawEditor.getShape(shapeId);

      if (existingShape) {
        // Only update if position changed significantly or other relevant props
        if (Math.abs(existingShape.x - idea.position.x) > 0.1 || Math.abs(existingShape.y - idea.position.y) > 0.1) {
          shapesToUpdate.push({
            id: shapeId,
            type: 'idea_card',
            x: idea.position.x,
            y: idea.position.y,
            props: {
              ideaId: idea.id,
              w: (existingShape.props as any).w || 320,
              h: (existingShape.props as any).h || 320,
            }
          });
        }
      } else {
        // New shape
        shapesToCreate.push({
          id: shapeId,
          type: 'idea_card',
          x: idea.position.x,
          y: idea.position.y,
          props: {
            ideaId: idea.id,
            w: 320,
            h: 320,
          }
        });
      }
    });

    if (shapesToCreate.length > 0) {
      tldrawEditor.createShapes(shapesToCreate);
    }
    if (shapesToUpdate.length > 0) {
      tldrawEditor.updateShapes(shapesToUpdate);
    }

    // Remove shapes that are no longer in the ideas list
    const ideaShapeIds = ideas.map(i => createShapeId(`idea-${i.id}`));
    const allIdeaShapes = tldrawEditor.getCurrentPageShapes().filter((s: any) => s.type === 'idea_card');
    const shapesToRemove = allIdeaShapes.filter((s: any) => !ideaShapeIds.includes(s.id as any));

    if (shapesToRemove.length) {
      tldrawEditor.deleteShapes(shapesToRemove.map((s: any) => s.id));
    }

  }, [ideas, tldrawEditor]);

  // Sync AI Mapping (Nodes & Edges) to tldraw canvas
  useEffect(() => {
    if (!tldrawEditor) return;

    // --- SYNC MAP NODES ---
    const nodeShapesToCreate: any[] = [];
    const nodeShapesToUpdate: any[] = [];
    const selectedIds = tldrawEditor.getSelectedShapeIds();

    mapNodes.forEach((node) => {
      const shapeId = createShapeId(`map-node-${node.id}`);
      if (selectedIds.includes(shapeId)) return;

      const existingShape = tldrawEditor.getShape(shapeId);
      if (existingShape) {
        if (Math.abs(existingShape.x - node.position.x) > 0.1 || Math.abs(existingShape.y - node.position.y) > 0.1) {
          nodeShapesToUpdate.push({
            id: shapeId,
            type: 'map_node',
            x: node.position.x,
            y: node.position.y,
            props: {
              mapNodeId: node.id,
              w: (existingShape.props as any).w || 240,
              h: (existingShape.props as any).h || 200,
            }
          });
        }
      } else {
        nodeShapesToCreate.push({
          id: shapeId,
          type: 'map_node',
          x: node.position.x,
          y: node.position.y,
          props: {
            mapNodeId: node.id,
            w: 240,
            h: 200,
          }
        });
      }
    });

    if (nodeShapesToCreate.length > 0) tldrawEditor.createShapes(nodeShapesToCreate);
    if (nodeShapesToUpdate.length > 0) tldrawEditor.updateShapes(nodeShapesToUpdate);

    // Remove old nodes
    const mapNodeShapeIds = mapNodes.map(n => createShapeId(`map-node-${n.id}`));
    const allMapNodes = tldrawEditor.getCurrentPageShapes().filter((s: any) => s.type === 'map_node');
    const nodesToRemove = allMapNodes.filter((s: any) => !mapNodeShapeIds.includes(s.id as any));
    if (nodesToRemove.length) tldrawEditor.deleteShapes(nodesToRemove.map((s: any) => s.id));

    // --- SYNC MAP EDGES ---
    const edgeShapesToCreate: any[] = [];
    mapEdges.forEach((edge) => {
      const shapeId = createShapeId(`map-edge-${edge.id}`);
      if (tldrawEditor.getShape(shapeId)) return;

      edgeShapesToCreate.push({
        id: shapeId,
        type: 'map_edge',
        x: 0,
        y: 0,
        props: {
          sourceId: createShapeId(`idea-${edge.source}`),
          targetId: createShapeId(`map-node-${edge.target}`),
          color: "#7c5cfc",
        }
      });
    });

    if (edgeShapesToCreate.length > 0) tldrawEditor.createShapes(edgeShapesToCreate);

    // Remove old edges
    const mapEdgeShapeIds = mapEdges.map(e => createShapeId(`map-edge-${e.id}`));
    const allMapEdges = tldrawEditor.getCurrentPageShapes().filter((s: any) => s.type === 'map_edge');
    const edgesToRemove = allMapEdges.filter((s: any) => !mapEdgeShapeIds.includes(s.id as any));
    if (edgesToRemove.length) tldrawEditor.deleteShapes(edgesToRemove.map((s: any) => s.id));

  }, [mapNodes, mapEdges, tldrawEditor]);

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

  // Handle drawing and shape broadcast logic
  useEffect(() => {
    if (!tldrawEditor) return;

    const channelHandler = (payload: any) => {
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
    };

    useIdeaStore.setState({ onDrawingUpdate: channelHandler });

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

          // If it's an idea_card, update our store/DB
          if (nextShape.type === 'idea_card') {
            const ideaId = nextShape.props.ideaId;
            if (ideaId && (Math.abs(nextShape.x - prevShape.x) > 0.1 || Math.abs(nextShape.y - prevShape.y) > 0.1)) {
              updateIdea(ideaId, {
                position: { x: nextShape.x, y: nextShape.y }
              });
            }
          }
        }
        pendingChanges.updated[id] = item;
        hasPending = true;
      });

      // Handle Removed
      Object.keys(change.changes.removed).forEach((id) => {
        pendingChanges.removed[id] = (change.changes.removed as any)[id];
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
        }, 100);
      }
    }, { scope: 'document', signals: false });

    return () => {
      cleanup();
      useIdeaStore.setState({ onDrawingUpdate: null });
    };
  }, [tldrawEditor, updateIdea]);

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
          shapeUtils={shapeUtils}
        />
        <CollaboratorCursors />
      </div>
    </div>
  );
}
