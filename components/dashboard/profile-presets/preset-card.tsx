"use client";

import { useState, useTransition } from "react";
import {
  applyProfilePresetAction,
  deleteProfilePresetAction,
  duplicateProfilePresetAction,
  exportProfilePresetAction,
  renameProfilePresetAction,
  updateProfilePresetSnapshotAction,
} from "@/app/actions/profile-presets";
import { PresetProfilePreview } from "@/components/dashboard/profile-presets/preset-profile-preview";
import { FormFeedback } from "@/components/dashboard/form-fields";
import type { ProfilePreset } from "@/lib/types/profile-preset";

function formatPresetDate(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function downloadJson(filename: string, json: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PresetCard({
  preset,
  isActive,
  onApplied,
  onMutated,
  checkUnsavedBeforeApply,
}: {
  preset: ProfilePreset;
  isActive: boolean;
  onApplied: (presetId: string) => void;
  onMutated: () => void;
  checkUnsavedBeforeApply: () => boolean;
}) {
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(preset.name);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<{ error?: string; success?: string }>) {
    startTransition(async () => {
      setFeedback({});
      const result = await action();
      setFeedback(result);
      if (result.success) onMutated();
      if (result.success?.toLowerCase().includes("applied")) onApplied(preset.id);
    });
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111]">
      <PresetProfilePreview data={preset.preset_data} name={preset.name} />

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{preset.name}</h3>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              Saved {formatPresetDate(preset.updated_at)}
            </p>
          </div>
          {isActive ? (
            <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              Active
            </span>
          ) : null}
        </div>

        <FormFeedback error={feedback.error} success={feedback.success} />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (!checkUnsavedBeforeApply()) return;
              runAction(() => applyProfilePresetAction(preset.id));
            }}
            className="rounded-lg bg-[#fafafa] px-3 py-2 text-xs font-semibold text-[#090909] transition-colors hover:bg-white disabled:opacity-50"
          >
            Apply
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => updateProfilePresetSnapshotAction(preset.id))}
            className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Overwrite
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setRenameValue(preset.name);
              setRenameOpen((open) => !open);
            }}
            className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Rename
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => duplicateProfilePresetAction(preset.id))}
            className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Duplicate
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const result = await exportProfilePresetAction(preset.id);
                if (result.error) {
                  setFeedback({ error: result.error });
                  return;
                }
                if (result.json && result.filename) {
                  downloadJson(result.filename, result.json);
                  setFeedback({ success: "Preset exported." });
                }
              });
            }}
            className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Export JSON
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (!window.confirm(`Delete "${preset.name}"? This cannot be undone.`)) return;
              runAction(() => deleteProfilePresetAction(preset.id));
            }}
            className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        {renameOpen ? (
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              runAction(() => renameProfilePresetAction(preset.id, renameValue));
              setRenameOpen(false);
            }}
          >
            <input
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              maxLength={60}
              className="bf-input min-w-0 flex-1 text-sm"
              placeholder="Preset name"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-white/[0.08] px-3 py-2 text-xs font-medium text-white"
            >
              Save
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}
