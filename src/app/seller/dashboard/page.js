"use client";
import { useEffect, useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { ShoppingBag, Package, TrendingUp, Users } from "lucide-react";

export default function SellerDashboard() {
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

  const totalRevenue = transactions.reduce((s, t) => s + Number(t.total), 0);

  const stats = [
    { label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, icon: TrendingUp, bg: "#f0fdf4", color: "#166534" },
    { label: "Total Orders", value: transactions.length, icon: ShoppingBag, bg: "#eff6ff", color: "#1d4ed8" },
    { label: "Products", value: products.length, icon: Package, bg: "#fffbeb", color: "#92400e" },
    { label: "Customers", value: "—", icon: Users, bg: "#faf5ff", color: "#6b21a8" },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <SellerSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#111827" }}>
          Dashboard
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
          Welcome back, Admin 👋
        </p>

        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading dashboard...</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map(({ label, value, icon: Icon, bg, color }) => (
                <div
                  key={label}
                  className="rounded-2xl shadow-sm p-6"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={20} color={color} />
                  </div>
                  <p className="text-2xl font-black" style={{ color: "#111827" }}>
                    {value}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div
              className="rounded-2xl shadow-sm p-6"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h2
                className="font-bold text-lg mb-4"
                style={{ color: "#111827" }}
              >
                Recent Orders
              </h2>
              {transactions.length === 0 ? (
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  No orders yet.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      {["Order ID", "Date", "Payment", "Total"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 font-semibold text-xs uppercase tracking-wide"
                          style={{ color: "#9ca3af" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((tx) => (
                      <tr
                        key={tx.id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td
                          className="py-3 font-medium"
                          style={{ color: "#2D5016" }}
                        >
                          {tx.id}
                        </td>
                        <td className="py-3" style={{ color: "#6b7280" }}>
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3" style={{ color: "#374151" }}>
                          {tx.payment_method}
                        </td>
                        <td
                          className="py-3 font-bold"
                          style={{ color: "#111827" }}
                        >
                          ₱{Number(tx.total).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}