"use client";

import { useMemo } from "react";
import { DEFAULT_CUSTOM_THEME_CSS, PROFILE_THEME_SELECTORS } from "@/lib/themes/default-template";
import { scopeProfileCss } from "@/lib/themes/scope-css";

/** Static mock profile used for live CSS preview in the theme builder. */
export function CustomThemePreview({
  css,
  username,
  displayName,
}: {
  css: string;
  username?: string | null;
  displayName?: string | null;
}) {
  const { css: scopedCss, errors } = useMemo(() => scopeProfileCss(css), [css]);
  const previewName = username?.trim() || displayName?.trim() || "yourname";
  const previewHandle = username?.trim() ? `@${username.trim()}` : "@yourname";
  const avatarInitial = previewName.charAt(0).toUpperCase() || "Y";

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
      <div className="border-b border-white/[0.06] px-3 py-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Live preview</p>
        {errors.length > 0 && (
          <p className="mt-1 text-[10px] text-amber-400">{errors[0]}</p>
        )}
      </div>
      <div className="relative flex min-h-[320px] items-center justify-center bg-gradient-to-br from-[#141414] to-[#090909] p-6">
        <div className="bf-profile-theme-root w-full max-w-sm" data-profile-theme="">
          {scopedCss ? <style dangerouslySetInnerHTML={{ __html: scopedCss }} /> : null}
          <div className="profile-card overflow-hidden">
            <div
              className="profile-banner h-20"
              style={{ background: "linear-gradient(135deg, #333, #111)" }}
            />
            <div className="profile-body p-4">
              <div className="profile-header mb-3 flex items-end gap-3">
                <div
                  className="profile-avatar flex h-14 w-14 items-center justify-center rounded-full bg-neutral-700 text-lg font-bold text-white"
                >
                  {avatarInitial}
                </div>
                <div>
                  <h1 className="username text-xl font-semibold text-white">{previewName}</h1>
                  <p className="profile-handle text-sm text-neutral-500">{previewHandle}</p>
                </div>
              </div>
              <div className="profile-meta mb-3 flex gap-3 text-xs text-neutral-400">
                <span>128 views</span>
                <span>Joined Jun 2026</span>
              </div>
              <p className="profile-bio mb-4 text-sm text-neutral-300">
                Create yourself a cried.bio profile.
              </p>
              <div className="profile-links space-y-2">
                <div className="profile-link rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                  My website
                </div>
                <div className="profile-link rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                  Discord
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CustomThemeSelectorHelp() {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3">
      <p className="mb-2 text-xs font-medium text-neutral-300">Available selectors</p>
      <p className="mb-2 text-[10px] text-neutral-500">
        CSS is automatically scoped to your profile card. Use these classes:
      </p>
      <code className="block whitespace-pre-wrap text-[10px] leading-relaxed text-neutral-400">
        {PROFILE_THEME_SELECTORS.join("\n")}
      </code>
    </div>
  );
}

export { DEFAULT_CUSTOM_THEME_CSS };
