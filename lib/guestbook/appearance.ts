import { cardBorderEffectStripsDefaultBorder } from "@/lib/card-border-effects/resolve";
import { buildCardStyle } from "@/lib/settings";
import type { GuestbookBorderStyle, GuestbookSpacing, ProfileSettings } from "@/lib/types/settings";

function clampPct(value: number, fallback: number): number {
  const n = Number.isFinite(value) ? value : fallback;
  return Math.min(100, Math.max(0, n)) / 100;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "").trim();
  if (h.length === 3) {
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  if (h.length === 6) {
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  return null;
}

function buildGuestbookCardStyle(settings: ProfileSettings): Record<string, string | number> {
  const borderRadius = settings.border_radius;
  const borderHandledExternally = cardBorderEffectStripsDefaultBorder(settings, "guestbook");

  const base: Record<string, string | number> = {
    borderRadius,
    border: borderHandledExternally ? "none" : "1px solid rgba(255,255,255,0.06)",
    boxShadow: borderHandledExternally ? "none" : "0 8px 32px rgba(0,0,0,0.4)",
  };

  if (!settings.guestbook_show_background) {
    return { ...base, backgroundColor: "transparent" };
  }

  const opacity = clampPct(settings.guestbook_opacity, 88);
  const blur = settings.guestbook_blur ?? 0;
  const rgb = settings.guestbook_background_color?.trim()
    ? hexToRgb(settings.guestbook_background_color)
    : null;
  const rgba = (alpha: number) =>
    rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : `rgba(20, 20, 20, ${alpha})`;

  if (settings.guestbook_glassmorphism) {
    const blurPx = blur > 0 ? blur : 8;
    return {
      ...base,
      backgroundColor: rgba(opacity * 0.85),
      backdropFilter: `blur(${blurPx}px)`,
      WebkitBackdropFilter: `blur(${blurPx}px)`,
    };
  }

  return {
    ...base,
    backgroundColor: rgba(opacity),
    ...(blur > 0
      ? { backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` }
      : {}),
  };
}

export function resolveGuestbookAppearance(settings: ProfileSettings): {
  borderStyle: GuestbookBorderStyle;
  spacing: GuestbookSpacing;
  style: Record<string, string | number>;
} {
  const borderStyle = settings.guestbook_border_style ?? "accent-left";
  const spacing = settings.guestbook_spacing ?? "default";
  const messageOpacity = clampPct(settings.guestbook_message_opacity, 50);

  const cssVars: Record<string, string> = {
    "--bf-guestbook-label-opacity": String(clampPct(settings.guestbook_label_opacity, 18)),
    "--bf-guestbook-message-opacity": String(messageOpacity),
    "--bf-guestbook-author-opacity": String(clampPct(settings.guestbook_author_opacity, 38)),
    "--bf-guestbook-pinned-opacity": String(Math.min(1, messageOpacity + 0.12)),
  };

  if (settings.guestbook_text_color?.trim()) {
    cssVars["--bf-guestbook-text-color"] = settings.guestbook_text_color.trim();
  }

  const paddingY = settings.guestbook_padding_y ?? 20;
  const cardStyle = settings.guestbook_use_profile_card
    ? { ...buildCardStyle(settings) }
    : buildGuestbookCardStyle(settings);

  if (cardBorderEffectStripsDefaultBorder(settings, "guestbook")) {
    cardStyle.border = "none";
    cardStyle.boxShadow = "none";
  }

  return {
    borderStyle,
    spacing,
    style: {
      ...cardStyle,
      ...cssVars,
      paddingTop: `${paddingY}px`,
      paddingBottom: `${paddingY}px`,
    },
  };
}
