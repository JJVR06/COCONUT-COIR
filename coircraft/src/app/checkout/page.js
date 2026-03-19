"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, MapPin, CheckCircle } from "lucide-react";

const paymentMethods = [
  { id: "COD",           label: "Cash on Delivery",  icon: "💵", fields: [] },
  { id: "GCash",         label: "GCash",              icon: "📱", fields: [{ key: "gcashNumber", label: "GCash Mobile Number", placeholder: "09XX XXX XXXX", type: "tel" }] },
  { id: "Bank Transfer", label: "Bank Transfer",      icon: "🏦", fields: [{ key: "bankName", label: "Bank Name", placeholder: "e.g. BDO, BPI, Metrobank", type: "text" }, { key: "accountName", label: "Account Name", placeholder: "Account holder name", type: "text" }, { key: "accountNumber", label: "Account Number", placeholder: "Account number", type: "text" }] },
  { id: "Credit Card",   label: "Credit/Debit Card",  icon: "💳", fields: [{ key: "cardNumber", label: "Card Number", placeholder: "XXXX XXXX XXXX XXXX", type: "text" }, { key: "cardName", label: "Name on Card", placeholder: "As printed on card", type: "text" }, { key: "cardExpiry", label: "Expiry Date", placeholder: "MM/YY", type: "text" }, { key: "cardCVV", label: "CVV", placeholder: "XXX", type: "text" }] },
  { id: "Maya",          label: "Maya (PayMaya)",     icon: "💜", fields: [{ key: "mayaNumber", label: "Maya Mobile Number", placeholder: "09XX XXX XXXX", type: "tel" }] },
];

