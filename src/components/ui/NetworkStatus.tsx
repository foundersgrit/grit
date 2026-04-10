"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";

export function NetworkStatus() {
  const { showToast } = useToast();
  // Initialize with false since we only want to show the "offline" toast on mount if actually offline
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        showToast("You&apos;re currently offline. The work continues locally.");
      }
      setTimeout(() => setIsInitialized(true), 0);
      return;
    }

    const handleOnline = () => {
      showToast("Connection restored. Syncing gear...");
    };

    const handleOffline = () => {
      showToast("You&apos;re offline. Some features may be limited.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast, isInitialized]);

  return null;
}
