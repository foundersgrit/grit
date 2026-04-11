import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/emails/mailer";
import { getWelcomeEmail } from "@/lib/emails/templates";

/**
 * Auth Webhook Relay (Supabase Database Webhook)
 * Triggersbranded registration telemetry when a new profile is initialized.
 * 
 * Target: profiles table (INSERT event)
 */
export async function POST(request: NextRequest) {
  try {
    // Phase 4: Secret verification to protect the enrollment terminal
    const authHeader = request.headers.get("x-webhook-secret");
    if (authHeader !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized enrollment attempt." }, { status: 401 });
    }

    const payload = await request.json();
    
    // Supabase Webhook Payload structure: { record: { ... }, old_record: { ... }, type: 'INSERT', ... }
    const { record, type } = payload;

    if (type !== "INSERT" || !record?.email) {
      return NextResponse.json({ status: "ignored", message: "Event type not eligible for telemetry relay." });
    }

    const result = await sendEmail({
      to: record.email,
      subject: "You're in. Now the work begins.",
      category: "auth",
      html: getWelcomeEmail({
        customer_name: record.full_name || record.display_name || "Operative",
      }),
    });

    if (!result.success) {
      throw new Error(typeof result.error === "string" ? result.error : "Unknown relay failure");
    }

    return NextResponse.json({ status: "success", message: "Welcome telemetry dispatched." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal relay failure.";
    console.error(`[WEBHOOK_AUTH_ERROR] Proxy failure:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
