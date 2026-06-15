import type { ProfileLayout } from "@/lib/types/settings";
import { LAYOUT_OPTIONS } from "@/lib/settings";

function previewKey(layout: ProfileLayout) {
  return LAYOUT_OPTIONS.find((option) => option.value === layout)?.preview ?? "classic";
}

export function LayoutPreview({ layout }: { layout: ProfileLayout }) {
  const base = "h-16 w-full overflow-hidden rounded-md border border-white/[0.08] bg-[#0a0a0a]";
  const key = previewKey(layout);

  switch (key) {
    case "modern":
    case "minimal":
    case "card":
      return (
        <div className={`${base} flex flex-col items-center justify-center gap-1 p-2`}>
          <div className="h-4 w-4 rounded-full bg-white/20" />
          <div className="h-1 w-10 rounded bg-white/15" />
          <div className="h-1 w-14 rounded bg-white/10" />
        </div>
      );
    case "split":
    case "sidebar":
      return (
        <div className={`${base} flex`}>
          <div className="w-1/3 border-r border-white/10 bg-white/[0.04]" />
          <div className="flex flex-1 flex-col gap-1 p-2">
            <div className="h-1.5 w-8 rounded bg-white/15" />
            <div className="h-1 w-full rounded bg-white/10" />
          </div>
        </div>
      );
    case "hero":
    case "cinematic":
    case "spotlight":
      return (
        <div className={`${base} relative`}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute bottom-2 left-2 h-1.5 w-10 rounded bg-white/20" />
        </div>
      );
    case "bento":
    case "mosaic":
      return (
        <div className={`${base} grid grid-cols-3 gap-1 p-1.5`}>
          <div className="col-span-2 rounded bg-white/10" />
          <div className="rounded bg-white/5" />
          <div className="rounded bg-white/5" />
          <div className="col-span-2 rounded bg-white/5" />
        </div>
      );
    case "terminal":
    case "blueprint":
      return (
        <div className={`${base} p-2 font-mono text-[8px] text-emerald-400/80`}>
          <div>&gt; profile</div>
          <div className="text-white/30">---</div>
        </div>
      );
    case "custom":
      return (
        <div className={`${base} flex items-center justify-center bg-gradient-to-br from-[var(--bf-accent)]/20 to-transparent`}>
          <span className="text-[10px] font-medium text-white/50">CSS</span>
        </div>
      );
    case "classic":
    default:
      return (
        <div className={`${base} relative`}>
          <div className="h-6 bg-white/[0.06]" />
          <div className="absolute left-2 top-4 h-4 w-4 rounded-full border border-[#0a0a0a] bg-white/20" />
          <div className="mt-5 space-y-1 px-2">
            <div className="h-1 w-8 rounded bg-white/15" />
            <div className="h-1 w-full rounded bg-white/10" />
          </div>
        </div>
      );
  }
}
