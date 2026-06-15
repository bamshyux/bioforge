"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type UnsavedChangesContextValue = {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const value = useMemo(
    () => ({ isDirty, markDirty, markClean }),
    [isDirty, markDirty, markClean],
  );

  return (
    <UnsavedChangesContext.Provider value={value}>{children}</UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider");
  }
  return context;
}

/** Optional hook for components outside the provider (no-op fallback). */
export function useUnsavedChangesOptional() {
  return useContext(UnsavedChangesContext);
}

export function UnsavedChangesNotice() {
  const context = useUnsavedChangesOptional();
  if (!context?.isDirty) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bf-unsaved-notice pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border border-amber-500/25 bg-[#141414]/95 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs text-amber-300">
          !
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-amber-100">You have unsaved changes</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-400">
            Save your work before leaving this page, or your updates will be lost.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DashboardFormTracker({ children }: { children: ReactNode }) {
  const context = useUnsavedChangesOptional();

  const handleMarkDirty = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      if (!context) return;

      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest("form")) return;

      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        context.markDirty();
      }
    },
    [context],
  );

  return (
    <div onInput={handleMarkDirty} onChange={handleMarkDirty}>
      {children}
    </div>
  );
}

/** Clear the unsaved banner after a successful form save. */
export function useClearUnsavedOnSuccess(state: { success?: string | boolean | null }) {
  const context = useUnsavedChangesOptional();

  useEffect(() => {
    if (state.success) {
      context?.markClean();
    }
  }, [state.success, context]);
}
