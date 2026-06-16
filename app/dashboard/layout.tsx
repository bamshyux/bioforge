import Link from "next/link";
import { redirect } from "next/navigation";
import { syncFounderBadges, syncSignupBadgesAction } from "@/app/actions/badges";
import { CriedLogo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmailVerificationBanner } from "@/components/dashboard/email-verification-banner";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ViewLiveProfileButton } from "@/components/dashboard/view-live-profile-button";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getAdminAccess } from "@/lib/auth/admin-access";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  await syncFounderBadges(userId);
  await syncSignupBadgesAction(userId);
  const email = (data.claims.email as string | undefined) ?? "User";
  const sessionId = data.claims.session_id as string | undefined;
  const { touchUserSession } = await import("@/lib/data/account-settings");
  await touchUserSession(userId, sessionId);
  const { data: userData } = await supabase.auth.getUser();
  const needsEmailVerification = Boolean(
    userData.user?.email && !userData.user.email_confirmed_at,
  );
  const profile = await getProfileByUserId(userId);
  const adminAccess = await getAdminAccess();
  const showAdminPanel = !!adminAccess;

  return (
    <div className="min-h-screen bg-[#090909] text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#090909]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 lg:px-8">
          <Link href="/dashboard" className="shrink-0">
            <CriedLogo size={28} />
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ViewLiveProfileButton username={profile?.username} />
            <span className="hidden h-4 w-px bg-white/[0.08] md:block" aria-hidden />
            <span className="hidden max-w-[180px] truncate text-[13px] text-neutral-500 lg:inline">
              {email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {needsEmailVerification && userData.user?.email ? (
        <EmailVerificationBanner email={userData.user.email} />
      ) : null}

      <DashboardShell>
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 lg:flex-row lg:items-start lg:px-8">
          <DashboardSidebar
            showAdminPanel={showAdminPanel}
            adminRole={adminAccess?.role}
          />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </DashboardShell>
    </div>
  );
}
