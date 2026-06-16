-- cried.bio v50: Optional profile location (shown beside view count)

alter table public.profiles
  add column if not exists location text not null default '';

comment on column public.profiles.location is 'Optional location label shown on public profile (e.g. city or HQ name)';
