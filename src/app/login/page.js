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

  const handleSubmit = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem("cc_accounts");
    const accounts = stored ? JSON.parse(stored) : [];
    const found = accounts.find(
      (a) => a.email === form.email && a.password === form.password
    );
    if (found) {
      setUser({ name: found.name, email: found.email, address: found.address, mobile: found.mobile });
      router.push("/store");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🥥</div>
            <h1 className="text-2xl font-bold text-[#2D5016]">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Login to your CoirCraft account</p>
          </div>
          {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2D5016] text-white py-3 rounded-xl font-semibold hover:bg-[#1a3009] transition"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{" "}
            <Link href="/register" className="text-[#2D5016] font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}