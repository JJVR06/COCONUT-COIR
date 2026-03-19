"use client";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Sidebar() {
  const pathname = usePathname();
  const links = [
    { href: "/seller/dashboard",  icon: "🏠", label: "Dashboard"  },
    { href: "/seller/orders",     icon: "📦", label: "Orders"     },
    { href: "/seller/inventory",  icon: "📋", label: "Inventory"  },
    { href: "/seller/storefront", icon: "🏪", label: "Storefront" },
    { href: "/seller/reports",    icon: "📊", label: "Reports"    },
  ];
  return (
    <aside style={{ width: 220, background: "#0E2011", minHeight: "100vh", padding: "28px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(168,255,62,0.12)" }}>
        <span style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 800, fontSize: 18 }}>Coir<span style={{ color: "#A8FF3E" }}>Craft</span></span>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>Seller Portal</div>
      </div>
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {links.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, marginBottom: 4, textDecoration: "none", background: active ? "rgba(168,255,62,0.12)" : "transparent", color: active ? "#A8FF3E" : "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 13, border: `1px solid ${active ? "rgba(168,255,62,0.2)" : "transparent"}`, transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
              {icon} {label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "0 12px 16px" }}>
        <button onClick={() => { try { localStorage.setItem("cc_seller","false"); } catch{} window.location.href = "/"; }}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 12, width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#ff7070"; e.currentTarget.style.borderColor = "rgba(255,100,100,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
          ↩ Logout
        </button>
      </div>
    </aside>
  );
}

export default function DashboardClient() {
  const { sellerLoggedIn, transactions } = useApp();

  useEffect(() => {
    if (!sellerLoggedIn) window.location.href = "/login";
  }, [sellerLoggedIn]);

  if (!sellerLoggedIn) return null;

  const txList  = Array.isArray(transactions) ? transactions : [];
  const revenue = txList.filter((t) => t.status !== "Cancelled").reduce((s, t) => s + (t.total || 0), 0);
  const pending = txList.filter((t) => t.status === "Pending").length;
  const done    = txList.filter((t) => ["Delivered","Received"].includes(t.status)).length;
  const recent  = [...txList].reverse().slice(0, 6);

  const sColor = { Pending:["#FFF9C4","#856404"], Confirmed:["#DBEAFE","#1E40AF"], Shipped:["#FFE0B2","#E65100"], Delivered:["#DCFCE7","#166534"], Received:["#E8FFD0","#1A7A2E"], Cancelled:["#FFE4E6","#9F1239"] };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <Sidebar />
      <main style={{ flex: 1, background: "#F8F9FA", padding: 32, overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>Dashboard</h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Welcome back, Admin!</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { icon:"💰", label:"Total Revenue",  value:`₱${revenue.toLocaleString()}`, sub:"Confirmed orders", accent:"#A8FF3E" },
            { icon:"📦", label:"Total Orders",   value:txList.length,                   sub:"All time",        accent:"#93C5FD" },
            { icon:"🕐", label:"Pending",        value:pending,                         sub:"Need action",     accent:"#FCD34D" },
            { icon:"✅", label:"Completed",      value:done,                            sub:"Delivered",       accent:"#6EE7B7" },
          ].map(({ icon, label, value, sub, accent }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 18, padding: "22px 20px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)", borderLeft: `4px solid ${accent}` }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#0E2011", marginBottom: 3 }}>{value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { href:"/seller/inventory",  icon:"📋", label:"Manage Inventory" },
            { href:"/seller/orders",     icon:"📦", label:"View Orders"      },
            { href:"/seller/reports",    icon:"📊", label:"Sales Reports"    },
            { href:"/seller/storefront", icon:"🏪", label:"Storefront"       },
          ].map(({ href, icon, label }) => (
            <Link key={href} href={href} style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"2px solid #E8EDE8", borderRadius:14, padding:"11px 18px", textDecoration:"none", fontWeight:700, fontSize:13, color:"#0E2011", transition:"all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="#A8FF3E"; e.currentTarget.style.background="#F5F9F0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="#E8EDE8"; e.currentTarget.style.background="#fff"; }}>
              {icon} {label}
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "24px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#0E2011", margin: 0 }}>Recent Orders</h2>
            <Link href="/seller/orders" style={{ fontSize: 13, fontWeight: 700, color: "#1A7A2E", textDecoration: "none", border: "2px solid #E8EDE8", borderRadius: 50, padding: "6px 16px" }}>View All →</Link>
          </div>
          {recent.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>📭</div>
              <p style={{ margin: 0 }}>No orders yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F5F9F0" }}>
                    {["Order ID","Date","Payment","Total","Status"].map((h) => (
                      <th key={h} style={{ textAlign:"left", padding:"10px 14px", color:"#1A7A2E", fontWeight:700, fontSize:11, letterSpacing:1, textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((tx) => {
                    const [bg, color] = sColor[tx.status] || ["#F5F5F5","#555"];
                    return (
                      <tr key={tx.id} style={{ borderBottom: "1px solid #F0F0EC" }}>
                        <td style={{ padding:"12px 14px", fontWeight:700, color:"#1A7A2E" }}>{tx.id}</td>
                        <td style={{ padding:"12px 14px", color:"#888" }}>{tx.date}</td>
                        <td style={{ padding:"12px 14px" }}>{tx.method}</td>
                        <td style={{ padding:"12px 14px", fontWeight:700 }}>₱{(tx.total||0).toLocaleString()}</td>
                        <td style={{ padding:"12px 14px" }}>
                          <span style={{ background:bg, color, borderRadius:50, padding:"4px 12px", fontSize:11, fontWeight:700 }}>{tx.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}