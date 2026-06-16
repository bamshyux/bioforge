import { AdminMiniChart, AdminPageHeader, AdminSection } from "@/components/admin/admin-ui";
import { getAdminAnalyticsSummary } from "@/lib/data/admin";

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalyticsSummary();

  return (
    <>
      <AdminPageHeader
        title="Platform Analytics"
        description="User growth, profile views, guestbook activity, and link clicks."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminMiniChart title="Daily signups (30d)" data={analytics.dailySignups} />
        <AdminMiniChart title="Profile views (30d)" data={analytics.dailyViews} />
        <AdminMiniChart title="Guestbook activity (30d)" data={analytics.dailyGuestbook} />
        <AdminMiniChart title="Link clicks (30d)" data={analytics.dailyClicks} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminSection title="Most viewed profiles">
          <ul className="space-y-2 text-sm">
            {analytics.mostViewedProfiles.map((p) => (
              <li key={p.username ?? "unknown"} className="flex justify-between text-neutral-300">
                <span>{p.username ?? "Unknown"}</span>
                <span>{p.views} views</span>
              </li>
            ))}
          </ul>
        </AdminSection>

        <AdminSection title="Most used layouts">
          <ul className="space-y-2 text-sm">
            {analytics.mostUsedLayouts.map((l) => (
              <li key={l.layout} className="flex justify-between text-neutral-300">
                <span>{l.layout}</span>
                <span>{l.count}</span>
              </li>
            ))}
          </ul>
        </AdminSection>
      </div>
    </>
  );
}
