import Link from "next/link";
import { IconExternal } from "@/components/icons/dashboard-icons";

type ViewLiveProfileButtonProps = {
  username?: string | null;
  /** header = sticky dashboard bar; inline = compact text link */
  variant?: "header" | "inline";
  className?: string;
};

export function ViewLiveProfileButton({
  username,
  variant = "header",
  className = "",
}: ViewLiveProfileButtonProps) {
  if (!username?.trim()) {
    return (
      <Link
        href="/dashboard/profile"
        className={
          variant === "header"
            ? `inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-[13px] font-medium text-neutral-200 transition-colors hover:border-white/[0.16] hover:bg-white/[0.07] hover:text-white ${className}`
            : `text-[13px] font-medium text-neutral-300 hover:text-white ${className}`
        }
      >
        {variant === "header" ? "Set up profile" : "Set up profile →"}
      </Link>
    );
  }

  const profilePath = `/${username}`;

  if (variant === "inline") {
    return (
      <Link
        href={profilePath}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 font-medium text-neutral-300 hover:text-white ${className}`}
      >
        View live profile
        <IconExternal size={12} className="opacity-70" />
      </Link>
    );
  }

  return (
    <Link
      href={profilePath}
      target="_blank"
      rel="noopener noreferrer"
      className={`bf-live-profile-cta group inline-flex max-w-full shrink-0 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] py-1.5 pl-2.5 pr-3 text-[13px] font-medium transition-all hover:border-emerald-500/25 hover:bg-emerald-500/[0.07] ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
        <span className="bf-live-profile-cta__pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
      </span>
      <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-neutral-100 group-hover:text-white">
        <span>View profile</span>
        <span className="hidden font-mono text-[11px] font-normal text-neutral-500 group-hover:text-emerald-200/70 sm:inline">
          /{username}
        </span>
      </span>
      <IconExternal
        size={13}
        className="shrink-0 text-neutral-500 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-300/90"
      />
    </Link>
  );
}
