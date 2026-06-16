import Link from "next/link";
import { SiDiscord } from "react-icons/si";
import { DISCORD_COMMUNITY_INVITE_URL } from "@/lib/site";

type DiscordCommunityPromoProps = {
  variant?: "section" | "floating" | "sidebar";
  className?: string;
};

export function DiscordCommunityPromo({
  variant = "section",
  className = "",
}: DiscordCommunityPromoProps) {
  if (variant === "floating") {
    return (
      <Link
        href={DISCORD_COMMUNITY_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`group fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-full border border-white/[0.1] bg-[#111]/95 py-2.5 pl-3 pr-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all hover:border-[#5865F2]/40 hover:bg-[#141414] sm:bottom-8 sm:left-8 ${className}`}
        aria-label="Join our Discord community"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/15 text-[#5865F2] ring-1 ring-[#5865F2]/25">
          <SiDiscord size={20} />
        </span>
        <span className="hidden text-sm font-medium text-white sm:inline">Join Discord</span>
        <svg
          className="hidden h-4 w-4 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-300 sm:block"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 8h10m0 0-3.5-3.5M13 8 9.5 11.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    );
  }

  if (variant === "sidebar") {
    return (
      <div
        className={`overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111] ${className}`}
      >
        <div className="flex items-start gap-3 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/15 text-[#5865F2] ring-1 ring-[#5865F2]/20">
            <SiDiscord size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Join Our Discord</p>
            <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
              Get updates, share feedback, and connect with other creators.
            </p>
            <Link
              href={DISCORD_COMMUNITY_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12px] font-medium text-neutral-200 transition-colors hover:border-[#5865F2]/30 hover:bg-[#5865F2]/10 hover:text-white"
            >
              <SiDiscord size={14} className="text-[#5865F2]" />
              Join Discord
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`relative z-10 mx-auto max-w-6xl px-6 py-16 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111]/90 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-8 p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/10 ring-1 ring-[#5865F2]/20">
            <SiDiscord size={48} className="text-[#5865F2]" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Join Our Discord Community
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-500">
              Connect with like-minded people, get exclusive updates, participate in events, and
              grow together in our engaging and supportive community.
            </p>
            <Link
              href={DISCORD_COMMUNITY_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#5865F2]/35 hover:bg-[#5865F2]/10"
            >
              <SiDiscord size={18} className="text-[#5865F2]" />
              Join Discord
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
