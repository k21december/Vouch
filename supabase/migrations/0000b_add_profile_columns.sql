-- Vouch — Add missing columns to profiles (safe to run if they already exist)
-- Paste into Supabase SQL Editor if you already have a profiles table

do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'full_name') then
        alter table public.profiles add column full_name text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'portfolio') then
        alter table public.profiles add column portfolio text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
        alter table public.profiles add column phone text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'previous_state') then
        alter table public.profiles add column previous_state text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'updated_at') then
        alter table public.profiles add column updated_at timestamptz default now();
    end if;
end $$;
