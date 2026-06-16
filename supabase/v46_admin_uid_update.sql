-- cried.bio v46: Allow platform admins to manually change profile UIDs
-- Does NOT modify profiles_uid_seq — new signups still auto-increment as before.

create or replace function public.admin_update_profile_uid(
  p_user_id uuid,
  p_uid bigint
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Forbidden';
  end if;

  if p_user_id is null then
    raise exception 'Missing user id';
  end if;

  if p_uid is null or p_uid < 1 then
    raise exception 'UID must be a positive number';
  end if;

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'User not found';
  end if;

  if exists (
    select 1 from public.profiles
    where uid = p_uid and id <> p_user_id
  ) then
    raise exception 'That UID is already taken';
  end if;

  update public.profiles
  set uid = p_uid, updated_at = now()
  where id = p_user_id;
end;
$$;

revoke all on function public.admin_update_profile_uid(uuid, bigint) from public;
grant execute on function public.admin_update_profile_uid(uuid, bigint) to authenticated;

notify pgrst, 'reload schema';
