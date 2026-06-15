-- cried.bio v33: Denormalized profile view_count (public-readable) + sync trigger

alter table public.profiles
  add column if not exists view_count bigint not null default 0;

-- Backfill from existing analytics rows
update public.profiles p
set view_count = sub.cnt
from (
  select profile_id, count(*)::bigint as cnt
  from public.analytics_events
  where event_type = 'profile_view'
  group by profile_id
) sub
where p.id = sub.profile_id;

-- One view per visitor identity (safe if v29 already ran)
delete from public.analytics_events
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by profile_id, visitor_hash
        order by created_at asc
      ) as rn
    from public.analytics_events
    where event_type = 'profile_view'
  ) ranked
  where rn > 1
);

create unique index if not exists analytics_events_profile_view_dedup_uidx
  on public.analytics_events (profile_id, visitor_hash)
  where event_type = 'profile_view';

create or replace function public.bump_profile_view_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set view_count = view_count + 1
  where id = new.profile_id;
  return new;
end;
$$;

drop trigger if exists analytics_events_bump_view_count on public.analytics_events;
create trigger analytics_events_bump_view_count
after insert on public.analytics_events
for each row
when (new.event_type = 'profile_view')
execute function public.bump_profile_view_count();

create or replace function public.get_public_profile_view_count(p_profile_id uuid)
returns bigint
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (
      select view_count
      from public.profiles
      where id = p_profile_id
        and username is not null
    ),
    0::bigint
  );
$$;

revoke all on function public.get_public_profile_view_count(uuid) from public;
grant execute on function public.get_public_profile_view_count(uuid) to anon, authenticated, service_role;

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

notify pgrst, 'reload schema';
