"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
  // ← Use live inventory from context (DB) — not the static products.js file
  const { user, wishlist, inventory, inventoryLoaded } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  const products        = Array.isArray(inventory) ? inventory : [];
  const wishedProducts  = products.filter((p) =>
    wishlist.includes(p.id) || wishlist.includes(Number(p.id)) || wishlist.includes(String(p.id))
  );

  return (
    <>
      <Navbar />
      <main style={{ background: "#FFFEF5", minHeight: "100vh", fontFamily: "var(--font-body)", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#0E2011", margin: "0 0 8px" }}>
              ❤️ My Wishlist
            </h1>
            <p style={{ color: "#888", fontSize: 14 }}>
              {!inventoryLoaded
                ? "Loading..."
                : wishedProducts.length === 0
                ? "You haven't liked any products yet"
                : `${wishedProducts.length} product${wishedProducts.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>

          {/* Loading skeleton */}
          {!inventoryLoaded && wishlist.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 22 }}>
              {wishlist.slice(0, 4).map((id) => (
                <div key={id} className="tk-skeleton" style={{ borderRadius: 20, aspectRatio: "3/4" }} />
              ))}
              <style>{`@keyframes skeletonShimmer{from{background-position:-400px 0}to{background-position:400px 0}}.tk-skeleton{background:linear-gradient(90deg,#E8F0E0 25%,#F2FAF0 50%,#E8F0E0 75%);background-size:800px 100%;animation:skeletonShimmer 1.6s linear infinite}`}</style>
            </div>
          )}

          {inventoryLoaded && wishedProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 100, height: 100, background: "#FFE4E6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, margin: "0 auto 24px" }}>🤍</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#0E2011", margin: "0 0 10px" }}>No items saved yet</h2>
              <p style={{ color: "#888", marginBottom: 28 }}>Tap the ♡ heart on any product to save it here.</p>
              <Link href="/products" className="tk-btn-cta" style={{ textDecoration: "none" }}>
                Browse Products
              </Link>
            </div>
          ) : inventoryLoaded && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 22 }}>
              {wishedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}