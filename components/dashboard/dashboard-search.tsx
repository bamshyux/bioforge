"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDashboardSearchIndex } from "@/lib/dashboard/navigation";

export function DashboardSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => getDashboardSearchIndex(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 12);
    return index.filter((entry) => {
      const haystack = [
        entry.label,
        entry.description ?? "",
        entry.section,
        ...(entry.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    }).slice(0, 12);
  }, [index, query]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      navigate(results[activeIndex].href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111] px-3.5 py-2 text-sm text-neutral-500 transition-colors hover:border-white/10 hover:text-neutral-400 md:flex md:min-w-[220px] lg:min-w-[280px]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" strokeLinecap="round" />
        </svg>
        <span className="flex-1 text-left">Search dashboard…</span>
        <kbd className="rounded border border-white/[0.08] bg-[#0a0a0a] px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-xl border border-white/[0.06] bg-[#111] p-2.5 text-neutral-500 md:hidden"
        aria-label="Search dashboard"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="shrink-0 text-neutral-500">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages…"
                className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-neutral-600"
              />
            </div>
            <ul className="max-h-[min(360px,50vh)] overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-neutral-500">No pages found</li>
              ) : (
                results.map((entry, i) => (
                  <li key={`${entry.href}-${entry.label}`}>
                    <button
                      type="button"
                      onClick={() => navigate(entry.href)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        i === activeIndex ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-medium text-white">{entry.label}</span>
                        <span className="mt-0.5 block text-xs text-neutral-500">
                          {entry.section}
                          {entry.description ? ` · ${entry.description}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-[10px] uppercase tracking-wider text-neutral-600">Go</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-neutral-600">
              ↑↓ navigate · ↵ open · esc close
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function DashboardSearchHint() {
  return (
    <p className="text-xs text-neutral-600">
      Press{" "}
      <kbd className="rounded border border-white/[0.08] bg-[#111] px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      {" "}to search any dashboard page
    </p>
  );
}
