"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

const statusStyle = {
  Pending:   { bg: "#FFF9C4", color: "#856404", border: "#FFE082" },
  Confirmed: { bg: "#DBEAFE", color: "#1E40AF", border: "#93C5FD" },
  Shipped:   { bg: "#FFE0B2", color: "#E65100", border: "#FFB74D" },
  Delivered: { bg: "#DCFCE7", color: "#166534", border: "#86EFAC" },
  Received:  { bg: "#E8FFD0", color: "#1A7A2E", border: "#A8FF3E" },
  Cancelled: { bg: "#FFE4E6", color: "#9F1239", border: "#FCA5A5" },
};

export default function HistoryPage() {
  const { transactions, markReceived } = useApp();
  const [filter,   setFilter]   = useState("All");
  const [expanded, setExpanded] = useState(null);

  const tabs     = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Received"];
  const filtered = filter === "All" ? transactions : transactions.filter((t) => t.status === filter);

  return (
    <>
      <Navbar />
      <main style={{ background: "#FFFEF5", minHeight: "100vh", fontFamily: "var(--font-body)", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#0E2011", margin: "0 0 8px" }}>📋 My Orders</h1>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>Track and manage your orders. Mark as Received to leave a product review.</p>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setFilter(tab)} className={`tk-filter ${filter === tab ? "active" : ""}`}>{tab}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
              <h2 style={{ fontFamily: "var(--font-display)", color: "#0E2011", fontSize: 22, margin: "0 0 10px" }}>No orders yet</h2>
              <p style={{ color: "#888", marginBottom: 28 }}>Place your first order to see it here.</p>
              <Link href="/products" className="tk-btn-cta" style={{ textDecoration: "none" }}>Shop Now</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filtered.map((tx) => {
                const sStyle = statusStyle[tx.status] || statusStyle.Pending;
                const isExpanded = expanded === tx.id;
                const canMarkReceived = tx.status === "Delivered";

                return (
                  <div key={tx.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(14,32,17,0.06)" }}>
                    {/* Header */}
                    <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "#0E2011", marginBottom: 3 }}>{tx.id}</div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{tx.date}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 12, color: "#888" }}>{tx.method} · {tx.delivery}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#0E2011" }}>₱{tx.total.toLocaleString()}</div>
                        <span style={{ background: sStyle.bg, color: sStyle.color, border: `1.5px solid ${sStyle.border}`, borderRadius: 50, padding: "5px 14px", fontSize: 11, fontWeight: 700 }}>{tx.status}</span>

                        {/* Mark as Received */}
                        {canMarkReceived && (
                          <button onClick={() => markReceived(tx.id)}
                            className="tk-btn-cta" style={{ padding: "7px 18px", fontSize: 12 }}>
                            ✓ Mark Received
                          </button>
                        )}

                        {/* Expand toggle */}
                        <button onClick={() => setExpanded(isExpanded ? null : tx.id)}
                          style={{ background: "#F5F9F0", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Review prompt if received */}
                    {tx.status === "Received" && (
                      <div style={{ margin: "0 24px", marginBottom: 14, background: "#E8FFD0", borderRadius: 12, padding: "10px 16px", fontSize: 13, color: "#1A7A2E", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <span>⭐ You can now review the products from this order!</span>
                        <button onClick={() => setExpanded(tx.id)} style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 50, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>See Items</button>
                      </div>
                    )}

                    {/* Expanded items */}
                    {isExpanded && (
                      <div style={{ borderTop: "1px solid #F0F0EC", padding: "16px 24px 20px", background: "#FAFFF5" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#1A7A2E", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Items in this Order</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {tx.items.map((item) => (
                            <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 12, padding: "12px 16px", border: "1px solid #E8F0E0" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011" }}>{item.name}</div>
                                  <div style={{ fontSize: 12, color: "#999" }}>Qty: {item.qty} × ₱{item.price.toLocaleString()}</div>
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: "#1A7A2E" }}>₱{(item.price * item.qty).toLocaleString()}</div>
                                {tx.status === "Received" && (
                                  <Link href={`/products/${item.id}`}
                                    style={{ background: "#E8FFD0", color: "#1A7A2E", border: "1.5px solid #A8FF3E", borderRadius: 50, padding: "5px 14px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
                                    ⭐ Review
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery info */}
                        {tx.address && (
                          <div style={{ marginTop: 14, background: "#F5F9F0", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#555" }}>
                            📍 Delivered to: <strong>{tx.address}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}