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
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = async () => {
    setLoading(true);
    const tx = {
      id: "TXN-" + Date.now(),
      user_email: user?.email,
      total,
      payment_method: payment,
      delivery,
      items: cart.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image,
      })),
    };
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });
    clearCart();
    setLoading(false);
    setDone(true);
    setTimeout(() => router.push("/history"), 2500);
  };

  // Success screen
  if (done) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f9fdf4" }}
      >
        <div className="text-center px-4">
          <div className="text-7xl mb-4">✅</div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "#111827" }}
          >
            Order Placed Successfully!
          </h2>
          <p style={{ color: "#6b7280" }}>
            Redirecting to your transaction history...
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  const paymentMethods = [
    { id: "COD", label: "Cash on Delivery", icon: "💵" },
    { id: "GCash", label: "GCash", icon: "📱" },
    { id: "Bank Transfer", label: "Bank Transfer", icon: "🏦" },
    { id: "Credit Card", label: "Credit Card", icon: "💳" },
  ];

  const deliveryOptions = [
    { id: "Delivery", label: "Home Delivery", icon: "🚚", desc: "Delivered to your address" },
    { id: "Pickup", label: "Store Pickup", icon: "🏪", desc: "Pick up at our store" },
  ];

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen py-12 px-4"
        style={{ backgroundColor: "#f9fdf4" }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <h1
            className="text-3xl font-bold mb-8"
            style={{ color: "#111827" }}
          >
            Checkout
          </h1>

          {/* Order Summary */}
          <div
            className="rounded-2xl shadow-sm p-6 mb-5"
            style={{ backgroundColor: "#ffffff" }}
          >
            <h2
              className="font-bold text-lg mb-4"
              style={{ color: "#111827" }}
            >
              🧾 Order Summary
            </h2>
            <div className="space-y-3">
              {cart.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={i.image}
                    alt={i.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/48x48?text=No+Img")
                    }
                  />
                  <div className="flex-1">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "#111827" }}
                    >
                      {i.name}
                    </p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      ₱{i.price.toLocaleString()} × {i.qty}
                    </p>
                  </div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: "#111827" }}
                  >
                    ₱{(i.price * i.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="border-t mt-4 pt-4 flex justify-between items-center"
              style={{ borderColor: "#e5e7eb" }}
            >
              <span
                className="font-bold text-base"
                style={{ color: "#111827" }}
              >
                Total
              </span>
              <span
                className="font-black text-2xl"
                style={{ color: "#2D5016" }}
              >
                ₱{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div
            className="rounded-2xl shadow-sm p-6 mb-5"
            style={{ backgroundColor: "#ffffff" }}
          >
            <h2
              className="font-bold text-lg mb-4"
              style={{ color: "#111827" }}
            >
              💳 Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className="py-3 px-4 rounded-xl border-2 font-semibold text-sm transition text-left"
                  style={{
                    borderColor: payment === m.id ? "#2D5016" : "#e5e7eb",
                    backgroundColor:
                      payment === m.id ? "#f0fdf4" : "#ffffff",
                    color: payment === m.id ? "#2D5016" : "#374151",
                  }}
                >
                  <span className="text-lg mr-2">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Option */}
          <div
            className="rounded-2xl shadow-sm p-6 mb-6"
            style={{ backgroundColor: "#ffffff" }}
          >
            <h2
              className="font-bold text-lg mb-4"
              style={{ color: "#111827" }}
            >
              🚚 Delivery Option
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {deliveryOptions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDelivery(d.id)}
                  className="py-4 px-4 rounded-xl border-2 font-semibold text-sm transition text-left"
                  style={{
                    borderColor: delivery === d.id ? "#2D5016" : "#e5e7eb",
                    backgroundColor:
                      delivery === d.id ? "#f0fdf4" : "#ffffff",
                    color: delivery === d.id ? "#2D5016" : "#374151",
                  }}
                >
                  <div className="text-2xl mb-1">{d.icon}</div>
                  <div className="font-bold" style={{ color: delivery === d.id ? "#2D5016" : "#111827" }}>
                    {d.label}
                  </div>
                  <div className="text-xs font-normal mt-0.5" style={{ color: "#6b7280" }}>
                    {d.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Delivery address */}
            {user && delivery === "Delivery" && (
              <div
                className="mt-4 p-3 rounded-xl text-sm"
                style={{ backgroundColor: "#f9fdf4" }}
              >
                <span style={{ color: "#6b7280" }}>📍 Delivering to: </span>
                <span className="font-semibold" style={{ color: "#111827" }}>
                  {user.address}
                </span>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg text-white transition"
            style={{
              backgroundColor: loading ? "#6b7280" : "#2D5016",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Placing Order..." : "Place Order ✓"}
          </button>

          {/* Back to cart */}
          <div className="text-center mt-4">
            <button
              onClick={() => router.push("/cart")}
              className="text-sm font-semibold hover:underline"
              style={{ color: "#2D5016" }}
            >
              ← Back to Cart
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}