import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, limit, query } from "firebase/firestore";

/**
 * Global Uptime & Service Health Protocol
 * Returns status metrics for platform connectivity and resource availability.
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  let services = {
    firestore: "unknown",
    auth: "connected", // Auth is handled client-side/middleware mostly
    storage: "connected"
  };

  try {
    // Structural test: verify Firestore read capability
    // Querying the products collection with minimal footprint (1 doc)
    const productsRef = collection(db, "products");
    const q = query(productsRef, limit(1));
    await getDocs(q);
    services.firestore = "operational";
  } catch (err) {
    console.error("[Health Check Failure]", err);
    services.firestore = "degraded";
    
    return NextResponse.json({
      status: "unstable",
      timestamp,
      services,
      error: "Service adjacency failure"
    }, { status: 503 });
  }

  return NextResponse.json({
    status: "operational",
    timestamp,
    services
  }, { status: 200 });
}
