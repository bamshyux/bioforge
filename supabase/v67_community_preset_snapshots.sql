-- Freeze profile preset data on community listings so author profile changes
-- do not mutate published community presets.

alter table public.community_theme_listings
  add column if not exists published_preset_data jsonb;

comment on column public.community_theme_listings.published_preset_data is
  'Immutable preset snapshot captured when the listing is published or updated.';

-- Best-effort backfill from the linked preset row.
update public.community_theme_listings ctl
set published_preset_data = pp.preset_data
from public.profile_presets pp
where ctl.profile_preset_id = pp.id
  and ctl.listing_type = 'profile_preset'
  and ctl.published_preset_data is null
  and pp.preset_data is not null
  and pp.preset_data <> '{}'::jsonb;

-- If the live preset was overwritten, recover from the earliest installer copy.
update public.community_theme_listings ctl
set
  published_preset_data = recovered.preset_data,
  preview_image_url = coalesce(nullif(trim(ctl.preview_image_url), ''), recovered.thumbnail_url)
from (
  select distinct on (ci.listing_id)
    ci.listing_id,
    ip.preset_data,
    ip.thumbnail_url
  from public.community_theme_installs ci
  join public.profile_presets ip on ip.id = ci.installed_preset_id
  where ip.preset_data is not null
    and ip.preset_data <> '{}'::jsonb
    and (ip.preset_data->>'version') = '1'
  order by ci.listing_id, ci.created_at asc
) recovered
where ctl.id = recovered.listing_id
  and ctl.listing_type = 'profile_preset'
  and (
    ctl.published_preset_data is null
    or ctl.published_preset_data = '{}'::jsonb
    or not (ctl.published_preset_data ? 'settings')
  );

notify pgrst, 'reload schema';
