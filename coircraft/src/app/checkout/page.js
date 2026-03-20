"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, CheckCircle } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "COD",           label: "Cash on Delivery",  icon: "💵", fields: [] },
  { id: "GCash",         label: "GCash",              icon: "📱", fields: [{ key: "gcashNumber",  label: "GCash Mobile Number", placeholder: "09XX XXX XXXX", type: "tel" }] },
  { id: "Maya",          label: "Maya (PayMaya)",     icon: "💜", fields: [{ key: "mayaNumber",   label: "Maya Mobile Number",  placeholder: "09XX XXX XXXX", type: "tel" }] },
  { id: "Bank Transfer", label: "Bank Transfer",      icon: "🏦", fields: [
    { key: "bankName",      label: "Bank Name",      placeholder: "BDO, BPI, Metrobank…", type: "text" },
    { key: "accountName",   label: "Account Name",   placeholder: "Account holder name",  type: "text" },
    { key: "accountNumber", label: "Account Number", placeholder: "Account number",       type: "text" },
  ]},
  { id: "Credit Card",   label: "Credit / Debit Card", icon: "💳", fields: [
    { key: "cardNumber", label: "Card Number",    placeholder: "XXXX XXXX XXXX XXXX", type: "text" },
    { key: "cardName",   label: "Name on Card",   placeholder: "As printed on card",  type: "text" },
    { key: "cardExpiry", label: "Expiry (MM/YY)", placeholder: "MM/YY",               type: "text" },
    { key: "cardCVV",    label: "CVV",            placeholder: "XXX",                 type: "text" },
  ]},
];

const STEPS = ["Delivery", "Payment", "Review & Place"];

