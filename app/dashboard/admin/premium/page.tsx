import { AdminPageHeader, AdminSection, AdminTableWrap } from "@/components/admin/admin-ui";
import { listPremiumUsers } from "@/lib/data/admin";

export default async function AdminPremiumPage() {
  const users = await listPremiumUsers();

  return (
    <>
      <AdminPageHeader
        title="Premium Management"
        description="View premium users, expiration dates, and lifetime premium accounts."
      />

      <AdminSection title="Premium users">
        <AdminTableWrap>
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-white">{user.username ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-300">{user.premium_tier}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {user.premium_expires_at ? new Date(user.premium_expires_at).toLocaleString() : "Lifetime / none"}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-400">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </AdminTableWrap>
      </AdminSection>
    </>
  );
}
