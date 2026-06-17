import type { ProfileSettings } from "@/lib/types/settings";

/** Page + enter-gate background fields stored in presets. */
export const BACKGROUND_PRESET_KEYS = [
  "background_type",
  "background_color",
  "background_image_url",
  "background_video_url",
  "gradient_colors",
  "animated_gradient",
  "particle_effect",
  "overlay_opacity",
  "vignette",
  "noise_texture",
  "enter_gate_background_type",
  "enter_gate_background_color",
  "enter_gate_background_image_url",
  "enter_gate_background_video_url",
  "enter_gate_gradient_colors",
  "enter_gate_animated_gradient",
  "enter_gate_overlay_opacity",
  "enter_gate_vignette",
  "enter_gate_noise",
  "enter_gate_particle_effect",
] as const satisfies readonly (keyof ProfileSettings)[];

function cleanUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function parseJsonArrayField(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    if (!value.trim()) return fallback;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      const split = value.split(",").map((c) => c.trim()).filter(Boolean);
      if (split.length) return split;
    }
  }
  return fallback;
}

/** Normalize background fields so presets save/restore media reliably. */
export function normalizePresetBackgroundSettings(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...input };

  result.background_image_url = cleanUrl(result.background_image_url);
  result.background_video_url = cleanUrl(result.background_video_url);
  result.enter_gate_background_image_url = cleanUrl(result.enter_gate_background_image_url);
  result.enter_gate_background_video_url = cleanUrl(result.enter_gate_background_video_url);

  result.gradient_colors = parseJsonArrayField(result.gradient_colors, ["#090909", "#141414", "#1a1a1a"]);
  result.enter_gate_gradient_colors = parseJsonArrayField(result.enter_gate_gradient_colors, [
    "#090909",
    "#141414",
    "#1a1a1a",
  ]);

  if (result.background_video_url) {
    result.background_type = "video";
  } else if (result.background_image_url) {
    result.background_type = "image";
  } else if (result.particle_effect && result.background_type !== "animated_gradient") {
    result.background_type = "particles";
  }

  if (result.enter_gate_background_video_url) {
    result.enter_gate_background_type = "video";
  } else if (result.enter_gate_background_image_url) {
    result.enter_gate_background_type = "image";
  }

  return result;
}

export function pickBackgroundPresetSettings(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const normalized = normalizePresetBackgroundSettings(input);
  const picked: Record<string, unknown> = {};
  for (const key of BACKGROUND_PRESET_KEYS) {
    picked[key] = normalized[key] ?? null;
  }
  return picked;
}

export const BACKGROUND_PRESET_SELECT = BACKGROUND_PRESET_KEYS.join(",");
