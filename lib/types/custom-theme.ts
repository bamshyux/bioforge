export type CustomTheme = {
  id: string;
  profile_id: string;
  name: string;
  css: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CustomThemeFormState = {
  error?: string;
  success?: string;
  themeId?: string;
};

export const MAX_CUSTOM_THEMES = 20;
export const MAX_CUSTOM_THEME_CSS_BYTES = 32 * 1024;
