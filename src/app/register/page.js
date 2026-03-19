"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { confirmPassword, ...body } = form;
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  const fields = [
    {
      key: "name",
      label: "Complete Name",
      type: "text",
      placeholder: "Juan dela Cruz",
      icon: "👤",
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@email.com",
      icon: "📧",
    },
    {
      key: "address",
      label: "Complete Address",
      type: "text",
      placeholder: "123 Street, City, Province",
      icon: "📍",
    },
    {
      key: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "09XX XXX XXXX",
      icon: "📱",
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      placeholder: "At least 6 characters",
      icon: "🔒",
    },
    {
      key: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Re-enter your password",
      icon: "🔒",
    },
  ];

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
              Create Account
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "#4b5563" }}
            >
              Join the CoirCraft community
            </p>
          </div>

          {/* Success */}
          {success && (
            <div
              className="text-sm p-3 rounded-xl mb-5 text-center border"
              style={{
                backgroundColor: "#f0fdf4",
                borderColor: "#86efac",
                color: "#166534",
              }}
            >
              ✅ Account created! Redirecting to login...
            </div>
          )}

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

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, icon }) => (
              <div key={key}>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "#111827" }}
                >
                  {icon} {label}
                </label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                  placeholder={placeholder}
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
            ))}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-xl font-bold text-sm transition mt-2"
              style={{
                backgroundColor: loading || success ? "#6b7280" : "#2D5016",
                color: "#ffffff",
                cursor: loading || success ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
            <span className="text-xs" style={{ color: "#9ca3af" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
          </div>

          <p className="text-center text-sm" style={{ color: "#4b5563" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold hover:underline"
              style={{ color: "#2D5016" }}
            >
              Login here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}