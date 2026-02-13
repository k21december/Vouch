-- Add portfolio attachment columns to candidate_profiles
-- Paste into Supabase SQL Editor

do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'candidate_profiles' and column_name = 'portfolio_path') then
        alter table public.candidate_profiles add column portfolio_path text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'candidate_profiles' and column_name = 'portfolio_filename') then
        alter table public.candidate_profiles add column portfolio_filename text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'candidate_profiles' and column_name = 'portfolio_uploaded_at') then
        alter table public.candidate_profiles add column portfolio_uploaded_at timestamptz;
    end if;
end $$;

-- Create private storage bucket (run ONCE — idempotent via IF NOT EXISTS)
insert into storage.buckets (id, name, public)
values ('portfolios', 'portfolios', false)
on conflict (id) do nothing;

-- Storage RLS: candidates can upload to their own folder
-- DROP first so re-running is safe
drop policy if exists "Candidates upload own portfolio" on storage.objects;
create policy "Candidates upload own portfolio"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can read their own uploads
drop policy if exists "Candidates read own portfolio" on storage.objects;
create policy "Candidates read own portfolio"
  on storage.objects for select
  using (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Candidates can overwrite/delete their own uploads
drop policy if exists "Candidates manage own portfolio" on storage.objects;
create policy "Candidates manage own portfolio"
  on storage.objects for delete
  using (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Candidates update own portfolio" on storage.objects;
create policy "Candidates update own portfolio"
  on storage.objects for update
  using (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
