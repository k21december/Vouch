-- Vouch — Create profiles table (paste into Supabase SQL Editor)
-- Safe to run multiple times (IF NOT EXISTS / CREATE OR REPLACE)

-- ============================================================
-- TABLE
-- ============================================================

create table if not exists public.profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  first_name      text,
  last_name       text,
  full_name       text,
  portfolio       text,
  phone           text,
  previous_state  text,
  role            text        check (role in ('candidate', 'referrer')),
  email           text,
  company         text,
  headline        text,
  bio             text,
  location        text,
  avatar_url      text,
  reputation_score int default 50,
  metadata        jsonb       default '{}'::jsonb,
  settings        jsonb       default '{"notifications": true, "email_updates": false, "profile_visible": true}'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Optional index on role for filtered queries
create index if not exists idx_profiles_role on profiles(role);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;

-- Drop existing policies first (safe re-run)
drop policy if exists "Users can read own profile"   on profiles;
drop policy if exists "Users can insert own profile"  on profiles;
drop policy if exists "Users can update own profile"  on profiles;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profiles_updated on profiles;

create trigger on_profiles_updated
  before update on profiles
  for each row
  execute function public.handle_updated_at();
