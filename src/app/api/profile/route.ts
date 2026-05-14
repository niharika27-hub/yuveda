import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [profile, addresses, orders, consultations] = await Promise.all([
    supabase.from("profiles").select("full_name,phone,avatar_url").eq("id", user.id).maybeSingle(),
    supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase
      .from("consultation_requests")
      .select("*")
      .or(`user_id.eq.${user.id},and(user_id.is.null,email.eq.${user.email})`)
      .order("created_at", { ascending: false }),
  ]);

  if (profile.error) return Response.json({ error: profile.error.message }, { status: 500 });
  if (addresses.error) return Response.json({ error: addresses.error.message }, { status: 500 });
  if (orders.error) return Response.json({ error: orders.error.message }, { status: 500 });
  if (consultations.error) {
    return Response.json({ error: consultations.error.message }, { status: 500 });
  }

  return Response.json({
    user: { id: user.id, email: user.email ?? null },
    profile: profile.data,
    addresses: addresses.data ?? [],
    orders: orders.data ?? [],
    consultations: consultations.data ?? [],
  });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { full_name?: string; phone?: string };
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: body.full_name?.trim() || null,
    phone: body.phone?.trim() || null,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
