import { create } from "zustand";
import { supabase, type IdeaWithVotes, type ProfileRow } from "./supabase";

/* ─── AI Expansion result ─── */
export type AiExpansion = {
  problemStatement: string;
  targetUsers: string[];
  possibleFeatures: string[];
  businessModel: string;
};

/* ─── AI Map result ─── */
export type MapResult = {
  targetUsers: string[];
  keyFeatures: string[];
  revenueModel: string[];
  competitors: string[];
};

export type MapNode = {
  id: string;
  category: string;
  label: string;
  items: string[];
  position: { x: number; y: number };
};

export type MapEdge = {
  id: string;
  source: string;
  target: string;
};

/* ─── Room Info shape ─── */
export type RoomInfo = {
  id: string;
  title: string;
  description: string;
  score: string;
  participants: number;
  ideas: number;
  created_at: string;
};

/** Map a DB row → local RoomInfo shape */
export function rowToRoom(row: any): RoomInfo {
  return {
    id: row.room_id || row.id,
    title: row.title || "Untitled Room",
    description: row.description || "",
    score: row.score || "0",
    participants: row.participants || 0,
    ideas: row.ideas || 0,
    created_at: row.created_at,
  };
}

/* ─── Collaborator shape for Presence ─── */
export type Collaborator = {
  id: string;
  name: string;
  color: string;
  avatar?: string | null;
  cursor?: { x: number; y: number };
  selectedIdeaId?: string | null;
  onlineAt: number;
};

/* ─── Local Idea shape used by UI ─── */
export type Idea = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  votes: number;
  position: { x: number; y: number };
};

/** Map a DB row → local Idea shape */
export function rowToIdea(row: any): Idea {
  const dateObj = new Date(row.created_at);
  const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tags: row.tags || [],
    position: {
      x: Number.isFinite(Number(row.position_x)) ? Number(row.position_x) : 0,
      y: Number.isFinite(Number(row.position_y)) ? Number(row.position_y) : 0
    },
    createdAt: formattedDate,
    updatedAt: row.created_at,
    createdBy: row.creator_id || "Anonymous",
    votes: row.vote_count !== undefined ? Number(row.vote_count) : (row.votes || 0),
  };
}

/** Map a DB row → local Comment shape */
export function rowToComment(row: any) {
  return {
    id: row.id,
    ideaId: row.idea_id,
    userId: row.user_id || "Anonymous",
    content: row.content,
    createdAt: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fullDate: row.created_at,
  };
}

/* ─── Store type ─── */
type IdeaStore = {
  ideas: Idea[];
  selectedIdeaId: string | null;
  activeTag: string | null;
  loading: boolean;

  /* AI expansion state */
  aiExpansions: Record<string, AiExpansion>;
  aiExpandingId: string | null;

  // --- AI Mapping ---
  mapNodes: MapNode[];
  mapEdges: MapEdge[];
  aiMappingId: string | null;
  isSidebarOpen: boolean;
  isChatOpen: boolean;
  isAddModalOpen: boolean;
  theme: "light" | "dark";

  /* Room Data */
  currentRoom: RoomInfo | null;
  comments: Record<string, any[]>; // ideaId -> comments[]

  setSidebarOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setAddModalOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;

  setSelectedIdeaId: (id: string | null) => void;
  setActiveTag: (tag: string | null) => void;

  fetchIdeas: (roomId: string) => Promise<void>;
  subscribeToRoom: (roomId: string) => () => void;
  addIdea: (roomIdOrPartial?: string | Partial<Idea>, partialInput?: Partial<Idea>) => Promise<void>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  voteIdea: (id: string) => Promise<void>;
  expandIdea: (id: string) => Promise<void>;
  mapIdea: (id: string) => Promise<void>;

  /* Comments */
  fetchComments: (ideaId: string) => Promise<void>;
  addComment: (ideaId: string, content: string) => Promise<void>;

  /* Tldraw */
  tldrawEditor: any | null;
  setTldrawEditor: (editor: any) => void;

  /* Room ID persistence */
  roomId: string | null;
  setRoomId: (id: string | null) => void;

  /* Presence */
  collaborators: Record<string, Collaborator>;
  updateMyCursor: (x: number, y: number, selectedIdeaId?: string | null) => void;
  myPresenceId: string | null;
  activityFeed: { id: string; message: string; timestamp: number }[];
  addActivityMessage: (message: string) => void;

  /* Drawing Sync */
  broadcastDrawing: (payload: any) => void;
  onDrawingUpdate: ((payload: any) => void) | null;

  /* User Auth */
  user: ProfileRow | null;
  fetchUser: () => Promise<void>;
};

