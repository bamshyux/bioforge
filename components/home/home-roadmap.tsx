import { HomeSection, HomeSectionHeader } from "@/components/home/home-section-header";
import { Reveal } from "@/components/home/reveal";
import type { LandingRoadmapItem } from "@/lib/types/landing";

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    dot: "bg-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  in_progress: {
    label: "In development",
    dot: "bg-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  planned: {
    label: "Planned",
    dot: "bg-neutral-500",
    border: "border-white/[0.06]",
    bg: "bg-[#141414]",
  },
} as const;

function RoadmapColumn({
  status,
  title,
  items,
}: {
  status: LandingRoadmapItem["status"];
  title: string;
  items: LandingRoadmapItem[];
}) {
  const config = STATUS_CONFIG[status];
  const filtered = items.filter((item) => item.status === status);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400">{title}</h3>
        <span className="text-xs text-neutral-600">({filtered.length})</span>
      </div>
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <Reveal key={item.id} delay={index * 40}>
            <div className={`rounded-xl border p-4 ${config.border} ${config.bg}`}>
              <p className="font-medium text-white">{item.title}</p>
              {item.description ? (
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{item.description}</p>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function HomeRoadmap({ items }: { items: LandingRoadmapItem[] }) {
  return (
    <HomeSection id="roadmap" withBorder>
      <HomeSectionHeader
        eyebrow="Roadmap"
        title="What we're building"
        description="Transparent progress on what's shipped, in progress, and coming next."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <RoadmapColumn status="completed" title="Completed" items={items} />
        <RoadmapColumn status="in_progress" title="In development" items={items} />
        <RoadmapColumn status="planned" title="Planned" items={items} />
      </div>
    </HomeSection>
  );
}
