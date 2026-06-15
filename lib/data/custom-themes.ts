import { createClient } from "@/lib/supabase/server";
import type { CustomTheme } from "@/lib/types/custom-theme";

export async function getCustomThemesByProfileId(profileId: string): Promise<CustomTheme[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("custom_themes")
    .select("*")
    .eq("profile_id", profileId)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as CustomTheme[];
}

export async function getCustomThemeById(
  themeId: string,
  profileId?: string,
): Promise<CustomTheme | null> {
  const supabase = await createClient();
  let query = supabase.from("custom_themes").select("*").eq("id", themeId);
  if (profileId) query = query.eq("profile_id", profileId);

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data as CustomTheme;
}

export async function getActiveCustomTheme(
  profileId: string,
  themeId: string | null,
): Promise<CustomTheme | null> {
  if (!themeId) return null;
  return getCustomThemeById(themeId, profileId);
}
