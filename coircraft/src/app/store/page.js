"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const TAG_SECTIONS = [
  { tag: "Best Seller", emoji: "🏆", label: "Best Sellers"  },
  { tag: "New",         emoji: "✨", label: "New Arrivals"  },
  { tag: "Trending",    emoji: "🔥", label: "Trending Now"  },
  { tag: "Featured",    emoji: "⭐", label: "Featured"      },
];

function SectionSkeleton() {
  return (
    <section style={{ padding: "clamp(32px,6vw,56px) 0" }}>
      <div className="tk-container">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div className="tk-skeleton" style={{ width: 52, height: 52, borderRadius: 14 }} />
          <div>
            <div className="tk-skeleton" style={{ width: 160, height: 20, borderRadius: 8, marginBottom: 6 }} />
            <div className="tk-skeleton" style={{ width: 80, height: 13, borderRadius: 6 }} />
          </div>
        </div>
        <div className="tk-grid-products">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="tk-skeleton" style={{ borderRadius: 20, aspectRatio: "3/4" }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes skeletonShimmer{from{background-position:-400px 0}to{background-position:400px 0}}.tk-skeleton{background:linear-gradient(90deg,#E8F0E0 25%,#F2FAF0 50%,#E8F0E0 75%);background-size:800px 100%;animation:skeletonShimmer 1.6s linear infinite;border-radius:12px}`}</style>
    </section>
  );
}

export default function StorePage() {
  const { inventory, inventoryLoaded, storefront } = useApp();
  const products = Array.isArray(inventory) ? inventory : [];

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--tk-bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

        {/* Announcement banner */}
        {storefront?.announcement && (
          <div style={{
            background: "linear-gradient(90deg,#0E2011,#1A472A)",
            color: "#A8FF3E", textAlign: "center",
            padding: "10px 16px", fontSize: 13, fontWeight: 700,
          }}>
            📢 {storefront.announcement}
          </div>
        )}

        {/* ── HERO ── */}
        <section style={{ background: "linear-gradient(135deg,#1A472A 0%,#0E2011 55%,#1A5C2E 100%)", padding: "clamp(48px,10vw,90px) 16px clamp(70px,12vw,120px)", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "clamp(200px,40vw,400px)", height: "clamp(200px,40vw,400px)", background: "radial-gradient(circle,rgba(168,255,62,0.12) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(168,255,62,0.13)", border: "1px solid rgba(168,255,62,0.28)", borderRadius: 999, padding: "6px 16px", marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, background: "#A8FF3E", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ color: "#A8FF3E", fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>Handpicked Products</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "clamp(28px,6vw,58px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-1px", lineHeight: 1.1 }}>
              {storefront?.name ?? "CoirCraft"}{" "}
              <span style={{ color: "#A8FF3E" }}>Storefront</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.60)", fontSize: "clamp(13px,2.5vw,16px)", lineHeight: 1.7, margin: 0 }}>
              {storefront?.tagline ?? "Discover our curated collection of premium Philippine coconut coir products"}
            </p>
          </div>
        </section>

        <div className="tk-wave" />

        {/* ── LOADING STATE ── */}
        {!inventoryLoaded && (
          <>
            <SectionSkeleton />
            <SectionSkeleton />
          </>
        )}

        {/* ── TAG SECTIONS ── */}
        {inventoryLoaded && TAG_SECTIONS.map(({ tag, emoji, label }) => {
          const tagProducts = products.filter((p) => p.tag === tag);
          if (!tagProducts.length) return null;
          return (
            <section key={tag} style={{ padding: "clamp(32px,6vw,56px) 0" }}>
              <div className="tk-container">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(18px,3vw,28px)", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: "#E8FFD0", borderRadius: 14, width: "clamp(42px,5vw,52px)", height: "clamp(42px,5vw,52px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(20px,3vw,24px)", border: "2px solid rgba(168,255,62,0.25)", flexShrink: 0 }}>
                      {emoji}
                    </div>
                    <div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,3vw,28px)", fontWeight: 800, color: "#0E2011", margin: 0, letterSpacing: "-0.5px" }}>{label}</h2>
                      <p style={{ color: "#999", fontSize: 12, margin: 0 }}>{tagProducts.length} product{tagProducts.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <a href={`/products?tag=${tag}`}
                    style={{ color: "#1A7A2E", fontWeight: 700, fontSize: 13, textDecoration: "none", border: "2px solid #0E2011", borderRadius: 999, padding: "7px 16px", transition: "all 0.18s", flexShrink: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#0E2011"; e.currentTarget.style.color = "#A8FF3E"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A7A2E"; }}>
                    View All →
                  </a>
                </div>
                <div className="tk-grid-products">
                  {tagProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
              </div>
            </section>
          );
        })}

        {/* Empty state after loading */}
        {inventoryLoaded && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "#0E2011", margin: "0 0 10px" }}>No products yet</h2>
            <p style={{ color: "#888" }}>The seller hasn't added any products. Check back soon!</p>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}