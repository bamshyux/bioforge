"use client";

import { createClient } from "@/lib/supabase/client";

const MAX_ICON_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function uploadLinkIconToStorage(file: File): Promise<string> {
  if (file.size === 0) {
    throw new Error("Please select a file.");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Icons must be JPEG, PNG, WebP, or GIF.");
  }

  if (file.size > MAX_ICON_SIZE) {
    throw new Error("Icons must be 2 MB or smaller.");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const path = `${user.id}/link-icons/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("profiles")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profiles").getPublicUrl(path);

  return `${publicUrl}?v=${Date.now()}`;
}
