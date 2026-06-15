import type { DiscordPresenceStatus } from "@/lib/discord/types";

export function getDiscordStatusColor(status: DiscordPresenceStatus) {
  switch (status) {
    case "online":
      return "#43b581";
    case "idle":
      return "#faa61a";
    case "dnd":
      return "#f04747";
    default:
      return "#747f8d";
  }
}

export function getDiscordStatusLabel(status: DiscordPresenceStatus) {
  switch (status) {
    case "online":
      return "Online";
    case "idle":
      return "Idle";
    case "dnd":
      return "Do Not Disturb";
    default:
      return "Offline";
  }
}
