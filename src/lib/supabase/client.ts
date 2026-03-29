import { createClient } from "@supabase/supabase-js";

export const hasSupabasePublicEnv = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "public-anon-key-placeholder";

if (!hasSupabasePublicEnv) {
  // Warn once in browser runtime; avoid noisy logs during server builds.
  if (typeof window !== "undefined") {
    const marker = "__yuveda_missing_supabase_env_warned__";
    const host = window as typeof window & Record<string, unknown>;

    if (!host[marker]) {
      host[marker] = true;
      console.warn(
        "Supabase public env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for live data."
      );
    }
  }
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
