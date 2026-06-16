"use client";

import { usePathname } from "next/navigation";
import { isPublicProfilePath } from "@/lib/profile";

export function ScrollToTopButton() {
  const pathname = usePathname();

  if (isPublicProfilePath(pathname)) {
    return null;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/90 bg-[radial-gradient(circle_at_50%_35%,#3a3a3a_0%,#1a1a1a_55%,#0d0d0d_100%)] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
    >
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
