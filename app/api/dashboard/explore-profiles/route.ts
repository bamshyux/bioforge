import {
  EXPLORE_PROFILES_PAGE_SIZE,
  searchExploreProfiles,
} from "@/lib/data/explore-profiles";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = data.claims.sub as string;
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? String(EXPLORE_PROFILES_PAGE_SIZE));

  const result = await searchExploreProfiles({
    query,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : EXPLORE_PROFILES_PAGE_SIZE,
    excludeUserId: userId,
  });

  return NextResponse.json(result);
}
