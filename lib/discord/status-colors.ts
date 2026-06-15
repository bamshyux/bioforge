import type { DiscordPresenceStatus } from "@/lib/discord/types";

export function getDiscordStatusColor(status: DiscordPresenceStatus) {
  switch (status) {
    case "online":
      return "#23a559";
    case "idle":
      return "#f0b232";
    case "dnd":
      return "#f23f43";
    default:
      return "#80848e";
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
