import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Admin client with service role to bypass RLS for critical transactions
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key"
  );

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
    interface OrderItemPayload {
      id: string;
      variantId?: string;
      name: string;
      image: string;
      quantity: number;
      price: number;
    }

    const orderItems = (orderData.items as OrderItemPayload[]).map((item) => ({
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

    // Dispatch Branded Order Confirmation (Background)
    if (orderData.shippingInfo.email) {
      const { sendEmail } = await import("@/lib/emails/mailer");
      const { getOrderConfirmEmail } = await import("@/lib/emails/templates");
      
      const firstItem = orderData.items[0];
      
      sendEmail({
        to: orderData.shippingInfo.email,
        subject: `Order #${order_number} confirmed. It's coming.`,
        category: "commerce",
        html: getOrderConfirmEmail({
          order_id: order_number,
          customer_name: `${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}`,
          address_line_1: orderData.shippingInfo.address,
          city: orderData.shippingInfo.city,
          postal_code: orderData.shippingInfo.postalCode,
          product_name: firstItem.name,
          size: firstItem.size || "Standard",
          color: firstItem.color || "Standard",
          quantity: firstItem.quantity,
          price: firstItem.price,
          total: orderData.financials.total
        })
      }).catch(err => console.error("Critical: Branded email dispatch failure", err));
    }

    return NextResponse.json({ 
      status: 'success', 
      orderId: order.id 
    }, { status: 201 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to secure order.';
    console.error('Supabase order creation error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
