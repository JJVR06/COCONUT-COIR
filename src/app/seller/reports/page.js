"use client";
import { useState, useEffect } from "react";
import SellerSidebar from "@/components/SellerSidebar";

export default function SellerReports() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/transactions/all")
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions || []));
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, []);

  const now = new Date();
  const today = now.toLocaleDateString();
  const thisMonth = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const todaySales = transactions
    .filter((t) => new Date(t.created_at).toLocaleDateString() === today)
    .reduce((s, t) => s + Number(t.total), 0);

  const monthSales = transactions
    .filter((t) => {
      const d = new Date(t.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + Number(t.total), 0);

  const totalSales = transactions.reduce((s, t) => s + Number(t.total), 0);

  const productSales = {};
  transactions.forEach((tx) => {
    (tx.items || []).forEach((item) => {
      productSales[item.product_name] = (productSales[item.product_name] || 0) + item.qty;
    });
  });

  const salesCards = [
    { label: `Today (${today})`, value: todaySales, icon: "📅" },
    { label: `This Month (${thisMonth})`, value: monthSales, icon: "📆" },
    { label: "All-Time Sales", value: totalSales, icon: "📊" },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <SellerSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#111827" }}>
          Reports
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
          Sales and inventory overview
        </p>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading reports...</p>
        ) : (
          <>
            {/* Sales Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {salesCards.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="rounded-2xl shadow-sm p-6"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <p className="text-2xl mb-2">{icon}</p>
                  <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
                    {label}
                  </p>
                  <p className="text-3xl font-black" style={{ color: "#2D5016" }}>
                    ₱{value.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Inventory Report Table */}
            <div
              className="rounded-2xl shadow-sm p-6"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h2
                className="font-bold text-lg mb-4"
                style={{ color: "#111827" }}
              >
                📦 Inventory Report
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                      {["Product", "Category", "Price", "Stock", "Units Sold", "Status"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-3 font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#9ca3af" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const sold = productSales[p.name] || 0;
                      const status =
                        p.stock === 0
                          ? { label: "Out of Stock", bg: "#fef2f2", color: "#dc2626" }
                          : p.stock < 20
                          ? { label: "Low Stock", bg: "#fffbeb", color: "#d97706" }
                          : { label: "In Stock", bg: "#f0fdf4", color: "#16a34a" };

                      return (
                        <tr
                          key={p.id}
                          style={{ borderBottom: "1px solid #f3f4f6" }}
                        >
                          <td
                            className="py-3 font-semibold"
                            style={{ color: "#111827" }}
                          >
                            {p.name}
                          </td>
                          <td className="py-3" style={{ color: "#6b7280" }}>
                            {p.category}
                          </td>
                          <td
                            className="py-3 font-semibold"
                            style={{ color: "#2D5016" }}
                          >
                            ₱{Number(p.price).toLocaleString()}
                          </td>
                          <td
                            className="py-3 font-semibold"
                            style={{ color: "#111827" }}
                          >
                            {p.stock}
                          </td>
                          <td
                            className="py-3 font-semibold"
                            style={{ color: "#111827" }}
                          >
                            {sold}
                          </td>
                          <td className="py-3">
                            <span
                              className="px-2 py-1 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: status.bg,
                                color: status.color,
                              }}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}