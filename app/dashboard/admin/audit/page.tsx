import { AdminPageHeader, AdminSection, AdminTableWrap } from "@/components/admin/admin-ui";
import { listAuditLogs } from "@/lib/data/admin";

export default async function AdminAuditPage() {
  const logs = await listAuditLogs();

  return (
    <>
      <AdminPageHeader
        title="Audit Logs"
        description="Full history of admin actions across the platform."
      />

      <AdminSection title="Recent audit events">
        <AdminTableWrap>
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-white">{log.action}</td>
                <td className="px-4 py-3 text-xs text-neutral-400">{log.actor_email || log.actor_id}</td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-500">{log.target_user_id ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </AdminTableWrap>
      </AdminSection>
    </>
  );
}
