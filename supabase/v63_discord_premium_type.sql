-- Discord Nitro subscription level from OAuth (identify.premium scope)
alter table public.profile_settings
  add column if not exists discord_premium_type smallint not null default 0;

-- Profile banner hash from OAuth (also used as a Nitro signal when premium_type is unavailable)
alter table public.profile_settings
  add column if not exists discord_banner text not null default '';
