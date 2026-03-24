"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { setUser, setSellerLoggedIn } = useApp();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        if (data.user.role === "seller") {
          // ── Seller login via DB ──
          setSellerLoggedIn(true);
          window.location.href = "/seller/dashboard";
          return;
        } else {
          // ── Buyer login ──
          setUser({
            name:    data.user.name,
            email:   data.user.email,
            address: data.user.address || "",
            mobile:  data.user.mobile  || "",
            avatar:  data.user.avatar  || "",
          });
          window.location.href = "/store";
          return;
        }
      }

      setError(data.error || "Incorrect email or password. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const inp = {
    width: "100%", border: "2px solid #E8EDE8", borderRadius: 14,
    padding: "13px 18px", fontSize: 15, fontFamily: "var(--font-body)",
    outline: "none", boxSizing: "border-box", background: "#fff", color: "#0E2011",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFFF5", fontFamily: "var(--font-body)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>

      {/* Background blobs */}
      <div style={{ position: "fixed", top: "-5%", right: "-5%", width: 500, height: 500, background: "radial-gradient(circle,rgba(168,255,62,0.09) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-5%", left: "-5%", width: 420, height: 420, background: "radial-gradient(circle,rgba(26,71,42,0.07) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 28, zIndex: 1 }}>
        <div style={{ background: "linear-gradient(135deg,#A8FF3E,#1A472A)", borderRadius: 14, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 14px rgba(168,255,62,0.35)" }}>🥥</div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#0E2011" }}>
          Coir<span style={{ color: "#1A7A2E" }}>Craft</span>
        </span>
      </Link>

      {/* Card */}
      <div style={{ position: "relative", zIndex: 1, background: "#fff", borderRadius: 28, boxShadow: "0 20px 56px rgba(14,32,17,0.10)", padding: "44px 44px 36px", width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#0E2011", margin: "0 0 6px", textAlign: "center" }}>
          Welcome Back
        </h1>
        <p style={{ color: "#aaa", fontSize: 13, textAlign: "center", margin: "0 0 28px" }}>
          Buyers and sellers use the same sign-in
        </p>

        {error && (
          <div style={{ background: "#FFF0F0", border: "1.5px solid #FFCDD2", borderRadius: 12, padding: "11px 15px", marginBottom: 18, fontSize: 13, color: "#C62828" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 7 }}>Email Address</label>
            <input type="email" required value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@email.com" style={inp}
              onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
              onBlur={(e)  => (e.target.style.borderColor = "#E8EDE8")} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} required value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••" style={{ ...inp, paddingRight: 50 }}
                onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
                onBlur={(e)  => (e.target.style.borderColor = "#E8EDE8")} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#bbb", display: "flex" }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ marginTop: 6, background: loading ? "#D4F5A0" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", padding: "15px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, borderRadius: 50, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 20px rgba(168,255,62,0.38)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
            {loading ? <><Spinner /> Signing in...</> : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#aaa", margin: "20px 0 0" }}>
          No account yet?{" "}
          <Link href="/register" style={{ color: "#1A7A2E", fontWeight: 700, textDecoration: "none" }}>Register here</Link>
        </p>
      </div>

      <Link href="/" style={{ marginTop: 16, fontSize: 13, color: "#bbb", textDecoration: "none", zIndex: 1 }}>← Back to Home</Link>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Spinner() {
  return <span style={{ width: 16, height: 16, border: "2.5px solid rgba(14,32,17,0.25)", borderTopColor: "#0E2011", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />;
}