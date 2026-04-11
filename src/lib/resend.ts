import { Resend } from 'resend';

// Do not throw at build time if RESEND_API_KEY is missing.
// Next.js static generation might import this module without env vars.
if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== "development") {
  console.warn("Missing RESEND_API_KEY environment variable. Email functionality may not work.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");
