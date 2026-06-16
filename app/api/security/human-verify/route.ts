import { getRequestMeta } from "@/lib/data/account-settings";
import {
  createHumanChallenge,
  createHumanCookieValue,
  HUMAN_COOKIE_MAX_AGE_SEC,
  HUMAN_COOKIE_NAME,
  isHumanVerified,
  isTurnstileConfigured,
  verifyHumanChallenge,
  verifyTurnstileToken,
} from "@/lib/security/human-verification";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  if (mode === "status") {
    return NextResponse.json({
      verified: await isHumanVerified(),
      turnstile: isTurnstileConfigured(),
      siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? null,
    });
  }

  const challenge = createHumanChallenge();
  return NextResponse.json({
    challenge: challenge.challenge,
    turnstile: isTurnstileConfigured(),
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? null,
  });
}

export async function POST(request: Request) {
  let body: {
    challenge?: string;
    holdDurationMs?: number;
    turnstileToken?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const challenge = body.challenge ?? "";
  const holdDurationMs = Number(body.holdDurationMs ?? 0);
  const turnstileToken = body.turnstileToken?.trim();

  if (isTurnstileConfigured()) {
    if (!turnstileToken) {
      return NextResponse.json({ error: "Verification incomplete." }, { status: 400 });
    }
    const { ip_address } = await getRequestMeta();
    const ok = await verifyTurnstileToken(turnstileToken, ip_address);
    if (!ok) {
      return NextResponse.json({ error: "Verification failed. Try again." }, { status: 403 });
    }
  } else if (!verifyHumanChallenge(challenge, holdDurationMs)) {
    return NextResponse.json({ error: "Verification failed. Try again." }, { status: 403 });
  }

  const jar = await cookies();
  jar.set(HUMAN_COOKIE_NAME, createHumanCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: HUMAN_COOKIE_MAX_AGE_SEC,
    path: "/",
  });

  return NextResponse.json({ verified: true });
}
