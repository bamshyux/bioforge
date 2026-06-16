import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin-access";
import { AdminSubnav } from "@/components/admin/admin-subnav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await getAdminAccess();
  if (!access) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <AdminSubnav role={access.role} />
      {children}
    </div>
  );
}
