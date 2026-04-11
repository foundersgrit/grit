import { resend } from "../resend";

export type EmailCategory = "auth" | "news" | "commerce";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  category: EmailCategory;
}

const SENDERS: Record<EmailCategory, string> = {
  auth: "G R I T <hello@gritwear.shop>",
  news: "G R I T <hello@gritwear.shop>",
  commerce: "G R I T Operations <orders@gritwear.shop>",
};

/**
 * Resend Mailer Protocol
 * Orchestrates the dispatch of branded telemetry across the GRIT platform.
 */
export async function sendEmail({ to, subject, html, category }: SendEmailOptions) {
  try {
    const from = SENDERS[category];

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      // Securely log the error without leaking telemetry secrets
      console.error(`[MAILER_FAILURE] Target: ${to} | Category: ${category} | Error:`, error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected transition failure occurred in the mailer.";
    console.error(`[MAILER_CRITICAL] Exception caught during relay to ${to}:`, message);
    return { success: false, error: message };
  }
}
