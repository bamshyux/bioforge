"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClearUnsavedOnSuccess } from "@/components/dashboard/unsaved-changes";
import type { SettingsFormState } from "@/lib/types/settings";

/** Refresh server data after successful save */
export function useSettingsRefresh(state: SettingsFormState) {
  const router = useRouter();
  useClearUnsavedOnSuccess(state);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);
}
