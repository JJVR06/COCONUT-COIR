"use client";
import { useState, useEffect, useRef } from "react";
import { X, Tag, Truck, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

/**
 * AnnouncementBanner — Premium e-commerce quality
 *
 * - Marquee scrolling text so long announcements never get clipped
 * - Rotating accent icons for visual interest
 * - Dismissable with session memory
 * - Pushes sticky navbar down via spacer div
 * - ONLY rendered here — inline banners in individual pages have been removed
 */
export default function AnnouncementBanner() {
  const { storefront } = useApp();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const marqueeRef = useRef(null);

  const announcement = storefront?.announcement?.trim() || "";

  useEffect(() => {
    if (!announcement) return;
    const dismissed = sessionStorage.getItem("cc_announcement_dismissed");
    if (dismissed !== announcement) setVisible(true);
  }, [announcement]);

  const handleDismiss = () => {
    sessionStorage.setItem("cc_announcement_dismissed", announcement);
    setVisible(false);
  };

  if (!announcement || !visible) return null;

  // Repeat text enough times so there's always content visible
  const repeatedText = Array(8).fill(announcement).join("   ✦   ");

  return (
    <>
      <style>{`
        /* ── Banner container ── */
        .ann-banner {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          height: 48px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #0a1a0d;
          border-bottom: 1px solid rgba(168,255,62,0.18);
          box-shadow:
            0 1px 0 rgba(168,255,62,0.08),
            0 4px 24px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(168,255,62,0.06);
          animation: annSlideDown 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* Gradient mesh background */
        .ann-banner::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 200% at 20% 50%, rgba(168,255,62,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 200% at 80% 50%, rgba(26,71,42,0.5) 0%, transparent 70%),
            linear-gradient(90deg, #0a1a0d 0%, #0e2011 30%, #0d1e10 70%, #0a1a0d 100%);
          pointer-events: none;
        }

        /* Subtle animated shimmer line at top */
        .ann-banner::after {
          content: "";
          position: absolute;
          top: 0; left: -100%; right: -100%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(168,255,62,0) 20%,
            rgba(168,255,62,0.6) 50%,
            rgba(168,255,62,0) 80%,
            transparent 100%
          );
          animation: annShimmerLine 3s ease-in-out infinite;
        }

        @keyframes annSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes annShimmerLine {
          0%   { transform: translateX(-60%); opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateX(60%); opacity: 0; }
        }

        /* ── Left accent block ── */
        .ann-left-accent {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 16px 0 18px;
          height: 100%;
          background: linear-gradient(90deg, rgba(168,255,62,0.13) 0%, transparent 100%);
          border-right: 1px solid rgba(168,255,62,0.12);
        }
        .ann-sale-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #A8FF3E, #6BCC1C);
          color: #0a1a0d;
          font-weight: 900;
          font-size: 9px;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 3px;
          white-space: nowrap;
          font-family: var(--font-display);
          box-shadow: 0 2px 8px rgba(168,255,62,0.3);
        }

        /* ── Marquee track ── */
        .ann-marquee-wrap {
          position: relative;
          z-index: 2;
          flex: 1;
          overflow: hidden;
          height: 100%;
          display: flex;
          align-items: center;
          /* Fade edges */
          mask-image: linear-gradient(90deg,
            transparent 0px,
            black 32px,
            black calc(100% - 32px),
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(90deg,
            transparent 0px,
            black 32px,
            black calc(100% - 32px),
            transparent 100%
          );
        }
        .ann-marquee-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: annMarquee 28s linear infinite;
          will-change: transform;
        }
        .ann-marquee-track.paused {
          animation-play-state: paused;
        }
        @keyframes annMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ann-marquee-text {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.3px;
          font-family: var(--font-body);
          padding: 0 6px;
        }
        .ann-marquee-text span.highlight {
          color: #A8FF3E;
          font-weight: 800;
        }
        .ann-divider {
          color: rgba(168,255,62,0.4);
          font-size: 10px;
          margin: 0 14px;
          flex-shrink: 0;
        }

        /* ── Right icon row ── */
        .ann-right-accent {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px 0 16px;
          height: 100%;
          border-left: 1px solid rgba(168,255,62,0.10);
          background: linear-gradient(90deg, transparent 0%, rgba(168,255,62,0.06) 100%);
        }
        .ann-icon-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.5px;
          white-space: nowrap;
          font-family: var(--font-body);
        }
        .ann-icon-chip svg {
          opacity: 0.55;
        }
        @media (max-width: 639px) {
          .ann-icon-chip { display: none; }
          .ann-left-accent { padding: 0 12px 0 14px; }
        }
        @media (max-width: 479px) {
          .ann-left-accent { display: none; }
        }

        /* ── Dismiss ── */
        .ann-dismiss {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          width: 40px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          border-left: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          transition: color 0.18s, background 0.18s;
        }
        .ann-dismiss:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
        }

        /* ── Spacer ── */
        .ann-spacer {
          height: 48px;
          flex-shrink: 0;
        }
      `}</style>

      {/* Fixed banner */}
      <div
        className="ann-banner"
        role="banner"
        aria-label="Site announcement"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Left: SALE pill */}
        <div className="ann-left-accent">
          <div className="ann-sale-pill">
            <Tag size={8} strokeWidth={2.5} />
            PROMO
          </div>
        </div>

        {/* Center: scrolling marquee */}
        <div className="ann-marquee-wrap">
          <div
            ref={marqueeRef}
            className={`ann-marquee-track${hovered ? " paused" : ""}`}
          >
            {/* Two identical sets so the loop is seamless */}
            {[0, 1].map((copy) => (
              <span key={copy} style={{ display: "inline-flex", alignItems: "center" }}>
                {Array(6).fill(null).map((_, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                    <span className="ann-marquee-text">
                      📢 {announcement}
                    </span>
                    <span className="ann-divider" aria-hidden="true">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Right: trust chips — desktop only */}
        <div className="ann-right-accent">
          <div className="ann-icon-chip">
            <Truck size={12} strokeWidth={2} />
            Free shipping ₱1500+
          </div>
          <div className="ann-icon-chip">
            <Zap size={12} strokeWidth={2} />
            Eco-Certified PH
          </div>
        </div>

        {/* Dismiss button */}
        <button
          className="ann-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Spacer keeps the sticky navbar below the banner */}
      <div className="ann-spacer" aria-hidden="true" />
    </>
  );
}