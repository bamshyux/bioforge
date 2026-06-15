import { redirect } from "next/navigation";
import { ensureDefaultCustomTheme } from "@/app/actions/custom-themes";
import { CustomThemeEditor } from "@/components/dashboard/custom-theme-editor";
import { getCustomThemesByProfileId } from "@/lib/data/custom-themes";
import { getSettingsByProfileId } from "@/lib/data/settings";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardCustomThemePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  let themes = await getCustomThemesByProfileId(userId);

  if (themes.length === 0) {
    await ensureDefaultCustomTheme(userId);
    themes = await getCustomThemesByProfileId(userId);
  }

  const settings = await getSettingsByProfileId(userId);

  return <CustomThemeEditor themes={themes} settings={settings} />;
}
