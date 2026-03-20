"use client";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";
import Link from "next/link";
import SellerSidebar from "@/components/SellerSidebar";

export default function DashboardClient() {
  const { sellerLoggedIn, transactions, inventory, reviews } = useApp();

  useEffect(() => {
    if (!sellerLoggedIn) window.location.href = "/login";
  }, [sellerLoggedIn]);

  if (!sellerLoggedIn) return null;

  const txList  = Array.isArray(transactions) ? transactions : [];
  const revenue = txList
    .filter((t) => t.status !== "Cancelled")
    .reduce((s, t) => s + (t.total || 0), 0);
  const pending  = txList.filter((t) => t.status === "Pending").length;
  const done     = txList.filter((t) => ["Delivered", "Received"].includes(t.status)).length;
  const recent   = [...txList].reverse().slice(0, 6);

  const totalProducts = Array.isArray(inventory) ? inventory.length : 0;
  const lowStock      = Array.isArray(inventory) ? inventory.filter((p) => p.stock > 0 && p.stock < 10).length : 0;
  const totalReviews  = Array.isArray(reviews) ? reviews.length : 0;

  const sColor = {
    Pending:   ["#FFF9C4", "#856404"],
    Confirmed: ["#DBEAFE", "#1E40AF"],
    Shipped:   ["#FFE0B2", "#E65100"],
    Delivered: ["#DCFCE7", "#166534"],
    Received:  ["#E8FFD0", "#1A7A2E"],
    Cancelled: ["#FFE4E6", "#9F1239"],
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />

      <main
        className="seller-page-main"
        style={{
          flex: 1,
          background: "#F8F9FA",
          padding: 32,
          overflowY: "auto",
          /* On mobile, push content below fixed mobile header */
          paddingTop: "var(--seller-mobile-header-offset, 32px)",
        }}
      >
        <style>{`
          @media (max-width: 1023px) {
            .seller-page-main { padding-top: 76px !important; padding-bottom: 88px !important; }
            .seller-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .seller-quick-links { flex-wrap: wrap !important; }
            .seller-table-wrap { overflow-x: auto !important; }
          }
          @media (max-width: 479px) {
            .seller-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          }
        `}</style>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(22px,4vw,28px)",
            fontWeight: 800, color: "#0E2011", margin: "0 0 4px",
          }}>
            Dashboard
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Welcome back, Admin!</p>
        </div>

        {/* ── Stat cards ── */}
        <div
          className="seller-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {[
            { icon: "💰", label: "Total Revenue",   value: `₱${revenue.toLocaleString()}`, sub: "Confirmed orders",  accent: "#A8FF3E" },
            { icon: "📦", label: "Total Orders",    value: txList.length,                   sub: "All time",          accent: "#93C5FD" },
            { icon: "🕐", label: "Pending Orders",  value: pending,                         sub: "Need action",       accent: "#FCD34D" },
            { icon: "✅", label: "Completed",       value: done,                            sub: "Delivered / Rcvd",  accent: "#6EE7B7" },
            { icon: "📋", label: "Products",        value: totalProducts,                   sub: `${lowStock} low stock`, accent: "#F9A8D4" },
            { icon: "⭐", label: "Reviews",         value: totalReviews,                    sub: "From buyers",       accent: "#FDE68A" },
          ].map(({ icon, label, value, sub, accent }) => (
            <div
              key={label}
              style={{
                background: "#fff", borderRadius: 16,
                padding: "18px 16px",
                boxShadow: "0 2px 12px rgba(14,32,17,0.06)",
                borderLeft: `4px solid ${accent}`,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,26px)",
                fontWeight: 800, color: "#0E2011", marginBottom: 3,
              }}>
                {value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Quick links ── */}
        <div
          className="seller-quick-links"
          style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}
        >
          {[
            { href: "/seller/inventory",  icon: "📋", label: "Manage Inventory" },
            { href: "/seller/orders",     icon: "📦", label: "View Orders"      },
            { href: "/seller/reports",    icon: "📊", label: "Sales Reports"    },
            { href: "/seller/storefront", icon: "🏪", label: "Storefront"       },
            { href: "/seller/reviews",    icon: "⭐", label: "Reviews"          },
          ].map(({ href, icon, label }) => (
            <Link
              key={href} href={href}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#fff", border: "2px solid #E8EDE8",
                borderRadius: 12, padding: "10px 16px",
                textDecoration: "none", fontWeight: 700,
                fontSize: 12, color: "#0E2011", transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A8FF3E"; e.currentTarget.style.background = "#F5F9F0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EDE8"; e.currentTarget.style.background = "#fff"; }}
            >
              {icon} {label}
            </Link>
          ))}
        </div>

        {/* ── Recent orders ── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "clamp(15px,2.5vw,18px)", color: "#0E2011", margin: 0,
            }}>
              Recent Orders
            </h2>
            <Link
              href="/seller/orders"
              style={{
                fontSize: 12, fontWeight: 700, color: "#1A7A2E",
                textDecoration: "none", border: "2px solid #E8EDE8",
                borderRadius: 50, padding: "6px 14px", whiteSpace: "nowrap",
              }}
            >
              View All →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <p style={{ margin: 0, fontSize: 14 }}>No orders yet. They'll appear here when buyers place orders.</p>
            </div>
          ) : (
            <div className="seller-table-wrap" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr style={{ background: "#F5F9F0" }}>
                    {["Order ID", "Date", "Payment", "Total", "Status"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left", padding: "10px 14px",
                          color: "#1A7A2E", fontWeight: 700, fontSize: 11,
                          letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((tx) => {
                    const [bg, color] = sColor[tx.status] || ["#F5F5F5", "#555"];
                    return (
                      <tr key={tx.id} style={{ borderBottom: "1px solid #F0F0EC" }}>
                        <td style={{ padding: "11px 14px", fontWeight: 700, color: "#1A7A2E", whiteSpace: "nowrap" }}>{tx.id}</td>
                        <td style={{ padding: "11px 14px", color: "#888", whiteSpace: "nowrap" }}>{tx.date}</td>
                        <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>{tx.method}</td>
                        <td style={{ padding: "11px 14px", fontWeight: 700, whiteSpace: "nowrap" }}>₱{(tx.total || 0).toLocaleString()}</td>
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{
                            background: bg, color,
                            borderRadius: 50, padding: "4px 12px",
                            fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                          }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mobile bottom spacer */}
        <div className="seller-mobile-bottom-spacer" />
      </main>
    </div>
  );
}