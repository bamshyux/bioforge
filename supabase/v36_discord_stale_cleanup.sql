-- Clear Discord status for accounts that were never properly linked (ID without username).
-- Run after v34_discord_connect.sql

update public.profile_settings
set
  widgets_discord_user_id = '',
  discord_username = '',
  discord_avatar = '',
  show_discord_status = false
where coalesce(trim(discord_username), '') = ''
  and coalesce(trim(widgets_discord_user_id), '') <> '';

delete from public.profile_widgets
where widget_type = 'discord_status'
  and profile_id in (
    select profile_id
    from public.profile_settings
    where coalesce(trim(discord_username), '') = ''
  );
