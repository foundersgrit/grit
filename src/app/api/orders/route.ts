import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Admin client with service role to bypass RLS for critical transactions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const cookieStore = await cookies();
    
    // Create a regular client to verify the user session
    const { createClient: createServerClient } = await import("@/utils/supabase/server");
    const supabase = createServerClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    const profileId = user?.id || null;

    // Server-side timestamp and ID generation
    const order_number = `GRIT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // Start transactional-like operations using admin client
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        profile_id: profileId,
        order_number,
        status: orderData.status || 'Processing',
        total: orderData.financials.total,
        item_count: orderData.items.length,
        shipping_address: orderData.shippingInfo,
        payment_status: orderData.paymentInfo.status === 'cod' ? 'Pending' : 'Awaiting Verification'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      variant_id: item.variantId || 'base',
      product_name: item.name,
      product_image: item.image,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Dispatch Order Confirmation Email (Background task in Next.js)
    if (orderData.shippingInfo.email) {
      const { sendOrderConfirmation } = await import("@/lib/email-service");
      sendOrderConfirmation(orderData.shippingInfo.email, {
        order_number,
        total: orderData.financials.total,
        items: orderData.items
      }).catch(err => console.error("Critical: Email dispatch failure", err));
    }

    return NextResponse.json({ 
      status: 'success', 
      orderId: order.id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Supabase order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to secure order.' }, { status: 500 });
  }
}
