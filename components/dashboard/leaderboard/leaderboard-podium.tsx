"use client";

import Link from "next/link";
import type { LeaderboardEntry, LeaderboardTab } from "@/lib/types/leaderboard";
import { LeaderboardAvatar, formatStat } from "./leaderboard-shared";

export function LeaderboardPodium({
  entries,
  tab,
  currentUserId,
}: {
  entries: LeaderboardEntry[];
  tab: LeaderboardTab;
  currentUserId: string;
}) {
  if (!entries.length) return null;

  const ordered = [
    entries.find((e) => e.rank === 2),
    entries.find((e) => e.rank === 1),
    entries.find((e) => e.rank === 3),
  ].filter(Boolean) as LeaderboardEntry[];

  return (
    <div className="bf-leaderboard-podium relative mb-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#161616] to-[#0d0d0d] p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bf-leaderboard-podium-glow" />
      <div className="relative mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Top creators</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Podium</h2>
      </div>

      <div className="relative grid grid-cols-3 items-end gap-3 sm:gap-6">
        {ordered.map((entry) => (
          <PodiumSlot key={entry.id} entry={entry} tab={tab} currentUserId={currentUserId} />
        ))}
      </div>
    </div>
  );
}

function PodiumSlot({
  entry,
  tab,
  currentUserId,
}: {
  entry: LeaderboardEntry;
  tab: LeaderboardTab;
  currentUserId: string;
}) {
  const isFirst = entry.rank === 1;
  const medal =
    entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉";
  const slotClass =
    entry.rank === 1
      ? "bf-leaderboard-podium-first"
      : entry.rank === 2
        ? "bf-leaderboard-podium-second"
        : "bf-leaderboard-podium-third";

  return (
    <div
      className={`bf-leaderboard-podium-slot group flex flex-col items-center text-center ${slotClass} ${isFirst ? "order-2 -mt-2 sm:-mt-4" : entry.rank === 2 ? "order-1" : "order-3"}`}
    >
      <span className="mb-2 text-2xl sm:text-3xl" aria-hidden>
        {medal}
      </span>

      <Link
        href={`/${entry.username}`}
        target="_blank"
        rel="noreferrer"
        className="relative mb-3 transition-transform hover:scale-105"
      >
        <div className={`rounded-full p-1 ${entry.rank === 1 ? "bg-gradient-to-br from-amber-300/40 to-amber-600/20" : entry.rank === 2 ? "bg-gradient-to-br from-neutral-200/30 to-neutral-500/20" : "bg-gradient-to-br from-orange-400/30 to-orange-800/20"}`}>
          <LeaderboardAvatar
            entry={entry}
            size={isFirst ? 88 : 72}
            className="ring-0"
          />
        </div>
        <span className="absolute -bottom-1 left-1/2 flex h-7 min-w-7 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#111] px-2 text-xs font-bold text-white">
          #{entry.rank}
        </span>
      </Link>

      <Link
        href={`/${entry.username}`}
        target="_blank"
        rel="noreferrer"
        className="truncate max-w-full text-sm font-semibold text-white hover:text-[var(--bf-accent)]"
      >
        {entry.display_name}
      </Link>
      <p className="truncate max-w-full font-mono text-[10px] text-neutral-500 sm:text-xs">
        @{entry.username}
      </p>

      <div className="mt-3 space-y-1 text-xs text-neutral-400">
        {tab === "views" ? (
          <p>
            <span className="text-base font-bold text-white">{formatStat(entry.views)}</span>
            <span className="ml-1">views</span>
          </p>
        ) : (
          <>
            <p>
              <span className="text-base font-bold text-white">{formatStat(entry.followers)}</span>
              <span className="ml-1">followers</span>
            </p>
            <p className="text-[11px] text-neutral-500">{formatStat(entry.views)} views</p>
          </>
        )}
      </div>

      {currentUserId !== entry.id ? (
        <div className="mt-3 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/${entry.username}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-medium text-[var(--bf-accent)] hover:underline"
          >
            View profile →
          </Link>
        </div>
      ) : null}

      <div
        className={`mt-4 w-full rounded-t-xl ${entry.rank === 1 ? "h-24 bg-gradient-to-t from-amber-500/20 to-amber-400/5 sm:h-28" : entry.rank === 2 ? "h-16 bg-gradient-to-t from-neutral-400/15 to-neutral-300/5 sm:h-20" : "h-12 bg-gradient-to-t from-orange-600/20 to-orange-500/5 sm:h-16"}`}
      />
    </div>
  );
}
