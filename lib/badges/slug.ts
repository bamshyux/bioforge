import type { SupabaseClient } from "@supabase/supabase-js";

export function slugifyBadgeName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return slug || "custom-badge";
}

export async function resolveUniqueBadgeSlug(
  supabase: SupabaseClient,
  name: string,
  preferred?: string,
): Promise<string> {
  const base = slugifyBadgeName(preferred?.trim() || name);
  let candidate = base;
  let suffix = 2;

  while (suffix <= 100) {
    const { data } = await supabase.from("badges").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return `${base}-${Date.now()}`;
}
