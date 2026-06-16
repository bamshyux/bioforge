import { type NextRequest, NextResponse } from "next/server";
import {
  AUTH_FLOW_RECOVERY,
  AUTH_FLOW_SIGNUP,
  PASSWORD_RECOVERY_CALLBACK,
  PASSWORD_RESET_NEXT,
  SIGNUP_EMAIL_VERIFY_NEXT,
} from "@/lib/auth/auth-email-shared";

const AUTH_HANDLER_PREFIXES = [
  "/auth/callback",
  "/auth/confirm",
  PASSWORD_RECOVERY_CALLBACK,
];

function isAuthHandlerPath(pathname: string) {
  return AUTH_HANDLER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
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

/** Forward Supabase auth query params that land on the wrong page to the auth handlers. */
export function redirectIncomingAuthRequest(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;

  if (isAuthHandlerPath(pathname)) {
    return null;
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const flow = searchParams.get("flow");

  if (code) {
    const url = request.nextUrl.clone();
    url.pathname =
      flow === AUTH_FLOW_RECOVERY || type === "recovery"
        ? PASSWORD_RECOVERY_CALLBACK
        : "/auth/callback";

    if (!searchParams.has("next")) {
      const defaultNext = defaultNextForIncomingAuth(pathname, type, flow);
      if (defaultNext) url.searchParams.set("next", defaultNext);
    }

    if (flow === AUTH_FLOW_RECOVERY && !searchParams.has("flow")) {
      url.searchParams.set("flow", AUTH_FLOW_RECOVERY);
    }

    return NextResponse.redirect(url);
  }

  if (tokenHash && type) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/confirm";

    if (!searchParams.has("next")) {
      const defaultNext = defaultNextForIncomingAuth(pathname, type, flow);
      if (defaultNext) url.searchParams.set("next", defaultNext);
    }

    return NextResponse.redirect(url);
  }

  return null;
}
