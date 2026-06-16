"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { quickSaveActivePresetAction } from "@/app/actions/profile-presets";

export function ProfilePresetQuickSave({
  activePresetId,
}: {
  activePresetId?: string | null;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!activePresetId) return null;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isPending}
        title="Quick save to active preset"
        aria-label="Quick save to active preset"
        onClick={() => {
          startTransition(async () => {
            setFeedback(null);
            const result = await quickSaveActivePresetAction();
            if (result.error) {
              setFeedback(result.error);
              return;
            }
            setFeedback("Saved");
            router.refresh();
            window.setTimeout(() => setFeedback(null), 2000);
          });
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-[#141414] text-neutral-300 transition-colors hover:border-white/[0.2] hover:bg-[#1a1a1a] hover:text-white disabled:opacity-50"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
          <path d="M17 21v-8H7v8M7 3v5h8" />
        </svg>
      </button>
      {feedback ? (
        <span className="pointer-events-none absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a1a1a] px-2 py-1 text-[10px] text-neutral-300 shadow-lg ring-1 ring-white/10">
          {feedback}
        </span>
      ) : null}
    </div>
  );
}
