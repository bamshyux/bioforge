import { createClient } from "@/lib/supabase/server";
import { resolveCountry } from "@/lib/analytics/geo";
import { buildProfileViewHash } from "@/lib/analytics/view-identity";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type RecordProfileViewResult = {
  ok?: boolean;
  recorded?: boolean;
  deduplicated?: boolean;
  skipped?: boolean;
  error?: string;
};

export async function POST(request: Request) {
  let body: {
    profileId?: string;
    eventType?: string;
    linkId?: string;
    visitorHash?: string;
    sessionId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { profileId, eventType, linkId, visitorHash, sessionId } = body;

  if (!profileId || !eventType || !visitorHash) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (eventType !== "profile_view" && eventType !== "link_click") {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const headersList = await headers();
  const country = await resolveCountry(headersList);
  const supabase = await createClient();

  if (eventType === "profile_view") {
    const trackingHash = buildProfileViewHash(headersList, visitorHash);

    const { data, error } = await supabase.rpc("record_profile_view", {
      p_profile_id: profileId,
      p_visitor_hash: trackingHash,
      p_country: country.slice(0, 64),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = (data ?? {}) as RecordProfileViewResult;

    if (result.error === "profile_not_found") {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (result.recorded) {
      const { syncAllMilestoneBadges } = await import("@/lib/badges/sync-milestones");
      await syncAllMilestoneBadges(profileId);
    }

    return NextResponse.json({
      ok: true,
      recorded: !!result.recorded,
      deduplicated: !!result.deduplicated,
      skipped: !!result.skipped,
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .not("username", "is", null)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (linkId) {
    const { data: link } = await supabase
      .from("links")
      .select("id")
      .eq("id", linkId)
      .eq("profile_id", profileId)
      .maybeSingle();

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
  }

  const trackingHash = sessionId
    ? `${visitorHash}:${sessionId}`.slice(0, 128)
    : visitorHash.slice(0, 64);

  const { error } = await supabase.from("analytics_events").insert({
    profile_id: profileId,
    event_type: "link_click",
    link_id: linkId ?? null,
    visitor_hash: trackingHash,
    country: country.slice(0, 64),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
