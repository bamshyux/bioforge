import { createAdminClient } from "@/lib/supabase/admin";

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

const memoryBuckets = new Map<string, number[]>();

function checkMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const hits = (memoryBuckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    const retryAfterMs = Math.max(windowMs - (now - oldest), 1000);
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  hits.push(now);
  memoryBuckets.set(key, hits);
  return { ok: true };
}

async function checkDatabase(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult | "unavailable"> {
  const admin = createAdminClient();
  if (!admin) return "unavailable";

  const since = new Date(Date.now() - windowMs).toISOString();

  const { count, error: countError } = await admin
    .from("rate_limit_events")
    .select("*", { count: "exact", head: true })
    .eq("bucket_key", key)
    .gte("created_at", since);

  if (countError) {
    if (
      countError.message.includes("rate_limit_events") ||
      countError.code === "42P01" ||
      countError.code === "PGRST205"
    ) {
      return "unavailable";
    }
    return checkMemory(key, limit, windowMs);
  }

  if ((count ?? 0) >= limit) {
    const { data: oldest } = await admin
      .from("rate_limit_events")
      .select("created_at")
      .eq("bucket_key", key)
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const oldestMs = oldest?.created_at ? new Date(oldest.created_at).getTime() : Date.now();
    const retryAfterMs = Math.max(windowMs - (Date.now() - oldestMs), 1000);
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  const { error: insertError } = await admin.from("rate_limit_events").insert({ bucket_key: key });
  if (insertError) return checkMemory(key, limit, windowMs);

  return { ok: true };
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const dbResult = await checkDatabase(key, limit, windowMs);
  if (dbResult === "unavailable") return checkMemory(key, limit, windowMs);
  return dbResult;
}

export function formatRateLimitError(retryAfterSec: number): string {
  if (retryAfterSec < 60) {
    return `Too many attempts. Please wait ${retryAfterSec} second${retryAfterSec === 1 ? "" : "s"}.`;
  }
  const minutes = Math.ceil(retryAfterSec / 60);
  return `Too many attempts. Please wait ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

export async function assertRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<string | null> {
  const result = await checkRateLimit(key, limit, windowMs);
  if (result.ok) return null;
  return formatRateLimitError(result.retryAfterSec);
}

/** Shared limits used across the app */
export const RATE_LIMITS = {
  loginIp: { limit: 12, windowMs: 15 * 60 * 1000 },
  signupIp: { limit: 5, windowMs: 60 * 60 * 1000 },
  passwordResetIp: { limit: 4, windowMs: 60 * 60 * 1000 },
  passwordResetEmail: { limit: 3, windowMs: 60 * 60 * 1000 },
  guestbookUserHourly: { limit: 12, windowMs: 60 * 60 * 1000 },
  followUserHourly: { limit: 60, windowMs: 60 * 60 * 1000 },
  themePublishHourly: { limit: 5, windowMs: 60 * 60 * 1000 },
} as const;

export async function assertIpRateLimit(
  scope: string,
  ip: string | null | undefined,
  config: { limit: number; windowMs: number },
): Promise<string | null> {
  const bucket = `${scope}:ip:${ip ?? "unknown"}`;
  return assertRateLimit(bucket, config.limit, config.windowMs);
}

export async function assertUserRateLimit(
  scope: string,
  userId: string,
  config: { limit: number; windowMs: number },
): Promise<string | null> {
  const bucket = `${scope}:user:${userId}`;
  return assertRateLimit(bucket, config.limit, config.windowMs);
}
