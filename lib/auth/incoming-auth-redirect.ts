import { type NextRequest, NextResponse } from "next/server";
import { PASSWORD_RESET_NEXT, SIGNUP_EMAIL_VERIFY_NEXT } from "@/lib/auth/auth-email-shared";

const AUTH_HANDLER_PREFIXES = ["/auth/callback", "/auth/confirm"];

function isAuthHandlerPath(pathname: string) {
  return AUTH_HANDLER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
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

/** Forward Supabase auth query params that land on the wrong page to the auth handlers. */
export function redirectIncomingAuthRequest(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;

  if (isAuthHandlerPath(pathname)) {
    return null;
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (code) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";

    if (!searchParams.has("next")) {
      const defaultNext = defaultNextForIncomingAuth(pathname, type);
      if (defaultNext) url.searchParams.set("next", defaultNext);
    }

    return NextResponse.redirect(url);
  }

  if (tokenHash && type) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/confirm";

    if (!searchParams.has("next")) {
      const defaultNext = defaultNextForIncomingAuth(pathname, type);
      if (defaultNext) url.searchParams.set("next", defaultNext);
    }

    return NextResponse.redirect(url);
  }

  return null;
}
