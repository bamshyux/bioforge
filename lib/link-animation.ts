import type { ProfileLink } from "@/lib/types/link";
import type { LinkAnimation, ProfileSettings } from "@/lib/types/settings";

export function resolveLinkAnimation(
  link: ProfileLink,
  settings: ProfileSettings,
): LinkAnimation {
  return (link.animation ?? settings.link_animation ?? "none") as LinkAnimation;
}

export function getLinkAnimationClass(animation: LinkAnimation) {
  switch (animation) {
    case "pulse":
      return "bf-link-anim--pulse";
    case "bounce":
      return "bf-link-anim--bounce";
    case "glow":
      return "bf-link-anim--glow";
    case "slide":
      return "bf-link-anim--slide";
    default:
      return "";
  }
}

export function getLinkAnimationGlowColor(link: ProfileLink, settings: ProfileSettings) {
  return link.color ?? settings.accent_color;
}

export function buildLinkAnimationProps(link: ProfileLink, settings: ProfileSettings) {
  const animation = resolveLinkAnimation(link, settings);
  const animClass = getLinkAnimationClass(animation);
  const hasAnim = animation !== "none";

  const hoverClass = settings.hover_animations
    ? hasAnim
      ? "transition-[color,background-color,border-color,filter,opacity] duration-200 hover:brightness-110"
      : "transition-all duration-200 hover:scale-[1.015] hover:brightness-110"
    : "";

  const animStyle =
    animation === "glow"
      ? ({ "--bf-link-glow": getLinkAnimationGlowColor(link, settings) } as Record<string, string>)
      : undefined;

  return { animation, animClass, hasAnim, hoverClass, animStyle };
}
