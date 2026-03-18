"use client";
import SellerSidebar from "@/components/SellerSidebar";
import { useApp } from "@/context/AppContext";
import { products } from "@/data/products";
import { ShoppingBag, Package, TrendingUp, Users } from "lucide-react";

export default function SellerDashboard() {
  const { transactions } = useApp();
  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
  const totalOrders = transactions.length;
  const totalProducts = products.length;

  const stats = [
    { label: "Total Revenue", value: `₱${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-green-50 text-green-700" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-700" },
    { label: "Products", value: totalProducts, icon: Package, color: "bg-amber-50 text-amber-700" },
    { label: "Customers", value: "—", icon: Users, color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-black text-gray-800">{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Recent Orders</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b">
                  <th className="text-left py-2">ID</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Method</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="py-2 text-[#2D5016] font-medium">{tx.id}</td>
                    <td className="py-2 text-gray-500">{tx.date}</td>
                    <td className="py-2">{tx.method}</td>
                    <td className="py-2 text-right font-bold">₱{tx.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}