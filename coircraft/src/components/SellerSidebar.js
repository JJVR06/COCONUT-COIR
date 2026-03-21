"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  LayoutDashboard,
  PackageOpen,
  ClipboardList,
  Store,
  BarChart3,
  Star,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/seller/dashboard",  icon: LayoutDashboard, label: "Dashboard"  },
  { href: "/seller/orders",     icon: PackageOpen,     label: "Orders"     },
  { href: "/seller/inventory",  icon: ClipboardList,   label: "Inventory"  },
  { href: "/seller/storefront", icon: Store,           label: "Storefront" },
  { href: "/seller/reports",    icon: BarChart3,       label: "Reports"    },
  { href: "/seller/reviews",    icon: Star,            label: "Reviews"    },
  { href: "/seller/sources",    icon: BookOpen,        label: "Sources"    },
];

function logout() {
  try { localStorage.setItem("cc_seller", "false"); } catch {}
  window.location.href = "/";
}

/* ── MOBILE PORTAL (bottom nav + drawer) ────────────────────────────────── */
function MobilePortal({ open, setOpen, pathname }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const mobileLinks = NAV_LINKS.slice(0, 4); // bottom-nav tabs
  const moreLinks   = NAV_LINKS.slice(4);    // overflow into drawer

  return createPortal(
    <>
      {/* ── Drawer overlay ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 198,
            background: "rgba(14,32,17,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Slide-in drawer (full sidebar) ── */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: 260, zIndex: 199,
          background: "#0E2011",
          transform: open ? "translateX(0)" : "translateX(-110%)",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", flexDirection: "column",
          boxShadow: open ? "8px 0 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Drawer header */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(168,255,62,0.12)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 800, fontSize: 18 }}>
              Coir<span style={{ color: "#A8FF3E" }}>Craft</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>Seller Portal</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "rgba(255,255,255,0.08)", border: "none",
              borderRadius: 10, width: 36, height: 36, cursor: "pointer",
              color: "rgba(255,255,255,0.7)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "14px 12px", flex: 1, overflowY: "auto" }}>
          {NAV_LINKS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href} href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 12, marginBottom: 4,
                  textDecoration: "none",
                  background: active ? "rgba(168,255,62,0.13)" : "transparent",
                  color: active ? "#A8FF3E" : "rgba(255,255,255,0.65)",
                  fontWeight: 700, fontSize: 14,
                  border: `1px solid ${active ? "rgba(168,255,62,0.2)" : "transparent"}`,
                  transition: "all 0.15s",
                }}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 12px 32px" }}>
          <button
            onClick={logout}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 12, width: "100%",
              background: "rgba(255,80,80,0.08)",
              border: "1px solid rgba(255,80,80,0.18)",
              color: "#ff7070", fontWeight: 700, fontSize: 13,
              cursor: "pointer", fontFamily: "var(--font-body)",
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* ── Mobile bottom navigation ── */}
      <nav
        className="seller-bottom-nav"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#0E2011",
          borderTop: "1px solid rgba(168,255,62,0.15)",
          display: "flex", zIndex: 80,
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {mobileLinks.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href} href={href}
              style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 3, padding: "10px 4px",
                textDecoration: "none",
                color: active ? "#A8FF3E" : "rgba(255,255,255,0.4)",
                transition: "color 0.15s",
                borderTop: active ? "2px solid #A8FF3E" : "2px solid transparent",
              }}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.3 }}>
                {label}
              </span>
            </Link>
          );
        })}
        {/* "More" opens drawer */}
        <button
          onClick={() => setOpen(true)}
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 3, padding: "10px 4px", border: "none",
            background: "transparent", cursor: "pointer",
            color: "rgba(255,255,255,0.4)", borderTop: "2px solid transparent",
          }}
        >
          <Menu size={19} strokeWidth={1.8} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.3 }}>More</span>
        </button>
      </nav>
    </>,
    document.body
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function SellerSidebar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <style>{`
        /* Desktop: static sidebar */
        .seller-sidebar-desktop {
          width: 220px;
          min-width: 220px;
          background: #0E2011;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        /* Mobile header bar injected into main content area */
        .seller-mobile-header {
          display: none;
          position: sticky;
          top: 0;
          z-index: 90;
          background: #0E2011;
          padding: 12px 16px;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(168,255,62,0.12);
          box-shadow: 0 2px 16px rgba(0,0,0,0.2);
        }
        /* Spacer so mobile content doesn't hide under bottom nav */
        .seller-mobile-bottom-spacer {
          display: none;
          height: 72px;
        }
        /* Bottom nav: hidden on desktop, visible only on mobile */
        .seller-bottom-nav {
          display: none !important;
        }
        @media (max-width: 1023px) {
          .seller-sidebar-desktop { display: none !important; }
          .seller-mobile-header   { display: flex !important; }
          .seller-mobile-bottom-spacer { display: block !important; }
          .seller-bottom-nav { display: flex !important; }
          /* Let main fill full width */
          .seller-page-main { padding: 16px !important; }
        }
      `}</style>

      {/* ── Desktop sidebar ── */}
      <aside className="seller-sidebar-desktop">
        <div style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(168,255,62,0.12)",
        }}>
          <div style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 800, fontSize: 18 }}>
            Coir<span style={{ color: "#A8FF3E" }}>Craft</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>Seller Portal</div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV_LINKS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href} href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", borderRadius: 12, marginBottom: 4,
                  textDecoration: "none",
                  background: active ? "rgba(168,255,62,0.12)" : "transparent",
                  color: active ? "#A8FF3E" : "rgba(255,255,255,0.55)",
                  fontWeight: 700, fontSize: 13,
                  border: `1px solid ${active ? "rgba(168,255,62,0.2)" : "transparent"}`,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "0 12px 20px" }}>
          <button
            onClick={logout}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 12, width: "100%",
              background: "none", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 13,
              cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ff7070"; e.currentTarget.style.borderColor = "rgba(255,100,100,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile header bar (injected via absolute positioning trick) ── */}
      {/* This renders at the top of the flex row and is hidden on desktop via CSS */}
      <div
        className="seller-mobile-header"
        style={{ position: "fixed", top: 0, left: 0, right: 0 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "rgba(168,255,62,0.12)", border: "1px solid rgba(168,255,62,0.2)",
              borderRadius: 10, width: 40, height: 40, cursor: "pointer",
              color: "#A8FF3E", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Menu size={20} />
          </button>
          <div>
            <div style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 800, fontSize: 16 }}>
              Coir<span style={{ color: "#A8FF3E" }}>Craft</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
              {NAV_LINKS.find((l) => l.href === pathname)?.label ?? "Seller Portal"}
            </div>
          </div>
        </div>
        <Link
          href="/"
          style={{
            fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
            padding: "6px 12px", fontWeight: 600,
          }}
        >
          ← Store
        </Link>
      </div>

      {/* Mobile portal (bottom nav + drawer) */}
      <MobilePortal
        open={drawerOpen}
        setOpen={setDrawerOpen}
        pathname={pathname}
      />
    </>
  );
}