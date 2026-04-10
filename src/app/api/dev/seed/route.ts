import { NextResponse } from 'next/server';
import { seedFirestore } from '@/lib/firebase/seed';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  // 1. Strict Environment Gating
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  // 2. Admin UID Check
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const adminUids = (process.env.GRIT_ADMIN_UIDS || '').split(',');
    
    if (!adminUids.includes(decodedToken.uid)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // 3. Idempotency Check (Prevent accidental re-seeding)
    // We'll check if any products exist as a simple flag
    const productsSnapshot = await adminAuth.app.firestore().collection('products').limit(1).get();
    if (!productsSnapshot.empty) {
      return NextResponse.json({ message: 'Already seeded. No action taken.' });
    }

    const result = await seedFirestore();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: 'Unauthorized or Server Error' }, { status: 401 });
  }
}
