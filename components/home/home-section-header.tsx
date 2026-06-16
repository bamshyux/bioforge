import type { ReactNode } from "react";
import { Reveal } from "@/components/home/reveal";

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <Reveal className={`mb-12 max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-neutral-500">{description}</p>
      ) : null}
    </Reveal>
  );
}

export function HomeSection({
  id,
  children,
  className = "",
  withBorder = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28 ${withBorder ? "border-t border-white/[0.04]" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
