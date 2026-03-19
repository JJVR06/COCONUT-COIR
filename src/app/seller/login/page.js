"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const SELLER_EMAIL = "admin@coircraft.ph";
const SELLER_PASS = "seller123";

export default function SellerLogin() {
  const { setSellerLoggedIn } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (form.email === SELLER_EMAIL && form.password === SELLER_PASS) {
        setSellerLoggedIn(true);
        router.push("/seller/dashboard");
      } else {
        setError("Invalid seller credentials.");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#1a3009" }}
      >
        <div
          className="rounded-2xl shadow-2xl p-8 w-full max-w-md"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🥥</div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "#111827" }}
            >
              Seller Portal
            </h1>
            <p className="text-sm mt-1" style={{ color: "#4b5563" }}>
              CoirCraft PH Admin Access
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="text-sm p-3 rounded-xl mb-5 border"
              style={{
                backgroundColor: "#fef2f2",
                borderColor: "#fca5a5",
                color: "#991b1b",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#111827" }}
              >
                📧 Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@coircraft.ph"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                style={{
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  border: "2px solid #e5e7eb",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid #2D5016")}
                onBlur={(e) => (e.target.style.border = "2px solid #e5e7eb")}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "#111827" }}
              >
                🔒 Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                style={{
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  border: "2px solid #e5e7eb",
                }}
                onFocus={(e) => (e.target.style.border = "2px solid #2D5016")}
                onBlur={(e) => (e.target.style.border = "2px solid #e5e7eb")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition"
              style={{
                backgroundColor: loading ? "#6b7280" : "#2D5016",
                color: "#ffffff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login as Seller"}
            </button>
          </form>

          <p
            className="text-center text-xs mt-6"
            style={{ color: "#9ca3af" }}
          >
            Default: admin@coircraft.ph / seller123
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}