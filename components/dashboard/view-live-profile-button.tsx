import Link from "next/link";
import { IconExternal } from "@/components/icons/dashboard-icons";
import { SITE_HOST } from "@/lib/site";

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
            ? `inline-flex shrink-0 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.06] px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/[0.1] ${className}`
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
      className={`group inline-flex max-w-full shrink-0 items-center gap-2.5 rounded-xl bg-[#fafafa] px-4 py-2.5 text-[13px] font-semibold text-[#090909] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all hover:bg-white hover:shadow-[0_4px_24px_rgba(255,255,255,0.12)] sm:px-5 sm:py-2.5 ${className}`}
    >
      <span className="flex min-w-0 flex-col items-start leading-tight">
        <span className="whitespace-nowrap">View live profile</span>
        <span className="mt-0.5 hidden truncate font-mono text-[10px] font-normal text-[#525252] sm:block sm:max-w-[180px] lg:max-w-[220px]">
          {SITE_HOST}/{username}
        </span>
      </span>
      <IconExternal
        size={14}
        className="shrink-0 text-[#525252] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#090909]"
      />
    </Link>
  );
}
