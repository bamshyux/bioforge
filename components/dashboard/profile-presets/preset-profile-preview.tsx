"use client";

import type { CSSProperties } from "react";
import { buildCardStyle, getFontCss } from "@/lib/settings";
import { mergeSettings } from "@/lib/settings";
import type { ProfilePresetData } from "@/lib/types/profile-preset";
import type { ProfileSettings } from "@/lib/types/settings";

function presetToPreviewSettings(data: ProfilePresetData): ProfileSettings {
  return mergeSettings(data.settings as Partial<ProfileSettings>, "preview");
}

function readPageBackground(data: ProfilePresetData, settings: ProfileSettings): CSSProperties {
  if (settings.background_image_url) {
    return {
      backgroundImage: `url(${settings.background_image_url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  if (settings.animated_gradient && settings.gradient_colors?.length >= 2) {
    return {
      background: `linear-gradient(135deg, ${settings.gradient_colors.join(", ")})`,
    };
  }

  if (settings.background_color) {
    return { background: settings.background_color };
  }

  return { background: "linear-gradient(135deg, #141414, #090909)" };
}

export function PresetProfilePreview({
  data,
  name,
}: {
  data: ProfilePresetData;
  name: string;
}) {
  const settings = presetToPreviewSettings(data);
  const cardStyle = buildCardStyle(settings);
  const pageBackground = readPageBackground(data, settings);
  const displayName = data.profile.display_name || name;
  const bio = data.profile.bio?.trim() || "Profile bio preview";
  const avatar = data.profile.avatar_url;
  const accent = settings.accent_color || "#fafafa";
  const textColor = settings.text_color || "#fafafa";
  const fontFamily = getFontCss(settings.font_family);
  const linkPreview = data.links.slice(0, 2);

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-[#090909]"
      style={pageBackground}
    >
      {settings.background_video_url ? (
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      ) : null}
      {settings.vignette ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.55)" }}
          aria-hidden
        />
      ) : null}

      <div className="absolute inset-0 flex items-center justify-center p-3">
        <div
          className="w-full max-w-[220px] overflow-hidden"
          style={{
            ...cardStyle,
            color: textColor,
            fontFamily,
            transform: "scale(0.92)",
            transformOrigin: "center center",
          }}
        >
          {data.profile.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.profile.banner_url}
              alt=""
              className="h-10 w-full object-cover"
            />
          ) : (
            <div
              className="h-10 w-full"
              style={{
                background: `linear-gradient(135deg, ${accent}55, transparent)`,
              }}
            />
          )}

          <div className="p-3">
            <div className="mb-2 flex items-end gap-2">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt=""
                  className="-mt-5 h-10 w-10 shrink-0 rounded-full border-2 border-[#111] object-cover"
                />
              ) : (
                <div
                  className="-mt-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#111] text-sm font-bold text-[#090909]"
                  style={{ background: accent }}
                >
                  {displayName.charAt(0).toUpperCase() || "P"}
                </div>
              )}
              <div className="min-w-0 pb-0.5">
                <p
                  className="truncate text-sm font-semibold leading-tight"
                  style={{
                    color: textColor,
                    textShadow: settings.neon_glow ? `0 0 16px ${accent}88` : undefined,
                  }}
                >
                  {displayName}
                </p>
                <p className="truncate text-[10px] opacity-60">
                  {settings.layout_label || settings.layout}
                </p>
              </div>
            </div>

            <p className="mb-2 line-clamp-2 text-[10px] leading-relaxed opacity-80">{bio}</p>

            <div className="space-y-1.5">
              {linkPreview.length > 0 ? (
                linkPreview.map((link, index) => (
                  <div
                    key={`${link.title}-${index}`}
                    className="truncate rounded-md border px-2 py-1.5 text-[10px]"
                    style={{
                      borderColor: `${link.color || accent}44`,
                      backgroundColor: `${link.background_color || accent}18`,
                      color: textColor,
                    }}
                  >
                    {link.title}
                  </div>
                ))
              ) : (
                <div
                  className="rounded-md border px-2 py-1.5 text-[10px] opacity-70"
                  style={{ borderColor: `${accent}33`, backgroundColor: `${accent}12` }}
                >
                  Sample link
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
