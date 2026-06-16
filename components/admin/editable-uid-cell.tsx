"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateUidAction } from "@/app/actions/admin";

export function EditableUidCell({
  userId,
  uid,
}: {
  userId: string;
  uid: number | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(uid != null ? String(uid) : "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(uid != null ? String(uid) : "");
  }, [uid]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const cancel = () => {
    setEditing(false);
    setError(null);
    setValue(uid != null ? String(uid) : "");
  };

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("UID required");
      return;
    }

    const parsed = Number(trimmed);
    if (!Number.isSafeInteger(parsed) || parsed < 1) {
      setError("Enter a positive whole number");
      return;
    }

    if (uid === parsed) {
      cancel();
      return;
    }

    startTransition(async () => {
      const result = await adminUpdateUidAction(userId, parsed);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setEditing(false);
      router.refresh();
    });
  };

  if (editing) {
    return (
      <div className="min-w-[5rem]" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          disabled={isPending}
          onChange={(e) => {
            setError(null);
            setValue(e.target.value.replace(/\D/g, ""));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              save();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            }
          }}
          onBlur={save}
          className="w-full rounded border border-[#fafafa]/20 bg-[#0a0a0a] px-2 py-1 font-mono text-xs text-white outline-none focus:border-[#fafafa]/40"
          aria-label="Edit UID"
        />
        {error ? <p className="mt-1 text-[10px] text-red-400">{error}</p> : null}
      </div>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      title="Double-click to edit UID"
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setEditing(true);
        }
      }}
      className="cursor-text font-mono text-xs text-neutral-400 underline decoration-dotted decoration-white/15 underline-offset-4 transition-colors hover:text-white"
    >
      {uid ?? "—"}
    </span>
  );
}
