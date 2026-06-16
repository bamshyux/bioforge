import { SUPER_ADMIN_EMAIL } from "@/lib/auth/super-admin";
import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types/admin";

export type AdminAccess = {
  userId: string;
  email: string;
  role: AdminRole;
};

export async function getProfileAdminRole(
  userId: string,
  email?: string | null,
): Promise<AdminRole | null> {
  const normalizedEmail = email?.trim().toLowerCase();
  if (normalizedEmail === SUPER_ADMIN_EMAIL) return "owner";

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return null;
  if (data.role === "owner") return "owner";
  if (data.role === "admin" || data.is_admin) return "admin";
  return null;
}

export async function getAdminAccess(): Promise<AdminAccess | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  const userId = data.claims.sub as string;
  const email = (data.claims.email as string | undefined) ?? "";
  const role = await getProfileAdminRole(userId, email);
  if (!role) return null;

  return { userId, email, role };
}

export async function requireAdminAccess(
  minRole: AdminRole = "admin",
): Promise<AdminAccess | { error: string }> {
  const access = await getAdminAccess();
  if (!access) return { error: "You do not have admin access." };
  if (minRole === "owner" && access.role !== "owner") {
    return { error: "Owner access required." };
  }
  return access;
}

export async function isAdminUser(userId: string, email?: string | null): Promise<boolean> {
  return (await getProfileAdminRole(userId, email)) !== null;
}
