"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCookieConsent, setCookieConsent } from "@/lib/analytics/consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  if (!visible) return null;

  function accept(level: "all" | "essential") {
    setCookieConsent(level);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-[#0f0f0f]/95 p-4 backdrop-blur-xl sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-white">We use cookies</p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            Essential cookies keep you signed in. Analytics cookies help us understand profile views and improve cried.bio.{" "}
            <Link href="/privacy" className="text-neutral-400 underline-offset-2 hover:text-white hover:underline">
              Privacy policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => accept("essential")}
            className="rounded-lg border border-white/[0.1] bg-transparent px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:border-white/[0.2] hover:text-white"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => accept("all")}
            className="rounded-lg bg-[#fafafa] px-4 py-2.5 text-sm font-medium text-[#090909] transition-opacity hover:opacity-90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
