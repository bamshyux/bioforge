import type { CSSProperties, ReactNode } from "react";
import { buildSelfGlowStyle, resolveSelfGlowStrength, type SelfGlowStrength } from "@/lib/self-glow";

type SelfGlowProps = {
  children: ReactNode;
  /** Optional separate bloom layer; defaults to duplicating children */
  duplicate?: ReactNode;
  enabled?: boolean;
  color: string;
  size: number;
  strength?: SelfGlowStrength | number;
  rounded?: "none" | "md" | "full";
  className?: string;
  animated?: boolean;
};

export function SelfGlow({
  children,
  duplicate,
  enabled = true,
  color,
  size,
  strength = "normal",
  rounded = "md",
  className = "",
  animated = false,
}: SelfGlowProps) {
  if (!enabled || resolveSelfGlowStrength(strength) <= 0) {
    return <>{children}</>;
  }

  const roundedClass =
    rounded === "full" ? "bf-self-glow--full" : rounded === "none" ? "bf-self-glow--none" : "bf-self-glow--md";

  return (
    <span
      className={[
        "bf-self-glow",
        roundedClass,
        animated ? "bf-self-glow--animated" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height: size,
        ...buildSelfGlowStyle(color, strength),
      } as CSSProperties}
    >
      <span className="bf-self-glow__bloom" aria-hidden>
        {duplicate ?? children}
      </span>
      <span className="bf-self-glow__surface">{children}</span>
    </span>
  );
}
