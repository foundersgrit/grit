import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    let userId = "guest";

    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        userId = decodedClaims.uid;
      } catch (e) {
        console.warn("Invalid session cookie during checkout. Proceeding as guest if data matches.");
      }
    }

    // Ensure userId in payload matches verified userId or is "guest"
    if (orderData.userId !== userId && userId !== "guest") {
      return NextResponse.json({ error: "Identity mismatch." }, { status: 403 });
    }

    // Server-side timestamp and ID generation
    const orderRef = adminDb.collection('orders').doc();
    const finalOrder = {
      ...orderData,
      id: orderRef.id,
      userId,
      createdAt: new Date().toISOString(),
      serverTimestamp: new Date().toISOString(),
      internalStatus: 'awaiting_payment_confirmation'
    };

    await orderRef.set(finalOrder);

    // If logged in, update user's last order date or similar metadata
    if (userId !== "guest") {
      await adminDb.collection('users').doc(userId).set({
        lastOrderAt: finalOrder.createdAt,
        totalOrders: FieldValue.increment(1)
      }, { merge: true });
    }

    return NextResponse.json({ 
      status: 'success', 
      orderId: orderRef.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to secure order.' }, { status: 500 });
  }
}
