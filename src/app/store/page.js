"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function StorePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4]">
        <section className="text-white py-16 text-center"
          style={{ background: "linear-gradient(135deg, #2D5016, #4a7c28)" }}>
          <h1 className="text-4xl font-black mb-2">🌿 CoirCraft Storefront</h1>
          <p className="text-green-200">Handpicked featured products just for you</p>
        </section>
        {["Best Seller", "New", "Trending", "Featured"].map((tag) => {
          const tagProducts = products.filter((p) => p.tag === tag);
          if (!tagProducts.length) return null;
          return (
            <section key={tag} className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold text-[#2D5016] mb-6">
                {tag === "Best Seller" && "🏆 "}
                {tag === "New" && "✨ "}
                {tag === "Trending" && "🔥 "}
                {tag === "Featured" && "⭐ "}
                {tag}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tagProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}