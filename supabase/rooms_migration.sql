-- Create Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  score text DEFAULT '0',
  participants integer DEFAULT 1,
  ideas integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Rooms are viewable by everyone." ON rooms;
CREATE POLICY "Rooms are viewable by everyone." ON rooms FOR SELECT USING (true);

-- Insert a default room for testing
INSERT INTO public.rooms (id, title, description)
VALUES ('default-session', 'Q1 Innovation Sprint', 'Main brainstorming room for our quarterly product goals.')
ON CONFLICT (id) DO NOTHING;
