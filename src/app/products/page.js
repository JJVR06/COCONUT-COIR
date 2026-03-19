"use client";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("category") || "All";
  const [category, setCategory] = useState(initCategory);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, []);

  const categories = ["All", "Home", "Garden", "Construction"];
  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9fdf4]">
        <section className="bg-[#2D5016] text-white py-12 text-center">
          <h1 className="text-4xl font-black mb-2">All Products</h1>
          <p className="text-green-200">Browse our full range of coir products</p>
        </section>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input type="text" placeholder="Search products..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 flex-1 focus:outline-none focus:ring-2 focus:ring-[#2D5016]" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    category === c ? "bg-[#2D5016] text-white" : "bg-white border border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <p className="text-center text-gray-400 py-20">Loading products...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return <Suspense><ProductsContent /></Suspense>;
}