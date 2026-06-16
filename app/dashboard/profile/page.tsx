import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { PageHeader, cardClassName } from "@/components/dashboard/form-fields";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getSettingsByProfileId } from "@/lib/data/settings";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  const [profile, settings] = await Promise.all([
    getProfileByUserId(userId),
    getSettingsByProfileId(userId),
  ]);

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your username, avatar, banner, bio, and display details."
      />
      <div className={cardClassName}>
        {settings ? (
          <ProfileEditor profile={profile} settings={settings} />
        ) : (
          <ProfileEditor profile={profile} />
        )}
      </div>
    </div>
  );
}
