import { type NextRequest, NextResponse } from "next/server";
import { PASSWORD_RESET_NEXT } from "@/lib/auth/auth-email-shared";

const AUTH_HANDLER_PREFIXES = ["/auth/callback", "/auth/confirm"];

function isAuthHandlerPath(pathname: string) {
  return AUTH_HANDLER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function shouldAssumePasswordRecovery(pathname: string, type: string | null) {
  return type === "recovery" || pathname === PASSWORD_RESET_NEXT || pathname === "/";
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

    if (!searchParams.has("next") && shouldAssumePasswordRecovery(pathname, type)) {
      url.searchParams.set("next", PASSWORD_RESET_NEXT);
    }

    return NextResponse.redirect(url);
  }

  if (tokenHash && type) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/confirm";

    if (type === "recovery" && !searchParams.has("next")) {
      url.searchParams.set("next", PASSWORD_RESET_NEXT);
    }

    return NextResponse.redirect(url);
  }

  return null;
}
