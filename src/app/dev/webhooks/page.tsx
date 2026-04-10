import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { adminAuth } from '@/lib/firebase/admin';
import WebhookSimulator from './WebhookSimulator';

export default async function DevWebhooksPage() {
  // 1. Strict Environment Gating
  if (process.env.NODE_ENV === 'production') {
    return notFound();
  }

  // 2. Admin Check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return (
      <div className="min-h-screen bg-bottle-green flex items-center justify-center">
        <div className="text-center p-12 border border-white/10 bg-black/20">
          <h1 className="font-structural text-4xl text-wattle uppercase mb-4">Access Denied</h1>
          <p className="font-editorial text-gray-400">Authenticated session required.</p>
        </div>
      </div>
    );
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const adminUids = (process.env.GRIT_ADMIN_UIDS || '').split(',');

    if (!adminUids.includes(decodedClaims.uid)) {
      return (
        <div className="min-h-screen bg-bottle-green flex items-center justify-center">
          <div className="text-center p-12 border border-white/10 bg-black/20">
            <h1 className="font-structural text-4xl text-wattle uppercase mb-4">Unauthorized</h1>
            <p className="font-editorial text-gray-400">Admin privileges required for this environment tool.</p>
          </div>
        </div>
      );
    }

    return <WebhookSimulator />;
  } catch (error) {
    console.error('Session verification failed on dev route:', error);
    return notFound();
  }
}
