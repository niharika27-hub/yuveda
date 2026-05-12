import { createHmac, timingSafeEqual } from "node:crypto";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

function verifyWebhook(body: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Razorpay webhook secret is not configured.");
  }

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

function mapPaymentStatus(event: string) {
  if (event === "payment.captured" || event === "order.paid") return "paid";
  if (event === "payment.failed") return "failed";
  if (event.includes("refund")) return "refunded";
  return null;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";

    if (!verifyWebhook(rawBody, signature)) {
      return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: { entity?: { id?: string; order_id?: string } };
        order?: { entity?: { id?: string } };
      };
    };

    const status = mapPaymentStatus(event.event ?? "");
    const razorpayOrderId =
      event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id ?? null;
    const razorpayPaymentId = event.payload?.payment?.entity?.id ?? null;

    if (!status || !razorpayOrderId) {
      return Response.json({ ok: true, ignored: true });
    }

    const supabase = createSupabaseServiceClient();
    const { data: order } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("razorpay_order_id", razorpayOrderId)
      .select("id")
      .maybeSingle();

    await supabase
      .from("payments")
      .update({
        status,
        razorpay_payment_id: razorpayPaymentId,
        raw_event: event,
      })
      .eq("razorpay_order_id", razorpayOrderId);

    if (order?.id && status === "paid") {
      await supabase.from("orders").update({ order_status: "placed" }).eq("id", order.id);
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Webhook handling failed." },
      { status: 500 }
    );
  }
}
