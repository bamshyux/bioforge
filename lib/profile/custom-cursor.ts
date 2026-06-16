export const CUSTOM_CURSOR_SIZE_MIN = 16;
export const CUSTOM_CURSOR_SIZE_MAX = 128;
/** Default matches the original profile cursor size before auto-shrink. */
export const CUSTOM_CURSOR_SIZE_DEFAULT = 48;

export function clampCursorImageSize(value: unknown, fallback = CUSTOM_CURSOR_SIZE_DEFAULT): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(CUSTOM_CURSOR_SIZE_MAX, Math.max(CUSTOM_CURSOR_SIZE_MIN, Math.round(parsed)));
}
