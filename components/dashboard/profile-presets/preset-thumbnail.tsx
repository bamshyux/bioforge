"use client";

import type { ProfilePresetData } from "@/lib/types/profile-preset";

function readAccent(data: ProfilePresetData): string {
  const accent = data.settings.accent_color;
  return typeof accent === "string" && accent.trim() ? accent : "#fafafa";
}

function readBackground(data: ProfilePresetData): string {
  const bgType = data.settings.background_type;
  const bgColor = data.settings.background_color;
  const bgImage = data.settings.background_image_url;
  const gradientColors = data.settings.gradient_colors;

  if (typeof bgImage === "string" && bgImage.trim()) {
    return `url(${bgImage}) center/cover no-repeat`;
  }

  if (Array.isArray(gradientColors) && gradientColors.length >= 2) {
    return `linear-gradient(135deg, ${gradientColors.join(", ")})`;
  }

  if (typeof bgColor === "string" && bgColor.trim()) {
    return bgColor;
  }

  if (bgType === "video") {
    return "linear-gradient(135deg, #1a1a2e, #090909)";
  }

  return "linear-gradient(135deg, #1f1f1f, #090909)";
}

export function PresetThumbnail({
  data,
  thumbnailUrl,
  name,
}: {
  data: ProfilePresetData;
  thumbnailUrl?: string | null;
  name: string;
}) {
  const accent = readAccent(data);
  const background = readBackground(data);
  const avatar = thumbnailUrl ?? data.profile.avatar_url ?? data.profile.banner_url;
  const displayName = data.profile.display_name || name;

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]"
      style={{ background }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative flex h-full flex-col justify-end p-3">
        <div
          className="rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-sm"
          style={{ boxShadow: `0 0 0 1px ${accent}22` }}
        >
          <div className="flex items-center gap-2.5">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#090909]"
                style={{ background: accent }}
              >
                {displayName.charAt(0).toUpperCase() || "P"}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{displayName}</p>
              <p className="truncate text-[11px] text-neutral-400">
                {(data.settings.layout_label as string) || String(data.settings.layout || "profile")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
