const DEFAULT_OFFSET = 88;
const DEFAULT_DURATION = 980;

/** easeOutExpo — fast start, smooth deceleration */
function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function highlightSection(element: HTMLElement) {
  element.classList.remove("bf-home-section-focus");
  // Reflow so re-adding the class retriggers the animation
  void element.offsetWidth;
  element.classList.add("bf-home-section-focus");
  window.setTimeout(() => element.classList.remove("bf-home-section-focus"), 1400);
}

export function smoothScrollToSection(
  id: string,
  options?: { offset?: number; duration?: number },
): boolean {
  const element = document.getElementById(id);
  if (!element) return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.scrollIntoView({ behavior: "auto", block: "start" });
    highlightSection(element);
    return true;
  }

  const offset = options?.offset ?? DEFAULT_OFFSET;
  const duration = options?.duration ?? DEFAULT_DURATION;
  const startY = window.scrollY;
  const targetY = element.getBoundingClientRect().top + window.scrollY - offset;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) {
    highlightSection(element);
    return true;
  }

  const startTime = performance.now();
  let frameId = 0;

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo({ top: startY + distance * easeOutExpo(progress), behavior: "auto" });

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    } else {
      highlightSection(element);
    }
  };

  frameId = requestAnimationFrame(step);
  return true;
}

export function isLandingHash(href: string): boolean {
  return href.startsWith("#") && href.length > 1;
}
