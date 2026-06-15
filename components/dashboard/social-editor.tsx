"use client";

import { useRouter } from "next/navigation";
import { respondFriendRequestAction } from "@/app/actions/social";
import {
  SaveConfirmation,
  useSocialDashboardSection,
} from "@/components/dashboard/use-settings-form";
import { ControlledSelect } from "@/components/dashboard/controlled-fields";
import {
  buttonPrimaryClassName,
  cardClassName,
  PageHeader,
  ToggleField,
} from "@/components/dashboard/form-fields";
import type { ProfileSettings } from "@/lib/types/settings";

function readSocialForm(settings: ProfileSettings) {
  return {
    friends_visibility: settings.friends_visibility,
    show_follow_counts: settings.show_follow_counts,
    show_activity: settings.show_activity,
  };
}

export function SocialEditor({
  settings,
  pendingRequests,
  followerCount,
  followingCount,
}: {
  settings: ProfileSettings;
  pendingRequests: Array<{ id: string; sender?: { display_name?: string; username?: string } }>;
  followerCount: number;
  followingCount: number;
}) {
  const router = useRouter();
  const { form, patchForm, submit, state, isPending } = useSocialDashboardSection(
    settings,
    readSocialForm,
    "Social settings saved.",
  );

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    submit(form);
  };

  return (
    <>
      <PageHeader title="Social" description="Followers, friends, and social visibility." />
      <div className={`${cardClassName} mb-6 grid gap-4 sm:grid-cols-2`}>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-4">
          <p className="text-2xl font-bold text-white">{followerCount}</p>
          <p className="text-xs text-neutral-500">Followers</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-4">
          <p className="text-2xl font-bold text-white">{followingCount}</p>
          <p className="text-xs text-neutral-500">Following</p>
        </div>
      </div>

      <div className={`${cardClassName} mb-6`}>
        <form onSubmit={handleSave} data-dashboard-primary-form className="space-y-4">
          <ToggleField
            name="show_follow_counts"
            label="Show followers & following"
            description="Display follower and following counts on your public profile"
            checked={form.show_follow_counts}
            onCheckedChange={(show_follow_counts) => patchForm({ show_follow_counts })}
          />
          <ToggleField
            name="show_activity"
            label="Show recent activity"
            description="Display your recent profile activity feed on your public profile"
            checked={form.show_activity}
            onCheckedChange={(show_activity) => patchForm({ show_activity })}
          />
          <ControlledSelect
            label="Friends list visibility"
            value={form.friends_visibility}
            onChange={(friends_visibility) => patchForm({ friends_visibility })}
            options={[
              { value: "public", label: "Public" },
              { value: "friends", label: "Friends only" },
              { value: "private", label: "Private" },
            ]}
          />
          <SaveConfirmation success={state.success} error={state.error} />
          <button type="submit" disabled={isPending} className={buttonPrimaryClassName}>
            {isPending ? "Saving..." : "Save social settings"}
          </button>
        </form>
      </div>

      {pendingRequests.length > 0 && (
        <div className={cardClassName}>
          <h2 className="mb-4 text-sm font-medium text-white">Friend requests</h2>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-4">
                <p className="text-sm text-white">{req.sender?.display_name || req.sender?.username || "User"}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => respondFriendRequestAction(req.id, true).then(() => router.refresh())} className="text-xs text-emerald-400">Accept</button>
                  <button type="button" onClick={() => respondFriendRequestAction(req.id, false).then(() => router.refresh())} className="text-xs text-red-400">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
