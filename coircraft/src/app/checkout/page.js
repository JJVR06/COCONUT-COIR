"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, CheckCircle } from "lucide-react";

/* ── Philippine courier options ─────────────────────────────────────────── */
const COURIERS = [
  {
    id:       "jnt",
    name:     "J&T Express",
    logo:     "🟥",
    tagline:  "Nationwide delivery",
    rate:     80,
    eta:      "3–5 business days",
    features: ["Real-time tracking", "Cash on pickup", "Wide coverage"],
  },
  {
    id:       "ninjavan",
    name:     "Ninja Van",
    logo:     "🥷",
    tagline:  "Fast & reliable",
    rate:     85,
    eta:      "2–4 business days",
    features: ["Door-to-door", "Signature required", "SMS updates"],
  },
  {
    id:       "lbc",
    name:     "LBC Express",
    logo:     "🔵",
    tagline:  "Trusted since 1945",
    rate:     120,
    eta:      "2–4 business days",
    features: ["Nationwide branches", "Package insurance", "Express option"],
  },
  {
    id:       "jrs",
    name:     "JRS Express",
    logo:     "🟩",
    tagline:  "Provincial specialist",
    rate:     100,
    eta:      "3–6 business days",
    features: ["Provincial coverage", "Affordable rates", "Bus cargo option"],
  },
  {
    id:       "2go",
    name:     "2GO Express",
    logo:     "🚢",
    tagline:  "For larger packages",
    rate:     150,
    eta:      "4–7 business days",
    features: ["Heavy items", "Island delivery", "Cargo service"],
  },
  {
    id:       "grab",
    name:     "GrabExpress",
    logo:     "🟢",
    tagline:  "Same-day delivery",
    rate:     60,
    eta:      "Same day (Metro Manila)",
    features: ["Instant dispatch", "Live GPS tracking", "Metro Manila only"],
  },
  {
    id:       "lalamove",
    name:     "Lalamove",
    logo:     "🟠",
    tagline:  "On-demand courier",
    rate:     55,
    eta:      "Same day (select cities)",
    features: ["On-demand booking", "Multiple vehicle types", "Business rates"],
  },
];

