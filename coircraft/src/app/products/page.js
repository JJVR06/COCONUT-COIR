"use client";
import { useState } from "react";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get("cat") || searchParams.get("category") || "All";
  const [category, setCategory] = useState(initCategory);
  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState("default");

  const categories = ["All", "Garden", "Home", "Construction", "Crafts"];

  let filtered = products.filter((p) => {
    const matchCat    = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  if (sort === "price-asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "name")       filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--tk-bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg,#1A472A,#0E2011)", padding: "clamp(44px,8vw,80px) 16px clamp(60px,10vw,100px)", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "-20%", right: "-5%", width: "clamp(200px,35vw,380px)", height: "clamp(200px,35vw,380px)", background: "radial-gradient(circle,rgba(168,255,62,0.1) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "clamp(26px,5vw,52px)", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.5px" }}>
              All <span style={{ color: "#A8FF3E" }}>Products</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "clamp(13px,2vw,15px)" }}>
              Browse our full range of coconut coir products
            </p>
          </div>
        </section>

        <div className="tk-wave" />

        <div className="tk-container" style={{ paddingTop: 28, paddingBottom: 56 }}>

          {/* Search + Sort */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0 }}>
              <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }} />
              <input type="text" placeholder="Search products…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", border: "2px solid #E5EDE5", borderRadius: 999, padding: "10px 16px 10px 38px", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", background: "#fff", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
                onBlur={(e)  => (e.target.style.borderColor = "#E5EDE5")} />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              style={{ border: "2px solid #E5EDE5", borderRadius: 999, padding: "10px 16px", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", background: "#fff", cursor: "pointer", flexShrink: 0 }}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`tk-filter ${category === c ? "active" : ""}`}
                style={{ flexShrink: 0 }}>
                {c}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "#888", fontWeight: 600, marginBottom: 20 }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {category !== "All" && <span style={{ color: "#1A7A2E" }}> in {category}</span>}
            {search && <span style={{ color: "#1A7A2E" }}> for &ldquo;{search}&rdquo;</span>}
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🔍</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#aaa", marginBottom: 6 }}>No products found</p>
              <p style={{ fontSize: 13, color: "#ccc", marginBottom: 20 }}>Try a different search or category</p>
              <button onClick={() => { setSearch(""); setCategory("All"); }} className="tk-btn-dark">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="tk-grid-products">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
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