"use client";

import { useRouter } from "next/navigation";
import {
  approveGuestbookEntryAction,
  banGuestbookUserAction,
  deleteGuestbookEntryAction,
} from "@/app/actions/guestbook";
import { GuestbookAppearanceEditor } from "@/components/dashboard/guestbook-appearance-editor";
import {
  buttonPrimaryClassName,
  cardClassName,
  PageHeader,
  ToggleField,
} from "@/components/dashboard/form-fields";
import {
  SaveConfirmation,
  useDashboardSettingsSection,
} from "@/components/dashboard/use-settings-form";
import type { GuestbookEntry } from "@/lib/types/guestbook";
import type { ProfileSettings } from "@/lib/types/settings";

type GuestbookSettingsForm = {
  guestbook_enabled: boolean;
  guestbook_approval_required: boolean;
};

function readGuestbookSettingsForm(settings: ProfileSettings): GuestbookSettingsForm {
  return {
    guestbook_enabled: settings.guestbook_enabled,
    guestbook_approval_required: settings.guestbook_approval_required,
  };
}

export function GuestbookEditor({
  settings,
  entries,
}: {
  settings: ProfileSettings;
  entries: GuestbookEntry[];
}) {
  const router = useRouter();
  const { form, patchForm, submit, state, isPending } = useDashboardSettingsSection(
    "guestbook",
    settings,
    readGuestbookSettingsForm,
    "Guestbook settings saved.",
    "guestbook-settings",
  );

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    submit(form);
  };

  return (
    <>
      <PageHeader title="Guestbook" description="Let visitors leave messages on your profile." />

      <div className={`${cardClassName} mb-6`}>
        <form
          onSubmit={handleSave}
          data-dashboard-settings-form="guestbook-settings"
          className="space-y-4"
        >
          <ToggleField
            name="guestbook_enabled"
            label="Enable guestbook"
            checked={form.guestbook_enabled}
            onCheckedChange={(guestbook_enabled) => patchForm({ guestbook_enabled })}
          />
          <ToggleField
            name="guestbook_approval_required"
            label="Require approval"
            checked={form.guestbook_approval_required}
            onCheckedChange={(guestbook_approval_required) => patchForm({ guestbook_approval_required })}
          />
          <SaveConfirmation success={state.success} error={state.error} />
          <button type="submit" disabled={isPending} className={buttonPrimaryClassName}>
            {isPending ? "Saving..." : "Save settings"}
          </button>
        </form>
      </div>

      <GuestbookAppearanceEditor settings={settings} />

      <div className={cardClassName}>
        <h2 className="mb-4 text-sm font-medium text-white">Messages ({entries.length})</h2>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-sm text-neutral-600">No messages yet.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-4">
                <p className="text-sm text-neutral-300">{entry.message}</p>
                <p className="mt-1 text-xs text-neutral-600">
                  {entry.author?.display_name || entry.author?.username} · {new Date(entry.created_at).toLocaleString()}
                  {!entry.is_approved && " · Pending"}
                </p>
                <div className="mt-2 flex gap-2">
                  {!entry.is_approved && (
                    <button
                      type="button"
                      onClick={() => approveGuestbookEntryAction(entry.id).then(() => router.refresh())}
                      className="text-xs text-emerald-400"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteGuestbookEntryAction(entry.id).then(() => router.refresh())}
                    className="text-xs text-red-400"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => banGuestbookUserAction(entry.author_id).then(() => router.refresh())}
                    className="text-xs text-neutral-500"
                  >
                    Ban user
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
