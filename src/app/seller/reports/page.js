"use client";
import { useState, useEffect } from "react";
import SellerSidebar from "@/components/SellerSidebar";

export default function SellerReports() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/transactions/all").then((r) => r.json()).then((d) => setTransactions(d.transactions || []));
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(d.products || []));
  }, []);

  const today = new Date().toLocaleDateString();
  const now = new Date();

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
      const key = item.product_name;
      productSales[key] = (productSales[key] || 0) + item.qty;
    });
  });

  const thisMonth = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: `Sales Today (${today})`, value: todaySales },
            { label: `Sales This Month (${thisMonth})`, value: monthSales },
            { label: "All-Time Sales", value: totalSales },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-6">
              <p className="text-gray-500 text-sm mb-1">{label}</p>
              <p className="text-3xl font-black text-[#2D5016]">₱{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Inventory Report</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-left border-b">
              <tr>
                <th className="py-2">Product</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Units Sold</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3 text-gray-500">{p.category}</td>
                  <td className="py-3 text-[#2D5016]">₱{Number(p.price).toLocaleString()}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3">{productSales[p.name] || 0}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      p.stock === 0 ? "bg-red-100 text-red-600" :
                      p.stock < 20 ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {p.stock === 0 ? "Out of Stock" : p.stock < 20 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}