import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import {
  getDiscordClientId,
  getDiscordRedirectUri,
  isDiscordOAuthConfigured,
} from "@/lib/discord/config";

const STATE_COOKIE = "discord_oauth_state";
const USER_COOKIE = "discord_oauth_uid";

export async function GET() {
  if (!isDiscordOAuthConfigured()) {
    return NextResponse.redirect(new URL("/dashboard/widgets?discord=not_configured", getSiteUrl()));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    return NextResponse.redirect(new URL("/login", getSiteUrl()));
  }

  const state = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  cookieStore.set(USER_COOKIE, data.claims.sub as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: getDiscordClientId(),
    redirect_uri: getDiscordRedirectUri(),
    response_type: "code",
    scope: "identify",
    state,
  });

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
}