/* ─── Zustand store ─── */
export const useIdeaStore = create<IdeaStore>((set, get) => ({
  ideas: [],
  selectedIdeaId: null,
  activeTag: null,
  loading: false,
  aiExpansions: {},
  aiExpandingId: null,
  mapNodes: [],
  mapEdges: [],
  aiMappingId: null,
  isSidebarOpen: false,
  isChatOpen: false,
  isAddModalOpen: false,
  theme: "dark",
  currentRoom: null,
  comments: {},
  tldrawEditor: null,
  roomId: null,
  collaborators: {},
  myPresenceId: null,
  activityFeed: [],
  addActivityMessage: (message: string) => {
    const id = Math.random().toString(36).slice(2, 11);
    set((state) => ({
      activityFeed: [{ id, message, timestamp: Date.now() }, ...state.activityFeed].slice(0, 50)
    }));
  },
  broadcastDrawing: () => { },
  onDrawingUpdate: null,
  user: null,

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setChatOpen: (open) => set({ isChatOpen: open }),
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setTldrawEditor: (editor) => set({ tldrawEditor: editor }),
  setRoomId: (id) => set({ roomId: id }),

  updateMyCursor: (x, y, selectedIdeaId) => {
    // This will be implemented inside subscribeToRoom closure or via channel reference
  },
  setTheme: (theme) => {
    localStorage.setItem("ideaforge-theme", theme);
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("ideaforge-theme", newTheme);
    return { theme: newTheme };
  }),

  setSelectedIdeaId: (id) => set({ selectedIdeaId: id }),
  setActiveTag: (tag) => set({ activeTag: tag }),

  /* Fetch all ideas */
  fetchIdeas: async (roomId: string) => {
    // Fetch User if not present
    if (!get().user) {
      await get().fetchUser();
    }

    set({ loading: true });

    // Fetch Room Metadata
    let roomData = null;

    // Try room_id first as it's the primary slug in the DB
    const { data: rd1, error: re1 } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_id", roomId)
      .maybeSingle();

    if (rd1) {
      roomData = rd1;
    } else {
      // Fallback search in title or description if needed, or just set generic
      console.warn("Room not found by room_id, using generic metadata for:", roomId);
      roomData = {
        room_id: roomId,
        title: roomId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: 'Collaborative brainstorming session'
      };
    }

    if (roomData) {
      set({ currentRoom: rowToRoom(roomData) });
    }

    const { data, error } = await supabase
      .from("ideas_with_votes")
      .select("*")
      .eq("session_id", roomId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch ideas:", error.message);
      set({ loading: false });
      return;
    }
    // Note: We use ideas_with_votes view if possible, but for real-time we might just use ideas
    set({ ideas: (data as any[]).map(rowToIdea), loading: false });
  },

  /* Real-time subscription */
  subscribeToRoom: (roomId: string) => {
    const userColors = ["#a78bfa", "#38bdf8", "#34d399", "#fb923c", "#f472b6"]; // purple, blue, green, orange, pink
    const myColor = userColors[Math.floor(Math.random() * userColors.length)];
    const user = get().user;

    // Stable ID for the session
    const myId = user?.id || `anon-${Math.random().toString(36).slice(2, 9)}`;
    set({ myPresenceId: myId });

    const channel = supabase.channel(`session:${roomId}`, {
      config: {
        presence: {
          key: roomId,
        },
      },
    });

    const activePresences = new Set<string>();
    let lastTrackTime = 0;
    const TRACK_THROTTLE = 100; // ms

    // Update the store's track function so other components can call it
    set({
      updateMyCursor: (x, y, selectedIdeaId) => {
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;

        const now = Date.now();
        if (now - lastTrackTime < TRACK_THROTTLE) return;
        lastTrackTime = now;

        channel.track({
          user_id: myId,
          name: user?.name || `Innovator ${myId.slice(-4)}`,
          color: myColor,
          avatar_url: user?.avatar,
          cursor: { x, y },
          selected_idea_id: selectedIdeaId,
          last_active: now,
        });
      },
      broadcastDrawing: (payload) => {
        channel.send({
          type: "broadcast",
          event: "drawing_update",
          payload,
        });
      }
    });

    channel
      .on("broadcast", { event: "drawing_update" }, ({ payload }) => {
        const handler = get().onDrawingUpdate;
        if (handler) handler(payload);
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: Record<string, Collaborator> = {};
        let hasChanges = false;

        Object.keys(state).forEach((key) => {
          (state[key] as any).forEach((presence: any) => {
            if (presence.cursor && (!Number.isFinite(presence.cursor.x) || !Number.isFinite(presence.cursor.y))) {
              return;
            }

            const uid = presence.user_id || presence.id;
            if (!users[uid] || users[uid].onlineAt < presence.last_active) {
              users[uid] = {
                id: uid,
                name: presence.name,
                color: presence.color,
                avatar: presence.avatar_url,
                cursor: presence.cursor,
                selectedIdeaId: presence.selected_idea_id,
                onlineAt: presence.last_active
              };
            }
          });
        });

        // Optimization: Only update store if the collaborator list or their data actually changed
        const currentCollaborators = get().collaborators;
        const currentIds = Object.keys(currentCollaborators);
        const newIds = Object.keys(users);

        if (currentIds.length !== newIds.length) {
          hasChanges = true;
        } else {
          // Check for individual data changes
          for (const id of newIds) {
            const old = currentCollaborators[id];
            const next = users[id];
            if (!old || old.cursor?.x !== next.cursor?.x || old.cursor?.y !== next.cursor?.y || old.selectedIdeaId !== next.selectedIdeaId) {
              hasChanges = true;
              break;
            }
          }
        }

        if (hasChanges) {
          // Detect Joins
          newIds.forEach(id => {
            if (!activePresences.has(id)) {
              activePresences.add(id);
              if (id !== myId) {
                get().addActivityMessage(`${users[id].name} joined the board`);
              }
            }
          });

          // Detect Leaves
          currentIds.forEach(id => {
            if (!users[id]) {
              const leftUserName = currentCollaborators[id]?.name || "Someone";
              activePresences.delete(id);
              get().addActivityMessage(`${leftUserName} left the session`);
            }
          });

          set({ collaborators: users });
        }
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ideas",
          filter: `session_id=eq.${roomId}`,
        },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          if (eventType === "INSERT") {
            const newIdea = rowToIdea(newRow);
            set((state) => ({
              ideas: state.ideas.some(i => i.id === newIdea.id)
                ? state.ideas
                : [newIdea, ...state.ideas]
            }));
          } else if (eventType === "UPDATE") {
            set((state) => ({
              ideas: state.ideas.map((i) => {
                if (i.id === newRow.id) {
                  const updates: Partial<Idea> = {};
                  if (newRow.title !== undefined) updates.title = newRow.title;
                  if (newRow.description !== undefined) updates.description = newRow.description;
                  if (newRow.tags !== undefined) updates.tags = newRow.tags;
                  if (newRow.position_x !== undefined || newRow.position_y !== undefined) {
                    updates.position = {
                      x: newRow.position_x ?? i.position.x,
                      y: newRow.position_y ?? i.position.y
                    };
                  }
                  if (newRow.votes !== undefined) updates.votes = Number(newRow.votes);
                  return { ...i, ...updates };
                }
                return i;
              }),
            }));
          } else if (eventType === "DELETE") {
            set((state) => ({
              ideas: state.ideas.filter((i) => i.id !== oldRow.id),
            }));
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        (payload) => {
          const newComment = rowToComment(payload.new);
          set((state) => {
            const ideaComments = state.comments[newComment.ideaId] || [];
            if (ideaComments.some(c => c.id === newComment.id)) return state;
            return {
              comments: {
                ...state.comments,
                [newComment.ideaId]: [...ideaComments, newComment]
              }
            };
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
        },
        (payload) => {
          const { idea_id } = payload.new;
          set((state) => ({
            ideas: state.ideas.map((i) =>
              i.id === idea_id ? { ...i, votes: i.votes + 1 } : i
            ),
          }));
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: myId,
            name: user?.name || `Innovator ${myId.slice(-4)}`,
            color: myColor,
            avatar_url: user?.avatar,
            last_active: Date.now(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  },

  /* Insert a new idea into Supabase */
  addIdea: async (roomIdOrPartial?: string | Partial<Idea>, partialInput?: Partial<Idea>) => {
    let roomId = typeof roomIdOrPartial === 'string' ? roomIdOrPartial : (get().roomId || get().currentRoom?.id);
    let partial = typeof roomIdOrPartial === 'object' ? roomIdOrPartial : (partialInput || {});

    if (!roomId) {
      console.error("Cannot add idea: No roomId provided and no currentRoom found. Current store state:", {
        passedRoomId: typeof roomIdOrPartial === 'string' ? roomIdOrPartial : null,
        storeRoomId: get().roomId,
        currentRoomId: get().currentRoom?.id
      });
      return;
    }

    const posX = partial.position?.x ?? 150 + Math.random() * 400;
    const posY = partial.position?.y ?? 150 + Math.random() * 300;
    const user = get().user;

    let finalUserId: string | null = null;

    // Ensure the user.id is a valid UUID, otherwise null it.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (user?.id && uuidRegex.test(user.id)) {
      // Ensure profile actually exists in DB before using the ID
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email || 'unknown@example.com',
        name: user.name || 'User',
      }, { onConflict: 'id' }).select('id').single();

      if (!profileError) {
        finalUserId = user.id;
      } else {
        console.warn("Could not ensure profile exists, using blank user_id:", profileError);
        finalUserId = null;
      }
    }

    const { data, error } = await supabase
      .from("ideas")
      .insert({
        title: partial.title || "New Idea",
        description: partial.description || "Add a description...",
        tags: partial.tags || ["Product"],
        position_x: posX,
        position_y: posY,
        creator_id: user?.name || "Anonymous",
        user_id: finalUserId,
        session_id: roomId,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add idea:", error.message);
      return;
    }

    const newIdea = rowToIdea({ ...data, vote_count: 0 });
    set((state) => ({
      ideas: [newIdea, ...state.ideas],
      selectedIdeaId: newIdea.id,
    }));
  },

  /* Update an idea in Supabase */
  updateIdea: async (id, updates) => {
    const payload: Record<string, any> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.position !== undefined) {
      payload.position_x = updates.position.x;
      payload.position_y = updates.position.y;
    }

    if (Object.keys(payload).length > 0) {
      const { error } = await supabase.from("ideas").update(payload).eq("id", id);
      if (error) {
        console.error("Failed to update idea:", error.message);
        return;
      }
    }

    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === id ? { ...idea, ...updates } : idea
      ),
    }));
  },

  /* Delete an idea from Supabase */
  deleteIdea: async (id) => {
    const { error } = await supabase.from("ideas").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete idea:", error.message);
      return;
    }
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== id),
      selectedIdeaId: state.selectedIdeaId === id ? null : state.selectedIdeaId,
    }));
  },

  /* Vote on an idea */
  voteIdea: async (id) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || null;

    const { error } = await supabase.from("votes").insert({
      idea_id: id,
      user_id: userId,
    });

    if (error) {
      console.error("Failed to vote:", error.message);
      return;
    }

    // Local update for immediate feedback
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      ),
    }));
  },

  /* Call Gemini to expand an idea */
  expandIdea: async (id) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (!idea) return;

    set({ aiExpandingId: id, selectedIdeaId: id });

    try {
      const res = await fetch("/api/expand-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: idea.title, description: idea.description }),
      });

      if (!res.ok) throw new Error("API returned " + res.status);

      const data: AiExpansion = await res.json();
      set((state) => ({
        aiExpansions: { ...state.aiExpansions, [id]: data },
        aiExpandingId: null,
      }));
    } catch (err) {
      console.error("Failed to expand idea:", err);
      set({ aiExpandingId: null });
    }
  },

  /* Call Gemini to generate a mind-map around an idea */
  mapIdea: async (id) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (!idea) return;

    set({ aiMappingId: id });

    try {
      const res = await fetch("/api/map-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: idea.title, description: idea.description }),
      });

      if (!res.ok) throw new Error("API returned " + res.status);

      const data: MapResult = await res.json();

      const CATEGORY_LABELS: Record<string, string> = {
        targetUsers: "Target Users",
        keyFeatures: "Key Features",
        revenueModel: "Revenue Model",
        competitors: "Competitors",
      };

      const cx = idea.position.x;
      const cy = idea.position.y;
      const radius = 350;
      const categories = Object.keys(CATEGORY_LABELS) as (keyof MapResult)[];

      const newNodes: MapNode[] = categories.map((cat, i) => {
        const angle = (-Math.PI / 2) + (i * (2 * Math.PI)) / categories.length;
        return {
          id: `map-${id}-${cat}`,
          category: cat,
          label: CATEGORY_LABELS[cat],
          items: data[cat] || [],
          position: {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
          },
        };
      });

      const newEdges: MapEdge[] = categories.map((cat) => ({
        id: `edge-${id}-${cat}`,
        source: id,
        target: `map-${id}-${cat}`,
      }));

      set((state) => ({
        mapNodes: [...state.mapNodes, ...newNodes],
        mapEdges: [...state.mapEdges, ...newEdges],
        aiMappingId: null,
      }));
    } catch (err) {
      console.error("Failed to map idea:", err);
      set({ aiMappingId: null });
    }
  },

  /* Comments Actions */
  fetchComments: async (ideaId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch comments:", error.message);
      return;
    }

    set((state) => ({
      comments: {
        ...state.comments,
        [ideaId]: (data as any[]).map(rowToComment),
      },
    }));
  },

  addComment: async (ideaId, content) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || null;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let finalUserId: string | null = null;

    if (userId && uuidRegex.test(userId)) {
      const userState = get().user;
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        email: userState?.email || 'unknown@example.com',
        name: userState?.name || 'User',
      }, { onConflict: 'id' }).select('id').single();

      if (!profileError) {
        finalUserId = userId;
      } else {
        console.warn("Could not ensure profile exists, using blank user_id:", profileError);
      }
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        idea_id: ideaId,
        content: content,
        user_id: finalUserId,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add comment:", error.message);
      return;
    }

    const newComment = rowToComment(data);
    set((state) => ({
      comments: {
        ...state.comments,
        [ideaId]: [...(state.comments[ideaId] || []), newComment],
      },
    }));
  },

  /* Fetch current user profile */
  fetchUser: async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      set({ user: null });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profile) {
      set({ user: profile as ProfileRow });
    } else {
      // Fallback if profile row doesn't exist yet but user is auth'd
      const fallbackProfile: ProfileRow = {
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        avatar: authUser.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
      };

      // Attempt to auto-create the missing profile to satisfy foreign key constraints
      const { error: insertError } = await supabase.from("profiles").insert({
        id: fallbackProfile.id,
        email: fallbackProfile.email,
        name: fallbackProfile.name,
        avatar: fallbackProfile.avatar
      });
      if (insertError) {
        console.warn("Could not auto-create profile:", insertError.message);
      }

      set({ user: fallbackProfile });
    }
  },
}));
