import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user: error ? null : user };
}

export async function POST(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    recipient_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    pin_code?: string;
    is_default?: boolean;
  };

  if (!body.address?.trim()) {
    return Response.json({ error: "Address is required." }, { status: 400 });
  }

  if (body.is_default) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    recipient_name: body.recipient_name?.trim() || null,
    phone: body.phone?.trim() || null,
    address: body.address.trim(),
    city: body.city?.trim() || null,
    pin_code: body.pin_code?.trim() || null,
    is_default: Boolean(body.is_default),
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { supabase, user } = await getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Address id is required." }, { status: 400 });

  const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
