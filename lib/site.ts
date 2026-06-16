export const SITE_HOST = "cried.bio";
export const SITE_URL = `https://${SITE_HOST}`;

export const DISCORD_COMMUNITY_INVITE_URL = "https://discord.gg/UKhDRUfR5v";

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return process.env.NODE_ENV === "production" ? SITE_URL : "http://localhost:3000";
}
