import type { PlatformUpdate } from "@/lib/types/platform-update";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function db() {
  return createAdminClient() ?? (await createClient());
}

function mapUpdates(rows: Record<string, unknown>[]): PlatformUpdate[] {
  return rows.map((row) => {
    const profiles = row.profiles as { username: string | null; display_name: string | null } | null;
    const { profiles: _p, ...rest } = row;
    return {
      ...(rest as PlatformUpdate),
      author: profiles
        ? { username: profiles.username, display_name: profiles.display_name }
        : undefined,
    };
  });
}

export async function getActivePlatformUpdates(): Promise<PlatformUpdate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_updates")
    .select("id, title, body, image_url, icon_url, is_active, created_by, created_at, updated_at, profiles:created_by(username, display_name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return mapUpdates((data ?? []) as Record<string, unknown>[]);
}

export async function listPlatformUpdates(): Promise<PlatformUpdate[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("platform_updates")
    .select("id, title, body, image_url, icon_url, is_active, created_by, created_at, updated_at, profiles:created_by(username, display_name)")
    .order("created_at", { ascending: false });

  return mapUpdates((data ?? []) as Record<string, unknown>[]);
}
