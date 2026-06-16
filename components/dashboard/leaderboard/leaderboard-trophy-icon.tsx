export function LeaderboardTrophyIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M18 10h28l2 8H16l2-8Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path
        d="M16 18h32v4c0 8.837-7.163 16-16 16s-16-7.163-16-16v-4Z"
        fill="currentColor"
        fillOpacity="0.28"
      />
      <path
        d="M12 18H8c0 6.627 4.373 12.227 10.4 14.08M52 18h4c0 6.627-4.373 12.227-10.4 14.08"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 38v8M24 54h16M28 46h8v8H28v-8Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 10h20l1.5 6h-23L22 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="24" r="4" fill="currentColor" />
    </svg>
  );
}
