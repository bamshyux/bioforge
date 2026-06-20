"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function SetupRedirect({ needsSetupWizard }: { needsSetupWizard: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSetupRoute = pathname.startsWith("/dashboard/setup");

  useEffect(() => {
    if (needsSetupWizard && !isSetupRoute) {
      router.replace("/dashboard/setup");
      return;
    }
    if (!needsSetupWizard && isSetupRoute) {
      router.replace("/dashboard");
    }
  }, [needsSetupWizard, isSetupRoute, router]);

  return null;
}
