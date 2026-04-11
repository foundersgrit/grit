import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emails/mailer";
import { getShippingEmail } from "@/lib/emails/templates";

/**
 * Commerce Webhook Relay
 * Handles outbound shipping telemetry oncecouriers confirm pickup.
 * 
 * TODO: Implement signature verification if utilizing third-party courier webhooks.
 */
export async function POST(request: NextRequest) {
  try {
    // Secret verification to protect the relay
    const authHeader = request.headers.get("x-webhook-secret");
    if (authHeader !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized enrollment attempt." }, { status: 401 });
    }

    const payload = await request.json();
    const { to, order_id, tracking_number, courier_name, estimated_date, tracking_url } = payload;

    if (!to || !order_id || !tracking_number) {
      return NextResponse.json({ error: "Insufficient telemetry data." }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      subject: "Your GRIT order is moving.",
      category: "commerce",
      html: getShippingEmail({
        order_id,
        tracking_number,
        courier_name,
        estimated_date,
        tracking_url,
      }),
    });

    if (!result.success) {
      throw new Error(typeof result.error === "string" ? result.error : "Unknown relay failure");
    }

    return NextResponse.json({ status: "success", message: "Shipping telemetry dispatched." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal relay failure.";
    console.error(`[WEBHOOK_ORDERS_ERROR] Proxy failure:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
