"use client";

import { useEffect } from "react";
import { PASSWORD_RESET_NEXT } from "@/lib/auth/auth-email-shared";

function isAuthHandlerPath(pathname: string) {
  return pathname.startsWith("/auth/callback") || pathname.startsWith("/auth/confirm");
}

/** Moves Supabase recovery tokens from the wrong page to the reset-password flow. */
export function AuthHashRecoveryRedirect() {
  useEffect(() => {
    const { hash, pathname, search } = window.location;
    const params = new URLSearchParams(search);
    const type = params.get("type");

    if (params.has("code") && !isAuthHandlerPath(pathname)) {
      const next = params.get("next") ?? PASSWORD_RESET_NEXT;
      const callbackParams = new URLSearchParams(search);
      if (!callbackParams.has("next")) {
        callbackParams.set("next", next);
      }
      window.location.replace(`/auth/callback?${callbackParams.toString()}${hash}`);
      return;
    }

    if (params.has("token_hash") && type && !isAuthHandlerPath(pathname)) {
      window.location.replace(`/auth/confirm${search}${hash}`);
      return;
    }

    if (!hash || hash.length <= 1) return;

    const hashParams = new URLSearchParams(hash.slice(1));
    const hashType = hashParams.get("type");
    const accessToken = hashParams.get("access_token");
    const isRecovery = hashType === "recovery" || hash.includes("type=recovery");

    if (!accessToken || !isRecovery) return;
    if (pathname === PASSWORD_RESET_NEXT) return;

    window.location.replace(`${PASSWORD_RESET_NEXT}${search}${hash}`);
  }, []);

  return null;
}
