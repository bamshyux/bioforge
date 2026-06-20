import type { OgProfileSnapshot } from "@/lib/og/types";

const IMAGE_FETCH_TIMEOUT_MS = 8_000;

async function fetchAsDataUrl(url: string): Promise<string | null> {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(trimmed, {
      signal: controller.signal,
      headers: { "User-Agent": "cried.bio-og/1.0" },
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) return null;

    const bytes = await response.arrayBuffer();
    if (!bytes.byteLength) return null;

    const base64 = Buffer.from(bytes).toString("base64");
    return `data:${contentType.split(";")[0]};base64,${base64}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Inline remote images so Satori does not fail when fetching during render. */
export async function embedOgImages(
  snapshot: OgProfileSnapshot,
): Promise<OgProfileSnapshot> {
  const avatarPromise = snapshot.avatarUrl
    ? fetchAsDataUrl(snapshot.avatarUrl)
    : Promise.resolve(null);

  const backgroundPromise =
    snapshot.background.kind === "image"
      ? fetchAsDataUrl(snapshot.background.url)
      : Promise.resolve(null);

  const [avatarUrl, backgroundUrl] = await Promise.all([
    avatarPromise,
    backgroundPromise,
  ]);

  return {
    ...snapshot,
    avatarUrl: avatarUrl ?? snapshot.avatarUrl,
    background:
      snapshot.background.kind === "image" && backgroundUrl
        ? { kind: "image", url: backgroundUrl }
        : snapshot.background.kind === "image"
          ? { kind: "gradient", colors: ["#090909", "#141414", "#1a1a1a"] }
          : snapshot.background,
  };
}
