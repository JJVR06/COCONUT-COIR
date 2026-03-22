"use client";
import { useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { useApp } from "@/context/AppContext";

/* ── Export helpers ─────────────────────────────────────────────────────── */

/** Properly escape a CSV cell value */
function escapeCSV(val) {
  const str = String(val ?? "").replace(/"/g, '""');
  // Wrap in quotes if it contains comma, newline, or quote
  return /[",\n\r]/.test(str) ? `"${str}"` : str;
}

/**
 * Download a proper RFC 4180 CSV file.
 * Prepends a UTF-8 BOM (0xEF BB BF) so Excel auto-detects the encoding
 * and renders Filipino characters (₱, accented letters) correctly.
 */
function downloadCSV(rows, filename) {
  const BOM = "\uFEFF";
  const csv = BOM + rows.map((r) => r.map(escapeCSV).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download a real XLSX file using the SheetJS library loaded from CDN.
 * This produces a genuine Office Open XML file that Excel opens without
 * any corruption warning.
 *
 * Falls back to CSV if SheetJS fails to load (e.g. offline).
 */
async function downloadXLSX(headers, rows, filename) {
  try {
    // Dynamically load SheetJS from CDN — no build-time dependency
    if (!window.XLSX) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload  = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const XLSX = window.XLSX;

    // Build worksheet data — first row is headers
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto-size columns (approximate)
    const colWidths = headers.map((h, i) => {
      const maxLen = Math.max(
        String(h).length,
        ...rows.map((r) => String(r[i] ?? "").length)
      );
      return { wch: Math.min(maxLen + 2, 40) };
    });
    ws["!cols"] = colWidths;

    // Style the header row bold (SheetJS community doesn't support full styling,
    // but the structure is correct and opens without error)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    XLSX.writeFile(wb, filename);
  } catch (err) {
    console.warn("SheetJS failed, falling back to CSV:", err);
    // Fallback — rename to .csv so the user knows what they're getting
    downloadCSV([headers, ...rows], filename.replace(".xlsx", ".csv"));
  }
}

/* ── Export menu component ───────────────────────────────────────────────── */
function ExportMenu({ label, headers, rows, csvFile, xlsxFile }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#fff", color: "#0E2011",
          border: "2px solid #0E2011", borderRadius: 12,
          padding: "9px 18px", fontFamily: "var(--font-body)",
          fontWeight: 700, fontSize: 12, cursor: "pointer",
          transition: "all 0.18s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#E8FFD0"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
      >
        ⬇ Export {label} {open ? "▲" : "▼"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "110%", left: 0,
            background: "#fff", border: "2px solid #E8EDE8",
            borderRadius: 14, padding: "8px", zIndex: 50,
            minWidth: 170, boxShadow: "0 8px 32px rgba(14,32,17,0.12)",
          }}
        >
          {[
            {
              fmt: "📄 CSV (.csv)",
              fn: () => {
                downloadCSV([headers, ...rows], csvFile);
                setOpen(false);
              },
            },
            {
              fmt: "📊 Excel (.xlsx)",
              fn: () => {
                downloadXLSX(headers, rows, xlsxFile);
                setOpen(false);
              },
            },
            {
              fmt: "🖨️ Print / PDF",
              fn: () => { window.print(); setOpen(false); },
            },
          ].map(({ fmt, fn }) => (
            <button
              key={fmt}
              onClick={fn}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none",
                padding: "9px 14px", fontFamily: "var(--font-body)",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                borderRadius: 8, color: "#0E2011", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#E8FFD0")}
              onMouseLeave={(e) => (e.target.style.background = "none")}
            >
              {fmt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Date helpers ────────────────────────────────────────────────────────── */
function txDate(tx) {
  const d = tx.created_at ? new Date(tx.created_at) : new Date(tx.date);
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), raw: d };
}

function isToday(tx) {
  const today = new Date();
  const { year, month, day } = txDate(tx);
  return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
}

function isThisMonth(tx) {
  const now = new Date();
  const { year, month } = txDate(tx);
  return year === now.getFullYear() && month === now.getMonth();
}

function groupByMonth(txs) {
  const map = {};
  txs.forEach((tx) => {
    const { raw } = txDate(tx);
    const key = raw.toLocaleDateString("en-PH", { year: "numeric", month: "long" });
    if (!map[key]) map[key] = [];
    map[key].push(tx);
  });
  return Object.entries(map).sort(([a], [b]) => new Date("1 " + b) - new Date("1 " + a));
}

/* ── Status badge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const m = {
    Delivered: ["#DCFCE7", "#166534"],
    Received:  ["#E8FFD0", "#1A7A2E"],
    Cancelled: ["#FFE4E6", "#9F1239"],
  };
  const [bg, color] = m[status] || ["#FFF9C4", "#856404"];
  return (
    <span style={{ background: bg, color, borderRadius: 50, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>
      {status}
    </span>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function ReportsClient() {
  const { transactions, inventory } = useApp();

  const valid = (t) => t.status !== "Cancelled";

  const todaySales  = transactions.filter((t) => isToday(t)     && valid(t)).reduce((s, t) => s + t.total, 0);
  const monthSales  = transactions.filter((t) => isThisMonth(t) && valid(t)).reduce((s, t) => s + t.total, 0);
  const monthOrders = transactions.filter((t) => isThisMonth(t) && valid(t)).length;
  const totalSales  = transactions.filter(valid).reduce((s, t) => s + t.total, 0);

  // Per-product sold quantities and revenue
  const ps = {};
  transactions.forEach((tx) => {
    if (!valid(tx)) return;
    (tx.items || []).forEach((i) => {
      ps[i.name] ??= { qty: 0, rev: 0 };
      ps[i.name].qty += i.qty;
      ps[i.name].rev += i.price * i.qty;
    });
  });

  const monthlyGroups = groupByMonth(transactions.filter(valid));
  const monthlyRows   = monthlyGroups.map(([label, txs]) => ({
    label,
    total: txs.reduce((s, t) => s + t.total, 0),
    count: txs.length,
  }));

  const products = Array.isArray(inventory) ? inventory : [];

  // ── Export data ─────────────────────────────────────────────────────────
  const orderHeaders  = ["Order ID", "Date", "Buyer Email", "Payment", "Delivery", "Status", "Total (PHP)"];
  const orderRows     = transactions.map((t) => [
    t.id, t.date, t.user_email || "", t.method, t.delivery, t.status, t.total,
  ]);

  const invHeaders = ["Product", "Category", "Price (PHP)", "Stock", "Units Sold", "Revenue (PHP)", "Status"];
  const invRows    = products.map((p) => [
    p.name, p.category, p.price, p.stock,
    ps[p.name]?.qty || 0,
    ps[p.name]?.rev || 0,
    p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock",
  ]);

  const monthHeaders = ["Month", "Orders", "Revenue (PHP)", "Avg Order Value (PHP)"];
  const monthExport  = monthlyRows.map((r) => [
    r.label, r.count, r.total,
    r.count > 0 ? Math.round(r.total / r.count) : 0,
  ]);

  const now      = new Date();
  const nowLabel = now.toLocaleDateString("en-PH", { month: "long", year: "numeric" });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />

      <main className="seller-page-main" style={{ flex: 1, background: "#F8F9FA", overflowY: "auto" }}>
        <style>{`
          .seller-page-main { padding: 32px; }
          /* mobile padding handled by globals.css */
          .reports-summary { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 14px; margin-bottom: 24px; }
          @media (max-width: 479px) { .reports-summary { grid-template-columns: 1fr 1fr; gap: 10px; } }
          .reports-monthly { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 10px; }
          @media (max-width: 479px) { .reports-monthly { grid-template-columns: 1fr; } }
          @media print { aside,.no-print { display:none!important } main { padding:0!important } }
        `}</style>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,4vw,26px)", fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>Reports</h1>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Daily, monthly, and all-time sales overview.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} className="no-print">
            <ExportMenu
              label="Orders"
              headers={orderHeaders} rows={orderRows}
              csvFile="coircraft-orders.csv"   xlsxFile="coircraft-orders.xlsx"
            />
            <ExportMenu
              label="Monthly"
              headers={monthHeaders} rows={monthExport}
              csvFile="coircraft-monthly.csv"  xlsxFile="coircraft-monthly.xlsx"
            />
            <ExportMenu
              label="Inventory"
              headers={invHeaders} rows={invRows}
              csvFile="coircraft-inventory.csv" xlsxFile="coircraft-inventory.xlsx"
            />
            <button
              onClick={() => window.print()}
              className="no-print"
              style={{
                background: "#0E2011", color: "#A8FF3E", border: "none",
                borderRadius: 12, padding: "10px 18px",
                fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12,
                cursor: "pointer", transition: "all 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1A472A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#0E2011"; }}
            >
              🖨️ Print / PDF
            </button>
          </div>
        </div>

        {/* ── Summary cards ── */}
        <div className="reports-summary">
          {[
            { label: "Today's Sales",    value: todaySales,  icon: "📅", sub: new Date().toLocaleDateString("en-PH", { weekday: "long", month: "short", day: "numeric" }) },
            { label: nowLabel,           value: monthSales,  icon: "📆", sub: `${monthOrders} order${monthOrders !== 1 ? "s" : ""} this month` },
            { label: "All-Time Revenue", value: totalSales,  icon: "💰", sub: `${transactions.filter(valid).length} confirmed orders` },
            { label: "Total Orders",     value: transactions.length, icon: "📦", sub: "All statuses", raw: true },
          ].map(({ label, value, icon, sub, raw }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 18, padding: "20px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0E2011" }}>
                {raw ? value : `₱${Number(value).toLocaleString()}`}
              </div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Monthly breakdown ── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "clamp(16px,4vw,22px)", marginBottom: 22, boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(15px,2.5vw,18px)", color: "#0E2011", margin: 0 }}>
              Monthly Sales Breakdown
            </h2>
            <span style={{ fontSize: 12, color: "#aaa" }}>Cancelled orders excluded</span>
          </div>

          {monthlyRows.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              <p>No confirmed orders yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", minWidth: 400 }}>
                <thead>
                  <tr style={{ background: "#F5F9F0" }}>
                    {["Month", "Orders", "Revenue", "Avg. Order Value"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#1A7A2E", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyRows.map((row) => {
                    const isCurrent = row.label === nowLabel;
                    const avg = row.count > 0 ? Math.round(row.total / row.count) : 0;
                    return (
                      <tr key={row.label} style={{ borderBottom: "1px solid #F0F0EC", background: isCurrent ? "#F5FFF0" : "transparent" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0E2011", whiteSpace: "nowrap" }}>
                          {row.label}
                          {isCurrent && <span style={{ marginLeft: 8, background: "#E8FFD0", color: "#1A7A2E", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>CURRENT</span>}
                        </td>
                        <td style={{ padding: "12px 14px", color: "#555" }}>{row.count}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#1A7A2E" }}>₱{row.total.toLocaleString()}</td>
                        <td style={{ padding: "12px 14px", color: "#888" }}>₱{avg.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#F5F9F0", borderTop: "2px solid #E8EDE8" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: "#0E2011", fontSize: 13 }}>All Time</td>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{transactions.filter(valid).length}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: "#1A7A2E", fontSize: 14 }}>₱{totalSales.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", color: "#888" }}>
                      ₱{transactions.filter(valid).length > 0
                        ? Math.round(totalSales / transactions.filter(valid).length).toLocaleString()
                        : 0}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* ── All Orders table ── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "clamp(16px,4vw,22px)", marginBottom: 22, boxShadow: "0 2px 12px rgba(14,32,17,0.06)", overflow: "auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(15px,2.5vw,18px)", color: "#0E2011", margin: "0 0 16px" }}>All Orders</h2>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", minWidth: 520 }}>
            <thead>
              <tr style={{ background: "#F5F9F0" }}>
                {orderHeaders.map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#1A7A2E", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#aaa" }}>No orders yet</td></tr>
              )}
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid #F0F0EC" }}>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#1A7A2E", whiteSpace: "nowrap" }}>{tx.id}</td>
                  <td style={{ padding: "11px 14px", color: "#888", whiteSpace: "nowrap" }}>{tx.date}</td>
                  <td style={{ padding: "11px 14px", color: "#666", fontSize: 12 }}>{tx.user_email || "—"}</td>
                  <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>{tx.method}</td>
                  <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>{tx.delivery}</td>
                  <td style={{ padding: "11px 14px" }}><StatusBadge status={tx.status} /></td>
                  <td style={{ padding: "11px 14px", fontWeight: 700 }}>₱{(tx.total || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Inventory report ── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "clamp(16px,4vw,22px)", boxShadow: "0 2px 12px rgba(14,32,17,0.06)", overflow: "auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(15px,2.5vw,18px)", color: "#0E2011", margin: "0 0 16px" }}>Inventory Report</h2>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "#F5F9F0" }}>
                {invHeaders.map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#1A7A2E", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#aaa" }}>No products in inventory</td></tr>
              )}
              {products.map((p) => {
                const badge = p.stock === 0
                  ? ["#FFE4E6", "#9F1239", "Out of Stock"]
                  : p.stock < 10
                  ? ["#FFF9C4", "#856404", "Low Stock"]
                  : ["#DCFCE7", "#166534", "In Stock"];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F0F0EC" }}>
                    <td style={{ padding: "11px 14px", fontWeight: 700 }}>{p.name}</td>
                    <td style={{ padding: "11px 14px", color: "#888" }}>{p.category}</td>
                    <td style={{ padding: "11px 14px", color: "#1A7A2E", fontWeight: 600 }}>₱{Number(p.price || 0).toLocaleString()}</td>
                    <td style={{ padding: "11px 14px" }}>{p.stock}</td>
                    <td style={{ padding: "11px 14px" }}>{ps[p.name]?.qty || 0}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 700 }}>₱{(ps[p.name]?.rev || 0).toLocaleString()}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ background: badge[0], color: badge[1], borderRadius: 50, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{badge[2]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ height: 72 }} />
      </main>
    </div>
  );
}