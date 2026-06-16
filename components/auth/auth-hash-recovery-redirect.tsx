"use client";

import { useEffect } from "react";
import { PASSWORD_RESET_NEXT, SIGNUP_EMAIL_VERIFY_NEXT } from "@/lib/auth/auth-email-shared";

function isAuthHandlerPath(pathname: string) {
  return pathname.startsWith("/auth/callback") || pathname.startsWith("/auth/confirm");
}

function defaultNextForIncomingAuth(pathname: string, type: string | null): string | null {
  if (type === "recovery" || pathname === PASSWORD_RESET_NEXT) {
    return PASSWORD_RESET_NEXT;
  }
  if (type === "signup" || type === "email") {
    return SIGNUP_EMAIL_VERIFY_NEXT;
  }
  if (pathname === "/") {
    return SIGNUP_EMAIL_VERIFY_NEXT;
  }
  return null;
}

/** Routes Supabase auth tokens that land on the wrong page to the correct handler. */
export function AuthHashRecoveryRedirect() {
  useEffect(() => {
    const { hash, pathname, search } = window.location;
    const params = new URLSearchParams(search);
    const type = params.get("type");

    if (params.has("code") && !isAuthHandlerPath(pathname)) {
      const callbackParams = new URLSearchParams(search);
      if (!callbackParams.has("next")) {
        const defaultNext = defaultNextForIncomingAuth(pathname, type);
        if (defaultNext) callbackParams.set("next", defaultNext);
      }
      window.location.replace(`/auth/callback?${callbackParams.toString()}${hash}`);
      return;
    }

    if (params.has("token_hash") && type && !isAuthHandlerPath(pathname)) {
      const confirmParams = new URLSearchParams(search);
      if (!confirmParams.has("next")) {
        const defaultNext = defaultNextForIncomingAuth(pathname, type);
        if (defaultNext) confirmParams.set("next", defaultNext);
      }
      window.location.replace(`/auth/confirm?${confirmParams.toString()}${hash}`);
      return;
    }

    if (!hash || hash.length <= 1) return;

    const hashParams = new URLSearchParams(hash.slice(1));
    const hashType = hashParams.get("type");
    const accessToken = hashParams.get("access_token");

    if (!accessToken) return;

    if (hashType === "recovery" || hash.includes("type=recovery")) {
      if (pathname === PASSWORD_RESET_NEXT) return;
      window.location.replace(`${PASSWORD_RESET_NEXT}${search}${hash}`);
      return;
    }

    if (hashType === "signup" || hashType === "email") {
      if (pathname === "/") return;
      window.location.replace(`/${search}${hash}`);
    }
  }, []);

  return null;
}
