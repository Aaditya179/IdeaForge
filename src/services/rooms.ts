import { supabase } from '../lib/supabase';
import { ROOMS_DATA, CAT_COLORS, CAT_GRADIENTS } from '../lib/constants';

export interface Room {
  id: string;
  user_id: string;
  cat: string;
  catColor: string;
  title: string;
  gradient: string;
  status: string;
  participants: number;
  max_participants: number;
  ideas: number;
  date: string;
  created_at: string;
  deadline?: string;
  description: string;
  score: string;
}

/**
 * Parses a Supabase room row into the frontend ROOM object format.
 */
const formatRoom = (row: any): Room => ({
  id: row.room_id || row.id,
  user_id: row.user_id,
  cat: row.category,
  catColor: CAT_COLORS[row.category] || "#3b3bff",
  title: row.title,
  gradient: CAT_GRADIENTS[row.category] || "linear-gradient(135deg, #2a2a3a, #3a3a5a)",
  status: row.status || "Active",
  participants: row.participants || 1,
  max_participants: row.max_participants || 500,
  ideas: row.ideas || 0,
  date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  created_at: row.created_at,
  deadline: row.deadline,
  description: row.description || "",
  score: row.score || "—",
});

export const getRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }

  return (data || []).map(formatRoom);
};

export const createRoom = async (roomData: { title: string; category: string; limit?: string; description?: string; duration?: string }): Promise<Room> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be logged in to create a room");

  // Calculate deadline from duration string if provided (mock logic)
  let deadline = null;
  if (roomData.duration && roomData.duration !== "Unlimited") {
    const hours = parseInt(roomData.duration) || 1;
    deadline = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  }

  const newRoom = {
    user_id: user.id,
    title: roomData.title,
    description: roomData.description,
    category: roomData.category,
    max_participants: parseInt(roomData.limit || "500") || 500,
    deadline: deadline,
  };

  const { data, error } = await supabase
    .from('rooms')
    .insert([newRoom])
    .select()
    .single();

  if (error) throw error;
  return formatRoom(data);
};

/**
 * One-time utility to push the dummy ROOMS_DATA from store.js into Supabase
 */
export const migrateDummyData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return; // Need a user to own the legacy rooms

  // Fetch current to avoid duplicates based on title
  const { data: existing } = await supabase.from('rooms').select('title');
  const existingTitles = new Set((existing || []).map((r: any) => r.title));

  const toInsert = ROOMS_DATA
    .filter(r => !existingTitles.has(r.title))
    .map(r => ({
      user_id: user.id,
      title: r.title,
      description: r.description,
      category: r.cat,
      max_participants: 50,
      participants: r.participants,
      ideas: r.ideas,
      score: r.score,
      created_at: new Date(r.date + " 2023").toISOString(), // best effort parse
    }));

  if (toInsert.length > 0) {
    console.log("Migrating dummy data to Supabase...", toInsert);
    await supabase.from('rooms').insert(toInsert);
  }
};
