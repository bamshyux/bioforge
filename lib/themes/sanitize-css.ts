import { MAX_CUSTOM_THEME_CSS_BYTES } from "@/lib/types/custom-theme";

const BLOCKED_PATTERNS: { pattern: RegExp; message: string }[] = [
  { pattern: /@import\b/i, message: "@import is not allowed" },
  { pattern: /@charset\b/i, message: "@charset is not allowed" },
  { pattern: /javascript\s*:/i, message: "javascript: URLs are not allowed" },
  { pattern: /expression\s*\(/i, message: "expression() is not allowed" },
  { pattern: /-moz-binding/i, message: "-moz-binding is not allowed" },
  { pattern: /\bbehavior\s*:/i, message: "behavior is not allowed" },
  { pattern: /url\s*\(\s*['"]?\s*data:/i, message: "data: URLs are not allowed" },
];

const GLOBAL_SELECTOR =
  /^(html|body|:root|\*|#(?:__next|root|app|main)|\[data-nextjs|\.bf-dash|\.bf-page)/i;

export function validateCssInput(css: string): { ok: true; css: string } | { ok: false; error: string } {
  const trimmed = css.trim();
  if (!trimmed) return { ok: true, css: "" };

  if (new TextEncoder().encode(trimmed).length > MAX_CUSTOM_THEME_CSS_BYTES) {
    return { ok: false, error: `CSS exceeds ${MAX_CUSTOM_THEME_CSS_BYTES / 1024}KB limit.` };
  }

  for (const { pattern, message } of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) return { ok: false, error: message };
  }

  return { ok: true, css: trimmed };
}

export function isBlockedSelector(selector: string): boolean {
  const trimmed = selector.trim();
  if (!trimmed) return true;
  if (GLOBAL_SELECTOR.test(trimmed)) return true;
  if (/^@/.test(trimmed)) return true;
  return false;
}
