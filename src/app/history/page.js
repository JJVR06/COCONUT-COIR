"use client";
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HistoryPage() {
  const { user } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    fetch(`/api/transactions?email=${user.email}`)
      .then((r) => r.json())
      .then((d) => { setTransactions(d.transactions || []); setLoading(false); });
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#2D5016] mb-8">📋 Transaction History</h1>
          {loading ? (
            <p className="text-center text-gray-400 py-20">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-xl">No transactions yet.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-[#2D5016]">{tx.id}</p>
                      <p className="text-gray-500 text-sm">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{tx.status}</span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {tx.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-gray-600">
                        <span>{i.product_name} × {i.qty}</span>
                        <span>₱{(i.price * i.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 flex justify-between text-sm">
                    <span className="text-gray-500">{tx.payment_method} · {tx.delivery}</span>
                    <span className="font-bold text-[#2D5016]">₱{Number(tx.total).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}