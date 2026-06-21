"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import {
  clearAllPlatformUpdatesAction,
  createPlatformUpdateAction,
  deletePlatformUpdateAction,
} from "@/app/actions/platform-updates";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminSection,
  AdminTableWrap,
} from "@/components/admin/admin-ui";
import {
  buttonPrimaryClassName,
  buttonSecondaryClassName,
  FormFeedback,
  inputClassName,
  labelClassName,
  ToggleField,
} from "@/components/dashboard/form-fields";
import type { PlatformUpdate, PlatformUpdateFormState } from "@/lib/types/platform-update";

const initial: PlatformUpdateFormState = {};

function FilePreview({ file, label }: { file: File | null; label: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !url) return null;

  return (
    <div className="mt-2">
      <p className="mb-1 text-[10px] uppercase tracking-wider text-neutral-600">{label} preview</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="max-h-32 rounded-lg border border-white/[0.08] object-contain" />
    </div>
  );
}

export function AdminUpdatesPanel({ updates }: { updates: PlatformUpdate[] }) {
  const [state, action, pending] = useActionState(createPlatformUpdateAction, initial);
  const [clearState, clearAction, clearPending] = useActionState(clearAllPlatformUpdatesAction, initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  return (
    <>
      <AdminPageHeader
        title="Updates"
        description="Publish platform updates that appear in the upper-left widget for every visitor."
      />

      <AdminSection title="Publish update">
        <form action={action} encType="multipart/form-data" className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClassName}>Title</label>
            <input name="title" required className={inputClassName} placeholder="What's new" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Message</label>
            <textarea
              name="body"
              rows={4}
              required
              className={inputClassName}
              placeholder="Describe the update for everyone..."
            />
          </div>
          <div>
            <label className={labelClassName}>Update image (optional)</label>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className={inputClassName}
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-xs text-neutral-600">Shown inside the update card. Max 5 MB.</p>
            <FilePreview file={imageFile} label="Image" />
          </div>
          <div>
            <label className={labelClassName}>Custom icon (optional)</label>
            <input
              name="icon"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className={inputClassName}
              onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-xs text-neutral-600">Replaces the default update icon for this post.</p>
            <FilePreview file={iconFile} label="Icon" />
          </div>
          <ToggleField name="is_active" label="Active" defaultChecked />
          <div className="md:col-span-2">
            <FormFeedback error={state.error} success={state.success} />
            <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
              {pending ? "Publishing..." : "Publish update"}
            </button>
          </div>
        </form>
      </AdminSection>

      <AdminSection title="Active & past updates">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <form action={clearAction}>
            <button
              type="submit"
              disabled={clearPending || updates.length === 0}
              className={buttonSecondaryClassName}
            >
              {clearPending ? "Clearing..." : "Clear all updates"}
            </button>
          </form>
          <FormFeedback error={clearState.error} success={clearState.success} />
        </div>

        {updates.length === 0 ? (
          <AdminEmptyState message="No updates published yet." />
        ) : (
          <AdminTableWrap>
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Media</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {updates.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="text-white">{item.title}</p>
                    <p className="mt-1 max-w-md truncate text-xs text-neutral-500">{item.body}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{item.is_active ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-neutral-600">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <form action={deletePlatformUpdateAction.bind(null, item.id)}>
                      <button type="submit" className={buttonSecondaryClassName}>
                        Clear
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTableWrap>
        )}
      </AdminSection>
    </>
  );
}
