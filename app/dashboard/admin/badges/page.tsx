import { AdminPageHeader } from "@/components/admin/admin-ui";
import { BadgesAdminPanel } from "@/components/dashboard/badges-admin-panel";
import { getAllBadgesCatalog } from "@/lib/data/badges";

export default async function AdminBadgesPage() {
  const catalog = await getAllBadgesCatalog();

  return (
    <>
      <AdminPageHeader
        title="Badge Management"
        description="Create, grant, revoke, and manage badges across the platform."
      />
      <BadgesAdminPanel catalog={catalog} />
    </>
  );
}
