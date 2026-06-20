-- cried.bio v69: First-time setup wizard and dashboard tour completion flags

alter table public.account_preferences
  add column if not exists onboarding_wizard_completed_at timestamptz,
  add column if not exists dashboard_tour_completed_at timestamptz;

notify pgrst, 'reload schema';
