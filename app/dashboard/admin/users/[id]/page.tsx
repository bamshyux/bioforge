import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBadge, AdminPageHeader, AdminSection } from "@/components/admin/admin-ui";
import { buttonSecondaryClassName } from "@/components/dashboard/form-fields";
import { getAdminUser, getUserTimeline } from "@/lib/data/admin";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAdminUser(id);
  if (!user) notFound();

  const timeline = await getUserTimeline(id);

  return (
    <>
      <AdminPageHeader
        title={user.username ?? user.email ?? "User"}
        description={`UID ${user.uid ?? "—"} · ${user.email ?? "No email"}`}
        actions={
          <Link href="/dashboard/admin/users" className={buttonSecondaryClassName}>
            Back to users
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminSection title="Account">
          <dl className="grid gap-3 text-sm">
            <Row label="Role" value={user.role} />
            <Row label="Premium" value={user.premium_tier} />
            <Row label="Created" value={new Date(user.created_at).toLocaleString()} />
            <Row label="Last login" value={user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "—"} />
            <Row label="Badges" value={String(user.badge_count)} />
            <div className="flex flex-wrap gap-2 pt-1">
              {user.is_banned ? <AdminBadge tone="red">Banned</AdminBadge> : null}
              {user.is_disabled ? <AdminBadge tone="red">Disabled</AdminBadge> : null}
            </div>
          </dl>
        </AdminSection>

        <AdminSection title="User Timeline">
          {timeline.length === 0 ? (
            <p className="text-sm text-neutral-500">No timeline events yet.</p>
          ) : (
            <ul className="space-y-3">
              {timeline.map((event) => (
                <li key={event.id} className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] px-3 py-2.5">
                  <p className="text-sm text-white">{event.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {event.event_type} · {new Date(event.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminSection>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] pb-2">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-200">{value}</dd>
    </div>
  );
}
