-- Vouch MVP — Complete Schema
-- Run this in the Supabase SQL Editor

-- ============================================================
-- EXTENSION
-- ============================================================

create extension if not exists vector;

-- ============================================================
-- PROFILES (base table for all users)
-- ============================================================

create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('candidate', 'referrer')) not null,
  email text,
  first_name text,
  last_name text,
  headline text,
  bio text,
  location text,
  avatar_url text,
  company text,
  reputation_score int default 50,
  metadata jsonb default '{}'::jsonb,
  settings jsonb default '{"notifications": true, "email_updates": false, "profile_visible": true}'::jsonb,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

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
-- CANDIDATE PROFILES
-- ============================================================

create table if not exists candidate_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  seniority text not null default 'mid',
  skills text[] not null default '{}',
  domains text[] not null default '{}',
  intent_role text not null default 'SWE',
  impact_score numeric not null default 50,
  updated_at timestamptz not null default now()
);

alter table candidate_profiles enable row level security;

create policy "Users can read own candidate profile"
  on candidate_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own candidate profile"
  on candidate_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own candidate profile"
  on candidate_profiles for update
  using (auth.uid() = user_id);

-- ============================================================
-- REFERRER PROFILES
-- ============================================================

create table if not exists referrer_profiles (
  user_id uuid primary key references profiles(id) on delete cascade,
  company text not null default '',
  job_title text not null default '',
  seniority text not null default 'mid',
  refer_roles text[] not null default '{}',
  prefer_skills text[] not null default '{}',
  prefer_domains text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table referrer_profiles enable row level security;

create policy "Users can read own referrer profile"
  on referrer_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own referrer profile"
  on referrer_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own referrer profile"
  on referrer_profiles for update
  using (auth.uid() = user_id);

-- Referrers can view candidate profiles only if a match links them
create policy "Referrers can view matched candidate profiles"
  on candidate_profiles for select
  using (
    exists (
      select 1 from matches
      where matches.candidate_id = candidate_profiles.user_id
        and matches.referrer_id = auth.uid()
    )
  );

-- ============================================================
-- MATCHES (service role inserts only)
-- ============================================================

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references profiles(id) on delete cascade,
  referrer_id uuid not null references profiles(id) on delete cascade,
  score numeric not null default 0,
  breakdown jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (candidate_id, referrer_id)
);

alter table matches enable row level security;

create policy "Candidates can read own matches"
  on matches for select
  using (auth.uid() = candidate_id);

create policy "Referrers can read own matches"
  on matches for select
  using (auth.uid() = referrer_id);

-- No insert policy: only service_role can insert matches

-- ============================================================
-- DECISIONS
-- ============================================================

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null unique references matches(id) on delete cascade,
  referrer_id uuid not null references profiles(id) on delete cascade,
  candidate_id uuid not null references profiles(id) on delete cascade,
  decision text not null check (decision in ('accept', 'decline')),
  reason text,
  decided_at timestamptz not null default now()
);

alter table decisions enable row level security;

create policy "Referrers can insert decisions for their matches"
  on decisions for insert
  with check (
    auth.uid() = referrer_id
    and exists (
      select 1 from matches
      where matches.id = decisions.match_id
        and matches.referrer_id = auth.uid()
    )
  );

create policy "Referrers can read own decisions"
  on decisions for select
  using (auth.uid() = referrer_id);

create policy "Candidates can read decisions about them"
  on decisions for select
  using (auth.uid() = candidate_id);

-- ============================================================
-- EVENTS
-- ============================================================

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

create policy "Users can read own events"
  on events for select
  using (auth.uid() = user_id);

create policy "Users can insert own events"
  on events for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_matches_referrer_score
  on matches (referrer_id, score desc);

create index if not exists idx_matches_candidate
  on matches (candidate_id);

create index if not exists idx_decisions_referrer
  on decisions (referrer_id);

create index if not exists idx_decisions_match
  on decisions (match_id);

create index if not exists idx_events_user
  on events (user_id);

create index if not exists idx_events_type
  on events (type);
