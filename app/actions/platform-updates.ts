"use server";

import { revalidatePath } from "next/cache";
import { logAdminAudit } from "@/lib/admin/audit";
import { requireAdminAccess } from "@/lib/auth/admin-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { PlatformUpdateFormState } from "@/lib/types/platform-update";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

async function guard() {
  const access = await requireAdminAccess("admin");
  if ("error" in access) return { error: access.error } as const;
  return { access } as const;
}

async function db() {
  return createAdminClient() ?? (await createClient());
}

async function uploadUpdateAsset(
  file: File,
  prefix: "images" | "icons",
): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Images must be JPEG, PNG, WebP, GIF, or SVG.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Images must be 5 MB or smaller.");
  }

  const extension =
    file.type.split("/")[1]?.replace("jpeg", "jpg").replace("svg+xml", "svg") ?? "png";
  const path = `${prefix}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("platform-updates")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("platform-updates").getPublicUrl(path);
  return `${publicUrl}?v=${Date.now()}`;
}

function revalidateUpdates() {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/admin/updates");
}

export async function createPlatformUpdateAction(
  _prev: PlatformUpdateFormState,
  formData: FormData,
): Promise<PlatformUpdateFormState> {
  const gate = await guard();
  if ("error" in gate) return { error: gate.error };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const is_active = formData.get("is_active") !== "false";
  const imageFile = formData.get("image") as File | null;
  const iconFile = formData.get("icon") as File | null;

  if (!title) return { error: "Title is required." };
  if (!body) return { error: "Update message is required." };

  let image_url: string | null = null;
  let icon_url: string | null = null;

  try {
    if (imageFile && imageFile.size > 0) {
      image_url = await uploadUpdateAsset(imageFile, "images");
    }
    if (iconFile && iconFile.size > 0) {
      icon_url = await uploadUpdateAsset(iconFile, "icons");
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const supabase = await db();
  const { error } = await supabase.from("platform_updates").insert({
    title,
    body,
    image_url,
    icon_url,
    is_active,
    created_by: gate.access.userId,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  await logAdminAudit({
    actorId: gate.access.userId,
    actorEmail: gate.access.email,
    action: "platform_update_created",
    details: { title },
  });

  revalidateUpdates();
  return { success: "Update published." };
}

export async function deletePlatformUpdateAction(
  id: string,
  _formData?: FormData,
): Promise<void> {
  const gate = await guard();
  if ("error" in gate) throw new Error(gate.error);

  const supabase = await db();
  const { error } = await supabase.from("platform_updates").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAdminAudit({
    actorId: gate.access.userId,
    actorEmail: gate.access.email,
    action: "platform_update_deleted",
    details: { id },
  });

  revalidateUpdates();
}

export async function clearAllPlatformUpdatesAction(
  _prev: PlatformUpdateFormState,
  _formData?: FormData,
): Promise<PlatformUpdateFormState> {
  const gate = await guard();
  if ("error" in gate) return { error: gate.error };

  const supabase = await db();
  const { error } = await supabase.from("platform_updates").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) return { error: error.message };

  await logAdminAudit({
    actorId: gate.access.userId,
    actorEmail: gate.access.email,
    action: "platform_updates_cleared",
    details: {},
  });

  revalidateUpdates();
  return { success: "All updates cleared." };
}