const PAYMENT_METHODS = [
  { id: "COD",           label: "Cash on Delivery",    icon: "💵", fields: [] },
  { id: "GCash",         label: "GCash",               icon: "📱", fields: [{ key: "gcashNumber",  label: "GCash Mobile Number", placeholder: "09XX XXX XXXX", type: "tel" }] },
  { id: "Maya",          label: "Maya (PayMaya)",      icon: "💜", fields: [{ key: "mayaNumber",   label: "Maya Mobile Number",  placeholder: "09XX XXX XXXX", type: "tel" }] },
  { id: "Bank Transfer", label: "Bank Transfer",       icon: "🏦", fields: [
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
  const [delivery,   setDelivery]   = useState("Delivery"); // "Delivery" or "Pickup"
  const [courierId,  setCourierId]  = useState("jnt");      // selected courier
  const [payFields,  setPayFields]  = useState({});
  const [address,    setAddress]    = useState(user?.address || "");
  const [addingAddr, setAddingAddr] = useState(false);
  const [newAddr,    setNewAddr]    = useState("");
  const [savedAddrs, setSavedAddrs] = useState([user?.address].filter(Boolean));
  const [done,       setDone]       = useState(false);
  const [txId,       setTxId]       = useState("");

  const selectedCourier = COURIERS.find((c) => c.id === courierId) || COURIERS[0];
  const shippingFee     = delivery === "Pickup" ? 0 : selectedCourier.rate;
  const subtotal        = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total           = subtotal + shippingFee;
  const selectedPay     = PAYMENT_METHODS.find((p) => p.id === payment);

  const inp = {
    width: "100%", border: "2px solid #E5EDE5", borderRadius: 12,
    padding: "12px 14px", fontSize: 14, fontFamily: "var(--font-body)",
    outline: "none", boxSizing: "border-box", background: "#fff",
  };

  const placeOrder = () => {
    const id = "TXN-" + Date.now();
    addTransaction({
      id,
      date:     new Date().toLocaleString(),
      items:    [...cart],
      total,
      method:   payment,
      delivery: delivery === "Pickup" ? "Store Pickup" : selectedCourier.name,
      address,
      status:   "Pending",
    });
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
        /* ── Checkout layout ── */
        .co-wrap { display: flex; flex-direction: column; gap: 20px; }
        @media (min-width: 768px) {
          .co-wrap { flex-direction: row; align-items: flex-start; gap: 24px; }
          .co-main    { flex: 1; min-width: 0; }
          .co-sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 80px; }
        }

        /* ── Courier grid ── */
        .courier-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        @media (min-width: 560px) {
          .courier-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── Credit card grid ── */
        .co-card-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 440px) { .co-card-grid { grid-template-columns: 1fr 1fr; } }

        /* ── Step label ── */
        .co-step-lbl { display: none; font-size: 10px; }
        @media (min-width: 360px) { .co-step-lbl { display: block; } }

        /* ── Mobile bottom spacer ── */
        .co-spacer { height: 80px; }
        @media (min-width: 768px) { .co-spacer { display: none; } }
      `}</style>

      <main style={{ background: "var(--tk-bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 48px" }}>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "#0E2011", margin: "0 0 22px" }}>
            Checkout
          </h1>

          {/* ── Step indicator ── */}
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

          <div className="co-wrap">
            <div className="co-main">

              {/* ════════════════════════════════
                  STEP 1 — DELIVERY
              ════════════════════════════════ */}
              {step === 1 && (
                <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(16px,5vw,26px)", boxShadow: "var(--shadow-sm)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 16px" }}>Delivery Method</h2>

                  {/* Home delivery vs pickup toggle */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                    {[
                      { id: "Delivery", label: "Home Delivery", sub: "Choose a courier below", icon: "🚚" },
                      { id: "Pickup",   label: "Store Pickup",  sub: "FREE · Same day",        icon: "🏪" },
                    ].map((d) => (
                      <button key={d.id} onClick={() => setDelivery(d.id)}
                        style={{ padding: "clamp(12px,3vw,16px)", borderRadius: 14, border: `2.5px solid ${delivery === d.id ? "#0E2011" : "#E5EDE5"}`, background: delivery === d.id ? "#E8FFD0" : "#fff", textAlign: "left", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.18s", WebkitTapHighlightColor: "transparent" }}>
                        <div style={{ fontSize: "clamp(22px,5vw,28px)", marginBottom: 6 }}>{d.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "clamp(12px,3.5vw,14px)", color: "#0E2011" }}>{d.label}</div>
                        <div style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#888", marginTop: 3 }}>{d.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* ── Courier selection (only for home delivery) ── */}
                  {delivery === "Delivery" && (
                    <>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0E2011", margin: "0 0 12px" }}>
                        Select Courier
                      </h3>
                      <div className="courier-grid">
                        {COURIERS.map((courier) => {
                          const selected = courierId === courier.id;
                          return (
                            <button key={courier.id} onClick={() => setCourierId(courier.id)}
                              style={{
                                padding: "14px 16px", borderRadius: 14, textAlign: "left", cursor: "pointer",
                                fontFamily: "var(--font-body)", WebkitTapHighlightColor: "transparent",
                                border: `2.5px solid ${selected ? "#0E2011" : "#E5EDE5"}`,
                                background: selected ? "#E8FFD0" : "#FAFFF5",
                                transition: "all 0.18s",
                                position: "relative",
                              }}>
                              {/* Selected checkmark */}
                              {selected && (
                                <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, background: "#0E2011", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <CheckCircle size={12} color="#A8FF3E" />
                                </div>
                              )}

                              {/* Courier logo + name */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 22, flexShrink: 0 }}>{courier.logo}</span>
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: 14, color: "#0E2011" }}>{courier.name}</div>
                                  <div style={{ fontSize: 11, color: "#888" }}>{courier.tagline}</div>
                                </div>
                              </div>

                              {/* Rate + ETA */}
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: selected ? "#0E2011" : "#1A7A2E" }}>
                                  ₱{courier.rate}
                                </span>
                                <span style={{ fontSize: 10, color: "#888", textAlign: "right", maxWidth: 120 }}>
                                  {courier.eta}
                                </span>
                              </div>

                              {/* Feature pills */}
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {courier.features.map((f) => (
                                  <span key={f} style={{ fontSize: 9, fontWeight: 700, background: selected ? "rgba(14,32,17,0.08)" : "#E8EDE8", color: selected ? "#0E2011" : "#666", borderRadius: 999, padding: "2px 7px" }}>
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected courier summary strip */}
                      <div style={{ background: "#0E2011", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 20 }}>{selectedCourier.logo}</span>
                          <div>
                            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{selectedCourier.name}</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{selectedCourier.eta}</div>
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#A8FF3E" }}>
                          ₱{selectedCourier.rate}
                        </div>
                      </div>

                      {/* Delivery address */}
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

                  {/* Pickup info */}
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

              {/* ════════════════════════════════
                  STEP 2 — PAYMENT
              ════════════════════════════════ */}
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
                    <div style={{ background: "#F5F9F0", borderRadius: 14, padding: 16, marginBottom: 16 }}>
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
                      style={{ flex: 1, background: "#fff", border: "2px solid #E5EDE5", borderRadius: 999, padding: "13px 8px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#555" }}>
                      ← Back
                    </button>
                    <button className="tk-btn-cta" onClick={() => setStep(3)} style={{ flex: 2, textAlign: "center" }}>
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════
                  STEP 3 — REVIEW & PLACE
              ════════════════════════════════ */}
              {step === 3 && (
                <div style={{ background: "#fff", borderRadius: 20, padding: "clamp(16px,5vw,26px)", boxShadow: "var(--shadow-sm)" }} className="animate-fadeSlideUp">
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 16px" }}>Review Your Order</h2>

                  {/* Items */}
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

                  {/* Delivery + Payment summary */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                    <div style={{ background: "#F5F9F0", borderRadius: 10, padding: "11px 13px" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Courier</div>
                      {delivery === "Pickup" ? (
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0E2011" }}>🏪 Store Pickup</div>
                      ) : (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0E2011" }}>{selectedCourier.logo} {selectedCourier.name}</div>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{selectedCourier.eta}</div>
                          {address && <div style={{ fontSize: 11, color: "#666", marginTop: 4, wordBreak: "break-word" }}>{address}</div>}
                        </>
                      )}
                    </div>
                    <div style={{ background: "#F5F9F0", borderRadius: 10, padding: "11px 13px" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Payment</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0E2011" }}>{payment}</div>
                    </div>
                  </div>

                  {/* Cost breakdown */}
                  <div style={{ background: "#F5F9F0", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 6 }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: 600 }}>₱{subtotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #E8EDE8" }}>
                      <span>Shipping ({delivery === "Pickup" ? "Store Pickup" : selectedCourier.name})</span>
                      <span style={{ fontWeight: 600, color: shippingFee === 0 ? "#1A7A2E" : "#555" }}>
                        {shippingFee === 0 ? "FREE 🎉" : `₱${shippingFee}`}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "#0E2011" }}>
                      <span>Total</span>
                      <span>₱{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setStep(2)}
                      style={{ flex: 1, background: "#fff", border: "2px solid #E5EDE5", borderRadius: 999, padding: "13px 8px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#555" }}>
                      ← Back
                    </button>
                    <button className="tk-btn-cta" onClick={placeOrder} style={{ flex: 2, textAlign: "center" }}>
                      Place Order ✓
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Order summary sidebar ── */}
            <div className="co-sidebar" style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "var(--shadow-sm)", border: "1.5px solid #F0F0EC" }}>
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

                {/* Dynamic shipping row */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Shipping
                    {delivery === "Delivery" && (
                      <span style={{ background: "#E8FFD0", color: "#1A7A2E", fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 999 }}>
                        {selectedCourier.name}
                      </span>
                    )}
                  </span>
                  <span style={{ fontWeight: 600, color: shippingFee === 0 ? "#1A7A2E" : "#555" }}>
                    {shippingFee === 0 ? "FREE" : `₱${shippingFee}`}
                  </span>
                </div>

                {delivery === "Delivery" && (
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 10 }}>
                    ETA: {selectedCourier.eta}
                  </div>
                )}

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