-- Add profiles table for user display names
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 64)
);

alter table public.profiles enable row level security;
-- Anyone can read profiles
create policy "profiles read" on public.profiles for select using (true);
-- Users can insert/update their own profile
create policy "profiles upsert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update" on public.profiles for update using (auth.uid() = id);
