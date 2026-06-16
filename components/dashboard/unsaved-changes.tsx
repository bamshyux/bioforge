"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type UnsavedChangesContextValue = {
  isDirty: boolean;
  isSaving: boolean;
  markDirty: () => void;
  markClean: () => void;
  markSaving: () => void;
  clearSaving: () => void;
  setLastDirtyForm: (form: HTMLFormElement | null) => void;
  saveChanges: () => void;
  resetChanges: () => void;
};

export const DASHBOARD_RESET_EVENT = "bf-dashboard-reset-changes";

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

function findDashboardSaveForm(lastForm: HTMLFormElement | null): HTMLFormElement | null {
  if (lastForm?.isConnected) return lastForm;

  const settingsForms = document.querySelectorAll<HTMLFormElement>(
    "main form[data-dashboard-settings-form]",
  );
  if (settingsForms.length === 1) return settingsForms[0] ?? null;

  const sectionForms = document.querySelectorAll<HTMLFormElement>("main form[data-dashboard-section-form]");
  if (sectionForms.length === 1) return sectionForms[0] ?? null;

  const primary = document.querySelector<HTMLFormElement>("main form[data-dashboard-primary-form]");
  if (primary) return primary;

  const forms = document.querySelectorAll<HTMLFormElement>("main form");
  if (forms.length === 1) return forms[0] ?? null;

  return (
    Array.from(forms).find((form) => form.querySelector('button[type="submit"]')) ?? forms[0] ?? null
  );
}

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lastDirtyFormRef = useRef<HTMLFormElement | null>(null);
  const savingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSavingTimeout = useCallback(() => {
    if (savingTimeoutRef.current) {
      clearTimeout(savingTimeoutRef.current);
      savingTimeoutRef.current = null;
    }
  }, []);

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
    setIsSaving(false);
    clearSavingTimeout();
  }, [clearSavingTimeout]);

  const markSaving = useCallback(() => {
    setIsSaving(true);
    clearSavingTimeout();
    savingTimeoutRef.current = setTimeout(() => {
      setIsSaving(false);
      savingTimeoutRef.current = null;
    }, 15000);
  }, [clearSavingTimeout]);

  const clearSaving = useCallback(() => {
    setIsSaving(false);
    clearSavingTimeout();
  }, [clearSavingTimeout]);

  const setLastDirtyForm = useCallback((form: HTMLFormElement | null) => {
    lastDirtyFormRef.current = form;
  }, []);

  const saveChanges = useCallback(() => {
    const form = findDashboardSaveForm(lastDirtyFormRef.current);
    if (!form) {
      clearSaving();
      return;
    }

    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]:not(:disabled)');
    if (!submit) {
      clearSaving();
      form.querySelector('button[type="submit"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    markSaving();
    form.requestSubmit();
  }, [clearSaving, markSaving]);

  const resetChanges = useCallback(() => {
    const form = findDashboardSaveForm(lastDirtyFormRef.current);
    if (form) {
      form.reset();
      window.dispatchEvent(new CustomEvent(DASHBOARD_RESET_EVENT));
    }
    markClean();
  }, [markClean]);

  useEffect(() => {
    if (!isDirty || isSaving) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSaving]);

  useEffect(
    () => () => {
      clearSavingTimeout();
    },
    [clearSavingTimeout],
  );

  const value = useMemo(
    () => ({
      isDirty,
      isSaving,
      markDirty,
      markClean,
      markSaving,
      clearSaving,
      setLastDirtyForm,
      saveChanges,
      resetChanges,
    }),
    [isDirty, isSaving, markDirty, markClean, markSaving, clearSaving, setLastDirtyForm, saveChanges, resetChanges],
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

  const { isSaving, saveChanges, resetChanges } = context;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bf-unsaved-notice pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-xl border border-amber-500/25 bg-[#141414]/95 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs text-amber-300">
          !
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-amber-100">You have unsaved changes</p>
          <p className="mt-0.5 hidden text-xs leading-relaxed text-neutral-400 sm:block">
            Save before leaving this page, or your updates will be lost.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={resetChanges}
            disabled={isSaving}
            className="rounded-lg border border-white/[0.12] bg-[#1a1a1a] px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-colors hover:border-white/20 hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset changes
          </button>
          <button
            type="button"
            onClick={saveChanges}
            disabled={isSaving}
            className="rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-semibold text-[#090909] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
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

      const form = target.closest("form");
      if (!form) return;

      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        context.setLastDirtyForm(form);
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

/** Clear the unsaved banner after native form actions (action={formAction}) finish. */
export function useClearUnsavedOnSuccess(
  state: { success?: string | boolean | null; error?: string | null },
  isPending = false,
) {
  const context = useUnsavedChangesOptional();
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (isPending) {
      wasPendingRef.current = true;
      return;
    }

    if (!wasPendingRef.current) return;
    wasPendingRef.current = false;

    if (state.success) {
      context?.markClean();
    } else {
      context?.clearSaving();
    }
  }, [isPending, state.success, state.error, context]);
}
