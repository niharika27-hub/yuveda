import Razorpay from "razorpay";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type CheckoutItem = {
  product_id: string;
  name: string;
  quantity: number;
  variant: string;
  price: number;
};

type CheckoutRequest = {
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    pinCode: string;
  };
  items: CheckoutItem[];
  paymentMethod: string;
  subtotal: number;
  tax: number;
  total: number;
};

async function getUserId() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const required = [
      body.customer?.name,
      body.customer?.phone,
      body.customer?.email,
      body.customer?.address,
      body.customer?.city,
      body.customer?.pinCode,
    ];

    if (required.some((value) => !value?.trim())) {
      return Response.json({ error: "Please fill all delivery details." }, { status: 400 });
    }

    if (!Array.isArray(body.items) || body.items.length === 0 || body.total <= 0) {
      return Response.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const userId = await getUserId();
    const orderNumber = `YUV-${Math.floor(100000 + Math.random() * 900000)}`;
    const isCod = body.paymentMethod === "cod";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_number: orderNumber,
        customer_name: body.customer.name.trim(),
        phone: body.customer.phone.trim(),
        email: body.customer.email.trim(),
        address: body.customer.address.trim(),
        city: body.customer.city.trim(),
        pin_code: body.customer.pinCode.trim(),
        items: body.items,
        payment_method: isCod ? "cod" : "razorpay",
        payment_status: isCod ? "pending" : "created",
        order_status: "placed",
        subtotal: body.subtotal,
        tax: body.tax,
        total: body.total,
      })
      .select("id,order_number")
      .single();

    if (orderError) throw orderError;

    if (isCod) {
      const { error: paymentError } = await supabase.from("payments").insert({
        order_id: order.id,
        order_number: order.order_number,
        customer_name: body.customer.name.trim(),
        method: "cod",
        amount: body.total,
        status: "pending",
      });
      if (paymentError) throw paymentError;
      return Response.json({ mode: "cod", orderNumber: order.order_number });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys are not configured.");
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(body.total * 100),
      currency: "INR",
      receipt: order.order_number,
      notes: {
        local_order_id: order.id,
        order_number: order.order_number,
      },
    });

    await supabase
      .from("orders")
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", order.id);

    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: order.id,
      order_number: order.order_number,
      customer_name: body.customer.name.trim(),
      method: "razorpay",
      amount: body.total,
      currency: "INR",
      status: "created",
      razorpay_order_id: razorpayOrder.id,
    });

    if (paymentError) throw paymentError;

    return Response.json({
      mode: "razorpay",
      keyId,
      orderNumber: order.order_number,
      localOrderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Could not create checkout order." },
      { status: 500 }
    );
  }
}
