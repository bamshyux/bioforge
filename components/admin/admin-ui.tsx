"use client";

import type { ReactNode } from "react";

export function AdminStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bf-card rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {hint ? <p className="mt-1.5 text-xs text-neutral-600">{hint}</p> : null}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-neutral-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bf-card space-y-4 p-5">
      <h2 className="text-sm font-medium text-white">{title}</h2>
      {children}
    </section>
  );
}

export function AdminTableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
      <table className="min-w-full divide-y divide-white/[0.06] text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "red" | "amber" | "purple" }) {
  const tones = {
    neutral: "bg-white/[0.06] text-neutral-300",
    green: "bg-emerald-500/10 text-emerald-300",
    red: "bg-red-500/10 text-red-300",
    amber: "bg-amber-500/10 text-amber-300",
    purple: "bg-purple-500/10 text-purple-300",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function AdminEmptyState({ message }: { message: string }) {
  return <p className="rounded-lg border border-dashed border-white/[0.08] px-4 py-8 text-center text-sm text-neutral-500">{message}</p>;
}

export function AdminMiniChart({
  title,
  data,
}: {
  title: string;
  data: { date: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="bf-card p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">{title}</p>
      <div className="flex h-24 items-end gap-1">
        {data.map((point) => (
          <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-white/[0.12]"
              style={{ height: `${Math.max(4, (point.count / max) * 100)}%` }}
              title={`${point.date}: ${point.count}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
