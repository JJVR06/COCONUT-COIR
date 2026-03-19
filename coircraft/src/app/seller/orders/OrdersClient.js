"use client";
import { useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { useApp } from "@/context/AppContext";
import { ChevronDown, ChevronUp } from "lucide-react";

const STATUS_FLOW = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLE = {
  Pending:   { bg: "#FFF9C4", color: "#856404",  next: "Confirmed" },
  Confirmed: { bg: "#DBEAFE", color: "#1E40AF",  next: "Shipped"   },
  Shipped:   { bg: "#FFE0B2", color: "#E65100",  next: "Delivered" },
  Delivered: { bg: "#DCFCE7", color: "#166534",  next: null        },
  Received:  { bg: "#E8FFD0", color: "#1A7A2E",  next: null        },
  Cancelled: { bg: "#FFE4E6", color: "#9F1239",  next: null        },
};

export default function OrdersClient() {
  const { transactions, setTransactions } = useApp();
  const [filter,   setFilter]   = useState("All");
  const [expanded, setExpanded] = useState(null);

  const tabs     = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Received", "Cancelled"];
  const filtered = filter === "All"
    ? [...transactions].reverse()
    : [...transactions].reverse().filter((t) => t.status === filter);

  const updateStatus = (txId, newStatus) => {
    setTransactions((prev) =>
      prev.map((t) => t.id === txId ? { ...t, status: newStatus } : t)
    );
  };

  const cancelOrder = (txId) => updateStatus(txId, "Cancelled");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />
      <main style={{ flex: 1, background: "#F8F9FA", padding: 32, overflowY: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>
            Order Management
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
            Update order statuses and view order details.
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total",     value: transactions.length,                                          color: "#1A7A2E" },
            { label: "Pending",   value: transactions.filter((t) => t.status === "Pending").length,   color: "#856404" },
            { label: "Shipped",   value: transactions.filter((t) => t.status === "Shipped").length,   color: "#E65100" },
            { label: "Delivered", value: transactions.filter((t) => t.status === "Delivered").length, color: "#166534" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {tabs.map((tab) => {
            const count = tab === "All" ? null : transactions.filter((t) => t.status === tab).length;
            return (
              <button key={tab} onClick={() => setFilter(tab)}
                style={{ padding: "8px 18px", borderRadius: 50, border: "2px solid", borderColor: filter === tab ? "#0E2011" : "#ddd", background: filter === tab ? "#0E2011" : "#fff", color: filter === tab ? "#A8FF3E" : "#555", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
                {tab}{count !== null && <span style={{ marginLeft: 5, opacity: 0.65 }}>({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>No orders found.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((tx) => {
              const ss     = STATUS_STYLE[tx.status] || STATUS_STYLE.Pending;
              const isOpen = expanded === tx.id;

              return (
                <div key={tx.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(14,32,17,0.06)", border: `1px solid ${isOpen ? "#A8FF3E" : "transparent"}`, transition: "border-color 0.2s" }}>

                  {/* Row header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", flexWrap: "wrap", gap: 12 }}>

                    {/* Left: ID + date */}
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "#0E2011" }}>{tx.id}</div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{tx.date} · {tx.method} · {tx.delivery}</div>
                    </div>

                    {/* Right: total + status badge + action buttons */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "#0E2011" }}>
                        ₱{(tx.total || 0).toLocaleString()}
                      </div>

                      {/* Status badge */}
                      <span style={{ background: ss.bg, color: ss.color, borderRadius: 50, padding: "5px 14px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {tx.status}
                      </span>

                      {/* Advance status button */}
                      {ss.next && (
                        <button
                          onClick={() => updateStatus(tx.id, ss.next)}
                          style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 50, padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap", transition: "all 0.15s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#1A7A2E"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#0E2011"}>
                          → Mark {ss.next}
                        </button>
                      )}

                      {/* Cancel button — only for non-final statuses */}
                      {!["Delivered","Received","Cancelled"].includes(tx.status) && (
                        <button
                          onClick={() => cancelOrder(tx.id)}
                          style={{ background: "#FFF0F0", color: "#C62828", border: "1.5px solid #FFCDD2", borderRadius: 50, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap", transition: "all 0.15s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#FFCDD2"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#FFF0F0"}>
                          Cancel
                        </button>
                      )}

                      {/* Expand toggle */}
                      <button onClick={() => setExpanded(isOpen ? null : tx.id)}
                        style={{ background: "#F5F5F0", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888", flexShrink: 0 }}>
                        {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded items */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #F0F0EC", background: "#FAFFF5", padding: "16px 20px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1A7A2E", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
                        Items in this Order
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                        {tx.items?.map((item) => (
                          <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 10, padding: "10px 14px", border: "1px solid #E8F0E0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              {item.image && (
                                <img src={item.image} alt={item.name}
                                  style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }}
                                  onError={(e) => { e.target.style.display = "none"; }} />
                              )}
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011" }}>{item.name}</div>
                                <div style={{ fontSize: 12, color: "#999" }}>Qty: {item.qty} × ₱{item.price?.toLocaleString()}</div>
                              </div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#1A7A2E" }}>
                              ₱{((item.price || 0) * item.qty).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery address */}
                      {tx.address && (
                        <div style={{ background: "#F0F9EC", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#555", display: "flex", alignItems: "center", gap: 8 }}>
                          <span>📍</span>
                          <span>{tx.address}</span>
                        </div>
                      )}

                      {/* Status flow indicator */}
                      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 0 }}>
                        {STATUS_FLOW.slice(0, 4).map((s, i) => {
                          const idx     = STATUS_FLOW.indexOf(tx.status);
                          const done    = STATUS_FLOW.indexOf(s) <= idx && tx.status !== "Cancelled";
                          const current = s === tx.status;
                          return (
                            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : "none" }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#0E2011" : "#E8EDE8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, border: current ? "3px solid #A8FF3E" : "none" }}>
                                  {done ? <span style={{ color: "#A8FF3E" }}>✓</span> : <span style={{ color: "#aaa" }}>{i + 1}</span>}
                                </div>
                                <span style={{ fontSize: 10, color: done ? "#0E2011" : "#aaa", fontWeight: 700, whiteSpace: "nowrap" }}>{s}</span>
                              </div>
                              {i < 3 && <div style={{ flex: 1, height: 2, background: done && STATUS_FLOW.indexOf(s) < idx ? "#0E2011" : "#E8EDE8", margin: "0 4px 16px" }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}