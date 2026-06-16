"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HomeSection, HomeSectionHeader } from "@/components/home/home-section-header";
import type { LandingActivityItem } from "@/lib/types/landing";

const TYPE_LABELS: Record<LandingActivityItem["type"], string> = {
  profile_created: "New profile",
  theme_created: "Theme created",
  badge_earned: "Badge earned",
  milestone_reached: "Milestone",
  profile_updated: "Profile updated",
  link_added: "Link added",
  friend_added: "New friend",
};

const TYPE_COLORS: Record<LandingActivityItem["type"], string> = {
  profile_created: "bg-emerald-500/15 text-emerald-400",
  theme_created: "bg-violet-500/15 text-violet-400",
  badge_earned: "bg-amber-500/15 text-amber-400",
  milestone_reached: "bg-sky-500/15 text-sky-400",
  profile_updated: "bg-neutral-500/15 text-neutral-400",
  link_added: "bg-blue-500/15 text-blue-400",
  friend_added: "bg-pink-500/15 text-pink-400",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ActivityRow({ item }: { item: LandingActivityItem }) {
  const initial = item.username?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex items-start gap-3 border-b border-white/[0.04] px-4 py-3.5 last:border-0">
      {item.avatar_url ? (
        <Image
          src={item.avatar_url}
          alt=""
          width={32}
          height={32}
          className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-white/10"
          unoptimized
        />
      ) : (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-neutral-300 ring-1 ring-white/10">
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${TYPE_COLORS[item.type]}`}>
            {TYPE_LABELS[item.type]}
          </span>
          <span className="text-xs text-neutral-600">{timeAgo(item.created_at)}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-300">
          {item.username ? (
            <>
              <Link href={`/${item.username}`} className="font-medium text-white hover:underline">
                @{item.username}
              </Link>
              {" — "}
              {item.title}
            </>
          ) : (
            item.title
          )}
        </p>
      </div>
    </div>
  );
}

export function HomeActivityFeed({ items }: { items: LandingActivityItem[] }) {
  const [visible, setVisible] = useState(items);

  useEffect(() => {
    setVisible(items);
    const interval = setInterval(() => {
      setVisible((current) => {
        if (current.length < 2) return current;
        return [...current.slice(1), current[0]];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [items]);

  return (
    <HomeSection id="activity" withBorder>
      <HomeSectionHeader
        eyebrow="Live"
        title="Recent activity"
        description="See what's happening across cried.bio right now."
      />

      <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#141414]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="bf-home-pulse-dot h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Live feed</span>
        </div>
        <div className="max-h-[28rem] overflow-y-auto bf-home-activity-scroll">
          {visible.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-neutral-500">Activity will appear here as creators join.</p>
          ) : (
            visible.map((item) => <ActivityRow key={item.id} item={item} />)
          )}
        </div>
      </div>
    </HomeSection>
  );
}
