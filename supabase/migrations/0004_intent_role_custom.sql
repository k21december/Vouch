-- Add intent_role_custom column for "Other" role option
-- Paste into Supabase SQL Editor

alter table public.candidate_profiles
  add column if not exists intent_role_custom text;
