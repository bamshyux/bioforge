"use client";

import Image from "next/image";
import { useMemo, type CSSProperties } from "react";
import type { LandingProfile } from "@/lib/types/landing";

function FloatingCard({
  profile,
  style,
}: {
  profile: LandingProfile;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="bf-home-float-card pointer-events-none absolute w-44 overflow-hidden rounded-xl border border-white/[0.04] bg-[#111]/60 backdrop-blur-sm"
      style={style}
      aria-hidden
    >
      <div className="h-12 bg-gradient-to-br from-neutral-800 to-neutral-900" />
      <div className="relative px-3 pb-3 pt-0">
        <div className="-mt-5 mb-2 flex items-end gap-2">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-[#111]"
              unoptimized
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 text-[10px] font-semibold ring-1 ring-[#111]">
              {(profile.display_name || profile.username).charAt(0)}
            </div>
          )}
          <div className="min-w-0 pb-0.5">
            <p className="truncate text-[11px] font-medium text-white/70">{profile.display_name}</p>
            <p className="truncate text-[9px] text-neutral-600">@{profile.username}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded bg-white/[0.06]" />
          <div className="h-1.5 w-2/3 rounded bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

export function HomeFloatingCards({ profiles }: { profiles: LandingProfile[] }) {
  const cards = useMemo(() => {
    const positions = [
      { top: "8%", left: "4%", animationDelay: "0s", rotate: "-6deg" },
      { top: "18%", right: "6%", animationDelay: "1.2s", rotate: "8deg" },
      { top: "55%", left: "2%", animationDelay: "2.4s", rotate: "4deg" },
      { top: "70%", right: "4%", animationDelay: "0.8s", rotate: "-10deg" },
      { top: "40%", left: "8%", animationDelay: "1.8s", rotate: "-4deg" },
      { top: "30%", right: "10%", animationDelay: "3s", rotate: "6deg" },
    ];
    return profiles.slice(0, positions.length).map((profile, i) => ({
      profile,
      style: {
        ...positions[i],
        opacity: 0.12,
        transform: `rotate(${positions[i].rotate})`,
        animationDelay: positions[i].animationDelay,
      } as CSSProperties,
    }));
  }, [profiles]);

  if (!cards.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden max-lg:hidden" aria-hidden>
      {cards.map(({ profile, style }) => (
        <FloatingCard key={profile.id} profile={profile} style={style} />
      ))}
    </div>
  );
}
