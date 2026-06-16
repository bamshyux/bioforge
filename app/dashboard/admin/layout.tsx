import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin-access";
import { AdminSubnav } from "@/components/admin/admin-subnav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await getAdminAccess();
  if (!access) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-400/80">Admin Panel</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Platform management</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Separate from your user dashboard. Manage users, content, and platform settings.
        </p>
      </div>
      <AdminSubnav role={access.role} />
      {children}
    </div>
  );
}
