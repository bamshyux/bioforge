import { redirect } from "next/navigation";
import Link from "next/link";
import { syncMilestoneBadges } from "@/app/actions/badges";
import {
  IconAnalytics,
  IconBackground,
  IconCustomize,
  IconEffects,
  IconLinks,
  IconOverview,
} from "@/components/icons/dashboard-icons";
import { getTotalAnalytics } from "@/lib/data/analytics";
import { getLinksByProfileId } from "@/lib/data/links";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getSettingsByProfileId } from "@/lib/data/settings";
import { formatProfileUid } from "@/lib/profile";
import { SITE_HOST } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { cardClassName } from "@/components/dashboard/form-fields";

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;

  await syncMilestoneBadges(userId);

  const profile = await getProfileByUserId(userId);
  const links = await getLinksByProfileId(userId);
  const settings = await getSettingsByProfileId(userId);
  const analytics = await getTotalAnalytics(userId);

  const isLive = !!profile?.username;
  const displayName = profile?.display_name || profile?.username || "there";

  const stats = [
    {
      label: "UID",
      value: profile?.uid != null ? formatProfileUid(profile.uid) : "—",
      sub: profile?.uid != null ? "Your account number" : "Run v6_profile_uid.sql",
    },
    {
      label: "Status",
      value: isLive ? "Live" : "Draft",
      sub: isLive ? `/${profile!.username}` : "Set username",
      highlight: isLive,
    },
    {
      label: "Unique visitors",
      value: analytics.uniqueVisitors.toLocaleString(),
      sub: `${analytics.totalViews} total views`,
    },
    {
      label: "Link clicks",
      value: analytics.totalClicks.toLocaleString(),
      sub: `${links.length} links`,
    },
    {
      label: "Layout",
      value: settings.layout,
      sub: "Active theme",
    },
  ];

  const shortcuts = [
    {
      href: "/dashboard/customize",
      title: "Customize",
      desc: "Colors, fonts, card styling",
      Icon: IconCustomize,
    },
    {
      href: "/dashboard/background",
      title: "Background",
      desc: "Gradients, video, particles",
      Icon: IconBackground,
    },
    {
      href: "/dashboard/links",
      title: "Links",
      desc: "Drag, drop, animate",
      Icon: IconLinks,
    },
    {
      href: "/dashboard/effects",
      title: "Effects",
      desc: "Cursor, username, bio",
      Icon: IconEffects,
    },
    {
      href: "/dashboard/analytics",
      title: "Analytics",
      desc: "Views, clicks, countries",
      Icon: IconAnalytics,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bf-dash-hero relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(255,255,255,0.06),transparent_55%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-500">
              {isLive
                ? "Your page is live. Tweak your design, add links, or check who's visiting."
                : "Finish your profile setup and publish your page when you're ready."}
            </p>
            {isLive ? (
              <p className="mt-3 font-mono text-xs text-neutral-600">
                {SITE_HOST}/{profile!.username}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <IconOverview size={16} className="text-neutral-500" />
          <h2 className="text-sm font-semibold text-white">At a glance</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`${cardClassName} bf-dash-stat-card ${"highlight" in s && s.highlight ? "bf-dash-stat-card--live" : ""}`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">{s.label}</p>
              <p className="mt-2 text-2xl font-semibold capitalize text-white">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">Quick actions</h2>
          <Link href="/dashboard/profile" className="text-xs font-medium text-neutral-500 hover:text-white">
            All settings →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${cardClassName} group flex items-start gap-4 transition-all hover:border-white/15 hover:bg-[#161616]`}
            >
              <span className="inline-flex rounded-lg border border-white/[0.06] bg-[#0a0a0a] p-2.5 text-neutral-400 transition-colors group-hover:border-white/10 group-hover:text-white">
                <item.Icon size={18} />
              </span>
              <span className="min-w-0">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">{item.desc}</p>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
