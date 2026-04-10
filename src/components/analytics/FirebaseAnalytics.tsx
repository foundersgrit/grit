"use client";

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase/config';
import { usePathname, useSearchParams } from 'next/navigation';
import { logEvent, getAnalytics } from 'firebase/analytics';

export function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics once
    const init = async () => {
      await initAnalytics();
    };
    init();
  }, []);

  useEffect(() => {
    // Log page views on route change
    const analytics = typeof window !== 'undefined' ? getAnalytics() : null;
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
