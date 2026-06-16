"use client";

import { useRef, useState } from "react";
import type { LeaderboardEntry, LeaderboardTab } from "@/lib/types/leaderboard";
import { SITE_HOST } from "@/lib/site";
import { LeaderboardAvatar, formatStat } from "./leaderboard-shared";

export function LeaderboardHoverPreview({
  entry,
  tab,
  children,
}: {
  entry: LeaderboardEntry;
  tab: LeaderboardTab;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (event: React.MouseEvent) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPosition({ x: rect.left + rect.width / 2, y: rect.top });
    timerRef.current = setTimeout(() => setVisible(true), 280);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <div className="relative min-w-0 flex-1" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible ? (
        <div
          className="bf-leaderboard-preview pointer-events-none fixed z-50 w-72 -translate-x-1/2 -translate-y-full rounded-2xl border border-white/[0.1] bg-[#141414]/95 p-4 shadow-2xl backdrop-blur-xl"
          style={{ left: position.x, top: position.y - 12 }}
        >
          <div className="flex items-start gap-3">
            <LeaderboardAvatar entry={entry} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{entry.display_name}</p>
              <p className="truncate font-mono text-[11px] text-neutral-500">
                {SITE_HOST}/{entry.username}
              </p>
            </div>
          </div>
          {entry.bio ? (
            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-neutral-400">{entry.bio}</p>
          ) : (
            <p className="mt-3 text-xs italic text-neutral-600">No bio yet</p>
          )}
          <div className="mt-3 flex gap-4 border-t border-white/[0.06] pt-3 text-[11px] text-neutral-500">
            <span>
              <span className="font-semibold text-neutral-300">{formatStat(entry.views)}</span> views
            </span>
            <span>
              <span className="font-semibold text-neutral-300">{formatStat(entry.followers)}</span> followers
            </span>
          </div>
          <p className="mt-2 text-[10px] text-neutral-600">
            Rank #{entry.rank} · {tab === "views" ? "Most viewed" : "Most followed"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
