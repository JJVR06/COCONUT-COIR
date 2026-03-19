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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email === SELLER_EMAIL && form.password === SELLER_PASS) {
      setSellerLoggedIn(true);
      router.push("/seller/dashboard");
    } else {
      setError("Invalid seller credentials.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#1a3009] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🥥</div>
            <h1 className="text-2xl font-bold text-[#2D5016]">Seller Portal</h1>
            <p className="text-gray-500 text-sm">CoirCraft PH Admin Access</p>
          </div>
          {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                placeholder="admin@coircraft.ph" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
                placeholder="••••••••" />
            </div>
            <button type="submit"
              className="w-full bg-[#2D5016] text-white py-3 rounded-xl font-semibold hover:bg-[#1a3009] transition">
              Login as Seller
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">
            Default: admin@coircraft.ph / seller123
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}