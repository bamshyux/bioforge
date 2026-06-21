import type { CardBorderEffectPreset, CardBorderTarget } from "@/lib/card-border-effects/types";

export const CARD_BORDER_EFFECT_OPTIONS: {
  value: CardBorderEffectPreset;
  label: string;
  description: string;
}[] = [
  { value: "none", label: "None", description: "No border effect" },
  { value: "standard", label: "Standard border", description: "Clean static outline" },
  { value: "neon-glow", label: "Neon Glow", description: "Soft glow wrapping the border" },
  { value: "snake", label: "Snake", description: "Light segment traveling the outline" },
  { value: "dual-snake", label: "Dual Snake", description: "Two segments moving opposite ways" },
  { value: "energy-flow", label: "Energy Flow", description: "Shifting light energy on the border" },
  { value: "pulse", label: "Pulse", description: "Border slowly brightens and fades" },
  { value: "lightning", label: "Lightning", description: "Electric sparks around the edges" },
  { value: "rgb-flow", label: "RGB Flow", description: "Animated gradient around the border" },
  { value: "white-aura", label: "White Aura", description: "Premium white glow with slow drift" },
  { value: "particle-trail", label: "Particle Trail", description: "Tiny particles along the border path" },
  { value: "liquid-chrome", label: "Liquid Chrome", description: "Metallic reflection moving around" },
  { value: "cyber-scan", label: "Cyber Scan", description: "Scanning line around the perimeter" },
  { value: "fire", label: "Fire", description: "Animated flame border" },
  { value: "ice", label: "Ice", description: "Frost energy border" },
  { value: "void", label: "Void", description: "Dark purple shadow energy" },
];

export const CARD_BORDER_TARGET_OPTIONS: {
  value: CardBorderTarget;
  label: string;
}[] = [
  { value: "main", label: "Main profile card" },
  { value: "discord", label: "Discord widget" },
  { value: "roblox", label: "Roblox embed" },
  { value: "spotify", label: "Spotify card" },
  { value: "links", label: "Link cards" },
  { value: "guestbook", label: "Guestbook" },
];
