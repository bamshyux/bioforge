import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ModerationPanel } from "@/components/admin/moderation-panel";
import {
  listModerationAudit,
  listModerationCategories,
  listModerationLogs,
  listModerationWords,
} from "@/lib/data/moderation";

export default async function AdminModerationPage() {
  const [categories, words, logs, audit] = await Promise.all([
    listModerationCategories(),
    listModerationWords(),
    listModerationLogs(),
    listModerationAudit(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Content Moderation"
        description="Search bios, usernames, and guestbook content. Review logs and manage filters."
      />
      <ModerationPanel
        categories={categories}
        words={words}
        logs={logs}
        audit={audit}
      />
    </>
  );
}