export default function CheckoutPage() {
  const { cart, clearCart, addTransaction, user } = useApp();
  const router = useRouter();

  const [step,        setStep]       = useState(1); // 1=address, 2=payment, 3=review
  const [payment,     setPayment]    = useState("COD");
  const [delivery,    setDelivery]   = useState("Delivery");
  const [payFields,   setPayFields]  = useState({});
  const [address,     setAddress]    = useState(user?.address || "");
  const [addingAddr,  setAddingAddr] = useState(false);
  const [newAddr,     setNewAddr]    = useState("");
  const [savedAddrs,  setSavedAddrs] = useState(user?.savedAddresses || [user?.address].filter(Boolean));
  const [done,        setDone]       = useState(false);
  const [txId,        setTxId]       = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = delivery === "Pickup" ? 0 : 120;
  const total    = subtotal + shipping;

  const selectedPayment = paymentMethods.find((p) => p.id === payment);

  const placeOrder = () => {
    const id = "TXN-" + Date.now();
    addTransaction({ id, date: new Date().toLocaleString(), items: [...cart], total, method: payment, delivery, address, status: "Pending" });
    clearCart();
    setTxId(id);
    setDone(true);
    setTimeout(() => router.push("/history"), 3000);
  };

  const inp = { width: "100%", border: "2px solid #E8EDE8", borderRadius: 14, padding: "12px 16px", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" };

  if (done) return (
    <div style={{ minHeight: "100vh", background: "#FFFEF5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}>
      <div style={{ textAlign: "center" }} className="animate-bounceIn">
        <div style={{ width: 96, height: 96, background: "#E8FFD0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, margin: "0 auto 24px" }}>✅</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "#0E2011", margin: "0 0 8px" }}>Order Placed!</h2>
        <p style={{ color: "#888", marginBottom: 6 }}>Order ID: <strong style={{ color: "#1A7A2E" }}>{txId}</strong></p>
        <p style={{ color: "#aaa", fontSize: 13 }}>Redirecting to your orders...</p>
      </div>
    </div>
  );

  if (cart.length === 0) { router.push("/cart"); return null; }

  /* ── Step indicator ── */
  const steps = ["Delivery", "Payment", "Review & Place Order"];

  return (
    <>
      <Navbar />
      <main style={{ background: "#FFFEF5", minHeight: "100vh", fontFamily: "var(--font-body)", padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#0E2011", margin: "0 0 28px" }}>Checkout</h1>

          {/* Step bar */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 36, gap: 0 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: step > i + 1 ? "#A8FF3E" : step === i + 1 ? "#0E2011" : "#E8EDE8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: step > i + 1 ? "#0E2011" : step === i + 1 ? "#A8FF3E" : "#aaa", transition: "all 0.3s" }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: step === i + 1 ? "#0E2011" : "#aaa", whiteSpace: "nowrap" }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? "#A8FF3E" : "#E8EDE8", margin: "0 8px 20px", transition: "background 0.3s" }} />}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
            <div>

              {/* ── STEP 1: DELIVERY ── */}
              {step === 1 && (
                <div style={{ background: "#fff", borderRadius: 22, padding: "28px", boxShadow: "0 4px 20px rgba(14,32,17,0.06)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0E2011", margin: "0 0 22px" }}>Delivery Method</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    {[{ id: "Delivery", label: "Home Delivery", sub: "+₱120 shipping · 3–5 days", icon: "🚚" }, { id: "Pickup", label: "Store Pickup", sub: "FREE · Same day ready", icon: "🏪" }].map((d) => (
                      <button key={d.id} onClick={() => setDelivery(d.id)}
                        style={{ padding: "16px", borderRadius: 16, border: `2.5px solid ${delivery === d.id ? "#0E2011" : "#E8EDE8"}`, background: delivery === d.id ? "#E8FFD0" : "#fff", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s" }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{d.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011" }}>{d.label}</div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{d.sub}</div>
                      </button>
                    ))}
                  </div>

                  {delivery === "Delivery" && (
                    <>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "#0E2011", margin: "0 0 14px" }}>Delivery Address</h3>

                      {/* Saved addresses */}
                      {savedAddrs.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                          {savedAddrs.filter(Boolean).map((addr, i) => (
                            <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", border: `2px solid ${address === addr ? "#0E2011" : "#E8EDE8"}`, borderRadius: 14, cursor: "pointer", background: address === addr ? "#E8FFD0" : "#fff" }}>
                              <input type="radio" name="address" checked={address === addr} onChange={() => setAddress(addr)} style={{ marginTop: 2 }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011" }}>{i === 0 ? "Default Address" : `Address ${i + 1}`}</div>
                                <div style={{ fontSize: 13, color: "#555" }}>{addr}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Add new address */}
                      {addingAddr ? (
                        <div style={{ background: "#F5F9F0", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0E2011", marginBottom: 8 }}>New Address</label>
                          <input value={newAddr} onChange={(e) => setNewAddr(e.target.value)} placeholder="House/Unit, Street, Barangay, City, Province"
                            style={{ ...inp, marginBottom: 10 }}
                            onFocus={(e) => e.target.style.borderColor = "#A8FF3E"} onBlur={(e) => e.target.style.borderColor = "#E8EDE8"} />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => { if (newAddr.trim()) { setSavedAddrs([...savedAddrs, newAddr.trim()]); setAddress(newAddr.trim()); setAddingAddr(false); setNewAddr(""); }}}
                              className="tk-btn-dark" style={{ fontSize: 12, padding: "9px 18px" }}>Save Address</button>
                            <button onClick={() => setAddingAddr(false)} style={{ background: "none", border: "2px solid #ddd", borderRadius: 50, padding: "8px 16px", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#888" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setAddingAddr(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "2px dashed #C5F0A0", borderRadius: 14, padding: "12px 18px", cursor: "pointer", color: "#1A7A2E", fontWeight: 700, fontSize: 13, fontFamily: "var(--font-body)", width: "100%", justifyContent: "center" }}>
                          <Plus size={16} /> Add New Address
                        </button>
                      )}

                      {!address && (
                        <p style={{ fontSize: 12, color: "#E74C3C", marginTop: 8 }}>⚠ Please select or add a delivery address</p>
                      )}
                    </>
                  )}

                  {delivery === "Pickup" && (
                    <div style={{ background: "#F5F9F0", borderRadius: 14, padding: "16px 18px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011", marginBottom: 4 }}>📍 CoirCraft Store</div>
                      <div style={{ fontSize: 13, color: "#555" }}>123 Coir Avenue, Quezon City, Metro Manila</div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>Mon–Sat: 8:00 AM – 6:00 PM</div>
                    </div>
                  )}

                  <button className="tk-btn-cta" style={{ marginTop: 24, width: "100%", textAlign: "center" }}
                    onClick={() => { if (delivery === "Delivery" && !address) return; setStep(2); }}>
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* ── STEP 2: PAYMENT ── */}
              {step === 2 && (
                <div style={{ background: "#fff", borderRadius: 22, padding: "28px", boxShadow: "0 4px 20px rgba(14,32,17,0.06)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0E2011", margin: "0 0 22px" }}>Payment Method</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                    {paymentMethods.map((m) => (
                      <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", border: `2px solid ${payment === m.id ? "#0E2011" : "#E8EDE8"}`, borderRadius: 16, cursor: "pointer", background: payment === m.id ? "#E8FFD0" : "#fff", transition: "all 0.2s" }}>
                        <input type="radio" name="payment" checked={payment === m.id} onChange={() => setPayment(m.id)} />
                        <span style={{ fontSize: 22 }}>{m.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#0E2011", flex: 1 }}>{m.label}</span>
                        {payment === m.id && <CheckCircle size={18} color="#1A7A2E" />}
                      </label>
                    ))}
                  </div>

                  {/* Payment-specific fields */}
                  {selectedPayment?.fields.length > 0 && (
                    <div style={{ background: "#F5F9F0", borderRadius: 16, padding: "18px 20px", marginBottom: 22 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011", marginBottom: 14 }}>{selectedPayment.icon} {selectedPayment.label} Details</div>
                      <div style={{ display: "grid", gridTemplateColumns: selectedPayment.fields.length > 2 ? "1fr 1fr" : "1fr", gap: 14 }}>
                        {selectedPayment.fields.map((f) => (
                          <div key={f.key}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder} value={payFields[f.key] || ""} onChange={(e) => setPayFields({ ...payFields, [f.key]: e.target.value })}
                              style={{ ...inp }}
                              onFocus={(e) => e.target.style.borderColor = "#A8FF3E"} onBlur={(e) => e.target.style.borderColor = "#E8EDE8"} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, background: "#fff", border: "2px solid #E8EDE8", borderRadius: 50, padding: "14px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#555" }}>← Back</button>
                    <button className="tk-btn-cta" style={{ flex: 2, textAlign: "center" }} onClick={() => setStep(3)}>Review Order →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: REVIEW ── */}
              {step === 3 && (
                <div style={{ background: "#fff", borderRadius: 22, padding: "28px", boxShadow: "0 4px 20px rgba(14,32,17,0.06)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0E2011", margin: "0 0 22px" }}>Review Your Order</h2>

                  {/* Items */}
                  <div style={{ marginBottom: 20 }}>
                    {cart.map((i) => (
                      <div key={i.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0F0EC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={i.image} alt={i.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011" }}>{i.name}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>Qty: {i.qty}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1A7A2E" }}>₱{(i.price * i.qty).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Summary info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <div style={{ background: "#F5F9F0", borderRadius: 12, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Delivery</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0E2011" }}>{delivery}</div>
                      {delivery === "Delivery" && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{address}</div>}
                    </div>
                    <div style={{ background: "#F5F9F0", borderRadius: 12, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Payment</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0E2011" }}>{payment}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setStep(2)} style={{ flex: 1, background: "#fff", border: "2px solid #E8EDE8", borderRadius: 50, padding: "14px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#555" }}>← Back</button>
                    <button className="tk-btn-cta" style={{ flex: 2, textAlign: "center" }} onClick={placeOrder}>Place Order ✓</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── ORDER SUMMARY SIDEBAR ── */}
            <div style={{ background: "#fff", borderRadius: 22, padding: "24px", boxShadow: "0 4px 20px rgba(14,32,17,0.06)", position: "sticky", top: 100 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 18px" }}>Order Summary</h3>
              {cart.map((i) => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 8 }}>
                  <span>{i.name} ×{i.qty}</span>
                  <span style={{ fontWeight: 600 }}>₱{(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ borderTop: "1.5px solid #F0F0EC", marginTop: 14, paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 8 }}>
                  <span>Subtotal</span><span style={{ fontWeight: 600 }}>₱{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 14 }}>
                  <span>Shipping</span><span style={{ fontWeight: 600, color: shipping === 0 ? "#1A7A2E" : "#555" }}>{shipping === 0 ? "FREE" : `₱${shipping}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#0E2011" }}>
                  <span>Total</span><span>₱{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}