export default function CheckoutPage() {
  const { cart, clearCart, addTransaction, user } = useApp();
  const router = useRouter();

  const [step,       setStep]       = useState(1);
  const [payment,    setPayment]    = useState("COD");
  const [delivery,   setDelivery]   = useState("Delivery");
  const [payFields,  setPayFields]  = useState({});
  const [address,    setAddress]    = useState(user?.address || "");
  const [addingAddr, setAddingAddr] = useState(false);
  const [newAddr,    setNewAddr]    = useState("");
  const [savedAddrs, setSavedAddrs] = useState([user?.address].filter(Boolean));
  const [done,       setDone]       = useState(false);
  const [txId,       setTxId]       = useState("");

  const subtotal    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping    = delivery === "Pickup" ? 0 : 120;
  const total       = subtotal + shipping;
  const selectedPay = PAYMENT_METHODS.find((p) => p.id === payment);

  const inp = {
    width: "100%", border: "2px solid #E5EDE5", borderRadius: 12,
    padding: "12px 14px", fontSize: 14, fontFamily: "var(--font-body)",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };

  const placeOrder = () => {
    const id = "TXN-" + Date.now();
    addTransaction({ id, date: new Date().toLocaleString(), items: [...cart], total, method: payment, delivery, address, status: "Pending" });
    clearCart();
    setTxId(id);
    setDone(true);
    setTimeout(() => router.push("/history"), 3000);
  };

  if (done) return (
    <div style={{ minHeight: "100vh", background: "var(--tk-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", padding: 24 }}>
      <div style={{ textAlign: "center" }} className="animate-bounceIn">
        <div style={{ width: 90, height: 90, background: "#E8FFD0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, margin: "0 auto 20px" }}>✅</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,5vw,30px)", fontWeight: 800, color: "#0E2011", margin: "0 0 8px" }}>Order Placed!</h2>
        <p style={{ color: "#888", marginBottom: 6 }}>Order ID: <strong style={{ color: "#1A7A2E" }}>{txId}</strong></p>
        <p style={{ color: "#aaa", fontSize: 13 }}>Redirecting to your orders…</p>
      </div>
    </div>
  );

  if (cart.length === 0) { router.push("/cart"); return null; }

  return (
    <>
      <Navbar />

      <style>{`
        /* Order summary: full width on mobile, sidebar on desktop */
        .co-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .co-wrap {
            flex-direction: row;
            align-items: flex-start;
            gap: 24px;
          }
          .co-main    { flex: 1; min-width: 0; }
          .co-sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 80px; }
        }

        /* Credit card fields: 2-col on wider mobile */
        .co-card-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 440px) { .co-card-grid { grid-template-columns: 1fr 1fr; } }

        /* Step label: hide on tiny phones */
        .co-step-lbl { display: none; font-size: 10px; }
        @media (min-width: 360px) { .co-step-lbl { display: block; } }

        /* Bottom spacer for mobile bottom nav */
        .co-spacer { height: 80px; }
        @media (min-width: 768px) { .co-spacer { display: none; } }
      `}</style>

      <main style={{ background: "var(--tk-bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 48px" }}>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "#0E2011", margin: "0 0 22px" }}>
            Checkout
          </h1>

          {/* ── STEP INDICATOR ── */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: step > i + 1 ? "#A8FF3E" : step === i + 1 ? "#0E2011" : "#E8EDE8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 13,
                    color: step > i + 1 ? "#0E2011" : step === i + 1 ? "#A8FF3E" : "#aaa",
                    transition: "all 0.3s",
                  }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className="co-step-lbl" style={{ fontWeight: 700, color: step === i + 1 ? "#0E2011" : "#aaa", whiteSpace: "nowrap", textAlign: "center" }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: step > i + 1 ? "#A8FF3E" : "#E8EDE8", margin: "0 6px 16px", transition: "background 0.3s", minWidth: 8 }} />
                )}
              </div>
            ))}
          </div>

          {/* ── MAIN WRAP ── */}
          <div className="co-wrap">

            {/* ── STEP CONTENT ── */}
            <div className="co-main">

              {/* STEP 1 — DELIVERY */}
              {step === 1 && (
                <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(16px,5vw,26px)", boxShadow: "var(--shadow-sm)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 16px" }}>Delivery Method</h2>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                    {[
                      { id: "Delivery", label: "Home Delivery", sub: "+₱120 · 3–5 days", icon: "🚚" },
                      { id: "Pickup",   label: "Store Pickup",  sub: "FREE · Same day",  icon: "🏪" },
                    ].map((d) => (
                      <button key={d.id} onClick={() => setDelivery(d.id)}
                        style={{ padding: "clamp(12px,3vw,16px)", borderRadius: 14, border: `2.5px solid ${delivery === d.id ? "#0E2011" : "#E5EDE5"}`, background: delivery === d.id ? "#E8FFD0" : "#fff", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.18s", WebkitTapHighlightColor: "transparent" }}>
                        <div style={{ fontSize: "clamp(22px,5vw,28px)", marginBottom: 6 }}>{d.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "clamp(12px,3.5vw,14px)", color: "#0E2011" }}>{d.label}</div>
                        <div style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#888", marginTop: 3 }}>{d.sub}</div>
                      </button>
                    ))}
                  </div>

                  {delivery === "Delivery" && (
                    <>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0E2011", margin: "0 0 10px" }}>Delivery Address</h3>
                      {savedAddrs.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
                          {savedAddrs.filter(Boolean).map((addr, i) => (
                            <label key={i}
                              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", border: `2px solid ${address === addr ? "#0E2011" : "#E5EDE5"}`, borderRadius: 12, cursor: "pointer", background: address === addr ? "#E8FFD0" : "#fff", transition: "all 0.18s" }}>
                              <input type="radio" name="address" checked={address === addr} onChange={() => setAddress(addr)} style={{ marginTop: 3, flexShrink: 0 }} />
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011" }}>{i === 0 ? "Default Address" : `Address ${i + 1}`}</div>
                                <div style={{ fontSize: 12, color: "#666", marginTop: 2, wordBreak: "break-word" }}>{addr}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      {addingAddr ? (
                        <div style={{ background: "#F5F9F0", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0E2011", marginBottom: 8 }}>New Address</label>
                          <input value={newAddr} onChange={(e) => setNewAddr(e.target.value)}
                            placeholder="House/Unit, Street, Barangay, City, Province"
                            style={{ ...inp, marginBottom: 10 }}
                            onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
                            onBlur={(e)  => (e.target.style.borderColor = "#E5EDE5")} />
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button onClick={() => { if (newAddr.trim()) { setSavedAddrs([...savedAddrs, newAddr.trim()]); setAddress(newAddr.trim()); setAddingAddr(false); setNewAddr(""); }}}
                              className="tk-btn-dark" style={{ fontSize: 12 }}>Save Address</button>
                            <button onClick={() => setAddingAddr(false)}
                              style={{ background: "none", border: "2px solid #ddd", borderRadius: 999, padding: "8px 14px", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#888" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setAddingAddr(true)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: "2px dashed #C5F0A0", borderRadius: 12, padding: "11px", cursor: "pointer", color: "#1A7A2E", fontWeight: 700, fontSize: 13, fontFamily: "var(--font-body)", width: "100%", marginBottom: 4, WebkitTapHighlightColor: "transparent" }}>
                          <Plus size={15} /> Add New Address
                        </button>
                      )}

                      {!address && (
                        <p style={{ fontSize: 12, color: "#E74C3C", margin: "8px 0 0" }}>⚠ Please select or add a delivery address</p>
                      )}
                    </>
                  )}

                  {delivery === "Pickup" && (
                    <div style={{ background: "#F5F9F0", borderRadius: 12, padding: "14px 16px", marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011", marginBottom: 3 }}>📍 CoirCraft Store</div>
                      <div style={{ fontSize: 13, color: "#555" }}>123 Coir Avenue, Quezon City, Metro Manila</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 5 }}>Mon–Sat: 8:00 AM – 6:00 PM</div>
                    </div>
                  )}

                  <button className="tk-btn-cta"
                    onClick={() => { if (delivery === "Delivery" && !address) return; setStep(2); }}
                    style={{ marginTop: 18, width: "100%", textAlign: "center" }}>
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* STEP 2 — PAYMENT */}
              {step === 2 && (
                <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(16px,5vw,26px)", boxShadow: "var(--shadow-sm)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 16px" }}>Payment Method</h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {PAYMENT_METHODS.map((m) => (
                      <label key={m.id}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: `2px solid ${payment === m.id ? "#0E2011" : "#E5EDE5"}`, borderRadius: 14, cursor: "pointer", background: payment === m.id ? "#E8FFD0" : "#fff", transition: "all 0.18s" }}>
                        <input type="radio" name="payment" checked={payment === m.id} onChange={() => setPayment(m.id)} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{m.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: "clamp(13px,3.5vw,14px)", color: "#0E2011", flex: 1 }}>{m.label}</span>
                        {payment === m.id && <CheckCircle size={16} color="#1A7A2E" style={{ flexShrink: 0 }} />}
                      </label>
                    ))}
                  </div>

                  {selectedPay?.fields.length > 0 && (
                    <div style={{ background: "#F5F9F0", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011", marginBottom: 12 }}>
                        {selectedPay.icon} {selectedPay.label} Details
                      </div>
                      <div className={selectedPay.fields.length > 2 ? "co-card-grid" : ""}
                        style={selectedPay.fields.length <= 2 ? { display: "flex", flexDirection: "column", gap: 12 } : {}}>
                        {selectedPay.fields.map((f) => (
                          <div key={f.key}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder}
                              value={payFields[f.key] || ""}
                              onChange={(e) => setPayFields({ ...payFields, [f.key]: e.target.value })}
                              style={inp}
                              onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
                              onBlur={(e)  => (e.target.style.borderColor = "#E5EDE5")} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setStep(1)}
                      style={{ flex: 1, background: "#fff", border: "2px solid #E5EDE5", borderRadius: 999, padding: "13px 8px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#555", WebkitTapHighlightColor: "transparent" }}>
                      ← Back
                    </button>
                    <button className="tk-btn-cta" onClick={() => setStep(3)} style={{ flex: 2, textAlign: "center" }}>
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 — REVIEW */}
              {step === 3 && (
                <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(16px,5vw,26px)", boxShadow: "var(--shadow-sm)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 16px" }}>Review Your Order</h2>

                  <div style={{ marginBottom: 16 }}>
                    {cart.map((i) => (
                      <div key={i.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0F0EC", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                          <img src={i.image} alt={i.name} style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                            onError={(e) => { e.target.style.display = "none"; }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.name}</div>
                            <div style={{ fontSize: 11, color: "#888" }}>Qty: {i.qty}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#1A7A2E", flexShrink: 0 }}>₱{(i.price * i.qty).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                    <div style={{ background: "#F5F9F0", borderRadius: 10, padding: "11px 13px" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Delivery</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0E2011" }}>{delivery}</div>
                      {delivery === "Delivery" && <div style={{ fontSize: 11, color: "#888", marginTop: 2, wordBreak: "break-word" }}>{address}</div>}
                    </div>
                    <div style={{ background: "#F5F9F0", borderRadius: 10, padding: "11px 13px" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Payment</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0E2011" }}>{payment}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setStep(2)}
                      style={{ flex: 1, background: "#fff", border: "2px solid #E5EDE5", borderRadius: 999, padding: "13px 8px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#555", WebkitTapHighlightColor: "transparent" }}>
                      ← Back
                    </button>
                    <button className="tk-btn-cta" onClick={placeOrder} style={{ flex: 2, textAlign: "center" }}>
                      Place Order ✓
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── ORDER SUMMARY SIDEBAR ── */}
            <div className="co-sidebar" style={{ background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "var(--shadow-sm)", border: "1.5px solid #F0F0EC" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#0E2011", margin: "0 0 14px" }}>
                Order Summary
              </h3>

              {cart.map((i) => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 7, gap: 8 }}>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.name} ×{i.qty}</span>
                  <span style={{ fontWeight: 600, flexShrink: 0 }}>₱{(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}

              <div style={{ borderTop: "1.5px solid #F0F0EC", marginTop: 12, paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 6 }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₱{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 12 }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? "#1A7A2E" : "#555" }}>
                    {shipping === 0 ? "FREE 🎉" : `₱${shipping}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#0E2011" }}>
                  <span>Total</span>
                  <span>₱{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="co-spacer" />
        </div>
      </main>
      <Footer />
    </>
  );
}