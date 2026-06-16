import { redirect } from "next/navigation";

export default function LegacyModerationRedirect() {
  redirect("/dashboard/admin/moderation");
}
