import { AdminAnnouncementsPanel } from "@/components/admin/admin-announcements-panel";
import { listAnnouncements } from "@/lib/data/admin";

export default async function AdminAnnouncementsPage() {
  const announcements = await listAnnouncements();
  return <AdminAnnouncementsPanel announcements={announcements} />;
}
