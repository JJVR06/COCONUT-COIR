// ─── SELLER LOGIN PAGE ────────────────────────────────────────────────────────
// Place at: src/app/seller/login/page.js

"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";

const SELLER_EMAIL = "admin@coircraft.ph";
const SELLER_PASS  = "seller123";

export default function SellerLogin() {
  const { setSellerLoggedIn } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (form.email === SELLER_EMAIL && form.password === SELLER_PASS) {
        setSellerLoggedIn(true);
        router.push("/seller/dashboard");
      } else {
        setError("Invalid seller credentials. Please try again.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0E2011 0%,#1A472A 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", fontFamily: "var(--font-body)", position: "relative", overflow: "hidden" }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -100, right: -80, width: 500, height: 500, background: "radial-gradient(circle,rgba(168,255,62,0.1) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -80, width: 400, height: 400, background: "radial-gradient(circle,rgba(168,255,62,0.07) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
          <div style={{ background: "#fff", borderRadius: 28, boxShadow: "0 24px 64px rgba(0,0,0,0.25)", padding: "48px 44px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 68, height: 68, background: "linear-gradient(135deg,#A8FF3E,#1A472A)", borderRadius: 20, fontSize: 32, marginBottom: 16, boxShadow: "0 8px 24px rgba(168,255,62,0.35)" }}>🥥</div>
              <div style={{ display: "inline-block", background: "#E8FFD0", borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#1A7A2E", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>Seller Portal</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#0E2011", margin: "0 0 6px" }}>Seller Dashboard</h1>
              <p style={{ color: "#888", fontSize: 13 }}>CoirCraft PH Admin Access</p>
            </div>

            {error && (
              <div style={{ background: "#FFF0F0", border: "1.5px solid #FFCDD2", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#C62828" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0E2011", marginBottom: 8 }}>Seller Email</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@coircraft.ph"
                  style={{ width: "100%", border: "2px solid #E8EDE8", borderRadius: 14, padding: "13px 18px", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "#A8FF3E"}
                  onBlur={(e) => e.target.style.borderColor = "#E8EDE8"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0E2011", marginBottom: 8 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPass ? "text" : "password"} required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    style={{ width: "100%", border: "2px solid #E8EDE8", borderRadius: 14, padding: "13px 50px 13px 18px", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                    onFocus={(e) => e.target.style.borderColor = "#A8FF3E"}
                    onBlur={(e) => e.target.style.borderColor = "#E8EDE8"} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ background: loading ? "#ccc" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", padding: "15px", borderRadius: 50, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 20px rgba(168,255,62,0.4)", marginTop: 4, transition: "all 0.25s" }}>
                {loading ? "Signing in..." : "Access Seller Dashboard →"}
              </button>
            </form>

            <div style={{ marginTop: 20, padding: "14px 16px", background: "#F5F9F0", borderRadius: 12, fontSize: 12, color: "#888" }}>
              <strong style={{ color: "#1A7A2E" }}>Default credentials:</strong><br />
              Email: admin@coircraft.ph<br />
              Password: seller123
            </div>

            <div style={{ textAlign: "center", marginTop: 18, fontSize: 12 }}>
              <a href="/login" style={{ color: "#aaa", textDecoration: "none" }}>← Back to Buyer Login</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}