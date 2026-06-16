import { AdminPageHeader, AdminSection, AdminTableWrap } from "@/components/admin/admin-ui";
import { listSecurityEvents } from "@/lib/data/admin";

export default async function AdminSecurityPage() {
  const events = await listSecurityEvents();

  const failed = events.filter((e) => e.event_type.includes("failed"));
  const recent = events.filter((e) => e.event_type.includes("login"));

  return (
    <>
      <AdminPageHeader
        title="Security Center"
        description="Monitor logins, failed attempts, and suspicious activity."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Recent events" value={events.length} />
        <Stat label="Login events" value={recent.length} />
        <Stat label="Failed logins" value={failed.length} />
      </div>

      <AdminSection title="Recent security events">
        <AdminTableWrap>
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-4 py-3 text-white">{event.event_type}</td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-400">{event.user_id ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{new Date(event.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </AdminTableWrap>
      </AdminSection>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bf-card p-4">
      <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
