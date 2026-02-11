
-- Enable pgvector extension for embeddings
create extension if not exists vector;

-- Profiles: Users (Candidates & Referrers)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('candidate', 'referrer')) not null,
  email text,
  first_name text,
  last_name text,
  headline text,
  bio text,
  location text,
  avatar_url text,
  company text, -- For Referrers
  reputation_score int default 50, -- Hidden score
  metadata jsonb default '{}'::jsonb, -- Skills, preferences, jobFocus for candidates
  settings jsonb default '{"notifications": true, "email_updates": false, "profile_visible": true}'::jsonb, -- User settings
  created_at timestamptz default now()
);

-- Jobs: Posted by Referrers
create table jobs (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  company text not null,
  description text not null,
  location text,
  salary_range text,
  requirements text[],
  embedding vector(1536), -- For fit scoring
  verified boolean default false,
  created_at timestamptz default now()
);

-- Requests (Matches): Candidates -> Referrers (Specific Job or General)
create table requests (
  id uuid default gen_random_uuid() primary key,
  candidate_id uuid references profiles(id) on delete cascade not null,
  referrer_id uuid references profiles(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete set null, -- Optional (general intro vs specific job)
  
  -- Status aligned with frontend ConnectionState
  -- 'details_requested' = Context Request sent by Referrer
  status text check (status in ('pending', 'details_requested', 'matched', 'vouched', 'passed')) default 'pending',
  
  note text, -- Initial request note from Candidate
  
  -- For Context Requests (details_requested)
  requested_areas text[], -- e.g. ['resume', 'projects']
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Portfolio Items: Candidate Evidence
create table portfolio_items (
  id uuid default gen_random_uuid() primary key,
  candidate_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  url text,
  type text check (type in ('resume', 'case-study', 'project', 'link', 'metrics')),
  description text,
  embedding vector(1536), -- For inference matching
  created_at timestamptz default now()
);

-- Chat Messages: Threaded conversation for accepted requests
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references requests(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Reputation Events: Log source of score changes
create table reputation_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  event_type text not null, -- 'request_sent', 'chat_sent', 'report', 'vouch'
  score_delta int not null,
  created_at timestamptz default now()
);

-- Row Level Security (RLS)

alter table profiles enable row level security;
alter table jobs enable row level security;
alter table requests enable row level security;
alter table portfolio_items enable row level security;
alter table chat_messages enable row level security;
alter table reputation_events enable row level security;

-- Policies

-- Profiles: Public read, owner update
create policy "Public profiles are viewable by everyone" 
on profiles for select using (true);

create policy "Users can update own profile" 
on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile" 
on profiles for insert with check (auth.uid() = id);

-- Jobs: Public read, referrer create/update
create policy "Jobs are viewable by everyone" 
on jobs for select using (true);

create policy "Referrers can insert jobs" 
on jobs for insert with check (auth.uid() = referrer_id);

create policy "Referrers can update own jobs" 
on jobs for update using (auth.uid() = referrer_id);

-- Requests: Private between Candidate and Referrer
create policy "Users can see requests they are part of" 
on requests for select 
using (auth.uid() = candidate_id or auth.uid() = referrer_id);

create policy "Users can insert requests they initiate"
on requests for insert
with check (auth.uid() = candidate_id); -- Usually candidates start requests, but could be flexible

create policy "Participants can update requests" 
on requests for update 
using (auth.uid() = candidate_id or auth.uid() = referrer_id); 

-- Portfolio: Public read, owner manage
create policy "Portfolio items are viewable" 
on portfolio_items for select using (true);

create policy "Candidates manage portfolio" 
on portfolio_items for all using (auth.uid() = candidate_id);

-- Chat: Participants only
create policy "Chat participants can view messages" 
on chat_messages for select 
using (
  exists (
    select 1 from requests 
    where requests.id = chat_messages.request_id 
    and (requests.candidate_id = auth.uid() or requests.referrer_id = auth.uid())
  )
);

create policy "Chat participants can insert messages" 
on chat_messages for insert 
with check (
  exists (
    select 1 from requests 
    where requests.id = chat_messages.request_id 
    and (requests.candidate_id = auth.uid() or requests.referrer_id = auth.uid())
  )
);

-- Triggers

-- Auto-create profile on Auth Signup
-- Assumes metadata in auth.users contains 'role', 'first_name', etc.
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, role, first_name, last_name, email, metadata)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'candidate'), -- default to candidate
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- RPC: create_request (Rate Limiting)
create or replace function create_request(
  target_referrer_id uuid,
  target_job_id uuid,
  request_note text
)
returns uuid
language plpgsql
security definer
as $$
declare
  daily_count int;
  new_request_id uuid;
begin
  -- Check daily limit (24h sliding window)
  select count(*) into daily_count
  from requests
  where candidate_id = auth.uid()
  and created_at > now() - interval '24 hours';

  if daily_count >= 15 then
    raise exception 'Daily request limit reached (15/day).';
  end if;

  -- Insert
  insert into requests (candidate_id, referrer_id, job_id, note)
  values (auth.uid(), target_referrer_id, target_job_id, request_note)
  returning id into new_request_id;

  return new_request_id;
end;
$$;
