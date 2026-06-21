-- Guestbook appearance controls (separate from main profile card styling)
alter table public.profile_settings
  add column if not exists guestbook_use_profile_card boolean not null default false,
  add column if not exists guestbook_opacity integer not null default 88,
  add column if not exists guestbook_blur integer not null default 0,
  add column if not exists guestbook_glassmorphism boolean not null default false,
  add column if not exists guestbook_show_background boolean not null default true,
  add column if not exists guestbook_background_color text not null default '',
  add column if not exists guestbook_message_opacity integer not null default 50,
  add column if not exists guestbook_author_opacity integer not null default 38,
  add column if not exists guestbook_label_opacity integer not null default 18,
  add column if not exists guestbook_text_color text not null default '',
  add column if not exists guestbook_border_style text not null default 'accent-left',
  add column if not exists guestbook_spacing text not null default 'default',
  add column if not exists guestbook_padding_y integer not null default 20;

comment on column public.profile_settings.guestbook_use_profile_card is 'When true, guestbook uses main profile card opacity/blur/glass settings';
comment on column public.profile_settings.guestbook_border_style is 'none, accent-left, or subtle-full';
comment on column public.profile_settings.guestbook_spacing is 'compact, default, or relaxed entry spacing';
