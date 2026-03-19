"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WishlistPage() {
  const { user, wishlist } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) return null;

  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

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
              {wishedProducts.length === 0
                ? "You haven't liked any products yet"
                : `${wishedProducts.length} product${wishedProducts.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>

          {wishedProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 100, height: 100, background: "#FFE4E6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, margin: "0 auto 24px" }}>🤍</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#0E2011", margin: "0 0 10px" }}>No items saved yet</h2>
              <p style={{ color: "#888", marginBottom: 28 }}>Tap the ♡ heart on any product to save it here.</p>
              <Link href="/products" className="tk-btn-cta" style={{ textDecoration: "none" }}>
                Browse Products
              </Link>
            </div>
          ) : (
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