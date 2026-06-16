"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type {
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardResult,
  LeaderboardTab,
} from "@/lib/types/leaderboard";
import { LEADERBOARD_PERIODS } from "@/lib/types/leaderboard";
import { LeaderboardPodium } from "./leaderboard-podium";
import { LeaderboardRow } from "./leaderboard-row";
import { LeaderboardTrophyIcon } from "./leaderboard-trophy-icon";

type LeaderboardPayload = {
  podium: LeaderboardEntry[];
  list: LeaderboardResult;
  tab: LeaderboardTab;
  period: LeaderboardPeriod;
  query: string;
};

function EmptyState({ tab, query }: { tab: LeaderboardTab; query: string }) {
  return (
    <div className="bf-leaderboard-empty flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] bg-[#111]/50 px-8 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white/90">
        <LeaderboardTrophyIcon className="h-9 w-9" />
      </div>
      <h3 className="text-lg font-semibold text-white">No rankings yet</h3>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        {query
          ? `No profiles matched "${query}". Try a different search.`
          : tab === "views"
            ? "Profile views will appear here as creators get traffic. Be the first to climb the board."
            : "Followers will appear here as the community grows. Start following creators you love."}
      </p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bf-explore-skeleton h-[88px] rounded-2xl border border-white/[0.05] bg-[#111]"
          style={{ animationDelay: `${index * 70}ms` }}
        />
      ))}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled: boolean;
}) {
  const pages = useMemo(() => {
    const items: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) items.push(i);
    return items;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="bf-explore-pagination flex flex-wrap items-center justify-center gap-2 pt-4">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border border-white/[0.08] bg-[#111] px-3 py-2 text-sm text-neutral-400 transition hover:border-white/[0.14] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          disabled={disabled}
          onClick={() => onPageChange(pageNumber)}
          className={`min-w-10 rounded-xl border px-3 py-2 text-sm transition ${
            pageNumber === page
              ? "border-white/[0.18] bg-white/[0.08] font-medium text-white"
              : "border-white/[0.08] bg-[#111] text-neutral-400 hover:border-white/[0.14] hover:text-white"
          }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border border-white/[0.08] bg-[#111] px-3 py-2 text-sm text-neutral-400 transition hover:border-white/[0.14] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

export function LeaderboardShell({
  initial,
  currentUserId,
}: {
  initial: LeaderboardPayload;
  currentUserId: string;
}) {
  const [tab, setTab] = useState<LeaderboardTab>(initial.tab);
  const [period, setPeriod] = useState<LeaderboardPeriod>(initial.period);
  const [query, setQuery] = useState(initial.query);
  const [searchInput, setSearchInput] = useState(initial.query);
  const [page, setPage] = useState(1);
  const [podium, setPodium] = useState(initial.podium);
  const [list, setList] = useState(initial.list);
  const [isPending, startTransition] = useTransition();
  const [rankFlash, setRankFlash] = useState(false);
  const prevRanksRef = useRef<Map<string, number>>(new Map());

  const fetchData = useCallback(
    (next: {
      tab?: LeaderboardTab;
      period?: LeaderboardPeriod;
      query?: string;
      page?: number;
    }) => {
      const params = new URLSearchParams({
        tab: next.tab ?? tab,
        period: next.period ?? period,
        page: String(next.page ?? page),
      });
      const q = next.query ?? query;
      if (q) params.set("q", q);

      startTransition(async () => {
        const response = await fetch(`/api/dashboard/leaderboard?${params.toString()}`);
        if (!response.ok) return;
        const data = (await response.json()) as LeaderboardPayload;

        const nextRanks = new Map<string, number>();
        [...data.podium, ...data.list.entries].forEach((entry) => {
          nextRanks.set(entry.id, entry.rank);
        });
        let moved = false;
        nextRanks.forEach((rank, id) => {
          const prev = prevRanksRef.current.get(id);
          if (prev !== undefined && prev !== rank) moved = true;
        });
        prevRanksRef.current = nextRanks;

        setPodium(data.podium);
        setList(data.list);
        setTab(data.tab);
        setPeriod(data.period);
        setQuery(data.query);
        if (moved) {
          setRankFlash(true);
          window.setTimeout(() => setRankFlash(false), 700);
        }
      });
    },
    [tab, period, query, page],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput !== query) {
        setPage(1);
        fetchData({ query: searchInput, page: 1 });
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [searchInput, query, fetchData]);

  const onTabChange = (nextTab: LeaderboardTab) => {
    setTab(nextTab);
    setPage(1);
    fetchData({ tab: nextTab, page: 1 });
  };

  const onPeriodChange = (nextPeriod: LeaderboardPeriod) => {
    setPeriod(nextPeriod);
    setPage(1);
    fetchData({ period: nextPeriod, page: 1 });
  };

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
    fetchData({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasResults = podium.length > 0 || list.entries.length > 0;
  const statLabel = tab === "views" ? "profile views" : "followers";

  return (
    <div className={`bf-leaderboard-page mx-auto max-w-5xl px-4 pb-16 pt-2 sm:px-6 ${rankFlash ? "bf-leaderboard-rank-flash" : ""}`}>
      <div className="bf-leaderboard-toolbar sticky top-0 z-20 -mx-4 mb-5 border-b border-white/[0.06] bg-[#050505]/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {(
              [
                { id: "views" as const, label: "Most Viewed" },
                { id: "followers" as const, label: "Most Followed" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isPending}
                onClick={() => onTabChange(item.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  tab === item.id
                    ? "border border-amber-400/25 bg-amber-400/[0.1] text-amber-50 shadow-[0_0_20px_rgba(251,191,36,0.08)]"
                    : "border border-white/[0.08] bg-transparent text-neutral-500 hover:border-white/[0.14] hover:text-neutral-300"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="bf-explore-search flex min-w-[180px] flex-1 items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#111]/80 px-3.5 py-2 transition-colors focus-within:border-white/[0.14] sm:ml-auto sm:max-w-xs">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0 text-neutral-500" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search creators…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {LEADERBOARD_PERIODS.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isPending}
                onClick={() => onPeriodChange(item.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition sm:text-xs ${
                  period === item.id
                    ? "border border-amber-400/20 bg-amber-400/[0.08] text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.06)]"
                    : "border border-white/[0.08] bg-transparent text-neutral-500 hover:border-white/[0.14] hover:text-neutral-300"
                }`}
              >
                {item.label}
              </button>
            ))}
            {list.total > 0 ? (
              <span className="ml-auto hidden text-[11px] text-neutral-600 sm:inline">
                {list.total.toLocaleString()} ranked by {statLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {isPending && !hasResults ? (
        <LoadingRows />
      ) : !hasResults ? (
        <EmptyState tab={tab} query={query} />
      ) : (
        <>
          {podium.length > 0 ? (
            <LeaderboardPodium entries={podium} tab={tab} currentUserId={currentUserId} />
          ) : null}

          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--bf-accent)]/80" />
              Full rankings
            </h2>
          </div>

          {isPending ? (
            <LoadingRows />
          ) : list.entries.length > 0 ? (
            <div className="space-y-2.5">
              {list.entries.map((entry, index) => (
                <LeaderboardRow
                  key={entry.id}
                  entry={entry}
                  tab={tab}
                  currentUserId={currentUserId}
                  index={index}
                />
              ))}
            </div>
          ) : list.total <= 3 ? (
            <p className="rounded-2xl border border-white/[0.06] bg-[#111]/50 px-5 py-8 text-center text-sm text-neutral-500">
              The top 3 take the stage — more rankings coming soon.
            </p>
          ) : null}

          <Pagination
            page={list.page}
            totalPages={list.totalPages}
            onPageChange={onPageChange}
            disabled={isPending}
          />
        </>
      )}
    </div>
  );
}
