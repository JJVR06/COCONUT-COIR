"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LoginPage() {
  const { setUser } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setUser(data.user);
    router.push("/store");
  };

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center py-16 px-4"
        style={{ backgroundColor: "#f9fdf4" }}
      >
        <div
          className="rounded-2xl shadow-xl p-8 w-full max-w-md"
          style={{ backgroundColor: "#ffffff" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🥥</div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "#111827" }}
            >
              Welcome Back
            </h1>
            <p className="text-sm mt-1" style={{ color: "#4b5563" }}>
              Login to your CoirCraft account
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
                📧 Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                style={{
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  border: "2px solid #e5e7eb",
                }}
                onFocus={(e) =>
                  (e.target.style.border = "2px solid #2D5016")
                }
                onBlur={(e) =>
                  (e.target.style.border = "2px solid #e5e7eb")
                }
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
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                style={{
                  color: "#111827",
                  backgroundColor: "#ffffff",
                  border: "2px solid #e5e7eb",
                }}
                onFocus={(e) =>
                  (e.target.style.border = "2px solid #2D5016")
                }
                onBlur={(e) =>
                  (e.target.style.border = "2px solid #e5e7eb")
                }
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition mt-2"
              style={{
                backgroundColor: loading ? "#6b7280" : "#2D5016",
                color: "#ffffff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
            <span className="text-xs" style={{ color: "#9ca3af" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
          </div>

          <p className="text-center text-sm" style={{ color: "#4b5563" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold hover:underline"
              style={{ color: "#2D5016" }}
            >
              Register here
            </Link>
          </p>

          <p className="text-center text-xs mt-3" style={{ color: "#9ca3af" }}>
            Are you a seller?{" "}
            <Link
              href="/seller/login"
              className="font-semibold hover:underline"
              style={{ color: "#2D5016" }}
            >
              Seller Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}