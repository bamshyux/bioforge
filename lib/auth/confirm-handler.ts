import {
  AUTH_FLOW_RECOVERY,
  AUTH_FLOW_SIGNUP,
  AUTH_INTENT_COOKIE,
  PASSWORD_RESET_NEXT,
  SIGNUP_EMAIL_VERIFY_NEXT,
} from "@/lib/auth/auth-email-shared";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/data/profiles";
import { sendWelcomeEmail } from "@/lib/email";
import { syncSignupBadges } from "@/lib/badges/signup-badges";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";

async function consumeAuthIntent(): Promise<string | null> {
  const cookieStore = await cookies();
  const intent = cookieStore.get(AUTH_INTENT_COOKIE)?.value ?? null;
  if (intent) {
    cookieStore.delete(AUTH_INTENT_COOKIE);
  }
  return intent;
}

function resolvePostConfirmRedirect(
  type: EmailOtpType | null,
  next: string,
  flow: string | null,
  authIntent: string | null,
): string {
  if (
    flow === AUTH_FLOW_RECOVERY ||
    type === "recovery" ||
    authIntent === AUTH_FLOW_RECOVERY
  ) {
    return PASSWORD_RESET_NEXT;
  }

  if (
    flow === AUTH_FLOW_SIGNUP ||
    type === "signup" ||
    type === "email" ||
    authIntent === AUTH_FLOW_SIGNUP
  ) {
    return SIGNUP_EMAIL_VERIFY_NEXT;
  }

  if (next.includes(PASSWORD_RESET_NEXT)) {
    return PASSWORD_RESET_NEXT;
  }

  if (next.includes("email_verified=1")) {
    return SIGNUP_EMAIL_VERIFY_NEXT;
  }

  return next;
}

/** Shared handler for /auth/confirm and /auth/callback (Supabase may use either). */
export async function handleAuthConfirm(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const flow = searchParams.get("flow");
  const next = searchParams.get("next") ?? "/dashboard";
  const authIntent = await consumeAuthIntent();

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect(resolvePostConfirmRedirect(type, next, flow, authIntent));
    }

    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email && (type === "signup" || type === "email")) {
        const profile = await getProfileByUserId(user.id);
        await syncSignupBadges(user.id);
        void sendWelcomeEmail({
          to: user.email,
          displayName: profile?.display_name,
          username: profile?.username,
        });
      }

      redirect(resolvePostConfirmRedirect(type, next, flow, authIntent));
    }

    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?error=Invalid confirmation link");
}
