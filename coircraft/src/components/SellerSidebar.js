"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SellerSidebar() {
  const pathname = usePathname();
  const links = [
    { href: "/seller/dashboard",  icon: "🏠", label: "Dashboard"  },
    { href: "/seller/orders",     icon: "📦", label: "Orders"     },
    { href: "/seller/inventory",  icon: "📋", label: "Inventory"  },
    { href: "/seller/storefront", icon: "🏪", label: "Storefront" },
    { href: "/seller/reports",    icon: "📊", label: "Reports"    },
  ];
  const logout = () => {
    try { localStorage.setItem("cc_seller", "false"); } catch (_) {}
    window.location.href = "/";
  };
  return (
    <aside style={{ width: 220, background: "#0E2011", minHeight: "100vh", padding: "28px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(168,255,62,0.12)" }}>
        <div style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 800, fontSize: 18 }}>Coir<span style={{ color: "#A8FF3E" }}>Craft</span></div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>Seller Portal</div>
      </div>
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {links.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, marginBottom: 4, textDecoration: "none", background: active ? "rgba(168,255,62,0.12)" : "transparent", color: active ? "#A8FF3E" : "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 13, border: `1px solid ${active ? "rgba(168,255,62,0.2)" : "transparent"}`, transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
              {icon} {label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "0 12px 16px" }}>
        <button onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#ff7070"; e.currentTarget.style.borderColor = "rgba(255,100,100,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
          ↩ Logout
        </button>
      </div>
    </aside>
  );
}