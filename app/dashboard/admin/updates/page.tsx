import { AdminUpdatesPanel } from "@/components/admin/admin-updates-panel";
import { listPlatformUpdates } from "@/lib/data/platform-updates";
import type { PlatformUpdate } from "@/lib/types/platform-update";

export default async function AdminUpdatesPage() {
  let updates: PlatformUpdate[] = [];
  try {
    updates = await listPlatformUpdates();
  } catch {
    updates = [];
  }
  return <AdminUpdatesPanel updates={updates} />;
}
