import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * Global Uptime & Service Health Protocol
 * Returns status metrics for platform connectivity and resource availability.
 */
export async function GET() {
  const timestamp = new Date().toISOString();
  const services = {
    supabase: "unknown",
    auth: "operational",
    storage: "operational"
  };

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Structural test: verify Supabase connectivity via minimal read
    const { error } = await supabase
      .from("categories")
      .select("id")
      .limit(1);

    if (error) throw error;
    
    services.supabase = "operational";
  } catch (err) {
    console.error("[Health Check Failure]", err);
    services.supabase = "degraded";
    
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
