import { AdminUpdatesPanel } from "@/components/admin/admin-updates-panel";
import { listPlatformUpdates } from "@/lib/data/platform-updates";

export default async function AdminUpdatesPage() {
  let updates = [];
  try {
    updates = await listPlatformUpdates();
  } catch {
    updates = [];
  }
  return <AdminUpdatesPanel updates={updates} />;
}
