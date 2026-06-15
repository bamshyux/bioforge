import { redirect } from "next/navigation";
import { ThemesPageShell } from "@/components/dashboard/themes-editor";
import { getCustomThemesByProfileId } from "@/lib/data/custom-themes";
import { getSettingsByProfileId } from "@/lib/data/settings";
import { createClient } from "@/lib/supabase/server";

export default async function ThemesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  const [settings, themes] = await Promise.all([
    getSettingsByProfileId(userId),
    getCustomThemesByProfileId(userId),
  ]);
  return <ThemesPageShell settings={settings} themes={themes} />;
}
