"use client";

import { PROFILE_THEME_SCOPE } from "@/lib/themes/default-template";

export function ProfileThemeScope({
  scopedCss,
  children,
}: {
  scopedCss?: string | null;
  children: React.ReactNode;
}) {
  if (!scopedCss) return <>{children}</>;

  return (
    <div className={PROFILE_THEME_SCOPE} data-profile-theme="">
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      {children}
    </div>
  );
}
