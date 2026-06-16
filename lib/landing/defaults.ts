import type {
  LandingRoadmapItem,
  LandingTestimonial,
  LandingThemePreview,
} from "@/lib/types/landing";

export const DEFAULT_ROADMAP: Omit<LandingRoadmapItem, "id">[] = [
  { title: "Custom CSS themes", description: "Full scoped CSS editor with live preview.", status: "completed" },
  { title: "37 profile layouts", description: "Preset layouts from classic to aurora.", status: "completed" },
  { title: "Guestbooks & reactions", description: "Public guestbooks with moderation.", status: "completed" },
  { title: "Badge system", description: "Milestone and custom badges.", status: "completed" },
  { title: "Analytics dashboard", description: "Views, clicks, and daily charts.", status: "completed" },
  { title: "Theme marketplace", description: "Browse and install community themes.", status: "in_progress" },
  { title: "Custom domains", description: "Connect your own domain.", status: "planned" },
  { title: "API access", description: "Public API for integrations.", status: "planned" },
];

export const DEFAULT_TESTIMONIALS: Omit<LandingTestimonial, "id">[] = [
  {
    quote: "Finally a bio link page that doesn't look like everyone else's. The custom CSS editor is insane.",
    author_name: "Alex",
    author_title: "Digital artist",
    author_username: null,
    author_avatar_url: null,
  },
  {
    quote: "Switched from Linktree in five minutes. Analytics actually tell me what my audience clicks.",
    author_name: "Jordan",
    author_title: "Streamer",
    author_username: null,
    author_avatar_url: null,
  },
  {
    quote: "The guestbook and badge system make my page feel like a real community hub, not just a link dump.",
    author_name: "Sam",
    author_title: "Musician",
    author_username: null,
    author_avatar_url: null,
  },
];

export const DEFAULT_THEME_PREVIEWS: Omit<LandingThemePreview, "id">[] = [
  {
    name: "Midnight Glass",
    description: "Frosted panels with soft glow accents.",
    preview_style: "linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f0f 100%)",
    install_count: 1240,
  },
  {
    name: "Neon Pulse",
    description: "Electric borders and animated highlights.",
    preview_style: "linear-gradient(160deg, #0d0221 0%, #1a0533 45%, #050505 100%)",
    install_count: 980,
  },
  {
    name: "Clean Mono",
    description: "Minimal black & white with sharp typography.",
    preview_style: "linear-gradient(180deg, #111 0%, #1c1c1c 50%, #090909 100%)",
    install_count: 2100,
  },
  {
    name: "Aurora Fade",
    description: "Soft color washes and gradient backgrounds.",
    preview_style: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0c0a09 100%)",
    install_count: 760,
  },
];
