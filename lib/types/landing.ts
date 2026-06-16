export type LandingProfile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
};

export type LandingStats = {
  total_users: number;
  total_profiles: number;
  total_profile_views: number;
  total_guestbook_posts: number;
  total_custom_themes: number;
  total_badges_granted: number;
};

export type LandingActivityItem = {
  id: string;
  type:
    | "profile_created"
    | "theme_created"
    | "badge_earned"
    | "milestone_reached"
    | "profile_updated"
    | "link_added"
    | "friend_added";
  title: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type LandingTestimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_title: string;
  author_username: string | null;
  author_avatar_url: string | null;
  is_active?: boolean;
};

export type LandingRoadmapItem = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "planned";
};

export type LandingThemePreview = {
  id: string;
  name: string;
  description: string;
  preview_style: string;
  install_count: number;
};

export type LandingFeaturedProfile = LandingProfile & {
  sort_order: number;
};

export type CookieConsentLevel = "all" | "essential";
