alter table public.profile_settings
  add column if not exists cursor_image_size integer not null default 48;
