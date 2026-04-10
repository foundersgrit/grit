import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface ErrorContext {
  userId?: string;
  url?: string;
  userAgent?: string;
  componentName?: string;
  [key: string]: any;
}

/**
 * Technical Error Reporting Protocol
 * In production, logs critical failures to Firestore for administrative review.
 */
export async function reportError(error: Error, context?: ErrorContext) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: serverTimestamp(),
    environment: process.env.NODE_ENV,
    url: typeof window !== "undefined" ? window.location.href : context?.url,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : context?.userAgent,
    ...context,
  };

  // Only log to Firestore in production to manage write quotas
  if (process.env.NODE_ENV === "production") {
    try {
      const errorsRef = collection(db, "errors");
      await addDoc(errorsRef, errorData);
    } catch (fsError) {
      // Fallback if Firestore itself is unreachable
      console.error("[GRIT Telemetry Failure]", fsError);
    }
  }

  // Always log to console for internal debug
  console.error("[GRIT Error Report]", {
    msg: error.message,
    ctx: context
  });
}
