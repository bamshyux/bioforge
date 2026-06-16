"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AUTH_FLOW_RECOVERY,
  AUTH_FLOW_SIGNUP,
  PASSWORD_RECOVERY_CALLBACK,
  PASSWORD_RESET_NEXT,
  SIGNUP_EMAIL_VERIFY_NEXT,
} from "@/lib/auth/auth-email-shared";

function isAuthHandlerPath(pathname: string) {
  return (
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/confirm") ||
    pathname.startsWith(PASSWORD_RECOVERY_CALLBACK)
  );
}

function defaultNextForIncomingAuth(
  pathname: string,
  type: string | null,
  flow: string | null,
): string | null {
  if (
    flow === AUTH_FLOW_RECOVERY ||
    type === "recovery" ||
    pathname === PASSWORD_RESET_NEXT ||
    pathname === PASSWORD_RECOVERY_CALLBACK
  ) {
    return PASSWORD_RESET_NEXT;
  }

  if (flow === AUTH_FLOW_SIGNUP || type === "signup" || type === "email") {
    return SIGNUP_EMAIL_VERIFY_NEXT;
  }

  return null;
}

/** Routes Supabase auth tokens that land on the wrong page to the correct handler. */
export function AuthHashRecoveryRedirect() {
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        window.location.replace(PASSWORD_RESET_NEXT);
      }
    });

    const { hash, pathname, search } = window.location;
    const params = new URLSearchParams(search);
    const type = params.get("type");
    const flow = params.get("flow");

    if (params.has("code") && !isAuthHandlerPath(pathname)) {
      const callbackParams = new URLSearchParams(search);
      if (!callbackParams.has("next")) {
        const defaultNext = defaultNextForIncomingAuth(pathname, type, flow);
        if (defaultNext) callbackParams.set("next", defaultNext);
      }

      const target =
        flow === AUTH_FLOW_RECOVERY || type === "recovery"
          ? PASSWORD_RECOVERY_CALLBACK
          : "/auth/callback";

      window.location.replace(`${target}?${callbackParams.toString()}${hash}`);
      subscription.unsubscribe();
      return;
    }

    if (params.has("token_hash") && type && !isAuthHandlerPath(pathname)) {
      const confirmParams = new URLSearchParams(search);
      if (!confirmParams.has("next")) {
        const defaultNext = defaultNextForIncomingAuth(pathname, type, flow);
        if (defaultNext) confirmParams.set("next", defaultNext);
      }
      window.location.replace(`/auth/confirm?${confirmParams.toString()}${hash}`);
      subscription.unsubscribe();
      return;
    }

    if (!hash || hash.length <= 1) {
      return () => subscription.unsubscribe();
    }

    const hashParams = new URLSearchParams(hash.slice(1));
    const hashType = hashParams.get("type");
    const accessToken = hashParams.get("access_token");

    if (!accessToken) {
      return () => subscription.unsubscribe();
    }

    if (hashType === "recovery" || hash.includes("type=recovery")) {
      if (pathname === PASSWORD_RESET_NEXT) {
        return () => subscription.unsubscribe();
      }
      window.location.replace(`${PASSWORD_RESET_NEXT}${search}${hash}`);
      subscription.unsubscribe();
      return;
    }

    if (hashType === "signup" || hashType === "email") {
      if (pathname === "/") {
        return () => subscription.unsubscribe();
      }
      window.location.replace(`/${search}${hash}`);
    }

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
