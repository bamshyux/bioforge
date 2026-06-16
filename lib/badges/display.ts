import type { ProfileBadge } from "@/lib/types/badge";
import type { ProfileSettings } from "@/lib/types/settings";

export type BadgeColorSettings = Pick<
  ProfileSettings,
  | "show_badges"
  | "badge_display_limit"
  | "badges_monochrome"
  | "badges_custom_monochrome"
  | "text_color"
>;

export type BadgeStyleOptions = {
  /** Monochrome default/catalog badges */
  monochrome?: boolean;
  /** Monochrome custom admin-created badges */
  monochromeCustom?: boolean;
  /** Applied when a badge is monochrome — uses profile text color from Customize */
  color?: string;
  /** Subtle color-matched glow around badge seals */
  glow?: boolean;
};

/** Color used for badges when monochrome mode is enabled */
export function getMonochromeBadgeColor(
  settings: Pick<ProfileSettings, "text_color">,
): string {
  return settings.text_color;
}

export function shouldMonochromeBadge(
  badge: Pick<ProfileBadge, "category">,
  settings: Pick<ProfileSettings, "badges_monochrome" | "badges_custom_monochrome">,
): boolean {
  if (badge.category === "custom") return settings.badges_custom_monochrome;
  return settings.badges_monochrome;
}

export function resolveBadgeMonochrome(
  badge: Pick<ProfileBadge, "category">,
  styleOptions?: BadgeStyleOptions,
): boolean {
  if (badge.category === "custom") return styleOptions?.monochromeCustom ?? false;
  return styleOptions?.monochrome ?? false;
}

export function resolveBadgeColor(
  badge: Pick<ProfileBadge, "category" | "color">,
  settings: Pick<ProfileSettings, "badges_monochrome" | "badges_custom_monochrome" | "text_color">,
): string {
  if (shouldMonochromeBadge(badge, settings)) return getMonochromeBadgeColor(settings);
  return badge.color;
}

export function buildBadgeStyleOptions(
  settings: Pick<
    ProfileSettings,
    "badges_monochrome" | "badges_custom_monochrome" | "text_color" | "badges_glow"
  >,
): BadgeStyleOptions {
  const anyMonochrome = settings.badges_monochrome || settings.badges_custom_monochrome;

  return {
    monochrome: settings.badges_monochrome,
    monochromeCustom: settings.badges_custom_monochrome,
    color: anyMonochrome ? getMonochromeBadgeColor(settings) : undefined,
    glow: settings.badges_glow ?? true,
  };
}

export function applyBadgeColorSettings(
  badges: ProfileBadge[],
  settings: Pick<ProfileSettings, "badges_monochrome" | "badges_custom_monochrome" | "text_color">,
): ProfileBadge[] {
  const monoColor = getMonochromeBadgeColor(settings);

  return badges.map((badge) => {
    if (!shouldMonochromeBadge(badge, settings)) return badge;
    return { ...badge, color: monoColor };
  });
}

/** Order and filter badges for public profile display */
export function preparePublicBadges(
  badges: ProfileBadge[],
  settings: BadgeColorSettings,
): ProfileBadge[] {
  if (!settings.show_badges) return [];

  const visible = badges.filter((b) => b.is_visible !== false);

  const sorted = [...visible].sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return new Date(a.assigned_at).getTime() - new Date(b.assigned_at).getTime();
  });

  const limit = settings.badge_display_limit;
  const limited = limit > 0 ? sorted.slice(0, limit) : sorted;
  return applyBadgeColorSettings(limited, settings);
}
