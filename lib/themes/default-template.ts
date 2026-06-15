/** Starter CSS shown in the editor and used when creating a new theme. */
export const DEFAULT_CUSTOM_THEME_CSS = `.profile-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.username {
  color: white;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.35);
}

.profile-handle {
  color: #a3a3a3;
}

.profile-avatar {
  border-radius: 9999px;
}

.profile-bio {
  color: #d4d4d4;
  line-height: 1.6;
}

.profile-link {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profile-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}`;

/** Scope class injected on the profile container — all user CSS is prefixed with this. */
export const PROFILE_THEME_SCOPE = "bf-profile-theme-root";

/** Semantic classes users can target in the theme editor. */
export const PROFILE_THEME_SELECTORS = [
  ".profile-card",
  ".profile-banner",
  ".profile-body",
  ".profile-header",
  ".profile-avatar",
  ".username",
  ".profile-handle",
  ".profile-meta",
  ".profile-bio",
  ".profile-badges",
  ".profile-links",
  ".profile-link",
  ".profile-embeds",
  ".profile-embed",
  ".profile-status",
  ".profile-social",
] as const;
