import { PASSWORD_RESET_NEXT } from "@/lib/auth/auth-email-shared";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/** Dedicated PKCE callback for password reset emails — always lands on the reset form. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    redirect("/forgot-password?error=Invalid%20reset%20link");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(PASSWORD_RESET_NEXT);
}
