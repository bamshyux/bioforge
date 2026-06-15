"use server";

import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email";
import { syncSignupBadges } from "@/lib/badges/signup-badges";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getSiteUrl } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const repeatPassword = String(formData.get("repeatPassword") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password !== repeatPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return {
      error:
        "Account registration is temporarily unavailable. SUPABASE_SERVICE_ROLE_KEY must be set on the server.",
    };
  }

  try {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      const message = createError.message.toLowerCase();
      if (message.includes("already") || message.includes("registered")) {
        return { error: "An account with this email already exists. Try logging in." };
      }
      return { error: createError.message };
    }

    const supabase = await createClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { error: signInError.message };
    }

    if (signInData.user?.id) {
      await syncSignupBadges(signInData.user.id);
      const profile = await getProfileByUserId(signInData.user.id);
      void sendWelcomeEmail({
        to: email,
        displayName: profile?.display_name,
        username: profile?.username,
      });

      const { recordLoginEvent } = await import("@/lib/data/account-settings");
      await recordLoginEvent(signInData.user.id, true);
    } else if (created.user?.id) {
      await syncSignupBadges(created.user.id);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach Supabase.";

    if (message.includes("fetch failed") || message.includes("ENOTFOUND")) {
      return {
        error:
          "Cannot reach your Supabase project URL. Copy the exact Project URL from Supabase Dashboard → Settings → API into .env.local, then restart the dev server.",
      };
    }

    return { error: message };
  }

  redirect("/dashboard");
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user?.id) {
      const { recordLoginEvent } = await import("@/lib/data/account-settings");
      await recordLoginEvent(data.user.id, true);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach Supabase.";

    if (message.includes("fetch failed") || message.includes("ENOTFOUND")) {
      return {
        error:
          "Cannot reach your Supabase project URL. Copy the exact Project URL from Supabase Dashboard → Settings → API into .env.local, then restart the dev server.",
      };
    }

    return { error: message };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordResetAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Email is required." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { error: "Password reset is temporarily unavailable." };
  }

  const siteUrl = getSiteUrl();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${siteUrl}/auth/confirm?next=/auth/update-password`,
    },
  });

  if (error) {
    console.error("[auth] password reset link failed:", error.message);
  }

  if (!error && data.properties.action_link) {
    void sendPasswordResetEmail({ to: email, resetUrl: data.properties.action_link });
  }

  return {
    success: "If an account exists for that email, a reset link has been sent.",
  };
}

export async function updatePasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const repeatPassword = String(formData.get("repeatPassword") ?? "");

  if (!password || !repeatPassword) {
    return { error: "Password and confirmation are required." };
  }

  if (password !== repeatPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
