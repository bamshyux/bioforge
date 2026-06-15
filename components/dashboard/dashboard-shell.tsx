"use client";

import {
  DashboardFormTracker,
  UnsavedChangesNotice,
  UnsavedChangesProvider,
} from "@/components/dashboard/unsaved-changes";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <UnsavedChangesProvider>
      <UnsavedChangesNotice />
      <DashboardFormTracker>{children}</DashboardFormTracker>
    </UnsavedChangesProvider>
  );
}
