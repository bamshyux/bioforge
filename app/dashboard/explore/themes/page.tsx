import { redirect } from "next/navigation";
import { CommunityThemesShell } from "@/components/dashboard/community-themes/community-themes-shell";
import {
  getFeaturedCommunityThemeSections,
  getMyPublishedThemes,
  searchCommunityThemes,
} from "@/lib/data/community-themes";
import { getProfileByUserId } from "@/lib/data/profiles";
import type { CommunityThemeListingType } from "@/lib/types/community-theme";
import { createClient } from "@/lib/supabase/server";

function resolveListingType(type?: string): CommunityThemeListingType | "all" {
  if (type === "profile_preset" || type === "theme") return type;
  return "all";
}

export default async function CommunityThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) redirect("/login");

  const userId = data.claims.sub as string;
  const params = await searchParams;
  const listingType = resolveListingType(params.type);

  const [initial, featured, myPublished, profile] = await Promise.all([
    searchCommunityThemes({ page: 1, userId, listingType }),
    getFeaturedCommunityThemeSections(userId),
    getMyPublishedThemes(userId),
    getProfileByUserId(userId),
  ]);

  return (
    <CommunityThemesShell
      userId={userId}
      initial={initial}
      initialListingType={listingType}
      featured={featured}
      myPublished={myPublished}
      username={profile?.username}
      displayName={profile?.display_name}
    />
  );
}
