"use client";
import { useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { products } from "@/data/products";

export default function StorefrontClient() {
  const [storeName,    setStoreName]    = useState("CoirCraft Philippines");
  const [storeDesc,    setStoreDesc]    = useState("Premium eco-friendly coconut coir products handcrafted in the Philippines.");
  const [storeAddress, setStoreAddress] = useState("123 Coir Avenue, Quezon City, Metro Manila");
  const [storeHours,   setStoreHours]   = useState("Mon–Sat: 8:00 AM – 6:00 PM");
  const [editing,      setEditing]      = useState(false);
  const [saved,        setSaved]        = useState(false);

  const save = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inp = { width: "100%", border: "2px solid #E8EDE8", borderRadius: 12, padding: "11px 16px", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box", background: "#fff" };

  const featured = products.filter((p) => ["Best Seller","Featured"].includes(p.tag)).slice(0, 4);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />
      <main style={{ flex: 1, background: "#F8F9FA", padding: 32, overflowY: "auto" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>Storefront</h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Manage your public store information.</p>
        </div>

        {saved && (
          <div style={{ background: "#E8FFD0", border: "1.5px solid #A8FF3E", borderRadius: 12, padding: "11px 16px", marginBottom: 20, fontSize: 13, color: "#1A7A2E", fontWeight: 700 }}>
            ✅ Storefront updated!
          </div>
        )}

        {/* Store info card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: 0 }}>Store Information</h2>
            {!editing
              ? <button onClick={() => setEditing(true)} style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 50, padding: "9px 22px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Edit</button>
              : <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={save} style={{ background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", borderRadius: 50, padding: "9px 22px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save</button>
                  <button onClick={() => setEditing(false)} style={{ background: "#fff", color: "#888", border: "2px solid #ddd", borderRadius: 50, padding: "8px 20px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                </div>
            }
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { label: "Store Name",    key: "name",    value: storeName,    set: setStoreName    },
              { label: "Address",       key: "address", value: storeAddress, set: setStoreAddress },
              { label: "Opening Hours", key: "hours",   value: storeHours,   set: setStoreHours   },
            ].map(({ label, key, value, set }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>{label}</label>
                {editing
                  ? <input value={value} onChange={(e) => set(e.target.value)} style={inp}
                      onFocus={(e) => e.target.style.borderColor = "#A8FF3E"}
                      onBlur={(e)  => e.target.style.borderColor = "#E8EDE8"} />
                  : <div style={{ fontSize: 14, color: "#0E2011", fontWeight: 600 }}>{value}</div>
                }
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Store Description</label>
              {editing
                ? <textarea value={storeDesc} onChange={(e) => setStoreDesc(e.target.value)} rows={2}
                    style={{ ...inp, resize: "vertical" }}
                    onFocus={(e) => e.target.style.borderColor = "#A8FF3E"}
                    onBlur={(e)  => e.target.style.borderColor = "#E8EDE8"} />
                : <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{storeDesc}</div>
              }
            </div>
          </div>
        </div>

        {/* Store preview */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 20px" }}>Featured Products Preview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
            {featured.map((p) => (
              <div key={p.id} style={{ background: "#F5F9F0", borderRadius: 16, overflow: "hidden" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: 130, objectFit: "cover" }}
                  onError={(e) => { e.target.style.display="none"; }} />
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#1A7A2E", fontSize: 15 }}>₱{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}