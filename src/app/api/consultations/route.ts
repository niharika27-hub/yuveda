import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const body = (await request.json()) as {
      full_name?: string;
      phone?: string;
      email?: string;
      age?: number;
      gender?: string;
      health_concern?: string;
      condition_details?: string;
      preferred_date?: string;
      preferred_time?: string;
    };

    if (
      !body.full_name?.trim() ||
      !body.phone?.trim() ||
      !body.email?.trim() ||
      !body.condition_details?.trim()
    ) {
      return Response.json(
        { error: "Name, phone, email, and condition details are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("consultation_requests").insert({
      user_id: user?.id ?? null,
      full_name: body.full_name.trim(),
      phone: body.phone.trim(),
      email: body.email.trim(),
      age: body.age ?? null,
      gender: body.gender ?? null,
      health_concern: body.health_concern ?? null,
      condition_details: body.condition_details.trim(),
      preferred_date: body.preferred_date || null,
      preferred_time: body.preferred_time || null,
    });

    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not book consultation." },
      { status: 500 }
    );
  }
}
