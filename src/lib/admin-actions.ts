"use server";

import { requireAdmin } from "@/lib/admin-server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient, hasSupabaseServiceEnv } from "@/lib/supabase/service";

export type AdminProductRow = {
  "Product Name": string;
  Category: string | null;
  Quantity: string | null;
  Price: string | null;
  images: string[] | null;
  status?: string | null;
  stock_quantity?: number | null;
  featured?: boolean | null;
  concerns?: string[];
};

export type AdminProductReview = {
  id: string;
  product_id: string;
  product_name: string;
  user_id: string | null;
  reviewer_name: string;
  reviewer_email: string | null;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
};

export type ConsultationRequest = {
  id: string;
  user_id: string | null;
  full_name: string;
  age: number | null;
  gender: string | null;
  health_concern: string | null;
  condition_details: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string;
};

export type AdminOrder = {
  id: string;
  user_id: string | null;
  order_number: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  pin_code: string | null;
  items: unknown[];
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
};

export type AdminPayment = {
  id: string;
  order_id: string | null;
  order_number: string | null;
  customer_name: string | null;
  method: string;
  amount: number;
  status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
};

export type AdminCustomer = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string | null;
};

function normalizeImages(images: string[] | null | undefined) {
  return (images ?? []).map((image) => image.trim()).filter(Boolean);
}

function parseFirstPrice(price: string | null | undefined) {
  const first = (price ?? "").split(",")[0] ?? "";
  const parsed = Number.parseFloat(first.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

async function withAdminClient() {
  await requireAdmin();
  return createSupabaseServerClient();
}

export async function listAdminProducts() {
  const supabase = await withAdminClient();
  const { data, error } = await supabase
    .from("products_by_category")
    .select('"Product Name",Category,Quantity,Price,images,status,stock_quantity,featured')
    .order("Product Name", { ascending: true });

  if (error) {
    throw error;
  }

  const { data: concernRows } = await supabase
    .from("products_by_concern")
    .select('"Product Name",Concern');

  const concernsByName = new Map<string, string[]>();
  for (const row of concernRows ?? []) {
    const name = String(row["Product Name"] ?? "");
    const concern = String(row.Concern ?? "");
    if (!name || !concern) continue;
    concernsByName.set(name, [...(concernsByName.get(name) ?? []), concern]);
  }

  return ((data ?? []) as AdminProductRow[]).map((product) => ({
    ...product,
    images: normalizeImages(product.images),
    concerns: concernsByName.get(product["Product Name"]) ?? [],
  }));
}

export async function saveAdminProduct(originalName: string | null, product: AdminProductRow) {
  const supabase = await withAdminClient();
  const cleanProduct = {
    "Product Name": product["Product Name"].trim(),
    Category: product.Category?.trim() || null,
    Quantity: product.Quantity?.trim() || null,
    Price: product.Price?.trim() || null,
    images: normalizeImages(product.images),
    status: product.status || "active",
    stock_quantity: product.stock_quantity ?? null,
    featured: Boolean(product.featured),
  };

  if (!cleanProduct["Product Name"]) {
    throw new Error("Product name is required.");
  }

  const result = originalName
    ? await supabase
        .from("products_by_category")
        .update(cleanProduct)
        .eq("Product Name", originalName)
    : await supabase.from("products_by_category").insert(cleanProduct);

  if (result.error) {
    throw result.error;
  }

  if (originalName && originalName !== cleanProduct["Product Name"]) {
    await supabase
      .from("products_by_concern")
      .update({ "Product Name": cleanProduct["Product Name"] })
      .eq("Product Name", originalName);
  }

  await supabase
    .from("products_by_concern")
    .delete()
    .eq("Product Name", cleanProduct["Product Name"]);

  const concerns = (product.concerns ?? []).map((item) => item.trim()).filter(Boolean);
  if (concerns.length > 0) {
    const price = parseFirstPrice(cleanProduct.Price);
    const concernInsert = await supabase.from("products_by_concern").insert(
      concerns.map((concern) => ({
        "Product Name": cleanProduct["Product Name"],
        Concern: concern,
        Quantity: cleanProduct.Quantity,
        Price: price,
        images: cleanProduct.images,
      }))
    );

    if (concernInsert.error) {
      throw concernInsert.error;
    }
  }

  return { ok: true };
}

export async function deleteAdminProduct(productName: string) {
  const supabase = await withAdminClient();
  const [categoryDelete, concernDelete] = await Promise.all([
    supabase.from("products_by_category").delete().eq("Product Name", productName),
    supabase.from("products_by_concern").delete().eq("Product Name", productName),
  ]);

  if (categoryDelete.error) throw categoryDelete.error;
  if (concernDelete.error) throw concernDelete.error;

  return { ok: true };
}

export async function listConsultationRequests() {
  const supabase = await withAdminClient();
  const { data, error } = await supabase
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ConsultationRequest[];
}

export async function updateConsultationStatus(id: string, status: string) {
  const supabase = await withAdminClient();
  const { error } = await supabase
    .from("consultation_requests")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  return { ok: true };
}

export async function listOrders() {
  const supabase = await withAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminOrder[];
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await withAdminClient();
  const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", id);

  if (error) throw error;
  return { ok: true };
}

export async function listPayments() {
  const supabase = await withAdminClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminPayment[];
}

export async function updatePaymentStatus(id: string, status: string) {
  const supabase = await withAdminClient();
  const { data, error } = await supabase
    .from("payments")
    .update({ status })
    .eq("id", id)
    .select("order_id")
    .maybeSingle();

  if (error) throw error;

  if (data?.order_id) {
    await supabase
      .from("orders")
      .update({ payment_status: status === "paid" ? "paid" : status })
      .eq("id", data.order_id);
  }

  return { ok: true };
}

export async function listCustomers() {
  const supabase = await withAdminClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id,full_name,phone,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const emailById = new Map<string, string | null>();

  if (hasSupabaseServiceEnv()) {
    try {
      const serviceSupabase = createSupabaseServiceClient();
      const { data: users } = await serviceSupabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      users.users.forEach((user) => emailById.set(user.id, user.email ?? null));
    } catch {
      // Customer emails are best-effort when the service role key is unavailable.
    }
  }

  return (profiles ?? []).map((profile) => ({
    ...profile,
    email: emailById.get(profile.id) ?? null,
  })) as AdminCustomer[];
}

export async function listAdminProductReviews(productName?: string | null) {
  const supabase = await withAdminClient();
  let query = supabase
    .from("product_reviews")
    .select("id,product_id,product_name,user_id,reviewer_name,reviewer_email,rating,comment,status,created_at")
    .order("created_at", { ascending: false });

  if (productName) {
    query = query.eq("product_name", productName);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as AdminProductReview[];
}

export async function updateAdminProductReviewStatus(id: string, status: string) {
  const supabase = await withAdminClient();
  const { error } = await supabase.from("product_reviews").update({ status }).eq("id", id);
  if (error) throw error;
  return { ok: true };
}

export async function deleteAdminProductReview(id: string) {
  const supabase = await withAdminClient();
  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) throw error;
  return { ok: true };
}
