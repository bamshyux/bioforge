"use client";

import Link from "next/link";
import type { LeaderboardEntry, LeaderboardTab } from "@/lib/types/leaderboard";
import { LeaderboardAvatar, formatStat } from "./leaderboard-shared";
import { LeaderboardPodiumCrown, LeaderboardRankBadge } from "./leaderboard-rank-badge";

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
    <section className="bf-leaderboard-stage relative mb-8 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#0a0a0a]">
      <div className="bf-leaderboard-stage-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="bf-leaderboard-stage-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

      <p
        className="bf-leaderboard-watermark pointer-events-none absolute bottom-3 right-4 select-none font-mono text-[10px] tracking-[0.18em] text-white/[0.06] sm:bottom-4 sm:right-6 sm:text-[11px]"
        aria-hidden
      >
        cried.bio
      </p>

      <div className="relative px-4 pb-2 pt-5 sm:px-8 sm:pb-4 sm:pt-7">
        <div className="mb-2 flex items-center justify-center gap-2 sm:mb-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Top 3
          </p>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
        </div>

        <div className="relative grid grid-cols-3 items-end gap-1 sm:gap-4">
          {ordered.map((entry) => (
            <PodiumSlot key={entry.id} entry={entry} tab={tab} currentUserId={currentUserId} />
          ))}
        </div>
      </div>
    </section>
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
  const slotClass =
    entry.rank === 1
      ? "bf-leaderboard-podium-first"
      : entry.rank === 2
        ? "bf-leaderboard-podium-second"
        : "bf-leaderboard-podium-third";

  const ringClass =
    entry.rank === 1
      ? "from-amber-300/70 via-amber-500/30 to-amber-700/10 shadow-[0_0_40px_rgba(251,191,36,0.25)]"
      : entry.rank === 2
        ? "from-neutral-100/50 via-neutral-400/20 to-neutral-600/10 shadow-[0_0_28px_rgba(212,212,216,0.12)]"
        : "from-orange-400/50 via-orange-600/20 to-orange-900/10 shadow-[0_0_28px_rgba(251,146,60,0.15)]";

  return (
    <div
      className={`bf-leaderboard-podium-slot group relative flex flex-col items-center text-center ${slotClass} ${
        isFirst ? "z-10 -mt-1 sm:-mt-3" : "z-0"
      } ${entry.rank === 2 ? "order-1" : entry.rank === 1 ? "order-2" : "order-3"}`}
    >
      {isFirst ? (
        <LeaderboardPodiumCrown className="mb-1 sm:mb-2" />
      ) : (
        <div className="mb-1 h-6 sm:mb-2 sm:h-7" aria-hidden />
      )}

      <div className="relative mb-3 sm:mb-4">
        <LeaderboardRankBadge
          rank={entry.rank}
          size={isFirst ? "xl" : "lg"}
          className="relative z-10 mx-auto"
        />
      </div>

      <Link
        href={`/${entry.username}`}
        target="_blank"
        rel="noreferrer"
        className="relative mb-3 transition-transform duration-300 hover:scale-[1.04] sm:mb-4"
      >
        <div
          className={`rounded-full bg-gradient-to-br p-[3px] ${ringClass} ${isFirst ? "p-1" : ""}`}
        >
          <LeaderboardAvatar
            entry={entry}
            size={isFirst ? 96 : 76}
            className="ring-2 ring-black/40"
          />
        </div>
      </Link>

      <Link
        href={`/${entry.username}`}
        target="_blank"
        rel="noreferrer"
        className={`truncate max-w-full font-semibold text-white transition-colors hover:text-[var(--bf-accent)] ${
          isFirst ? "text-base sm:text-lg" : "text-sm"
        }`}
      >
        {entry.display_name}
      </Link>
      <p className="truncate max-w-full font-mono text-[10px] text-neutral-500 sm:text-[11px]">
        @{entry.username}
      </p>

      <div
        className={`mt-2 rounded-xl border px-3 py-2 sm:mt-3 ${
          entry.rank === 1
            ? "border-amber-400/20 bg-amber-400/[0.06]"
            : entry.rank === 2
              ? "border-neutral-400/15 bg-white/[0.03]"
              : "border-orange-500/15 bg-orange-500/[0.04]"
        }`}
      >
        {tab === "views" ? (
          <p className="text-xs text-neutral-400">
            <span className={`font-bold text-white ${isFirst ? "text-lg sm:text-xl" : "text-base"}`}>
              {formatStat(entry.views)}
            </span>
            <span className="ml-1.5">views</span>
          </p>
        ) : (
          <div className="space-y-0.5">
            <p className="text-xs text-neutral-400">
              <span className={`font-bold text-white ${isFirst ? "text-lg sm:text-xl" : "text-base"}`}>
                {formatStat(entry.followers)}
              </span>
              <span className="ml-1.5">followers</span>
            </p>
            <p className="text-[10px] text-neutral-600">{formatStat(entry.views)} views</p>
          </div>
        )}
      </div>

      {currentUserId !== entry.id ? (
        <Link
          href={`/${entry.username}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 text-[10px] font-medium text-neutral-600 opacity-0 transition-all hover:text-[var(--bf-accent)] group-hover:opacity-100 sm:mt-3 sm:text-[11px]"
        >
          View profile →
        </Link>
      ) : null}

      <div
        className={`bf-leaderboard-stand mt-3 w-[88%] rounded-t-2xl sm:mt-4 sm:w-[82%] ${
          entry.rank === 1
            ? "bf-leaderboard-stand--gold h-[5.5rem] sm:h-[6.5rem]"
            : entry.rank === 2
              ? "bf-leaderboard-stand--silver h-[3.75rem] sm:h-[4.5rem]"
              : "bf-leaderboard-stand--bronze h-[3rem] sm:h-[3.75rem]"
        }`}
      />
    </div>
  );
}
