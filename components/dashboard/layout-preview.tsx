import type { ReactNode } from "react";
import type { ProfileLayout } from "@/lib/types/settings";

const BASE =
  "relative h-16 w-full overflow-hidden rounded-md border border-white/[0.08] bg-[#0a0a0a]";

function Line({ w = "w-full", h = "h-1", className = "" }: { w?: string; h?: string; className?: string }) {
  return <div className={`rounded bg-white/10 ${h} ${w} ${className}`.trim()} />;
}

function Avatar({ className = "h-4 w-4" }: { className?: string }) {
  return <div className={`shrink-0 rounded-full bg-white/20 ${className}`.trim()} />;
}

function Banner({ h = "h-5" }: { h?: string }) {
  return <div className={`${h} bg-white/[0.06]`} />;
}

const LAYOUT_PREVIEWS: Record<ProfileLayout, ReactNode> = {
  classic: (
    <div className={BASE}>
      <Banner />
      <Avatar className="absolute left-2 top-4 h-4 w-4 border border-[#0a0a0a]" />
      <div className="mt-5 space-y-1 px-2">
        <Line w="w-8" className="bg-white/15" />
        <Line />
      </div>
    </div>
  ),

  modern: (
    <div className={`${BASE} flex flex-col items-center justify-center gap-1 p-2`}>
      <Avatar className="h-4 w-4" />
      <Line w="w-10" className="bg-white/15" />
      <Line w="w-14" />
    </div>
  ),

  gaming: (
    <div className={BASE}>
      <div className="border-b border-white/10 bg-white/[0.04] px-2 py-1">
        <Line w="w-12" h="h-1" className="bg-white/20" />
      </div>
      <div className="flex gap-2 p-2">
        <Avatar className="h-5 w-5" />
        <div className="flex-1 space-y-1">
          <Line w="w-10" className="bg-white/15" />
          <Line />
        </div>
      </div>
    </div>
  ),

  portfolio: (
    <div className={`${BASE} flex`}>
      <div className="flex w-2/5 flex-col items-center border-r border-white/10 bg-white/[0.04] p-1.5">
        <Avatar className="h-5 w-5" />
        <Line w="w-8" className="mt-1 bg-white/15" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2">
        <Line w="w-10" className="bg-white/15" />
        <Line />
        <Line w="w-3/4" />
      </div>
    </div>
  ),

  minimal: (
    <div className={`${BASE} flex flex-col justify-center gap-1 px-3 py-2`}>
      <Line w="w-12" h="h-1.5" className="bg-white/20" />
      <Line w="w-8" className="bg-white/10" />
      <Line />
    </div>
  ),

  stacked: (
    <div className={BASE}>
      <Banner h="h-4" />
      <div className="flex flex-col items-center -mt-2">
        <Avatar className="h-5 w-5 border border-[#0a0a0a]" />
        <Line w="w-10" className="mt-1 bg-white/15" />
      </div>
      <div className="mt-1 space-y-1 px-3">
        <Line />
      </div>
    </div>
  ),

  split: (
    <div className={`${BASE} flex`}>
      <div className="w-1/2 border-r border-white/10 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="flex flex-1 flex-col justify-center gap-1 p-2">
        <Line w="w-8" className="bg-white/15" />
        <Line />
      </div>
    </div>
  ),

  terminal: (
    <div className={BASE}>
      <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
      </div>
      <div className="p-2 font-mono text-[8px] text-emerald-400/80">
        <div>&gt; profile</div>
        <div className="text-white/30">---</div>
      </div>
    </div>
  ),

  compact: (
    <div className={`${BASE} flex flex-col justify-center gap-1.5 p-2`}>
      <div className="flex items-center gap-2">
        <Avatar className="h-4 w-4" />
        <Line w="w-10" className="bg-white/15" />
      </div>
      <div className="flex gap-1">
        <Line w="w-4" className="bg-white/15" />
        <Line w="w-4" className="bg-white/15" />
        <Line w="w-4" className="bg-white/15" />
      </div>
    </div>
  ),

  card: (
    <div className={`${BASE} flex items-center justify-center p-2`}>
      <div className="w-3/4 rounded-lg border border-white/10 bg-[#141414] p-2 shadow-lg">
        <div className="flex flex-col items-center gap-1">
          <Avatar className="h-3 w-3" />
          <Line w="w-8" className="bg-white/15" />
          <Line w="w-full" />
        </div>
      </div>
    </div>
  ),

  neon: (
    <div className={`${BASE} p-[1px]`} style={{ background: "linear-gradient(135deg,#a855f7,#ec4899,#a855f7)" }}>
      <div className="flex h-full flex-col justify-center gap-1 rounded-[5px] bg-[#0a0a0a] p-2">
        <Line w="w-10" className="bg-white/15 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
        <Line />
      </div>
    </div>
  ),

  magazine: (
    <div className={BASE}>
      <Avatar className="absolute right-2 top-2 h-4 w-4" />
      <div className="p-2 pr-8">
        <Line w="w-3" h="h-0.5" className="bg-white/20" />
        <Line w="w-14" h="h-2" className="mt-1 bg-white/20" />
        <Line w="w-10" className="mt-1 bg-white/10" />
      </div>
    </div>
  ),

  bento: (
    <div className={`${BASE} grid grid-cols-3 gap-1 p-1.5`}>
      <div className="col-span-2 rounded bg-white/10" />
      <div className="rounded bg-white/5" />
      <div className="rounded bg-white/5" />
      <div className="col-span-2 rounded bg-white/5" />
    </div>
  ),

  sidebar: (
    <div className={`${BASE} flex`}>
      <div className="flex w-1/3 flex-col items-center justify-center gap-1 border-r border-white/10 bg-white/[0.04] p-1">
        <Avatar className="h-4 w-4" />
        <Line w="w-6" className="bg-white/15" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 p-2">
        <Line />
        <Line w="w-3/4" />
      </div>
    </div>
  ),

  hero: (
    <div className={BASE}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
      <div className="absolute bottom-2 left-2 space-y-1">
        <Line w="w-12" h="h-1.5" className="bg-white/25" />
        <Line w="w-8" className="bg-white/15" />
      </div>
    </div>
  ),

  polaroid: (
    <div className={`${BASE} flex items-center justify-center bg-[#111]`}>
      <div className="-rotate-6 rounded-sm bg-white p-1 shadow-md">
        <div className="h-7 w-10 bg-neutral-300" />
        <Line w="w-10" h="h-0.5" className="mt-1 bg-neutral-400" />
      </div>
    </div>
  ),

  cinematic: (
    <div className={BASE}>
      <div className="absolute inset-x-0 top-0 h-2 bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-black" />
      <div className="flex h-full items-center justify-center px-4">
        <Line w="w-full" className="bg-white/15" />
      </div>
    </div>
  ),

  showcase: (
    <div className={`${BASE} flex flex-col items-center justify-center`}>
      <div className="relative">
        <div className="absolute -inset-1.5 rounded-full border border-white/10" />
        <div className="absolute -inset-3 rounded-full border border-white/5" />
        <Avatar className="relative h-5 w-5" />
      </div>
      <Line w="w-10" className="mt-2 bg-white/15" />
    </div>
  ),

  retro: (
    <div className={BASE}>
      <div className="flex items-center gap-1 border-b border-white/20 bg-[#1a1a2e] px-2 py-0.5">
        <Line w="w-8" h="h-1" className="bg-white/20" />
      </div>
      <div className="border border-t-0 border-white/15 p-2">
        <Line w="w-10" className="bg-white/15" />
        <Line className="mt-1" />
      </div>
    </div>
  ),

  poster: (
    <div className={`${BASE} flex`}>
      <div className="w-2 bg-rose-500/80" />
      <div className="flex flex-1 flex-col justify-end gap-1 p-2">
        <Line w="w-12" h="h-2" className="bg-white/20" />
        <Line w="w-8" className="bg-white/10" />
      </div>
    </div>
  ),

  glass: (
    <div className={`${BASE} bg-[#0a0a0a]/80`}>
      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-purple-500/30 blur-sm" />
      <div className="absolute bottom-1 right-2 h-3 w-3 rounded-full bg-cyan-500/30 blur-sm" />
      <div className="absolute inset-1 rounded border border-white/10 bg-white/[0.04] backdrop-blur-sm">
        <div className="flex h-full flex-col items-center justify-center gap-1 p-1">
          <Line w="w-10" className="bg-white/15" />
          <Line w="w-8" />
        </div>
      </div>
    </div>
  ),

  vaporwave: (
    <div className={BASE}>
      <div
        className="h-8 px-2 pt-1"
        style={{
          background:
            "repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0 1px,transparent 1px 8px),repeating-linear-gradient(0deg,rgba(255,255,255,0.05) 0 1px,transparent 1px 8px)",
        }}
      >
        <Line w="w-10" h="h-1.5" className="-skew-x-6 bg-white/20" />
      </div>
      <div className="h-0.5 bg-gradient-to-r from-[#ff71ce] via-[#01cdfe] to-[#05ffa1]" />
      <div className="space-y-1 p-2">
        <Line />
      </div>
    </div>
  ),

  brutalist: (
    <div className={`${BASE} border-2 border-white bg-[#090909] p-0`}>
      <div className="border-b-2 border-white px-2 py-1.5">
        <Line w="w-12" h="h-2" className="bg-white/25" />
      </div>
      <div className="space-y-1 p-2">
        <Line />
      </div>
    </div>
  ),

  newspaper: (
    <div className={BASE}>
      <div className="border-b border-white/20 px-2 pb-1 pt-1.5 text-center">
        <Line w="w-16" h="h-0.5" className="mx-auto bg-white/15" />
        <Line w="w-12" h="h-1.5" className="mx-auto mt-1 bg-white/20" />
      </div>
      <div className="grid grid-cols-2 gap-1 p-1.5">
        <Line />
        <Line />
      </div>
    </div>
  ),

  ticket: (
    <div className={`${BASE} flex`}>
      <div className="flex flex-1 flex-col justify-center gap-1 border-r border-dashed border-white/20 p-2">
        <Line w="w-10" className="bg-white/15" />
        <Line w="w-8" />
      </div>
      <div className="relative w-4 bg-black/30">
        <div className="absolute -left-1 top-2 h-2 w-2 rounded-full bg-[#0a0a0a]" />
        <div className="absolute -left-1 bottom-2 h-2 w-2 rounded-full bg-[#0a0a0a]" />
      </div>
    </div>
  ),

  vinyl: (
    <div className={`${BASE} flex gap-2 p-2`}>
      <div className="relative h-12 w-12 shrink-0 rounded bg-white/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-black/40" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1">
        <Line w="w-10" className="bg-white/15" />
        <Line />
        <Line w="w-3/4" />
      </div>
    </div>
  ),

  discord: (
    <div className={BASE}>
      <Banner h="h-4" />
      <Avatar className="absolute left-2 top-3 h-4 w-4 border-2 border-[#0a0a0a]" />
      <span className="absolute left-5 top-5 h-1.5 w-1.5 rounded-full border border-[#0a0a0a] bg-emerald-500" />
      <div className="mt-4 space-y-1 px-2">
        <Line w="w-8" className="bg-white/15" />
        <Line />
      </div>
    </div>
  ),

  twitch: (
    <div className={BASE}>
      <div className="flex items-center justify-between bg-[#6441a5]/40 px-2 py-1">
        <Line w="w-8" h="h-1" className="bg-white/20" />
        <span className="rounded bg-red-600/80 px-1 text-[6px] font-bold uppercase text-white">Live</span>
      </div>
      <div className="flex gap-2 p-2">
        <Avatar className="h-4 w-4" />
        <Line w="w-10" className="mt-1 bg-white/15" />
      </div>
    </div>
  ),

  idcard: (
    <div className={`${BASE} flex items-stretch p-1.5`}>
      <div className="flex w-2/5 flex-col items-center justify-center rounded-l border border-white/10 bg-white/[0.04] p-1">
        <Avatar className="h-5 w-5" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 border border-l-0 border-white/10 p-1.5">
        <Line w="w-10" className="bg-white/15" />
        <Line w="w-8" />
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-2 w-0.5 bg-white/20" />
          ))}
        </div>
      </div>
    </div>
  ),

  blueprint: (
    <div
      className={BASE}
      style={{
        background:
          "linear-gradient(#1e3a5f 1px,transparent 1px),linear-gradient(90deg,#1e3a5f 1px,transparent 1px)",
        backgroundSize: "8px 8px",
        backgroundColor: "#0c1929",
      }}
    >
      <div className="p-2 font-mono text-[7px] text-sky-300/90">
        <div>PLAN: profile_v1</div>
        <Line w="w-12" className="mt-1 bg-sky-400/30" />
      </div>
    </div>
  ),

  comic: (
    <div className={`${BASE} border-2 border-black bg-[#fef08a] p-1`}>
      <div className="grid h-full grid-cols-2 gap-1">
        <div className="rounded border-2 border-black bg-white p-1">
          <Avatar className="h-3 w-3" />
        </div>
        <div className="rounded border-2 border-black bg-white p-1">
          <Line w="w-full" h="h-1.5" className="bg-black/20" />
        </div>
      </div>
    </div>
  ),

  cyberpunk: (
    <div className={BASE}>
      <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.08)_2px,rgba(255,255,255,0.08)_4px)]" />
      <div className="relative flex h-full gap-1.5 p-2">
        <div className="w-0.5 shrink-0 rounded bg-cyan-400/80" />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <Line w="w-10" className="bg-cyan-400/40" />
          <Line className="bg-white/10" />
        </div>
      </div>
    </div>
  ),

  luxury: (
    <div className={`${BASE} flex flex-col items-center justify-center gap-1 p-2`}>
      <div className="h-px w-8 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <Avatar className="h-4 w-4" />
      <Line w="w-10" className="bg-white/15" />
      <div className="h-px w-6 bg-white/10" />
    </div>
  ),

  receipt: (
    <div className={`${BASE} flex items-center justify-center bg-[#111] p-2`}>
      <div className="h-full w-3/4 bg-[#f5f0e6] px-2 py-1 font-mono text-[6px] text-[#1a1a1a]">
        <div className="text-center uppercase">cried.bio</div>
        <div className="my-1 border-t border-dashed border-neutral-400" />
        <Line w="w-full" h="h-0.5" className="bg-neutral-400" />
      </div>
    </div>
  ),

  zine: (
    <div className={BASE}>
      <div className="border-b-2 border-white/20 px-2 py-1.5">
        <Line w="w-8" h="h-0.5" className="bg-white/15" />
        <Line w="w-12" h="h-1.5" className="mt-1 bg-white/25" />
      </div>
      <div className="relative p-2">
        <div className="absolute left-3 top-0 h-3 w-6 -rotate-3 bg-white/10" />
        <Line />
      </div>
    </div>
  ),

  orbit: (
    <div className={`${BASE} flex flex-col items-center justify-center`}>
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border border-dashed border-white/20" />
        <div className="absolute inset-1 rounded-full border border-white/10" />
        <Avatar className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <Line w="w-8" className="mt-1 bg-white/15" />
    </div>
  ),

  wave: (
    <div className={BASE}>
      <div className="relative h-8 bg-gradient-to-br from-white/15 to-transparent">
        <Line w="w-10" className="absolute left-2 top-2 bg-white/20" />
        <svg className="absolute -bottom-px left-0 w-full text-[#0a0a0a]" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden>
          <path d="M0,6 C25,12 75,0 100,6 L100,12 L0,12 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="space-y-1 p-2">
        <Line />
      </div>
    </div>
  ),

  mosaic: (
    <div className={BASE}>
      <div className="grid h-6 grid-cols-4 gap-px">
        {["bg-rose-500/40", "bg-amber-500/40", "bg-emerald-500/40", "bg-sky-500/40"].map((c, i) => (
          <div key={i} className={c} />
        ))}
      </div>
      <div className="flex gap-2 p-2">
        <Avatar className="h-4 w-4" />
        <Line w="w-10" className="mt-1 bg-white/15" />
      </div>
    </div>
  ),

  aurora: (
    <div className={BASE}>
      <div className="h-6 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-purple-500/30" />
      <div className="flex flex-col items-center gap-1 p-2">
        <Avatar className="h-4 w-4" />
        <Line w="w-10" className="bg-white/15" />
      </div>
    </div>
  ),

  hologram: (
    <div
      className={`${BASE} p-[1px]`}
      style={{ background: "linear-gradient(135deg,#22d3ee,#a855f7,#f472b6,#22d3ee)" }}
    >
      <div className="flex h-full flex-col items-center justify-center gap-1 rounded-[5px] bg-[#0a0a0a] p-2">
        <Avatar className="h-4 w-4" />
        <Line w="w-10" className="bg-white/15" />
      </div>
    </div>
  ),

  spotify: (
    <div className={BASE}>
      <div className="mx-auto mt-1 h-8 w-8 rounded bg-white/10" />
      <div className="space-y-1 px-3 pt-1">
        <Line w="w-12" h="h-1.5" className="bg-white/20" />
        <Line w="w-8" />
      </div>
    </div>
  ),

  spotlight: (
    <div className={`${BASE} bg-black`}>
      <div
        className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at top,rgba(255,255,255,0.15),transparent 70%)" }}
      />
      <div className="relative flex h-full flex-col items-center justify-end gap-1 pb-2">
        <Avatar className="h-4 w-4" />
        <Line w="w-8" className="bg-white/15" />
      </div>
    </div>
  ),

  custom: (
    <div className={`${BASE} flex items-center justify-center bg-gradient-to-br from-[var(--bf-accent,#fafafa)]/20 to-transparent`}>
      <span className="text-[10px] font-medium text-white/50">CSS</span>
    </div>
  ),
};

export function LayoutPreview({ layout }: { layout: ProfileLayout }) {
  return LAYOUT_PREVIEWS[layout] ?? LAYOUT_PREVIEWS.classic;
}
