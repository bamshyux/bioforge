export const LINKS_ICON_SIZE_MIN = 14;
export const LINKS_ICON_SIZE_MAX = 40;
export const DEFAULT_LINKS_ICON_SIZE = 24;

export function clampLinksIconSize(size: number) {
  if (!Number.isFinite(size)) return DEFAULT_LINKS_ICON_SIZE;
  return Math.min(LINKS_ICON_SIZE_MAX, Math.max(LINKS_ICON_SIZE_MIN, Math.round(size)));
}

export function getLinksIconBoxSize(iconSize: number) {
  return Math.max(36, iconSize + 20);
}

export function isCustomLinkIcon(icon: string) {
  return icon.startsWith("http://") || icon.startsWith("https://");
}

export function normalizeLinkIconKey(icon: string) {
  if (isCustomLinkIcon(icon)) return icon;
  return icon.toLowerCase().trim();
}

export function normalizeLinkUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function formatLinkHostname(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
