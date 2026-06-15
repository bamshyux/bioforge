import { getActivityTypeLabel } from "@/lib/discord/activity-images";
import { getDiscordStatusColor, getDiscordStatusLabel } from "@/lib/discord/status-colors";
import type { DiscordActivity, DiscordPresence } from "@/lib/discord/types";
import type { ProfileSettings } from "@/lib/types/settings";

function ActivityBlock({
  label,
  title,
  line1,
  line2,
  imageUrl,
}: {
  label: string;
  title: string;
  line1?: string;
  line2?: string;
  imageUrl?: string | null;
}) {
  return (
    <div className="mx-3 mb-3 rounded-md bg-[#1e1f22] p-2.5">
      <div className="flex gap-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-[60px] w-[60px] shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-lg bg-[#5865F2]/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#5865F2" aria-hidden>
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 12.3 12.3 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex flex-col justify-center gap-0.5">
          <p className="text-[11px] font-bold uppercase leading-none tracking-wide text-[#b5bac1]">
            {label}
          </p>
          <p className="truncate text-sm font-semibold leading-snug text-[#f2f3f5]">{title}</p>
          {line1 ? (
            <p className="truncate text-xs leading-snug text-[#b5bac1]">{line1}</p>
          ) : null}
          {line2 ? (
            <p className="truncate text-xs leading-snug text-[#b5bac1]">{line2}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function renderActivity(activity: DiscordActivity) {
  if (activity.type === 4) {
    return (
      <ActivityBlock
        label="Custom Status"
        title={activity.state || activity.name}
        line1={activity.state ? activity.name : undefined}
        imageUrl={activity.largeImageUrl}
      />
    );
  }

  return (
    <ActivityBlock
      label={getActivityTypeLabel(activity.type)}
      title={activity.name}
      line1={activity.details}
      line2={activity.state}
      imageUrl={activity.largeImageUrl ?? activity.smallImageUrl}
    />
  );
}

export function DiscordStatusCard({
  presence,
  settings,
  live = true,
}: {
  presence: DiscordPresence;
  settings: ProfileSettings;
  live?: boolean;
}) {
  const statusColor = getDiscordStatusColor(presence.status);
  const statusLabel = getDiscordStatusLabel(presence.status);
  const displayName = settings.discord_username || presence.username;
  const hasActivity = Boolean(presence.activity || presence.spotify);

  return (
    <div className="profile-discord-status bf-profile-block mb-5 w-full max-w-[320px] overflow-hidden rounded-lg bg-[#2b2d31] shadow-[0_8px_16px_rgba(0,0,0,0.24)]">
      <div className="flex items-center gap-3 px-3 py-3">
        {presence.avatarUrl ? (
          <div className="relative shrink-0">
            <img
              src={presence.avatarUrl}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 box-content h-2.5 w-2.5 rounded-full border-[3px] border-[#2b2d31]"
              style={{ backgroundColor: statusColor }}
              title={statusLabel}
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold leading-tight text-[#f2f3f5]">
            {displayName}
          </p>
          <p className="truncate text-[13px] leading-snug text-[#b5bac1]">{statusLabel}</p>
        </div>
      </div>

      {presence.spotify ? (
        <ActivityBlock
          label="Listening to Spotify"
          title={presence.spotify.song}
          line1={`by ${presence.spotify.artist}`}
          imageUrl={presence.spotify.albumArtUrl}
        />
      ) : presence.activity ? (
        renderActivity(presence.activity)
      ) : null}

      {!live && !hasActivity ? (
        <p className="border-t border-[#1e1f22] px-3 py-2 text-[11px] leading-relaxed text-[#949ba4]">
          Join{" "}
          <a
            href="https://discord.gg/lanyard"
            target="_blank"
            rel="noreferrer"
            className="text-[#00a8fc] hover:underline"
          >
            discord.gg/lanyard
          </a>{" "}
          for live activity.
        </p>
      ) : null}
    </div>
  );
}
