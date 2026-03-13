-- Supabase SQL Migration
-- Comprehensive setup for Profiles, Ideas, Votes, and Comments

-- 1. Create Profiles Table (syncs with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  name text,
  avatar text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create Ideas Table
CREATE TABLE IF NOT EXISTS public.ideas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text DEFAULT '',
  tags text[] DEFAULT '{}',
  position_x numeric DEFAULT 0,
  position_y numeric DEFAULT 0,
  creator_id text, -- legacy string id
  user_id uuid REFERENCES public.profiles(id) DEFAULT auth.uid(),
  session_id text DEFAULT 'default-session',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ideas are viewable by everyone." ON ideas;
DROP POLICY IF EXISTS "Authenticated users can insert ideas." ON ideas;
DROP POLICY IF EXISTS "Authenticated users can update ideas." ON ideas;
DROP POLICY IF EXISTS "Authenticated users can delete ideas." ON ideas;

CREATE POLICY "Ideas are viewable by everyone." ON ideas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ideas." ON ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ideas." ON ideas FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete ideas." ON ideas FOR DELETE USING (true);


-- 3. Create Votes Table
CREATE TABLE IF NOT EXISTS public.votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id text, -- stored as text to support both auth.uid() and session IDs
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Votes are viewable by everyone." ON votes;
DROP POLICY IF EXISTS "Authenticated users can insert votes." ON votes;
DROP POLICY IF EXISTS "Authenticated users can delete votes." ON votes;

CREATE POLICY "Votes are viewable by everyone." ON votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes." ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete votes." ON votes FOR DELETE USING (true);


-- 4. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id),
  session_id text DEFAULT 'default-session',
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are viewable by everyone." ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments." ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can delete comments." ON public.comments;

CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments." ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete comments." ON public.comments FOR DELETE USING (true);


-- 5. Views
DROP VIEW IF EXISTS public.ideas_with_votes;
CREATE VIEW public.ideas_with_votes AS
SELECT
  i.id,
  i.title,
  i.description,
  i.tags,
  i.position_x,
  i.position_y,
  i.creator_id,
  i.user_id,
  i.session_id,
  i.created_at,
  COALESCE(count(v.id), 0)::numeric AS vote_count
FROM ideas i
LEFT JOIN votes v ON i.id = v.idea_id
GROUP BY i.id;

DROP VIEW IF EXISTS public.ideas_with_stats;
CREATE VIEW public.ideas_with_stats AS
SELECT
  i.id,
  i.title,
  i.description,
  i.tags,
  i.position_x,
  i.position_y,
  i.creator_id,
  i.user_id,
  i.session_id,
  i.created_at,
  COALESCE(count(DISTINCT v.id), 0)::numeric AS vote_count,
  COALESCE(count(DISTINCT c.id), 0)::numeric AS comment_count
FROM ideas i
LEFT JOIN votes v ON i.id = v.idea_id
LEFT JOIN comments c ON i.id = c.idea_id
GROUP BY i.id;
