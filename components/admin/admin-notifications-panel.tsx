"use client";

import { useActionState } from "react";
import { sendAdminNotificationAction } from "@/app/actions/admin";
import { AdminPageHeader, AdminSection, AdminTableWrap } from "@/components/admin/admin-ui";
import {
  buttonPrimaryClassName,
  FormFeedback,
  inputClassName,
  labelClassName,
} from "@/components/dashboard/form-fields";
import type { AdminFormState, AdminNotification } from "@/lib/types/admin";

const initial: AdminFormState = {};

export function AdminNotificationsPanel({ notifications }: { notifications: AdminNotification[] }) {
  const [state, action, pending] = useActionState(sendAdminNotificationAction, initial);

  return (
    <>
      <AdminPageHeader
        title="Notifications"
        description="Send a notification to a specific user or broadcast to all users."
      />

      <AdminSection title="Send notification">
        <form action={action} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClassName}>Username (optional)</label>
            <input name="username" placeholder="Leave empty for all users" className={inputClassName} />
          </div>
          <div>
            <label className={labelClassName}>Title</label>
            <input name="title" required className={inputClassName} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>Message</label>
            <textarea name="body" rows={3} required className={inputClassName} />
          </div>
          <div className="md:col-span-2">
            <FormFeedback error={state.error} success={state.success} />
            <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
              {pending ? "Sending..." : "Send notification"}
            </button>
          </div>
        </form>
      </AdminSection>

      <AdminSection title="Recent notifications">
        <AdminTableWrap>
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Sent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {notifications.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-3 text-white">{n.title}</td>
                <td className="px-4 py-3 text-neutral-400">{n.user_id ? "User" : "All users"}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{new Date(n.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </AdminTableWrap>
      </AdminSection>
    </>
  );
}
