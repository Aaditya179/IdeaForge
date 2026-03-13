import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

export type ProfileRow = {
  id: string; // matches auth.users() id
  email: string;
  name: string | null;
  avatar: string | null;
  created_at: string;
};

/** Row in the `ideas` table */
export type IdeaRow = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  position_x: number;
  position_y: number;
  creator_id: string; // legacy string id
  user_id: string | null; // references profile
  session_id: string; // active collaboration room
  created_at: string;
};

/** Row returned by the `ideas_with_votes` view (includes vote_count) */
export type IdeaWithVotes = IdeaRow & {
  vote_count: number;
};

/** Row in the `votes` table */
export type VoteRow = {
  id: string;
  idea_id: string;
  user_id: string;
  created_at: string;
};

/** Row in the `comments` table */
export type CommentRow = {
  id: string;
  idea_id: string;
  user_id: string | null;
  session_id: string;
  content: string;
  created_at: string;
};
