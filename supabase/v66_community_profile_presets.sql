-- Extend community theme listings to support shared profile presets

alter table public.community_theme_listings
  add column if not exists listing_type text not null default 'theme'
    check (listing_type in ('theme', 'profile_preset'));

alter table public.community_theme_listings
  add column if not exists profile_preset_id uuid references public.profile_presets(id) on delete cascade;

alter table public.community_theme_listings
  alter column theme_id drop not null;

alter table public.community_theme_listings
  drop constraint if exists community_theme_listings_theme_id_key;

alter table public.community_theme_listings
  drop constraint if exists community_theme_listings_source_check;

alter table public.community_theme_listings
  add constraint community_theme_listings_source_check
  check (
    (listing_type = 'theme' and theme_id is not null and profile_preset_id is null)
    or (listing_type = 'profile_preset' and profile_preset_id is not null and theme_id is null)
  );

create unique index if not exists community_theme_listings_theme_id_uq
  on public.community_theme_listings (theme_id)
  where theme_id is not null;

create unique index if not exists community_theme_listings_preset_id_uq
  on public.community_theme_listings (profile_preset_id)
  where profile_preset_id is not null;

alter table public.community_theme_installs
  add column if not exists installed_preset_id uuid references public.profile_presets(id) on delete set null;

notify pgrst, 'reload schema';
