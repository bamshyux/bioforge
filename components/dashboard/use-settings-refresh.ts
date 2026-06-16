"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClearUnsavedOnSuccess } from "@/components/dashboard/unsaved-changes";
import type { SettingsFormState } from "@/lib/types/settings";

/** Refresh server data after successful save (native form actions only). */
export function useSettingsRefresh(state: SettingsFormState, isPending = false) {
  const router = useRouter();
  useClearUnsavedOnSuccess(state, isPending);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);
}
