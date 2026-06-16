export type ExploreProfile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  view_count: number;
  created_at: string;
  premium_tier: "free" | "premium" | null;
};

export type ExploreProfilesResult = {
  profiles: ExploreProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  query: string;
};

export type SuggestedProfileReason = "featured" | "popular" | "recent" | "network";

export type SuggestedExploreProfile = ExploreProfile & {
  reason: SuggestedProfileReason;
};
