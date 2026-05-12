import { supabase } from "@/lib/supabase/client";

export type AdminProductRow = {
  "Product Name": string;
  Category: string | null;
  Quantity: string | null;
  Price: string | null;
  images: string[] | null;
};

export type ConsultationRequest = {
  id: string;
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
  created_at: string;
};

export async function listAdminProducts() {
  const { data, error } = await supabase
    .from("products_by_category")
    .select('"Product Name",Category,Quantity,Price,images')
    .order("Product Name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminProductRow[];
}

export async function createAdminProduct(product: AdminProductRow) {
  const { error } = await supabase.from("products_by_category").insert(product);
  if (error) {
    throw error;
  }
}

export async function updateAdminProduct(
  originalName: string,
  product: AdminProductRow
) {
  const { error } = await supabase
    .from("products_by_category")
    .update(product)
    .eq("Product Name", originalName);

  if (error) {
    throw error;
  }
}

export async function deleteAdminProduct(productName: string) {
  const categoryDelete = await supabase
    .from("products_by_category")
    .delete()
    .eq("Product Name", productName);

  if (categoryDelete.error) {
    throw categoryDelete.error;
  }

  await supabase.from("products_by_concern").delete().eq("Product Name", productName);
}

export async function createConsultationRequest(input: {
  full_name: string;
  age: number;
  gender: string;
  health_concern: string;
  condition_details: string;
  preferred_date: string;
  preferred_time: string;
}) {
  const { error } = await supabase.from("consultation_requests").insert(input);
  if (error) {
    throw error;
  }
}

export async function listConsultationRequests() {
  const { data, error } = await supabase
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ConsultationRequest[];
}

export async function updateConsultationStatus(id: string, status: string) {
  const { error } = await supabase
    .from("consultation_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function createOrder(input: {
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pin_code: string;
  items: unknown[];
  payment_method: string;
  subtotal: number;
  tax: number;
  total: number;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert(input)
    .select("id, order_number")
    .single();

  if (error) {
    throw error;
  }

  const payment = await supabase.from("payments").insert({
    order_id: data.id,
    order_number: data.order_number,
    customer_name: input.customer_name,
    method: input.payment_method,
    amount: input.total,
    status: input.payment_method === "cod" ? "pending" : "pending",
  });

  if (payment.error) {
    throw payment.error;
  }
}

export async function listOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminOrder[];
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from("orders")
    .update({ order_status: status })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function listPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminPayment[];
}

export async function updatePaymentStatus(id: string, status: string) {
  const { error } = await supabase
    .from("payments")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
