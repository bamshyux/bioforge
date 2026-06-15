/** Resolve Discord / Lanyard activity asset keys to a CDN URL. */
export function resolveActivityAssetUrl(
  asset?: string | null,
  applicationId?: string | null,
): string | null {
  if (!asset) return null;

  if (asset.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${asset.slice("spotify:".length)}`;
  }

  if (asset.startsWith("mp:external/")) {
    const encoded = asset.slice("mp:external/".length);
    try {
      const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
      const binary =
        typeof Buffer !== "undefined"
          ? Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
          : atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
      return binary.startsWith("http") ? binary : null;
    } catch {
      return null;
    }
  }

  if (applicationId && /^\d+$/.test(applicationId) && asset) {
    return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.png?size=128`;
  }

  return null;
}

export function getActivityTypeLabel(type?: number): string {
  switch (type) {
    case 0:
      return "Playing";
    case 1:
      return "Streaming";
    case 2:
      return "Listening to";
    case 3:
      return "Watching";
    case 4:
      return "Custom Status";
    case 5:
      return "Competing in";
    default:
      return "Playing";
  }
}
