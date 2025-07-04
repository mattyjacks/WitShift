-- SpeechFight initial schema
-- Users table comes from Supabase auth users

create table if not exists public.debates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  debate_id uuid references public.debates(id) on delete cascade,
  parent_post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete cascade,
  content_text text,
  audio_url text,
  transcript text,
  created_at timestamptz not null default now()
);

create table if not exists public.cooldowns (
  user_id uuid references auth.users(id) on delete cascade,
  debate_id uuid references public.debates(id) on delete cascade,
  unlock_at timestamptz not null,
  primary key (user_id, debate_id)
);

-- simple RLS example: allow authenticated users to read; only owner to insert
alter table public.debates enable row level security;
create policy "authenticated read" on public.debates for select using (true);
create policy "owner insert" on public.debates for insert with check (auth.uid() = created_by);

alter table public.posts enable row level security;
create policy "authenticated read posts" on public.posts for select using (true);
create policy "owner insert posts" on public.posts for insert with check (auth.uid() = author_id);

alter table public.cooldowns enable row level security;
create policy "owner read cooldowns" on public.cooldowns for select using (auth.uid() = user_id);
create policy "owner insert cooldowns" on public.cooldowns for insert with check (auth.uid() = user_id);
