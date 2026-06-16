export type AdminRole = "owner" | "admin";

export type AnnouncementType = "info" | "warning" | "update" | "maintenance";

export type PlatformStats = {
  total_users: number;
  new_users_today: number;
  active_users_today: number;
  total_profile_views: number;
  total_guestbook_posts: number;
  total_profiles_created: number;
  total_badges_granted: number;
};

export type AdminUserRow = {
  id: string;
  email: string | null;
  uid: number | null;
  username: string | null;
  display_name: string | null;
  role: string;
  is_admin: boolean;
  is_banned: boolean;
  is_disabled: boolean;
  premium_tier: string;
  premium_expires_at: string | null;
  badge_count: number;
  created_at: string;
  last_login_at: string | null;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  announcement_type: AnnouncementType;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminNotification = {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  is_read: boolean;
  created_by: string | null;
  created_at: string;
};

export type UserTimelineEvent = {
  id: string;
  user_id: string;
  event_type: string;
  title: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AdminAuditLog = {
  id: string;
  actor_id: string | null;
  actor_email: string;
  target_user_id: string | null;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
};

export type SecurityEvent = {
  id: string;
  user_id: string | null;
  event_type: string;
  ip_hash: string;
  user_agent: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type PlatformSettings = {
  maintenance_mode: boolean;
  read_only_mode: boolean;
  global_banner: string;
  global_banner_type: AnnouncementType;
  force_password_reset: boolean;
  updated_at: string;
};

export type ReservedUsername = {
  username: string;
  reason: string;
  created_at: string;
};

export type AdminFormState = { error?: string; success?: string };

export const ANNOUNCEMENT_TYPE_OPTIONS: { value: AnnouncementType; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "update", label: "Update" },
  { value: "maintenance", label: "Maintenance" },
];
