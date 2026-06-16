alter table public.profile_settings
  add column if not exists cursor_image_url text;
