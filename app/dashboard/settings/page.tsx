import { redirect } from "next/navigation";
import { AccountSettingsShell } from "@/components/dashboard/settings/account-settings-shell";
import { getAccountSettingsData, touchUserSession } from "@/lib/data/account-settings";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  const email = (data.claims.email as string | undefined) ?? "";
  const sessionId = data.claims.session_id as string | undefined;

  await touchUserSession(userId, sessionId);

  const settingsData = await getAccountSettingsData(userId, email);

  return <AccountSettingsShell data={settingsData} />;
}
