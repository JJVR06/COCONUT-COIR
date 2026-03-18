"use client";
import { useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { products } from "@/data/products";

export default function SellerStorefront() {
  const [banner, setBanner] = useState("🌿 Welcome to CoirCraft PH — Eco-Friendly Products!");
  const [featured, setFeatured] = useState(products.slice(0, 3).map((p) => p.id));
  const [saved, setSaved] = useState(false);

  const toggleFeatured = (id) => {
    setFeatured((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Storefront Settings</h1>
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Message</label>
          <input
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D5016]"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Select Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => toggleFeatured(p.id)}
                className={`border-2 rounded-xl p-3 cursor-pointer transition ${
                  featured.includes(p.id) ? "border-[#2D5016] bg-[#f0fde8]" : "border-gray-200"
                }`}
              >
                <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                <p className="text-sm font-semibold text-gray-700">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
        {saved && <p className="text-green-600 font-semibold mb-3">✅ Changes saved!</p>}
        <button onClick={save}
          className="bg-[#2D5016] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1a3009] transition">
          Save Changes
        </button>
      </main>
    </div>
  );
}