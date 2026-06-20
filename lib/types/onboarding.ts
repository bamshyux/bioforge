export type OnboardingState = {
  wizardCompletedAt: string | null;
  tourCompletedAt: string | null;
  needsSetupWizard: boolean;
  needsDashboardTour: boolean;
};

export type OnboardingActionState = {
  error?: string;
  success?: string;
};
