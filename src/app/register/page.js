"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    address: "", mobile: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
  if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
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
    { key: "name", label: "Complete Name", type: "text", placeholder: "Juan dela Cruz" },
    { key: "email", label: "Email Address", type: "email", placeholder: "you@email.com" },
    { key: "address", label: "Address", type: "text", placeholder: "123 Street, City, Province" },
    { key: "mobile", label: "Mobile Number", type: "tel", placeholder: "09XX XXX XXXX" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🥥</div>
            <h1 className="text-2xl font-bold text-[#2D5016]">Create Account</h1>
            <p className="text-gray-500 text-sm">Join the CoirCraft community</p>
          </div>
          {success && (
            <p className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 text-center">
              ✅ Account created! Redirecting to login...
            </p>
          )}
          {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-[#2D5016] text-white py-3 rounded-xl font-semibold hover:bg-[#1a3009] transition"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2D5016] font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}