import { redirect } from "next/navigation";
import { Suspense } from "react";
import { sanitizeDiscordConnectionAction, refreshDiscordProfileAction } from "@/app/actions/discord";
import { WidgetsEditor } from "@/components/dashboard/widgets-editor";
import { getSettingsByProfileId } from "@/lib/data/settings";
import { isDiscordConnected } from "@/lib/discord/connection";
import { isDiscordOAuthConfigured } from "@/lib/discord/config";
import { fetchLanyardPresence } from "@/lib/discord/lanyard";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardWidgetsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  await sanitizeDiscordConnectionAction();
  await refreshDiscordProfileAction();
  const settings = await getSettingsByProfileId(userId);
  const connected = isDiscordConnected(settings);
  const onLanyard = connected
    ? Boolean(await fetchLanyardPresence(settings.discord_user_id))
    : false;

  return (
    <Suspense fallback={null}>
      <WidgetsEditor
        settings={settings}
        oauthConfigured={isDiscordOAuthConfigured()}
        onLanyard={onLanyard}
      />
    </Suspense>
  );
}
