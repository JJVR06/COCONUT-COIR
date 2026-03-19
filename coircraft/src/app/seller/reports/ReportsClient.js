"use client";
import { useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";

function downloadCSV(rows, filename) {
  const csv  = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click(); URL.revokeObjectURL(url);
}

function downloadExcel(headers, rows, filename) {
  const trs  = [headers, ...rows].map((r) => "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>").join("");
  const html = `<html><head><meta charset="UTF-8"><style>td{border:1px solid #ccc;padding:6px}</style></head><body><table>${trs}</table></body></html>`;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click(); URL.revokeObjectURL(url);
}

function ExportMenu({ label, headers, rows, csvFile, xlsFile }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#0E2011", border: "2px solid #0E2011", borderRadius: 12, padding: "9px 18px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
        ⬇ Export {label} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "110%", left: 0, background: "#fff", border: "2px solid #E8EDE8", borderRadius: 14, padding: "8px", zIndex: 50, minWidth: 150, boxShadow: "0 8px 32px rgba(14,32,17,0.12)" }}>
          {[
            { fmt: "CSV",   fn: () => { downloadCSV([headers, ...rows], csvFile); setOpen(false); } },
            { fmt: "Excel", fn: () => { downloadExcel(headers, rows, xlsFile);    setOpen(false); } },
            { fmt: "Print / PDF", fn: () => { window.print(); setOpen(false); } },
          ].map(({ fmt, fn }) => (
            <button key={fmt} onClick={fn}
              style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "9px 14px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, cursor: "pointer", borderRadius: 8, color: "#0E2011" }}
              onMouseEnter={(e) => e.target.style.background = "#E8FFD0"}
              onMouseLeave={(e) => e.target.style.background = "none"}>
              {fmt === "CSV" ? "📄" : fmt === "Excel" ? "📊" : "🖨️"} {fmt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportsClient() {
  const { transactions } = useApp();

  const today     = new Date().toLocaleDateString();
  const valid     = (t) => t.status !== "Cancelled";
  const todaySales = transactions.filter((t) => new Date(t.date).toLocaleDateString() === today && valid(t)).reduce((s, t) => s + t.total, 0);
  const totalSales = transactions.filter(valid).reduce((s, t) => s + t.total, 0);

  const ps = {};
  transactions.forEach((tx) => {
    if (!valid(tx)) return;
    tx.items?.forEach((i) => { ps[i.name] ??= { qty: 0, rev: 0 }; ps[i.name].qty += i.qty; ps[i.name].rev += i.price * i.qty; });
  });

  const orderHeaders = ["Order ID","Date","Payment","Delivery","Status","Total (PHP)"];
  const orderRows    = transactions.map((t) => [t.id, t.date, t.method, t.delivery, t.status, t.total]);
  const invHeaders   = ["Product","Category","Price","Stock","Units Sold","Revenue","Status"];
  const invRows      = products.map((p) => [p.name, p.category, p.price, p.stock, ps[p.name]?.qty||0, ps[p.name]?.rev||0, p.stock===0?"Out of Stock":p.stock<10?"Low Stock":"In Stock"]);

  const sBadge = (s) => {
    const m = { Delivered:["#DCFCE7","#166534"], Received:["#E8FFD0","#1A7A2E"], Cancelled:["#FFE4E6","#9F1239"] };
    const [bg, color] = m[s] || ["#FFF9C4","#856404"];
    return <span style={{ background: bg, color, borderRadius: 50, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{s}</span>;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />
      <main style={{ flex: 1, background: "#F8F9FA", padding: 32, overflowY: "auto" }}>
        <style>{`@media print { aside,.no-print { display:none!important } main { padding:0!important } }`}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>Reports</h1>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Sales overview and inventory analysis.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} className="no-print">
            <ExportMenu label="Orders"    headers={orderHeaders} rows={orderRows} csvFile="orders.csv"    xlsFile="orders.xls" />
            <ExportMenu label="Inventory" headers={invHeaders}   rows={invRows}   csvFile="inventory.csv" xlsFile="inventory.xls" />
            <button onClick={() => window.print()}
              style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 12, padding: "10px 18px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              🖨️ Print / PDF
            </button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: `Today`, value: todaySales, icon: "📅" },
            { label: "Total Revenue", value: totalSales, icon: "💰" },
            { label: "Total Orders",  value: transactions.length, icon: "📦", raw: true },
          ].map(({ label, value, icon, raw }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 18, padding: "22px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011" }}>
                {raw ? value : `₱${value.toLocaleString()}`}
              </div>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px", marginBottom: 22, boxShadow: "0 2px 12px rgba(14,32,17,0.06)", overflow: "auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#0E2011", margin: "0 0 16px" }}>All Orders</h2>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F5F9F0" }}>
              {orderHeaders.map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#1A7A2E", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid #F0F0EC" }}>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#1A7A2E" }}>{tx.id}</td>
                  <td style={{ padding: "11px 14px", color: "#888" }}>{tx.date}</td>
                  <td style={{ padding: "11px 14px" }}>{tx.method}</td>
                  <td style={{ padding: "11px 14px" }}>{tx.delivery}</td>
                  <td style={{ padding: "11px 14px" }}>{sBadge(tx.status)}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700 }}>₱{(tx.total||0).toLocaleString()}</td>
                </tr>
              ))}
              {transactions.length === 0 && <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#aaa" }}>No orders yet</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Inventory report */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)", overflow: "auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#0E2011", margin: "0 0 16px" }}>Inventory Report</h2>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F5F9F0" }}>
              {invHeaders.map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#1A7A2E", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {products.map((p) => {
                const badge = p.stock === 0 ? ["#FFE4E6","#9F1239","Out of Stock"] : p.stock < 10 ? ["#FFF9C4","#856404","Low Stock"] : ["#DCFCE7","#166534","In Stock"];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F0F0EC" }}>
                    <td style={{ padding: "11px 14px", fontWeight: 700 }}>{p.name}</td>
                    <td style={{ padding: "11px 14px", color: "#888" }}>{p.category}</td>
                    <td style={{ padding: "11px 14px", color: "#1A7A2E", fontWeight: 600 }}>₱{p.price.toLocaleString()}</td>
                    <td style={{ padding: "11px 14px" }}>{p.stock}</td>
                    <td style={{ padding: "11px 14px" }}>{ps[p.name]?.qty || 0}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 700 }}>₱{(ps[p.name]?.rev || 0).toLocaleString()}</td>
                    <td style={{ padding: "11px 14px" }}><span style={{ background: badge[0], color: badge[1], borderRadius: 50, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{badge[2]}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}