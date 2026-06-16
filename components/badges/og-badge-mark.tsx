import type { ReactNode } from "react";

function parseHexColor(hex: string) {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return { r: 0, g: 104, b: 94 };
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function isLightHex(hex: string) {
  const { r, g, b } = parseHexColor(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

export function ogBadgePalette(color: string) {
  if (isLightHex(color)) {
    return {
      fill: "#d4d4d8",
      letter: "#18181b",
      border: "#52525b",
    };
  }

  return {
    fill: color,
    letter: "#ffffff",
    border: "#ffffff",
  };
}

/** Block-letter OG inside a vertical hexagon. */
export function OgBadgeMark({
  fill,
  letter,
  border,
}: {
  fill: string;
  letter: string;
  border: string;
}): ReactNode {
  return (
    <>
      <path
        d="M12 2.1 19.9 6.62v10.76L12 21.9 4.1 17.38V6.62Z"
        fill={fill}
        stroke={border}
        strokeWidth="1.05"
        strokeLinejoin="round"
      />
      <path
        fill={letter}
        fillRule="evenodd"
        d="M12 4.35 6.15 7.45v9.1L12 19.65V4.35 M8.55 8.15h1.55v7.7H8.55V8.15"
      />
      <rect x="11.35" y="4.35" width="1.3" height="15.3" fill={letter} />
      <path
        fill={letter}
        fillRule="evenodd"
        d="M12 4.35l5.85 3.1v9.1L12 19.65V4.35 M13.85 8.15h2.4v7.7h-2.4v-2.3h1.2v-1.1h-1.2V8.15"
      />
    </>
  );
}

export function OgBadgeMarkFromColor({ color }: { color: string }): ReactNode {
  const palette = ogBadgePalette(color);
  return <OgBadgeMark {...palette} />;
}
