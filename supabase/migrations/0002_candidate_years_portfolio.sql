-- Candidate profiles: add years_working + portfolio_url, relax old columns
-- Paste into Supabase SQL Editor

do $$
begin
    -- Add new columns
    if not exists (select 1 from information_schema.columns where table_name = 'candidate_profiles' and column_name = 'years_working') then
        alter table public.candidate_profiles add column years_working integer not null default 0;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'candidate_profiles' and column_name = 'portfolio_url') then
        alter table public.candidate_profiles add column portfolio_url text;
    end if;

    -- Relax impact_score default so old column doesn't cause insert failures
    alter table public.candidate_profiles alter column impact_score set default 0;
    alter table public.candidate_profiles alter column seniority set default 'mid';
end $$;
