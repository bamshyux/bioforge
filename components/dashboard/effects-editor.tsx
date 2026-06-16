"use client";

import { ControlledSelect } from "@/components/dashboard/controlled-fields";
import {
  EnterGateEditor,
  readEnterGateForm,
  type EnterGateFormFields,
} from "@/components/dashboard/enter-gate-editor";
import {
  SaveConfirmation,
  useDashboardSettingsSection,
} from "@/components/dashboard/use-settings-form";
import {
  buttonPrimaryClassName,
  cardClassName,
  FormFeedback,
  labelClassName,
  PageHeader,
  RemoveMediaButton,
  ToggleField,
} from "@/components/dashboard/form-fields";
import { removeCursorImageAction, saveCursorImageAction } from "@/app/actions/settings";
import { uploadCursorImageToStorage } from "@/lib/uploads/cursor-client";
import { CURSOR_EFFECT_OPTIONS, USERNAME_EFFECT_OPTIONS } from "@/lib/settings";
import type { CursorEffect, ProfileSettings, UsernameEffect } from "@/lib/types/settings";
import type { Profile } from "@/lib/types/profile";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const fileInputClassName =
  "block w-full text-sm text-neutral-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#fafafa] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#090909]";

type EffectsFormState = EnterGateFormFields & {
  cursor_effect: CursorEffect;
  username_effect: UsernameEffect;
  typing_bio: boolean;
  hover_animations: boolean;
  page_entrance: boolean;
};

function readEffectsForm(settings: ProfileSettings): EffectsFormState {
  return {
    ...readEnterGateForm(settings),
    cursor_effect: settings.cursor_effect,
    username_effect: settings.username_effect,
    typing_bio: settings.typing_bio,
    hover_animations: settings.hover_animations,
    page_entrance: settings.page_entrance,
  };
}

export function EffectsEditor({
  settings,
  profile,
}: {
  settings: ProfileSettings;
  profile: Profile;
}) {
  const router = useRouter();
  const [isRemoving, startRemove] = useTransition();
  const { form, patchForm, submit, state, isPending } = useDashboardSettingsSection(
    "effects",
    settings,
    readEffectsForm,
    "Effects saved.",
  );

  const [uploadError, setUploadError] = useState<string>();
  const [uploadSuccess, setUploadSuccess] = useState<string>();
  const [uploadPending, setUploadPending] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [cursorPreview, setCursorPreview] = useState<string | null>(null);
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    setCursorPreview(null);
  }, [settings.cursor_image_url]);

  useEffect(() => {
    return () => {
      if (cursorPreview?.startsWith("blob:")) URL.revokeObjectURL(cursorPreview);
    };
  }, [cursorPreview]);

  const displayCursorUrl = cursorPreview ?? settings.cursor_image_url ?? null;

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    submit(formRef.current);
  };

  const handleCursorUpload = async (file: File | undefined) => {
    if (!file) return;

    setUploadPending(true);
    setUploadError(undefined);
    setUploadSuccess(undefined);

    const previewUrl = URL.createObjectURL(file);
    setCursorPreview(previewUrl);

    try {
      const url = await uploadCursorImageToStorage(file);
      const result = await saveCursorImageAction(url);
      if (result.error) {
        setUploadError(result.error);
        setCursorPreview(null);
        return;
      }
      setUploadSuccess(result.success ?? "Custom cursor uploaded.");
      router.refresh();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
      setCursorPreview(null);
    } finally {
      setUploadPending(false);
      setFileInputKey((k) => k + 1);
    }
  };

  const handleRemoveCursor = () => {
    startRemove(async () => {
      setUploadError(undefined);
      setUploadSuccess(undefined);
      const result = await removeCursorImageAction();
      if (result.error) {
        setUploadError(result.error);
        return;
      }
      setCursorPreview(null);
      setUploadSuccess(result.success ?? "Custom cursor removed.");
      router.refresh();
    });
  };

  return (
    <>
      <PageHeader title="Effects" description="Cursor, username, bio, page entrance, and click-to-enter screen." />
      <div className={cardClassName}>
        <form onSubmit={handleSave} data-dashboard-primary-form className="space-y-5">
          <EnterGateEditor
            settings={settings}
            profile={profile}
            form={form}
            patchForm={patchForm}
          />

          <ControlledSelect
            label="Cursor effect"
            value={form.cursor_effect}
            onChange={(v) => patchForm({ cursor_effect: v as CursorEffect })}
            options={CURSOR_EFFECT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />

          <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-4">
            <p className={labelClassName}>Custom cursor image</p>
            <p className="mt-1 text-xs text-neutral-500">
              Upload an image visitors will see as their cursor on your profile. Works alongside cursor effects.
              Square PNG or GIF around 32–64px works best.
            </p>

            {displayCursorUrl ? (
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/[0.08] bg-[#141414]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayCursorUrl}
                    alt="Custom cursor preview"
                    className="max-h-12 max-w-12 object-contain"
                  />
                </div>
                <RemoveMediaButton
                  label="Remove cursor"
                  onClick={handleRemoveCursor}
                  disabled={isRemoving || uploadPending}
                />
              </div>
            ) : (
              <p className="mt-3 text-xs text-neutral-500">No custom cursor uploaded yet.</p>
            )}

            <div className="mt-4">
              <input
                key={fileInputKey}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={uploadPending}
                className={fileInputClassName}
                onChange={(event) => void handleCursorUpload(event.target.files?.[0])}
              />
              <p className="mt-2 text-xs text-neutral-500">
                {uploadPending ? "Uploading..." : "JPEG, PNG, WebP, or GIF up to 2 MB."}
              </p>
            </div>
            <FormFeedback error={uploadError} success={uploadSuccess} />
          </div>

          <ControlledSelect
            label="Username effect"
            value={form.username_effect}
            onChange={(v) => patchForm({ username_effect: v as UsernameEffect })}
            options={USERNAME_EFFECT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField
              name="typing_bio"
              label="Typing bio"
              description="Bio types out, pauses, then backspaces in a loop"
              checked={form.typing_bio}
              onCheckedChange={(typing_bio) => patchForm({ typing_bio })}
            />
            <ToggleField
              name="hover_animations"
              label="Hover animations"
              checked={form.hover_animations}
              onCheckedChange={(hover_animations) => patchForm({ hover_animations })}
            />
            <ToggleField
              name="page_entrance"
              label="Page entrance"
              checked={form.page_entrance}
              onCheckedChange={(page_entrance) => patchForm({ page_entrance })}
            />
          </div>

          <SaveConfirmation success={state.success} error={state.error} />
          <button type="submit" disabled={isPending} className={buttonPrimaryClassName}>
            {isPending ? "Saving..." : "Save effects"}
          </button>
        </form>
      </div>
    </>
  );
}

export function EffectsPageShell({
  settings,
  profile,
}: {
  settings: ProfileSettings;
  profile: Profile;
}) {
  return <EffectsEditor settings={settings} profile={profile} />;
}
