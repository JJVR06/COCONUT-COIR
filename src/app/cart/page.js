"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useApp();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen py-12 px-4"
        style={{ backgroundColor: "#f9fdf4" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1
            className="text-3xl font-bold mb-8 flex items-center gap-3"
            style={{ color: "#111827" }}
          >
            <ShoppingCart size={32} color="#2D5016" />
            Your Cart
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-7xl mb-4">🛒</div>
              <p
                className="text-xl font-semibold mb-2"
                style={{ color: "#374151" }}
              >
                Your cart is empty
              </p>
              <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
                Browse our products and add something you love!
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-3 rounded-full font-bold text-white transition"
                style={{ backgroundColor: "#2D5016" }}
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl shadow-sm p-4 flex items-center gap-4"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/80x80?text=No+Image")
                    }
                  />

                  {/* Name & Price */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-base truncate"
                      style={{ color: "#111827" }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="font-bold text-lg mt-0.5"
                      style={{ color: "#2D5016" }}
                    >
                      ₱{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.qty > 1
                          ? updateQty(item.id, item.qty - 1)
                          : removeFromCart(item.id)
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-80"
                      style={{ backgroundColor: "#f3f4f6" }}
                    >
                      <Minus size={14} color="#111827" />
                    </button>
                    <span
                      className="w-8 text-center font-bold text-base"
                      style={{ color: "#111827" }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-80"
                      style={{ backgroundColor: "#f3f4f6" }}
                    >
                      <Plus size={14} color="#111827" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p
                    className="font-bold text-base w-28 text-right"
                    style={{ color: "#111827" }}
                  >
                    ₱{(item.price * item.qty).toLocaleString()}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 transition hover:opacity-70"
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </div>
              ))}

              {/* Order Summary */}
              <div
                className="rounded-2xl shadow-sm p-6"
                style={{ backgroundColor: "#ffffff" }}
              >
                <h2
                  className="font-bold text-lg mb-4"
                  style={{ color: "#111827" }}
                >
                  Order Summary
                </h2>

                {/* Item breakdown */}
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span style={{ color: "#6b7280" }}>
                        {item.name} × {item.qty}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "#111827" }}
                      >
                        ₱{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="border-t pt-4 flex items-center justify-between"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Total Amount
                    </p>
                    <p
                      className="text-3xl font-black"
                      style={{ color: "#2D5016" }}
                    >
                      ₱{total.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href="/checkout"
                    className="px-8 py-3 rounded-full font-bold text-white text-sm transition hover:opacity-90"
                    style={{ backgroundColor: "#2D5016" }}
                  >
                    Proceed to Checkout →
                  </Link>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="text-center pt-2">
                <Link
                  href="/products"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: "#2D5016" }}
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}