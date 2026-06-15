import type { BadgeRarity } from "@/lib/types/badge";
import { RARITY_STYLES } from "@/lib/types/badge";

type IconProps = { size?: number; color?: string; className?: string };

function Svg({ size = 16, children, className = "" }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      {children}
    </svg>
  );
}

const paths: Record<string, (p: IconProps) => React.ReactNode> = {
  verified: (p) => (
    <Svg {...p}>
      <path
        d="M12 2.8 6.2 5.4v5.9c0 4.1 2.7 7.9 5.8 8.7 3.1-.8 5.8-4.6 5.8-8.7V5.4L12 2.8z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.2 11.1 14.2 15.1 10.2"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  developer: (p) => (
    <Svg {...p}>
      <path d="M8 9 4 12l4 3M16 9l4 3-4 3M14 6l-4 12" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  staff: (p) => (
    <Svg {...p}>
      <rect x="4" y="8" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  moderator: (p) => (
    <Svg {...p}>
      <path d="M12 3 4 7v6c0 4.5 3.5 7.5 8 8 4.5-.5 8-3.5 8-8V7l-8-4z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  creator: (p) => (
    <Svg {...p}>
      <rect x="4" y="8" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="13.5" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M9 5h6v3H9V5z" stroke="currentColor" strokeWidth="1.85" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="1.1" fill="currentColor" />
    </Svg>
  ),
  partner: (p) => (
    <Svg {...p}>
      <path
        d="M7.5 14.5a3 3 0 1 0 0-6h1.8M16.5 14.5a3 3 0 1 1 0-6h-1.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M11.2 11.5h1.6M10 9.5 12 7.5 14 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  premium: (p) => (
    <Svg {...p}>
      <path
        d="M5 8l7-4 7 4-7 13L5 8z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  founder: (p) => (
    <Svg {...p}>
      <path
        d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 2z"
        fill="currentColor"
        fillOpacity="0.24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  ),
  donor: (p) => (
    <Svg {...p}>
      <rect x="5" y="10" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M5 10h14M12 10V7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7.5c-1.2-2-3.3-1.5-3.3.4.1 1.2 1.4 1.8 3.3 3.1 1.9-1.3 3.2-1.9 3.3-3.1 0-1.9-2.1-2.4-3.3-.4z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  ),
  supporter: (p) => (
    <Svg {...p}>
      <path d="M5 10 9.5 8v9L5 15V10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.5 10.5H12c2.2 0 4 1.4 4 3.2S14.2 17 12 17H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 11.5v4M18.5 12v3" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
    </Svg>
  ),
  helper: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  "bug-hunter": (p) => (
    <Svg {...p}>
      <ellipse cx="12" cy="14" rx="5" ry="6" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7 10H4M20 10h-3M7 14H4M20 14h-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  contributor: (p) => (
    <Svg {...p}>
      <path d="M6 18 12 6l6 12H6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  "community-choice": (p) => (
    <Svg {...p}>
      <circle cx="12" cy="10" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.2v2.8l1.8 1" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 18.5 12 16l3.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 21h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  ),
  og: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="14.8" textAnchor="middle" fill="currentColor" fontSize="7.5" fontWeight="800" fontFamily="system-ui, sans-serif">
        OG
      </text>
    </Svg>
  ),
  "year-one": (p) => (
    <Svg {...p}>
      <path d="M6 14c0-4 2.7-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.5 7.5 12 4l3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4v6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.4" fill="currentColor" />
    </Svg>
  ),
  "followers-100": (p) => (
    <Svg {...p}>
      <circle cx="9" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.85" />
      <circle cx="15.5" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.85" />
      <path d="M5.5 18.5c0-2.8 1.8-4.5 3.5-4.5s3.5 1.7 3.5 4.5M13 18.5c0-2.2 1.2-3.5 2.5-3.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
      <path d="M16.5 8.5h3.5v3.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
      <text x="17.2" y="11.2" textAnchor="middle" fill="currentColor" fontSize="4.5" fontWeight="700">100</text>
    </Svg>
  ),
  "account-1yr": (p) => (
    <Svg {...p}>
      <rect x="5" y="6" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M5 10h14M9 4v3M15 4v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 14.5 11.3 16.3 15 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  "views-100": (p) => (
    <Svg {...p}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="21" textAnchor="middle" fill="currentColor" fontSize="5.5" fontWeight="700">100</text>
    </Svg>
  ),
  "views-1k": (p) => (
    <Svg {...p}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="21" textAnchor="middle" fill="currentColor" fontSize="5.5" fontWeight="700">1K</text>
    </Svg>
  ),
  "views-10k": (p) => (
    <Svg {...p}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="21" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="700">10K</text>
    </Svg>
  ),
  "views-100k": (p) => (
    <Svg {...p}>
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <text x="12" y="21" textAnchor="middle" fill="currentColor" fontSize="4.5" fontWeight="700">100K</text>
    </Svg>
  ),
  champion: (p) => (
    <Svg {...p}>
      <path d="M6 9H4a2 2 0 0 0-2 2v2h6V9zM20 9h-2a2 2 0 0 0-2 2v2h6v-2a2 2 0 0 0-2-2zM8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 9h8v5a4 4 0 0 1-8 0V9z" stroke="currentColor" strokeWidth="1.75" />
    </Svg>
  ),
  "runner-up": (p) => (
    <Svg {...p}>
      <circle cx="12" cy="13" r="6" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 7V4M9 4h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  finalist: (p) => (
    <Svg {...p}>
      <path d="M12 4 8 10h8l-4-6zM6 10v10h12V10H6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  "tournament-winner": (p) => (
    <Svg {...p}>
      <path d="M8 21h8M12 17v4M7 4h10l-1 8H8L7 4z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  "halloween-2026": (p) => (
    <Svg {...p}>
      <path d="M12 4c-3 0-5 2-5 5v3H5v2h14v-2h-2v-3c0-3-2-5-5-5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="1" fill="currentColor" /><circle cx="14" cy="10" r="1" fill="currentColor" />
    </Svg>
  ),
  "christmas-2026": (p) => (
    <Svg {...p}>
      <path d="M12 3 6 14h12L12 3zM9 14h6v7H9v-7z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </Svg>
  ),
  "new-year-2027": (p) => (
    <Svg {...p}>
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  "summer-2026": (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
  custom: (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  ),
};

export function BadgeIcon({
  slug,
  iconUrl,
  size = 14,
  color = "currentColor",
  className = "",
  monochrome = false,
  sharp = false,
}: {
  slug: string;
  iconUrl?: string | null;
  size?: number;
  color?: string;
  className?: string;
  monochrome?: boolean;
  sharp?: boolean;
}) {
  const glyphClass = sharp ? `bf-badge-glyph ${className}`.trim() : className;

  if (iconUrl && monochrome) {
    return (
      <span
        className={`inline-block shrink-0 ${glyphClass}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          WebkitMaskImage: `url(${iconUrl})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: `url(${iconUrl})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        }}
        aria-hidden
      />
    );
  }

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className={`inline-block shrink-0 object-contain ${glyphClass}`}
        aria-hidden
      />
    );
  }

  const Icon = paths[slug] ?? paths.custom;
  return (
    <span className={`inline-flex shrink-0 ${glyphClass}`} style={{ color }}>
      {Icon({ size, color, className: glyphClass })}
    </span>
  );
}

export function rarityClass(rarity: BadgeRarity) {
  return RARITY_STYLES[rarity] ?? RARITY_STYLES.common;
}
