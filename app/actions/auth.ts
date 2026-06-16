"use server";

import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email";
import { getResendClient } from "@/lib/email/client";
import { syncSignupBadges } from "@/lib/badges/signup-badges";
import { getProfileByUserId } from "@/lib/data/profiles";
import { getSiteUrl } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export type AuthActionState = {
  error?: string;
  success?: string;
};

async function finishNewSignup(userId: string, email: string) {
  await syncSignupBadges(userId);
  const profile = await getProfileByUserId(userId);
  void sendWelcomeEmail({
    to: email,
    displayName: profile?.display_name,
    username: profile?.username,
  });

  const { recordLoginEvent } = await import("@/lib/data/account-settings");
  await recordLoginEvent(userId, true);
}

function isDuplicateEmailError(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("already") || lower.includes("registered") || lower.includes("exists");
}

function isEmailDeliveryError(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("confirmation email") || lower.includes("error sending");
}

async function signUpWithAdmin(email: string, password: string): Promise<AuthActionState | "ok"> {
  const admin = createAdminClient();
  if (!admin) return { error: "admin_unavailable" };

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    if (isDuplicateEmailError(createError.message)) {
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

  const userId = signInData.user?.id ?? created.user?.id;
  if (userId) {
    await finishNewSignup(userId, email);
  }

  return "ok";
}

async function signUpWithPublicClient(email: string, password: string): Promise<AuthActionState | "ok"> {
  const supabase = await createClient();
  const siteUrl = getSiteUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    if (isDuplicateEmailError(error.message)) {
      return { error: "An account with this email already exists. Try logging in." };
    }
    if (isEmailDeliveryError(error.message)) {
      return { error: "email_delivery_failed" };
    }
    return { error: error.message };
  }

  if (data.session && data.user) {
    await finishNewSignup(data.user.id, email);
    return "ok";
  }

  if (data.user) {
    return {
      success: "Check your email for a confirmation link to activate your account.",
    };
  }

  return { error: "Could not create your account. Please try again." };
}

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

  try {
    const adminResult = await signUpWithAdmin(email, password);
    if (adminResult === "ok") {
      redirect("/dashboard");
    }

    if (adminResult.error !== "admin_unavailable") {
      return adminResult;
    }

    const publicResult = await signUpWithPublicClient(email, password);
    if (publicResult === "ok") {
      redirect("/dashboard");
    }

    if (publicResult.error === "email_delivery_failed") {
      console.error(
        "[auth] signup email delivery failed — add SUPABASE_SERVICE_ROLE_KEY to server env, or disable Confirm email in Supabase Auth settings.",
      );
      return {
        error:
          "We couldn't finish creating your account because email confirmation isn't configured. The site owner needs to add the Supabase secret key to the server or disable email confirmation in Supabase.",
      };
    }

    return publicResult;
  } catch (error) {
    if (isRedirectError(error)) throw error;

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
    if (isRedirectError(error)) throw error;

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

  const siteUrl = getSiteUrl();
  const nextPath = "/auth/update-password";
  const redirectTo = `${siteUrl}/auth/confirm?next=${encodeURIComponent(nextPath)}`;

  let sent = false;
  const admin = createAdminClient();

  if (admin && getResendClient()) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });

    if (!error && data.properties.hashed_token) {
      const resetUrl = `${siteUrl}/auth/confirm?token_hash=${encodeURIComponent(data.properties.hashed_token)}&type=recovery&next=${encodeURIComponent(nextPath)}`;
      const emailResult = await sendPasswordResetEmail({ to: email, resetUrl });
      if (emailResult.ok) {
        sent = true;
      } else {
        console.error("[auth] Resend password reset failed:", emailResult.error);
      }
    } else if (error) {
      console.error("[auth] password reset link failed:", error.message);
    }
  }

  if (!sent) {
    const supabase = await createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetError) {
      console.error("[auth] resetPasswordForEmail failed:", resetError.message);
      if (isEmailDeliveryError(resetError.message)) {
        return {
          error:
            "We couldn't send a reset email right now. Check Supabase Auth email settings or contact support.",
        };
      }
    } else {
      sent = true;
    }
  }

  if (!sent) {
    return {
      error: "Password reset is temporarily unavailable. Please try again later.",
    };
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
