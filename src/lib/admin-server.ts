import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient, hasSupabaseServiceEnv } from "@/lib/supabase/service";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function isUserAdmin(email?: string | null, appMetadata?: Record<string, unknown>) {
  if (!email && !appMetadata) {
    return false;
  }

  if (appMetadata?.role === "admin" || appMetadata?.is_admin === true) {
    return true;
  }

  if (!email) {
    return false;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("app_admins")
      .select("email")
      .ilike("email", email)
      .maybeSingle();

    if (!error && data) {
      return true;
    }
  } catch {
    // Fall back to the service role check below when no request session is available.
  }

  if (!hasSupabaseServiceEnv()) {
    return false;
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("app_admins")
    .select("email")
    .ilike("email", email)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  const ok = await isUserAdmin(user?.email, user?.app_metadata);

  if (!user || !ok) {
    throw new Error("Unauthorized admin access.");
  }

  return user;
}

export async function getAdminSessionStatus() {
  const user = await getCurrentUser();
  const isAdmin = await isUserAdmin(user?.email, user?.app_metadata);

  return {
    user: user
      ? {
          id: user.id,
          email: user.email ?? null,
        }
      : null,
    isAdmin,
  };
}
