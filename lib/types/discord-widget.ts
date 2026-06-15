export type DiscordCardStyle = "discord" | "minimal" | "compact" | "pill";

export type DiscordCardTheme =
  | "discord_dark"
  | "glass"
  | "neon"
  | "accent"
  | "midnight";

export type DiscordCardRadius = "sharp" | "soft" | "round" | "pill";

export type DiscordCardWidth = "narrow" | "default" | "wide" | "full";

export type DiscordCardConfig = {
  style: DiscordCardStyle;
  theme: DiscordCardTheme;
  show_lanyard_hint: boolean;
  accent_color: string;
  background_color: string;
  background_opacity: number;
  border_color: string;
  border_width: number;
  border_radius: DiscordCardRadius;
  card_width: DiscordCardWidth;
  show_avatar: boolean;
  show_status_text: boolean;
  show_activity: boolean;
  glow: boolean;
  backdrop_blur: boolean;
};

export const DEFAULT_DISCORD_CARD_CONFIG: DiscordCardConfig = {
  style: "discord",
  theme: "discord_dark",
  show_lanyard_hint: false,
  accent_color: "",
  background_color: "",
  background_opacity: 100,
  border_color: "",
  border_width: 1,
  border_radius: "soft",
  card_width: "default",
  show_avatar: true,
  show_status_text: true,
  show_activity: true,
  glow: false,
  backdrop_blur: false,
};
