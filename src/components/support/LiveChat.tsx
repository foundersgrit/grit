"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import Script from "next/script";

export function LiveChat() {
  const { user } = useAuth();
  
  // Tawk.to Property ID - In production, this would be an env var
  const TAWK_PROPERTY_ID = "67f8bfb36701540306e00f9a";
  const TAWK_WIDGET_ID = "1imsf7fvg";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Configure Tawk.to once it loads
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    (window as any).Tawk_API.onLoad = function() {
      // Set branded theme colors via API if possible, or use custom CSS injection
      (window as any).Tawk_API.setAttributes({
        'name': user?.displayName || 'Inquisitive Operative',
        'email': user?.email || '',
      }, function(error: any) {});
    };

  }, [user]);

  return (
    <>
      <Script
        id="tawk-script"
        strategy="afterInteractive"
        src={`https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`}
      />
      
      {/* Custom Branded Overrides for Tawk.to */}
      <style jsx global>{`
        #tawk-chat-container .tawk-button-circle {
          background-color: #CCDA47 !important; /* Wattle */
          box-shadow: 0 10px 30px rgba(204, 218, 71, 0.3) !important;
        }
        #tawk-chat-container .tawk-min-container .tawk-button-circle svg {
          fill: #0B2519 !important; /* Bottle Green */
        }
        .tawk-card {
          border-radius: 0 !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          background-color: #0B2519 !important;
        }
        .tawk-header {
           background-color: #0B2519 !important;
           border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .tawk-footer {
           background-color: #0B2519 !important;
        }
        .tawk-chat-bubble-user {
           background-color: #CCDA47 !important;
           color: #0B2519 !important;
        }
        .tawk-chat-bubble-agent {
           background-color: #212B26 !important;
           color: #FFFFFF !important;
        }
      `}</style>
    </>
  );
}
