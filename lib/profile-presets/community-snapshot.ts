import { parsePresetData } from "@/lib/profile-presets/snapshot";
import type { ProfilePresetData } from "@/lib/types/profile-preset";

export function resolveCommunityPresetSnapshot(
  publishedPresetData: unknown,
  fallbackPresetData?: unknown,
): ProfilePresetData | null {
  const published = parsePresetData(publishedPresetData);
  if (published) return published;

  if (fallbackPresetData !== undefined) {
    return parsePresetData(fallbackPresetData);
  }

  return null;
}

export function resolveCommunityPresetThumbnail(
  listing: {
    preview_image_url?: string | null;
  },
  presetData: ProfilePresetData | null,
): string | null {
  const listingImage = listing.preview_image_url?.trim();
  if (listingImage) return listingImage;

  if (!presetData) return null;

  const bgImage = presetData.settings.background_image_url;
  if (typeof bgImage === "string" && bgImage.trim()) return bgImage;
  if (presetData.profile.banner_url) return presetData.profile.banner_url;
  if (presetData.profile.avatar_url) return presetData.profile.avatar_url;
  return null;
}
