"use client";

import { useCallback, useEffect, useState } from "react";
import { isLandingHash, smoothScrollToSection } from "@/lib/home/smooth-scroll";

export type HomeNavLink = {
  href: string;
  label: string;
};

export function HomeNavLinks({ links }: { links: HomeNavLink[] }) {
  const [activeHash, setActiveHash] = useState<string>("");
  const [scrollingTo, setScrollingTo] = useState<string | null>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!isLandingHash(href)) return;

      event.preventDefault();
      const id = href.slice(1);
      setScrollingTo(href);
      setActiveHash(href);

      const ok = smoothScrollToSection(id);
      if (!ok) setScrollingTo(null);

      window.history.replaceState(null, "", href);
    },
    [],
  );

  useEffect(() => {
    if (!scrollingTo) return;
    const timer = window.setTimeout(() => setScrollingTo(null), 1100);
    return () => window.clearTimeout(timer);
  }, [scrollingTo]);

  useEffect(() => {
    const sectionIds = links
      .map((link) => (isLandingHash(link.href) ? link.href.slice(1) : null))
      .filter(Boolean) as string[];

    const syncFromScroll = () => {
      if (scrollingTo) return;

      const offset = 120;
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = `#${id}`;
      }

      if (current) setActiveHash(current);
    };

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncFromScroll);
  }, [links, scrollingTo]);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !isLandingHash(hash)) return;

    window.requestAnimationFrame(() => {
      smoothScrollToSection(hash.slice(1));
      setActiveHash(hash);
    });
  }, []);

  return (
    <nav className="hidden items-center gap-6 text-sm lg:flex" aria-label="Landing page sections">
      {links.map((link) => {
        const isActive = activeHash === link.href;
        const isAnimating = scrollingTo === link.href;

        return (
          <a
            key={link.href}
            href={link.href}
            onClick={(event) => handleClick(event, link.href)}
            className={`bf-home-nav-link relative transition-colors ${
              isActive ? "text-white" : "text-neutral-500 hover:text-white"
            } ${isAnimating ? "bf-home-nav-link--scroll" : ""}`}
          >
            {link.label}
            <span
              className={`bf-home-nav-link__indicator absolute -bottom-1 left-0 h-px bg-white transition-all duration-500 ${
                isActive ? "w-full opacity-80" : "w-0 opacity-0"
              }`}
              aria-hidden
            />
          </a>
        );
      })}
    </nav>
  );
}
