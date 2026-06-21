export type PlatformUpdate = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  icon_url: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    username: string | null;
    display_name: string | null;
  };
};

export type PlatformUpdateFormState = { error?: string; success?: string };
