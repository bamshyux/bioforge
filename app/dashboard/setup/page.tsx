import { redirect } from "next/navigation";
import { SetupWizard } from "@/components/onboarding/setup-wizard";
import { getOnboardingState } from "@/lib/data/onboarding";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getSettingsByProfileId } from "@/lib/data/settings";
import { createClient } from "@/lib/supabase/server";

export default async function SetupPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  const profile = await getProfileByUserId(userId);
  const onboarding = await getOnboardingState(userId, profile?.username);

  if (!onboarding.needsSetupWizard) {
    redirect("/dashboard");
  }

  const [settings, linksResult] = await Promise.all([
    getSettingsByProfileId(userId),
    supabase
      .from("links")
      .select("*")
      .eq("profile_id", userId)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <div className="min-h-[calc(100vh-4.25rem)] bg-[#090909] px-5 py-12">
      <SetupWizard
        profile={profile}
        settings={settings}
        links={linksResult.data ?? []}
      />
    </div>
  );
}
