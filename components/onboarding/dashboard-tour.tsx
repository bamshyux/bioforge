"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { completeDashboardTourAction } from "@/app/actions/onboarding";
import {
  buttonPrimaryClassName,
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/dashboard/form-fields";

export type DashboardTourStep = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export const DASHBOARD_TOUR_STEPS: DashboardTourStep[] = [
  {
    id: "profile",
    emoji: "👤",
    title: "Profile",
    description: "Manage your username, bio, avatar and profile information.",
  },
  {
    id: "appearance",
    emoji: "🎨",
    title: "Appearance",
    description: "Customize backgrounds, effects, layouts and themes.",
  },
  {
    id: "content",
    emoji: "🔗",
    title: "Content",
    description: "Add links, embeds, widgets and music.",
  },
  {
    id: "explore",
    emoji: "🌎",
    title: "Explore",
    description: "Find profiles, themes and leaderboards.",
  },
  {
    id: "settings",
    emoji: "⚙️",
    title: "Settings",
    description: "Manage account security and preferences.",
  },
];

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function getSpotlightRect(selector: string): SpotlightRect | null {
  const element = document.querySelector<HTMLElement>(`[data-tour="${selector}"]`);
  if (!element) return null;
  element.scrollIntoView({ block: "nearest", behavior: "smooth" });
  const rect = element.getBoundingClientRect();
  const padding = 8;
  return {
    top: Math.max(0, rect.top - padding),
    left: Math.max(0, rect.left - padding),
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

export function DashboardTour({ active }: { active: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [isPending, startTransition] = useTransition();
  const [visible, setVisible] = useState(active);

  const step = DASHBOARD_TOUR_STEPS[stepIndex];
  const isLastStep = stepIndex === DASHBOARD_TOUR_STEPS.length - 1;

  const updateSpotlight = useCallback(() => {
    if (!visible || !step) return;
    setSpotlight(getSpotlightRect(step.id));
  }, [visible, step]);

  useEffect(() => {
    setVisible(active);
    if (active) setStepIndex(0);
  }, [active]);

  useEffect(() => {
    if (!visible) return;
    updateSpotlight();
    const handleLayoutChange = () => updateSpotlight();
    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);
    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [visible, stepIndex, updateSpotlight]);

  const finishTour = () => {
    startTransition(async () => {
      await completeDashboardTourAction();
      setVisible(false);
    });
  };

  const handleSkip = () => finishTour();
  const handleNext = () => {
    if (isLastStep) {
      finishTour();
      return;
    }
    setStepIndex((index) => index + 1);
  };
  const handleBack = () => setStepIndex((index) => Math.max(0, index - 1));

  if (!visible || !step) return null;

  const tooltipTop = spotlight
    ? Math.min(spotlight.top + spotlight.height + 16, window.innerHeight - 220)
    : window.innerHeight / 2 - 100;
  const tooltipLeft = spotlight
    ? Math.min(Math.max(16, spotlight.left), window.innerWidth - 360)
    : Math.max(16, window.innerWidth / 2 - 180);

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" aria-hidden />

      {spotlight ? (
        <div
          className="pointer-events-none absolute rounded-xl border-2 border-[#fafafa]/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.72)] transition-all duration-200"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        />
      ) : null}

      <div
        className={`${cardClassName} absolute w-[min(100vw-2rem,22rem)] border border-white/[0.1] shadow-2xl`}
        style={{ top: tooltipTop, left: tooltipLeft }}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard tour"
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
          Dashboard tour · {stepIndex + 1}/{DASHBOARD_TOUR_STEPS.length}
        </p>
        <div className="mt-3 flex items-start gap-3">
          <span className="text-2xl" aria-hidden>{step.emoji}</span>
          <div>
            <h2 className="text-lg font-semibold text-white">{step.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-400">{step.description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isPending}
            className="text-sm text-neutral-500 transition-colors hover:text-white"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {stepIndex > 0 ? (
              <button type="button" onClick={handleBack} className={buttonSecondaryClassName}>
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleNext}
              disabled={isPending}
              className={buttonPrimaryClassName}
            >
              {isPending ? "Saving..." : isLastStep ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
