"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Home, ShoppingBag, Grid, ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function MobileBottomNav() {
  const pathname  = usePathname();
  const { user, cart } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Don't show on seller pages or login/register
  const hide = pathname.startsWith("/seller") ||
               pathname === "/login" ||
               pathname === "/register" ||
               pathname === "/checkout";
  if (!mounted || hide) return null;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const tabs = [
    { href: "/",         icon: Home,         label: "Home",     exact: true },
    { href: "/store",    icon: ShoppingBag,  label: "Store"               },
    { href: "/products", icon: Grid,         label: "Products"             },
    { href: "/cart",     icon: ShoppingCart, label: "Cart",     badge: cartCount },
    { href: user ? "/profile" : "/login", icon: User, label: user ? "Me" : "Sign In" },
  ];

  const isActive = (tab) =>
    tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);

  return createPortal(
    <>
      {/* Only shown on mobile via CSS */}
      <style>{`
        .mobile-bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid #E5EDE5;
          z-index: 70;
          padding: 6px 0 env(safe-area-inset-bottom, 8px);
          box-shadow: 0 -4px 24px rgba(14,32,17,0.08);
        }
        @media (min-width: 768px) {
          .mobile-bottom-nav { display: none; }
        }
        .mobile-bottom-nav-spacer {
          height: 72px;
          display: block;
        }
        @media (min-width: 768px) {
          .mobile-bottom-nav-spacer { display: none; }
        }
      `}</style>

      <nav className="mobile-bottom-nav">
        {tabs.map(({ href, icon: Icon, label, badge, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                padding: "6px 4px",
                position: "relative",
                transition: "all 0.18s",
              }}>
              {/* Active indicator pill */}
              {active && (
                <div style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", width: 28, height: 28, background: "#E8FFD0", borderRadius: "50%", zIndex: 0 }} />
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                <Icon
                  size={20}
                  color={active ? "#0E2011" : "#aaa"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                {badge > 0 && (
                  <span style={{ position: "absolute", top: -5, right: -7, background: "#E74C3C", color: "#fff", borderRadius: "50%", width: 14, height: 14, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, border: "1.5px solid #fff" }}>
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 9, fontWeight: active ? 800 : 600, color: active ? "#0E2011" : "#bbb", letterSpacing: 0.3, fontFamily: "var(--font-body)" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>,
    document.body
  );
}