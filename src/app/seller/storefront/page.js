"use client";
import { useState, useEffect } from "react";
import SellerSidebar from "@/components/SellerSidebar";

export default function SellerStorefront() {
  const [banner, setBanner] = useState("🌿 Welcome to CoirCraft PH — Eco-Friendly Products!");
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const prods = d.products || [];
        setProducts(prods);
        setFeatured(prods.slice(0, 3).map((p) => p.id));
      });
  }, []);

  const toggleFeatured = (id) => {
    setFeatured((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <SellerSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#111827" }}>
          Storefront Settings
        </h1>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>
          Customize what customers see on the storefront
        </p>

        {/* Banner */}
        <div
          className="rounded-2xl shadow-sm p-6 mb-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "#111827" }}
          >
            📢 Banner Message
          </label>
          <input
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
            style={{
              color: "#111827",
              backgroundColor: "#f9fafb",
              border: "2px solid #e5e7eb",
            }}
            onFocus={(e) => (e.target.style.border = "2px solid #2D5016")}
            onBlur={(e) => (e.target.style.border = "2px solid #e5e7eb")}
          />
          {/* Preview */}
          <div
            className="mt-3 p-3 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "#f0fdf4", color: "#166534" }}
          >
            Preview: {banner}
          </div>
        </div>

        {/* Featured Products */}
        <div
          className="rounded-2xl shadow-sm p-6 mb-6"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h2
            className="font-semibold text-base mb-1"
            style={{ color: "#111827" }}
          >
            ⭐ Featured Products
          </h2>
          <p className="text-xs mb-4" style={{ color: "#6b7280" }}>
            Click to toggle which products appear as featured on the storefront
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => toggleFeatured(p.id)}
                className="rounded-xl p-3 cursor-pointer transition"
                style={{
                  border: featured.includes(p.id)
                    ? "2px solid #2D5016"
                    : "2px solid #e5e7eb",
                  backgroundColor: featured.includes(p.id)
                    ? "#f0fdf4"
                    : "#ffffff",
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/200x96?text=No+Image")
                  }
                />
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: featured.includes(p.id) ? "#2D5016" : "#111827",
                  }}
                >
                  {p.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  ₱{Number(p.price).toLocaleString()}
                </p>
                {featured.includes(p.id) && (
                  <span
                    className="text-xs font-bold mt-1 inline-block"
                    style={{ color: "#2D5016" }}
                  >
                    ✓ Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        {saved && (
          <p className="font-semibold mb-3 text-sm" style={{ color: "#166534" }}>
            ✅ Changes saved successfully!
          </p>
        )}
        <button
          onClick={save}
          className="px-8 py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
          style={{ backgroundColor: "#2D5016" }}
        >
          Save Changes
        </button>
      </main>
    </div>
  );
}