import { AdminNotificationsPanel } from "@/components/admin/admin-notifications-panel";
import { listNotifications } from "@/lib/data/admin";

export default async function AdminNotificationsPage() {
  const notifications = await listNotifications();
  return <AdminNotificationsPanel notifications={notifications} />;
}
