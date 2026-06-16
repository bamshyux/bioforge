"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import {
  pinGuestbookEntryAction,
  postGuestbookEntryAction,
  unpinGuestbookEntryAction,
} from "@/app/actions/guestbook";
import { FormFeedback } from "@/components/dashboard/form-fields";
import type { GuestbookEntry, GuestbookFormState } from "@/lib/types/guestbook";
import type { ProfileSettings } from "@/lib/types/settings";

const initial: GuestbookFormState = {};
const MAX_VISIBLE_ENTRIES = 6;

export function ProfileGuestbookSection({
  profileId,
  settings,
  entries,
  currentUserId,
}: {
  profileId: string;
  settings: ProfileSettings;
  entries: GuestbookEntry[];
  currentUserId?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(postGuestbookEntryAction, initial);

  if (!settings.guestbook_enabled) return null;

  const isOwner = currentUserId === profileId;
  const canSign = !!currentUserId && !isOwner;
  const visibleEntries = entries.slice(0, MAX_VISIBLE_ENTRIES);
  const hiddenCount = entries.length - visibleEntries.length;

  return (
    <section className="bf-guestbook mt-10 border-t border-white/[0.04] pt-5">
      <p className="bf-guestbook__label">guestbook</p>

      {visibleEntries.length > 0 ? (
        <ul className="bf-guestbook__entries">
          {visibleEntries.map((entry) => (
            <GuestbookWhisper key={entry.id} entry={entry} isOwner={isOwner} />
          ))}
        </ul>
      ) : (
        <p className="bf-guestbook__empty">—</p>
      )}

      {hiddenCount > 0 && (
        <p className="bf-guestbook__more">+{hiddenCount} more</p>
      )}

      {canSign && (
        <form action={formAction} className="bf-guestbook__form">
          <input type="hidden" name="profile_id" value={profileId} />
          <input
            type="text"
            name="message"
            maxLength={500}
            placeholder="leave a note"
            className="bf-guestbook__input"
            required
          />
          <button type="submit" disabled={isPending} className="bf-guestbook__submit">
            {isPending ? "…" : "sign"}
          </button>
          <FormFeedback error={state.error} success={state.success} />
        </form>
      )}

      {!currentUserId && !isOwner && (
        <p className="bf-guestbook__hint">
          <Link href="/login">log in</Link> to sign
        </p>
      )}

      {isOwner && (
        <p className="bf-guestbook__hint">
          {entries.some((entry) => entry.is_pinned) ? "Pinned message shows first. " : null}
          <Link href="/dashboard/guestbook">manage</Link>
        </p>
      )}
    </section>
  );
}

function GuestbookWhisper({ entry, isOwner }: { entry: GuestbookEntry; isOwner: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handle = entry.author?.username ? `@${entry.author.username}` : "guest";

  const togglePin = () => {
    startTransition(async () => {
      const result = entry.is_pinned
        ? await unpinGuestbookEntryAction(entry.id)
        : await pinGuestbookEntryAction(entry.id);
      if (!result.error) router.refresh();
    });
  };

  return (
    <li className={`bf-guestbook__entry${entry.is_pinned ? " bf-guestbook__entry--pinned" : ""}`}>
      {entry.is_pinned && !isOwner ? (
        <span className="bf-guestbook__pin-badge" title="Pinned message" aria-hidden>
          <PinIcon filled />
        </span>
      ) : null}
      <span className="bf-guestbook__quote">&ldquo;{entry.message}&rdquo;</span>
      <span className="bf-guestbook__by">{handle}</span>
      {isOwner ? (
        <button
          type="button"
          onClick={togglePin}
          disabled={isPending}
          className={`bf-guestbook__pin-action${entry.is_pinned ? " bf-guestbook__pin-action--active" : ""}`}
          title={entry.is_pinned ? "Unpin message" : "Pin message"}
          aria-label={entry.is_pinned ? "Unpin message" : "Pin message"}
        >
          <PinIcon filled={entry.is_pinned} />
        </button>
      ) : null}
    </li>
  );
}

function PinIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M16 4v2h2.25l-3 7H9.5l-3-7H9V4H7V2h10v2h-1zm-2.5 10.5 1.5 4.5H9l1.5-4.5h3z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
      />
    </svg>
  );
}
