"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const { cart, clearCart, addTransaction, user } = useApp();
  const router = useRouter();
  const [payment, setPayment] = useState("COD");
  const [delivery, setDelivery] = useState("Delivery");
  const [done, setDone] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = async () => {
  const tx = {
    id: "TXN-" + Date.now(),
    user_email: user?.email,
    total,
    payment_method: payment,
    delivery,
    items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty, image: i.image })),
  };
  await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tx),
  });
  clearCart();
  setDone(true);
  setTimeout(() => router.push("/history"), 2500);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fdf4]">
      <div className="text-center">
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-[#2D5016]">Order Placed!</h2>
        <p className="text-gray-500">Redirecting to your transaction history...</p>
      </div>
    </div>
  );

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#2D5016] mb-8">Checkout</h1>
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>
            {cart.map((i) => (
              <div key={i.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                <span>{i.name} × {i.qty}</span>
                <span className="font-semibold">₱{(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span className="text-[#2D5016]">₱{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {["COD", "GCash", "Bank Transfer", "Credit Card"].map((m) => (
                <button key={m} onClick={() => setPayment(m)}
                  className={`py-3 rounded-xl border-2 font-semibold text-sm transition ${
                    payment === m ? "border-[#2D5016] bg-[#f0fde8] text-[#2D5016]" : "border-gray-200 text-gray-600"
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Delivery Option</h2>
            <div className="grid grid-cols-2 gap-3">
              {["Delivery", "Pickup"].map((d) => (
                <button key={d} onClick={() => setDelivery(d)}
                  className={`py-3 rounded-xl border-2 font-semibold text-sm transition ${
                    delivery === d ? "border-[#2D5016] bg-[#f0fde8] text-[#2D5016]" : "border-gray-200 text-gray-600"
                  }`}>
                  {d === "Delivery" ? "🚚 Delivery" : "🏪 Pickup"}
                </button>
              ))}
            </div>
            {user && delivery === "Delivery" && (
              <p className="text-sm text-gray-500 mt-3">📍 Delivering to: {user.address}</p>
            )}
          </div>

          <button onClick={placeOrder}
            className="w-full bg-[#2D5016] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a3009] transition">
            Place Order
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}