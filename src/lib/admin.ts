import { supabase } from "@/lib/supabase/client";

export function getAdminEmails() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.toLowerCase());
}

export async function isCurrentUserAdmin() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return false;
  }

  return (
    user.app_metadata?.role === "admin" ||
    user.app_metadata?.is_admin === true ||
    isAdminEmail(user.email)
  );
}
