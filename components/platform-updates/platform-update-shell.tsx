import { PlatformUpdateWidget } from "@/components/platform-updates/platform-update-widget";
import { getActivePlatformUpdates } from "@/lib/data/platform-updates";
import type { PlatformUpdate } from "@/lib/types/platform-update";

export async function PlatformUpdateShell() {
  let updates: PlatformUpdate[] = [];
  try {
    updates = await getActivePlatformUpdates();
  } catch {
    return null;
  }

  if (updates.length === 0) return null;

  return <PlatformUpdateWidget updates={updates} />;
}
