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
    <span
      className={`bf-leaderboard-crown-wrap relative inline-flex h-7 w-10 items-center justify-center sm:h-8 sm:w-11 ${className}`}
      aria-hidden
    >
      <svg
        className="bf-leaderboard-crown relative z-[1] h-full w-full text-amber-300/90"
        viewBox="0 0 40 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 23h28L25 11l-5 4-5-9-5 9-5-4-3 12Z"
          fill="currentColor"
          fillOpacity="0.16"
        />
        <path
          d="M6 23h28M9 12l5 4 5-9 5 9 5-4 3 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="20" cy="8" r="1.4" fill="currentColor" />
        <circle cx="10" cy="14" r="1.1" fill="currentColor" />
        <circle cx="30" cy="14" r="1.1" fill="currentColor" />
      </svg>
    </span>
  );
}
