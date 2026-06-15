import { PROFILE_THEME_SCOPE } from "@/lib/themes/default-template";
import { isBlockedSelector, validateCssInput } from "@/lib/themes/sanitize-css";

type ParsedBlock =
  | { kind: "rule"; selectors: string; body: string }
  | { kind: "at"; prelude: string; body: string; name: string };

function splitTopLevelBlocks(css: string): string[] {
  const blocks: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        blocks.push(css.slice(start, i + 1));
        start = i + 1;
      }
    }
  }

  const tail = css.slice(start).trim();
  if (tail) blocks.push(tail);
  return blocks.filter((b) => b.trim());
}

function parseBlock(block: string): ParsedBlock | null {
  const trimmed = block.trim();
  const open = trimmed.indexOf("{");
  if (open === -1) return null;

  const prelude = trimmed.slice(0, open).trim();
  const body = trimmed.slice(open + 1, -1).trim();

  if (prelude.startsWith("@")) {
    const name = prelude.match(/^@([\w-]+)/)?.[1]?.toLowerCase() ?? "";
    return { kind: "at", prelude, body, name };
  }

  return { kind: "rule", selectors: prelude, body };
}

function prefixSelectors(selectors: string, scope: string, errors: string[]): string | null {
  const parts = selectors.split(",").map((s) => s.trim()).filter(Boolean);
  const scoped: string[] = [];

  for (const part of parts) {
    if (isBlockedSelector(part)) {
      errors.push(`Blocked selector: ${part}`);
      continue;
    }
    scoped.push(`${scope} ${part}`);
  }

  return scoped.length ? scoped.join(", ") : null;
}

function scopeBlock(block: ParsedBlock, scope: string, errors: string[]): string {
  if (block.kind === "at") {
    if (block.name === "keyframes") {
      return `${block.prelude} { ${block.body} }`;
    }
    if (block.name === "media" || block.name === "supports") {
      const inner = scopeStylesheet(block.body, scope, errors);
      return `${block.prelude} { ${inner} }`;
    }
    errors.push(`Blocked at-rule: ${block.prelude.split(/\s/)[0]}`);
    return "";
  }

  const prefixed = prefixSelectors(block.selectors, scope, errors);
  if (!prefixed) return "";
  return `${prefixed} { ${block.body} }`;
}

function scopeStylesheet(css: string, scope: string, errors: string[]): string {
  const blocks = splitTopLevelBlocks(css);
  const output: string[] = [];

  for (const raw of blocks) {
    const parsed = parseBlock(raw);
    if (!parsed) continue;
    const scoped = scopeBlock(parsed, scope, errors);
    if (scoped) output.push(scoped);
  }

  return output.join("\n");
}

export function scopeProfileCss(
  rawCss: string,
  scopeClass = PROFILE_THEME_SCOPE,
): { css: string; errors: string[] } {
  const validated = validateCssInput(rawCss);
  if (!validated.ok) return { css: "", errors: [validated.error] };
  if (!validated.css) return { css: "", errors: [] };

  const scope = `.${scopeClass}`;
  const errors: string[] = [];
  const css = scopeStylesheet(validated.css, scope, errors);
  return { css, errors };
}
