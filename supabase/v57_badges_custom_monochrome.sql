-- cried.bio v57: Separate monochrome control for custom badges

alter table public.profile_settings
  add column if not exists badges_custom_monochrome boolean not null default false;

comment on column public.profile_settings.badges_monochrome is
  'When true, default/catalog badges use text_color instead of catalog colors';

comment on column public.profile_settings.badges_custom_monochrome is
  'When true, custom admin-created badges use text_color instead of their uploaded colors';

notify pgrst, 'reload schema';
