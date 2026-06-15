-- Discord account linking + live status on public profile
-- widgets_discord_user_id already exists from v12_v2_expansion.sql

alter table public.profile_settings
  add column if not exists show_discord_status boolean not null default false;

alter table public.profile_settings
  add column if not exists discord_username text not null default '';

alter table public.profile_settings
  add column if not exists discord_avatar text not null default '';
