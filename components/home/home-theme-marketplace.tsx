import { HomeSection, HomeSectionHeader } from "@/components/home/home-section-header";
import { Reveal } from "@/components/home/reveal";
import type { LandingThemePreview } from "@/lib/types/landing";

export function HomeThemeMarketplace({ themes }: { themes: LandingThemePreview[] }) {
  return (
    <HomeSection id="themes" withBorder>
      <HomeSectionHeader
        eyebrow="Themes"
        title="Theme marketplace preview"
        description="Popular community themes creators are using to stand out."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme, index) => (
          <Reveal key={theme.id} delay={index * 60}>
            <div className="group overflow-hidden rounded-xl border border-white/[0.06] bg-[#141414] transition-all hover:border-white/[0.12]">
              <div
                className="relative h-32 transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ background: theme.preview_style }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,20,20,0.9)_0%,transparent_60%)]" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-2 w-16 rounded-full bg-white/20" />
                  <div className="mt-2 h-1.5 w-24 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-white">{theme.name}</h3>
                    <p className="mt-1 text-sm text-neutral-500">{theme.description}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-neutral-600">
                  <span className="font-medium text-neutral-400">{theme.install_count.toLocaleString()}</span>
                  {" "}installs
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </HomeSection>
  );
}
