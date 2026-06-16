-- cried.bio v54: Freeze public view_count for specific profiles (skip bump trigger)

alter table public.profiles
  add column if not exists view_count_frozen boolean not null default false;

create or replace function public.bump_profile_view_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set view_count = view_count + 1
  where id = new.profile_id
    and not view_count_frozen;
  return new;
end;
$$;

create or replace function public.record_profile_view(
  p_profile_id uuid,
  p_visitor_hash text,
  p_country text default 'Unknown'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted uuid;
  v_viewer uuid := auth.uid();
begin
  if not exists (
    select 1
    from public.profiles
    where id = p_profile_id
      and username is not null
  ) then
    return jsonb_build_object('ok', false, 'error', 'profile_not_found');
  end if;

  if exists (
    select 1
    from public.profiles
    where id = p_profile_id
      and view_count_frozen
  ) then
    return jsonb_build_object('ok', true, 'skipped', true);
  end if;

  if v_viewer = p_profile_id then
    return jsonb_build_object('ok', true, 'skipped', true);
  end if;

  insert into public.analytics_events (profile_id, event_type, visitor_hash, country)
  values (
    p_profile_id,
    'profile_view',
    left(coalesce(p_visitor_hash, ''), 64),
    left(coalesce(nullif(trim(p_country), ''), 'Unknown'), 64)
  )
  on conflict (profile_id, visitor_hash) where (event_type = 'profile_view')
  do nothing
  returning id into v_inserted;

  if v_inserted is not null then
    return jsonb_build_object('ok', true, 'recorded', true);
  end if;

  return jsonb_build_object('ok', true, 'deduplicated', true);
end;
$$;

revoke all on function public.record_profile_view(uuid, text, text) from public;
grant execute on function public.record_profile_view(uuid, text, text) to anon, authenticated, service_role;

-- @bam (uid 1): fixed public view count
update public.profiles
set
  view_count = 8675309,
  view_count_frozen = true
where lower(username) = 'bam'
  and uid = 1;

notify pgrst, 'reload schema';
