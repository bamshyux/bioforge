import type { ParsedEmbed } from "@/lib/types/embed";

export function buildRobloxProfileUrl(embedId: string): string {
  if (/^\d+$/.test(embedId)) {
    return `https://www.roblox.com/users/${embedId}/profile`;
  }
  return `https://www.roblox.com/users/profile?username=${encodeURIComponent(embedId)}`;
}

export async function enrichRobloxProfileEmbed(parsed: ParsedEmbed): Promise<ParsedEmbed> {
  if (parsed.embed_type !== "roblox_profile") return parsed;

  try {
    const isUserId = /^\d+$/.test(parsed.embed_id);
    let userId = isUserId ? parsed.embed_id : null;
    let username = isUserId ? null : parsed.embed_id;

    if (!userId && username) {
      const res = await fetch("https://users.roblox.com/v1/usernames/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = (await res.json()) as {
          data?: Array<{ id?: number; name?: string; requestedUsername?: string }>;
        };
        const match = json.data?.[0];
        if (match?.id) {
          userId = String(match.id);
          username = match.name ?? username;
        }
      }
    } else if (userId) {
      const res = await fetch(`https://users.roblox.com/v1/users/${userId}`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = (await res.json()) as { name?: string };
        username = json.name ?? username;
      }
    }

    const embedId = userId ?? parsed.embed_id;
    const title = username ? `Roblox · @${username}` : parsed.title;

    return {
      ...parsed,
      embed_id: embedId,
      title,
      url: buildRobloxProfileUrl(embedId),
    };
  } catch {
    return parsed;
  }
}

export function isRobloxLinkEmbed(type: string): type is "roblox" | "roblox_profile" {
  return type === "roblox" || type === "roblox_profile";
}

export function robloxEmbedLinkLabel(type: string): string {
  return type === "roblox_profile" ? "View profile on Roblox →" : "Play on Roblox →";
}
