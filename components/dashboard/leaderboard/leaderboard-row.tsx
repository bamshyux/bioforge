"use client";

import Link from "next/link";
import type { LeaderboardEntry, LeaderboardTab } from "@/lib/types/leaderboard";
import { SITE_HOST } from "@/lib/site";
import { LeaderboardAvatar, formatStat } from "./leaderboard-shared";
import { LeaderboardFollowButton } from "./leaderboard-follow-button";
import { LeaderboardHoverPreview } from "./leaderboard-hover-preview";
import { LeaderboardRankBadge } from "./leaderboard-rank-badge";

export function LeaderboardRow({
  entry,
  tab,
  currentUserId,
  index,
}: {
  entry: LeaderboardEntry;
  tab: LeaderboardTab;
  currentUserId: string;
  index: number;
}) {
  const isTopThree = entry.rank <= 3;

  return (
    <div
      className={`bf-leaderboard-row group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isTopThree
          ? "border-white/[0.1] bg-gradient-to-r from-white/[0.04] to-transparent hover:border-white/[0.16]"
          : "border-white/[0.06] bg-[#0d0d0d]/90 hover:border-white/[0.12] hover:bg-[#121212]"
      }`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {isTopThree ? (
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-1 ${
            entry.rank === 1
              ? "bg-gradient-to-b from-amber-400/80 to-amber-600/20"
              : entry.rank === 2
                ? "bg-gradient-to-b from-neutral-200/70 to-neutral-500/20"
                : "bg-gradient-to-b from-orange-400/70 to-orange-700/20"
          }`}
        />
      ) : null}

      <div className="relative flex flex-wrap items-center gap-4 p-4 sm:gap-5 sm:p-5">
        <LeaderboardRankBadge rank={entry.rank} size={isTopThree ? "md" : "sm"} />

        <LeaderboardHoverPreview entry={entry} tab={tab}>
          <Link
            href={`/${entry.username}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 flex-1 items-center gap-4"
          >
            <LeaderboardAvatar entry={entry} size={50} className="transition-transform duration-300 group-hover:scale-105" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white group-hover:text-[#fafafa]">
                {entry.display_name}
              </p>
              <p className="truncate font-mono text-xs text-neutral-500">
                {SITE_HOST}/{entry.username}
              </p>
            </div>
          </Link>
        </LeaderboardHoverPreview>

        <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto sm:gap-5">
          <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
            {tab === "views" ? (
              <StatPill icon={<EyeIcon />} value={formatStat(entry.views)} label="views" />
            ) : (
              <>
                <StatPill icon={<UsersIcon />} value={formatStat(entry.followers)} label="followers" />
                <StatPill icon={<EyeIcon />} value={formatStat(entry.views)} label="views" muted />
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <LeaderboardFollowButton
              key={`${entry.id}-${entry.is_following}`}
              profileId={entry.id}
              initialFollowing={entry.is_following}
              currentUserId={currentUserId}
            />
            <Link
              href={`/${entry.username}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white"
            >
              View profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
  muted = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 ${
        muted
          ? "border-white/[0.04] bg-transparent text-neutral-500"
          : "border-white/[0.06] bg-white/[0.02] text-neutral-400"
      }`}
    >
      {icon}
      <span className="font-semibold text-neutral-200">{value}</span>
      {label}
    </span>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
