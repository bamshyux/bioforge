"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { CARD_LAYOUT_MIN_HEIGHT } from "@/lib/settings";

type ScaleMetrics = {
  scale: number;
  boxHeight: number | undefined;
};

function computeScaleMetrics(naturalHeight: number, maxHeight: number): ScaleMetrics {
  const natural = Math.max(naturalHeight, CARD_LAYOUT_MIN_HEIGHT);

  if (maxHeight <= 0) {
    return { scale: 1, boxHeight: undefined };
  }

  const target = Math.max(CARD_LAYOUT_MIN_HEIGHT, maxHeight);
  const scale = Math.min(1, target / natural);

  return {
    scale,
    boxHeight: target,
  };
}

function measureNaturalContentHeight(el: HTMLElement) {
  const prevTransform = el.style.transform;
  const prevWidth = el.style.width;
  const prevMargin = el.style.marginInline;
  const prevOrigin = el.style.transformOrigin;

  el.style.transform = "none";
  el.style.transformOrigin = "top center";
  el.style.width = "100%";
  el.style.marginInline = "";

  const natural = Math.max(el.scrollHeight, CARD_LAYOUT_MIN_HEIGHT);

  el.style.transform = prevTransform;
  el.style.transformOrigin = prevOrigin;
  el.style.width = prevWidth;
  el.style.marginInline = prevMargin;

  return natural;
}

export function ProfileCardHeightScaler({
  maxHeight,
  children,
}: {
  maxHeight: number;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<ScaleMetrics>({ scale: 1, boxHeight: undefined });

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const natural = measureNaturalContentHeight(el);
      setMetrics(computeScaleMetrics(natural, maxHeight));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [maxHeight, children]);

  const constrained = metrics.scale < 1 && metrics.boxHeight !== undefined;

  return (
    <div
      className="profile-card-height-scaler"
      style={constrained ? { height: metrics.boxHeight, overflow: "hidden" } : undefined}
    >
      <div
        ref={contentRef}
        className="profile-card-height-scaler__content"
        style={
          constrained
            ? {
                transform: `scale(${metrics.scale})`,
                transformOrigin: "top center",
                width: `${100 / metrics.scale}%`,
                marginInline: "auto",
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}

export function measureProfileCardNaturalHeight(container: HTMLDivElement | null) {
  if (!container) return CARD_LAYOUT_MIN_HEIGHT;

  const content = container.querySelector<HTMLElement>(".profile-card-height-scaler__content");
  if (!content) return CARD_LAYOUT_MIN_HEIGHT;

  return measureNaturalContentHeight(content);
}
