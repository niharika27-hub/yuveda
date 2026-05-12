import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProductReview = {
  id: string;
  product_id: string;
  product_name: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  const limit = Math.min(Number(searchParams.get("limit") ?? 12), 24);
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("product_reviews")
    .select("id,product_id,product_name,reviewer_name,rating,comment,created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message, reviews: [] }, { status: 500 });
  }

  return Response.json({ reviews: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const body = (await request.json()) as {
    product_id?: string;
    product_name?: string;
    reviewer_name?: string;
    reviewer_email?: string;
    rating?: number;
    comment?: string;
  };

  const rating = Number(body.rating);
  const payload = {
    product_id: body.product_id?.trim() ?? "",
    product_name: body.product_name?.trim() ?? "",
    user_id: user?.id ?? null,
    reviewer_name: body.reviewer_name?.trim() ?? "",
    reviewer_email: body.reviewer_email?.trim() || user?.email || null,
    rating,
    comment: body.comment?.trim() ?? "",
    status: "approved",
  };

  if (!payload.product_id || !payload.product_name || !payload.reviewer_name || !payload.comment) {
    return Response.json({ error: "Name, rating, and review are required." }, { status: 400 });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });
  }

  const { error } = await supabase.from("product_reviews").insert(payload);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
