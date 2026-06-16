import { getActiveAnnouncement, getPlatformSettings } from "@/lib/data/admin";

export async function GlobalSiteBanner() {
  const [announcement, settings] = await Promise.all([
    getActiveAnnouncement(),
    getPlatformSettings(),
  ]);

  const message = announcement?.title
    ? announcement.body
      ? `${announcement.title} — ${announcement.body}`
      : announcement.title
    : settings?.global_banner?.trim();

  if (!message) return null;

  const type = announcement?.announcement_type ?? settings?.global_banner_type ?? "info";
  const tone =
    type === "warning"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-100"
      : type === "maintenance"
        ? "border-red-500/20 bg-red-500/10 text-red-100"
        : type === "update"
          ? "border-sky-500/20 bg-sky-500/10 text-sky-100"
          : "border-white/10 bg-white/[0.05] text-neutral-200";

  return (
    <div className={`border-b px-4 py-2.5 text-center text-sm ${tone}`}>
      {message}
    </div>
  );
}
