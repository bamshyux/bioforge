"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { saveCurrentProfilePresetAction } from "@/app/actions/profile-presets";
import { PresetCard } from "@/components/dashboard/profile-presets/preset-card";
import {
  buttonPrimaryClassName,
  cardClassName,
  FormFeedback,
  inputClassName,
  PageHeader,
} from "@/components/dashboard/form-fields";
import { useUnsavedChangesOptional } from "@/components/dashboard/unsaved-changes";
import type { ProfilePreset } from "@/lib/types/profile-preset";
import { MAX_PROFILE_PRESETS } from "@/lib/types/profile-preset";

export function ProfilePresetsShell({
  presets: initialPresets,
  activePresetId,
}: {
  presets: ProfilePreset[];
  activePresetId: string | null;
}) {
  const router = useRouter();
  const unsaved = useUnsavedChangesOptional();
  const [activeId, setActiveId] = useState(activePresetId);
  const [saveOpen, setSaveOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [feedback, setFeedback] = useState<{ error?: string; success?: string }>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setActiveId(activePresetId);
  }, [activePresetId]);

  const checkUnsavedBeforeApply = useCallback(() => {
    if (!unsaved?.isDirty) return true;

    const saveFirst = window.confirm(
      "You have unsaved changes on another dashboard page. Apply this preset anyway? Your unsaved edits will remain in the editor until you save or reset them.",
    );
    return saveFirst;
  }, [unsaved?.isDirty]);

  function refresh() {
    router.refresh();
  }

  function handleApplied() {
    unsaved?.markClean();
    refresh();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile Presets"
        description="Save complete profile styles — layout, colors, links, widgets, music, and more — then switch between them instantly."
      />

      <div className={`${cardClassName} flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between`}>
        <div>
          <h2 className="text-base font-semibold text-white">Save current profile</h2>
          <p className="mt-1 max-w-xl text-sm text-neutral-500">
            Capture everything that affects how your profile looks right now. Presets are separate
            from Custom Themes, which only store CSS.
          </p>
          <p className="mt-2 text-xs text-neutral-600">
            {initialPresets.length}/{MAX_PROFILE_PRESETS} presets saved
          </p>
        </div>
        <button
          type="button"
          disabled={isPending || initialPresets.length >= MAX_PROFILE_PRESETS}
          onClick={() => {
            setPresetName("");
            setSaveOpen(true);
            setFeedback({});
          }}
          className={buttonPrimaryClassName}
        >
          Save Current Profile
        </button>
      </div>

      <FormFeedback error={feedback.error} success={feedback.success} />

      {saveOpen ? (
        <div className={`${cardClassName} space-y-4`}>
          <h3 className="text-sm font-semibold text-white">Name this preset</h3>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              startTransition(async () => {
                setFeedback({});
                const result = await saveCurrentProfilePresetAction(presetName);
                setFeedback(result);
                if (result.error) return;
                setSaveOpen(false);
                setPresetName("");
                if (result.presetId) setActiveId(result.presetId);
                refresh();
              });
            }}
          >
            <input
              value={presetName}
              onChange={(event) => setPresetName(event.target.value)}
              maxLength={60}
              required
              placeholder="e.g. Gaming setup, Minimal dark, Stream night"
              className={`${inputClassName} min-w-0 flex-1`}
            />
            <div className="flex gap-2">
              <button type="submit" disabled={isPending} className={buttonPrimaryClassName}>
                {isPending ? "Saving..." : "Save preset"}
              </button>
              <button
                type="button"
                onClick={() => setSaveOpen(false)}
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {initialPresets.length === 0 ? (
        <div className={`${cardClassName} py-16 text-center`}>
          <p className="text-sm text-neutral-400">No presets yet.</p>
          <p className="mt-2 text-xs text-neutral-600">
            Style your profile, then click Save Current Profile to create your first preset.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {initialPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={activeId === preset.id}
              onApplied={handleApplied}
              onMutated={refresh}
              checkUnsavedBeforeApply={checkUnsavedBeforeApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
