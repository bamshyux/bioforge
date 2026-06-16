type RankTier = "gold" | "silver" | "bronze" | "default";

function tierForRank(rank: number): RankTier {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return "default";
}

const sizeClasses = {
  sm: "bf-leaderboard-rank-badge--sm h-9 w-9 text-sm",
  md: "bf-leaderboard-rank-badge--md h-11 w-11 text-base",
  lg: "bf-leaderboard-rank-badge--lg h-14 w-14 text-xl",
  xl: "bf-leaderboard-rank-badge--xl h-[4.5rem] w-[4.5rem] text-3xl",
};

export function LeaderboardRankBadge({
  rank,
  size = "md",
  className = "",
}: {
  rank: number;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  const tier = tierForRank(rank);

  return (
    <div
      className={`bf-leaderboard-rank-badge bf-leaderboard-rank-badge--${tier} ${sizeClasses[size]} ${className}`}
      aria-label={`Rank ${rank}`}
    >
      <span className="bf-leaderboard-rank-badge__ring" aria-hidden />
      <span className="bf-leaderboard-rank-badge__shine" aria-hidden />
      <span className="bf-leaderboard-rank-badge__num tabular-nums">{rank}</span>
    </div>
  );
}

export function LeaderboardPodiumCrown({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`bf-leaderboard-crown ${className}`}
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 26h40l-2-14-9 7-7-12-7 12-9-7-2 14Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M4 26h40M6 12l8 6 6-10 6 10 8-6 2 14H4l2-14Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="8" r="2" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="40" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
