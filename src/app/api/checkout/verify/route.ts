import { createHmac, timingSafeEqual } from "node:crypto";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function verifySignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Razorpay secret is not configured.");
  }

  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
      return Response.json({ error: "Incomplete Razorpay verification payload." }, { status: 400 });
    }

    if (
      !verifySignature(
        body.razorpay_order_id,
        body.razorpay_payment_id,
        body.razorpay_signature
      )
    ) {
      return Response.json({ error: "Invalid Razorpay signature." }, { status: 400 });
    }

    const supabase = createSupabaseServiceClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({ payment_status: "paid", order_status: "placed" })
      .eq("razorpay_order_id", body.razorpay_order_id)
      .select("id,order_number")
      .single();

    if (orderError) throw orderError;

    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "paid",
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature,
      })
      .eq("razorpay_order_id", body.razorpay_order_id);

    if (paymentError) throw paymentError;

    return Response.json({ ok: true, orderNumber: order.order_number });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Payment verification failed." },
      { status: 500 }
    );
  }
}
