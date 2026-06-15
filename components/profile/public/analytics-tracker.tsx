"use client";

import { useEffect } from "react";
import {
  getSessionId,
  getVisitorId,
  hasRecordedProfileView,
  markProfileViewRecorded,
} from "@/lib/analytics/visitor";

export function AnalyticsTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    if (hasRecordedProfileView(profileId)) return;

    const visitorHash = getVisitorId();

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        profileId,
        eventType: "profile_view",
        visitorHash,
      }),
    })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json().catch(() => null)) as { ok?: boolean } | null;
        if (data?.ok) markProfileViewRecorded(profileId);
      })
      .catch(() => {});
  }, [profileId]);

  return null;
}

export function trackLinkClick(profileId: string, linkId: string) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profileId,
      eventType: "link_click",
      linkId,
      visitorHash: getVisitorId(),
      sessionId: getSessionId(),
    }),
  }).catch(() => {});
}
