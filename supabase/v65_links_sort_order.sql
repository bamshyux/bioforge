-- Ensure links.sort_order exists (required for preset apply + link ordering)
alter table public.links
  add column if not exists sort_order integer not null default 0;

create index if not exists links_profile_sort_idx
  on public.links (profile_id, sort_order);

notify pgrst, 'reload schema';
