"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useApp();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 1500 ? 0 : 120;
  const total    = subtotal + shipping;

  return (
    <>
      <Navbar />

      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (min-width: 768px) {
          .cart-layout { grid-template-columns: 1fr 340px; gap: 28px; }
        }

        .cart-item-inner {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: nowrap;
        }
        @media (max-width: 479px) {
          .cart-item-inner { flex-wrap: wrap; }
          .cart-item-actions { width: 100%; justify-content: space-between; }
        }

        /* Spacer for mobile bottom nav */
        .cart-mobile-spacer { height: 80px; display: block; }
        @media (min-width: 768px) { .cart-mobile-spacer { display: none; } }
      `}</style>

      <main style={{ background: "var(--tk-bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 48px" }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#0E2011", margin: "0 0 5px" }}>
              🛒 Your Cart
            </h1>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
              {cart.length === 0
                ? "Your cart is empty"
                : `${cart.reduce((s, i) => s + i.qty, 0)} item${cart.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ width: 90, height: 90, background: "#E8FFD0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 20px" }}>🛒</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#0E2011", margin: "0 0 8px" }}>Your cart is empty</h2>
              <p style={{ color: "#888", marginBottom: 28, fontSize: 14 }}>You haven&apos;t added any products yet.</p>
              <Link href="/products" className="tk-btn-cta" style={{ textDecoration: "none" }}>Shop Now</Link>
            </div>
          ) : (
            <div className="cart-layout">

              {/* ── ITEMS ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cart.map((item) => (
                  <div key={item.id}
                    style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "var(--shadow-sm)", border: "1.5px solid #F0F0EC" }}>
                    <div className="cart-item-inner">
                      {/* Image */}
                      <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#E8FFD0" }}>
                        <img src={item.image} alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.display = "none"; }} />
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(13px,3vw,15px)", color: "#0E2011", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 13, color: "#1A7A2E", fontWeight: 700 }}>
                          ₱{item.price.toLocaleString()} each
                        </div>
                        <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                          Subtotal: ₱{(item.price * item.qty).toLocaleString()}
                        </div>
                      </div>

                      {/* Qty + delete */}
                      <div className="cart-item-actions" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F9F0", borderRadius: 999, padding: "5px 12px", border: "2px solid #E5EDE5" }}>
                          <button
                            onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeFromCart(item.id)}
                            style={{ width: 28, height: 28, background: "#0E2011", borderRadius: "50%", border: "none", color: "#A8FF3E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}>
                            <Minus size={13} />
                          </button>
                          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            style={{ width: 28, height: 28, background: "#0E2011", borderRadius: "50%", border: "none", color: "#A8FF3E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}>
                            <Plus size={13} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)}
                          style={{ width: 36, height: 36, background: "#FFF0F0", border: "1.5px solid #FFCDD2", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.18s", WebkitTapHighlightColor: "transparent" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#FFCDD2"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#FFF0F0"}>
                          <Trash2 size={14} color="#C62828" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue shopping */}
                <Link href="/products"
                  style={{ display: "flex", alignItems: "center", gap: 8, color: "#1A7A2E", fontWeight: 700, fontSize: 13, textDecoration: "none", padding: "4px 0" }}>
                  <ShoppingBag size={15} /> Continue Shopping
                </Link>
              </div>

              {/* ── ORDER SUMMARY ── */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "var(--shadow-sm)", border: "1.5px solid #F0F0EC", position: "sticky", top: 80 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 20px" }}>
                  Order Summary
                </h2>

                {cart.map((i) => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 8 }}>
                    <span style={{ flex: 1, marginRight: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.name} ×{i.qty}</span>
                    <span style={{ fontWeight: 600, flexShrink: 0 }}>₱{(i.price * i.qty).toLocaleString()}</span>
                  </div>
                ))}

                <div style={{ borderTop: "1.5px solid #F0F0EC", marginTop: 14, paddingTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 8 }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 14 }}>
                    <span>Shipping</span>
                    <span style={{ fontWeight: 600, color: shipping === 0 ? "#1A7A2E" : "#555" }}>
                      {shipping === 0 ? "FREE 🎉" : `₱${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div style={{ background: "#F5F9F0", borderRadius: 10, padding: "8px 12px", fontSize: 11, color: "#888", marginBottom: 14, textAlign: "center" }}>
                      Add ₱{(1500 - subtotal).toLocaleString()} more for <strong style={{ color: "#1A7A2E" }}>free shipping</strong>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#0E2011", marginBottom: 20 }}>
                    <span>Total</span>
                    <span>₱{total.toLocaleString()}</span>
                  </div>

                  <Link href="/checkout" className="tk-btn-cta" style={{ textDecoration: "none", display: "block", textAlign: "center", width: "100%", boxSizing: "border-box" }}>
                    Proceed to Checkout →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="cart-mobile-spacer" />
        </div>
      </main>
      <Footer />
    </>
  );
}