-- cried.bio v43: Link icon visual effects (glow, shadow, pulse)

alter table public.profile_settings
  add column if not exists links_icon_glow boolean not null default false;

alter table public.profile_settings
  add column if not exists links_icon_shadow boolean not null default false;

alter table public.profile_settings
  add column if not exists links_icon_pulse boolean not null default false;

comment on column public.profile_settings.links_icon_glow is 'Soft color-matched glow on link icons';
comment on column public.profile_settings.links_icon_shadow is 'Drop shadow behind link icons';
comment on column public.profile_settings.links_icon_pulse is 'Subtle pulse animation on link icons';

notify pgrst, 'reload schema';
