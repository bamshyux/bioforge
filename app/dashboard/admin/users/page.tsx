import { AdminUsersPanel } from "@/components/admin/admin-users-panel";
import { listAdminUsers } from "@/lib/data/admin";

export default async function AdminUsersPage() {
  const users = await listAdminUsers("");
  return <AdminUsersPanel initialUsers={users} />;
}
