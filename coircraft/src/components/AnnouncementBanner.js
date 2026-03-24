"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";

/**
 * AnnouncementBanner
 *
 * - Sticks to the very top of the viewport (above the navbar) while scrolling
 * - Buyer can dismiss it; dismissal is remembered in sessionStorage so it
 *   stays gone for the whole session but comes back on a fresh visit / new tab
 * - Automatically hidden when there is no announcement text
 */
export default function AnnouncementBanner() {
  const { storefront } = useApp();
  const [visible, setVisible] = useState(false);

  const announcement = storefront?.announcement?.trim() || "";

  useEffect(() => {
    if (!announcement) return;
    // Check if the user already dismissed this exact announcement text this session
    const dismissed = sessionStorage.getItem("cc_announcement_dismissed");
    if (dismissed !== announcement) {
      setVisible(true);
    }
  }, [announcement]);

  const handleDismiss = () => {
    // Remember the dismissed text so it doesn't re-appear on navigation
    sessionStorage.setItem("cc_announcement_dismissed", announcement);
    setVisible(false);
  };

  if (!announcement || !visible) return null;

  return (
    <>
      <style>{`
        .announcement-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200; /* above navbar (z-index 100) */
          background: linear-gradient(90deg, #0E2011, #1A472A, #0E2011);
          color: #A8FF3E;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 9px 48px 9px 16px;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-body);
          box-shadow: 0 2px 12px rgba(14,32,17,0.25);
          min-height: 38px;
          animation: slideDown 0.3s ease both;
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .announcement-text {
          flex: 1;
          text-align: center;
          line-height: 1.4;
        }
        .announcement-dismiss {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(168,255,62,0.12);
          border: 1px solid rgba(168,255,62,0.25);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(168,255,62,0.7);
          transition: all 0.18s;
          flex-shrink: 0;
        }
        .announcement-dismiss:hover {
          background: rgba(168,255,62,0.22);
          color: #A8FF3E;
        }
        /* Push navbar + page content down by the banner height */
        .announcement-spacer {
          height: 38px;
          flex-shrink: 0;
        }
      `}</style>

      {/* Fixed banner */}
      <div className="announcement-banner" role="banner" aria-label="Site announcement">
        <span style={{ fontSize: 15, flexShrink: 0 }}>📢</span>
        <span className="announcement-text">{announcement}</span>
        <button
          className="announcement-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
        >
          <X size={13} />
        </button>
      </div>

      {/* Spacer so the sticky navbar sits below the banner, not behind it */}
      <div className="announcement-spacer" aria-hidden="true" />
    </>
  );
}