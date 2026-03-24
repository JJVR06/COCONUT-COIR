"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useEffect, useRef, useState } from "react";

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use a CSS class rather than inline opacity/transform so the browser
    // doesn't recalculate layout geometry mid-scroll (which caused the lock).
    el.classList.add("reveal-hidden");

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay applied via setTimeout so sequential sections stagger
          // without blocking the main thread between frames.
          setTimeout(() => {
            el.classList.remove("reveal-hidden");
            el.classList.add("reveal-visible");
          }, delay);
          obs.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}

/* ── Product grid skeleton ── */
function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="tk-grid-products">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="tk-skeleton" style={{ borderRadius: 20, aspectRatio: "3/4" }} />
      ))}
    </div>
  );
}

/* ── Animated counter for hero stats ── */
function AnimatedStat({ value, label, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <div style={{ width: "clamp(40px,5vw,48px)", height: "clamp(40px,5vw,48px)", background: "rgba(168,255,62,0.12)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "clamp(16px,2.5vw,20px)" }}>{icon}</div>
      <div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(12px,2vw,14px)" }}>{value}</div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(10px,1.5vw,12px)" }}>{label}</div>
      </div>
    </div>
  );
}

const CATS = [
  { label: "Garden",       icon: "🌱" },
  { label: "Home",         icon: "🏠" },
  { label: "Construction", icon: "🏗️" },
  { label: "Crafts",       icon: "🎨" },
];

export default function Home() {
  const { user, inventory, inventoryLoaded, storefront } = useApp();
  const [heroReady, setHeroReady] = useState(false);

  // Hero animates in immediately regardless of data loading
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  const products = Array.isArray(inventory) ? inventory : [];
  const sf       = storefront || {};

  const featured = products.filter((p) => ["Best Seller", "Trending"].includes(p.tag)).slice(0, 4);
  const newArr   = products.filter((p) => p.tag === "New").slice(0, 4);

  const heroLines = (sf.heroTitle || "Sustainable Living\nStarts with Coconut Coir.").split("\\n");

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--tk-bg)", fontFamily: "var(--font-body)", overflowX: "hidden" }}>

        {/* ── HERO ── */}
        <section
          className="tk-hero"
          style={{
            background: "linear-gradient(140deg,#0E2011 0%,#1A472A 50%,#0E2011 100%)",
            position: "relative", overflow: "hidden", textAlign: "center",
            opacity: heroReady ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div className="tk-glow tk-glow-lime anim-float" style={{ width: "clamp(300px,50vw,600px)", height: "clamp(300px,50vw,600px)", top: "-20%", left: "50%", transform: "translateX(-50%)" }} />
          <div style={{ position: "absolute", right: "5%", bottom: "-10%", fontSize: "clamp(120px,20vw,280px)", opacity: 0.04, userSelect: "none", lineHeight: 1 }}>🌿</div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
            <div className="tk-pill anim-fadeUp" style={{ marginBottom: 24, display: "inline-flex" }}>
              <span className="tk-pill-dot" /> 100% Natural · Philippine Made · Eco-Certified
            </div>

            <h1 className="tk-h1 anim-fadeUp delay-1" style={{ color: "#fff", margin: "0 0 20px" }}>
              {heroLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === heroLines.length - 1
                    ? line.includes("Coconut Coir") ? (
                        <>
                          {line.replace("Coconut Coir.", "")}{" "}
                          <span style={{ background: "linear-gradient(90deg,#A8FF3E,#6BCC1C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block" }}>
                            Coconut Coir.
                          </span>
                        </>
                      ) : line
                    : line}
                </span>
              ))}
            </h1>

            <p className="anim-fadeUp delay-2" style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(14px,2.5vw,17px)", lineHeight: 1.75, marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
              {sf.heroSubtitle || "Premium eco-friendly products handcrafted from Philippine coconut husks. Join thousands of happy customers."}
            </p>

            {user ? (
              <div className="anim-fadeUp delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/store"    className="tk-btn-cta tk-ripple"          style={{ textDecoration: "none" }}>Browse Store</Link>
                <Link href="/products" className="tk-btn-outline-white" style={{ textDecoration: "none" }}>All Products</Link>
              </div>
            ) : (
              <div className="anim-fadeUp delay-3" style={{ background: "rgba(168,255,62,0.09)", border: "1.5px solid rgba(168,255,62,0.25)", borderRadius: 20, padding: "clamp(18px,4vw,28px) clamp(16px,4vw,32px)", marginBottom: 36, display: "inline-block", maxWidth: "100%" }}>
                <p style={{ color: "#A8FF3E", fontWeight: 700, fontSize: 13, margin: "0 0 14px" }}>🎉 Create a free account to start shopping</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/register" className="tk-btn-cta tk-ripple"          style={{ textDecoration: "none" }}>Create Account — Free</Link>
                  <Link href="/login"    className="tk-btn-outline-white" style={{ textDecoration: "none" }}>Sign In</Link>
                </div>
              </div>
            )}

            <div className="anim-fadeUp delay-4" style={{ display: "flex", gap: "clamp(12px,3vw,44px)", justifyContent: "center", flexWrap: "wrap", marginTop: user ? 28 : 0, paddingTop: user ? 0 : 8 }}>
              <AnimatedStat icon="🌿" value="100% Natural" label="Zero synthetic" />
              <AnimatedStat icon="🇵🇭" value="Local"       label="Made in PH"    />
              <AnimatedStat icon="♻️" value="Zero Waste"   label="Biodegradable" />
            </div>
          </div>
        </section>

        <div className="tk-wave" />

        {/* ── Category shortcuts ── */}
        <Reveal>
          <section className="tk-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
            <div className="tk-container">
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {CATS.map(({ label, icon }, i) => (
                  <Link
                    key={label} href={`/products?cat=${label}`}
                    className="anim-fadeUp"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "#fff", border: "2px solid #E5EDE5", borderRadius: 999,
                      padding: "10px 20px", textDecoration: "none", fontWeight: 700,
                      fontSize: 13, color: "#0E2011", whiteSpace: "nowrap",
                      transition: "all 0.22s var(--ease-bounce)",
                      flexShrink: 0, animationDelay: `${i * 60}ms`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A8FF3E"; e.currentTarget.style.background = "#E8FFD0"; e.currentTarget.style.transform = "translateY(-3px) scale(1.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5EDE5"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                  >
                    {icon} {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Featured Products ── */}
        {sf.showFeatured !== false && (
          <Reveal delay={50}>
            <section className="tk-section" style={{ paddingTop: 16 }}>
              <div className="tk-container">
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "inline-block", background: "#E8FFD0", borderRadius: 999, padding: "5px 16px", fontSize: 11, fontWeight: 800, color: "#1A7A2E", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>
                      ⭐ Bestsellers
                    </div>
                    <h2 className="tk-h2" style={{ color: "#0E2011", margin: 0 }}>Featured Products</h2>
                  </div>
                  <Link href="/products"
                    style={{ color: "#1A7A2E", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, border: "2px solid #E5EDE5", borderRadius: 999, padding: "8px 18px", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0E2011"; e.currentTarget.style.transform = "translateX(2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5EDE5"; e.currentTarget.style.transform = "translateX(0)"; }}>
                    View All →
                  </Link>
                </div>

                {/* Show skeleton only when inventory has never loaded AND cache is empty */}
                {!inventoryLoaded && products.length === 0 ? (
                  <ProductGridSkeleton count={4} />
                ) : featured.length > 0 ? (
                  <div className="tk-grid-products">
                    {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                  </div>
                ) : inventoryLoaded ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#ccc", fontSize: 13 }}>
                    No featured products yet.
                  </div>
                ) : (
                  <ProductGridSkeleton count={4} />
                )}
              </div>
            </section>
          </Reveal>
        )}

        {/* ── Why Coir panel ── */}
        <Reveal delay={50}>
          <section className="tk-section">
            <div className="tk-container">
              <div style={{ background: "linear-gradient(135deg,#0E2011,#1A472A)", borderRadius: 28, padding: "clamp(28px,6vw,56px) clamp(20px,5vw,64px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 40, alignItems: "center", position: "relative", overflow: "hidden" }}>
                <div className="tk-glow tk-glow-lime" style={{ width: 300, height: 300, top: "-50%", left: "-10%", position: "absolute" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h2 className="tk-h2" style={{ color: "#fff", margin: "0 0 16px" }}>
                    Why Choose<br /><span style={{ color: "#A8FF3E" }}>Philippine Coir?</span>
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
                    One of the world&apos;s most sustainable fibers — and the Philippines produces some of the finest available.
                  </p>
                  <Link href="/store" className="tk-btn-cta tk-ripple" style={{ textDecoration: "none" }}>Shop Collection</Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, position: "relative", zIndex: 1 }}>
                  {[["🌍", "Biodegradable", "Breaks down naturally"], ["💪", "Ultra Durable", "3× longer lasting"], ["🌊", "Water Wise", "Natural moisture control"], ["🌱", "Eco-Certified", "PH verified sustainable"]].map(([icon, title, desc]) => (
                    <div key={title}
                      style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 16px", border: "1px solid rgba(168,255,62,0.12)", transition: "all 0.25s var(--ease-bounce)", cursor: "default" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,255,62,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(168,255,62,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(168,255,62,0.12)"; }}>
                      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
                      <div style={{ color: "#A8FF3E", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{title}</div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── New Arrivals ── */}
        {sf.showNewArrivals !== false && (
          <Reveal delay={50}>
            <section className="tk-section" style={{ paddingTop: 0 }}>
              <div className="tk-container">
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "inline-block", background: "#E8FFD0", borderRadius: 999, padding: "5px 16px", fontSize: 11, fontWeight: 800, color: "#1A7A2E", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>
                      ✨ Just Arrived
                    </div>
                    <h2 className="tk-h2" style={{ color: "#0E2011", margin: 0 }}>New Arrivals</h2>
                  </div>
                  <Link href="/products?tag=New"
                    style={{ color: "#1A7A2E", fontWeight: 700, fontSize: 14, textDecoration: "none", border: "2px solid #E5EDE5", borderRadius: 999, padding: "8px 18px", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0E2011"; e.currentTarget.style.transform = "translateX(2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5EDE5"; e.currentTarget.style.transform = "translateX(0)"; }}>
                    See All →
                  </Link>
                </div>

                {!inventoryLoaded && products.length === 0 ? (
                  <ProductGridSkeleton count={4} />
                ) : newArr.length > 0 ? (
                  <div className="tk-grid-products">
                    {newArr.map((p, i) => <ProductCard key={p.id} product={p} index={i + 4} />)}
                  </div>
                ) : inventoryLoaded ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "#ccc", fontSize: 13 }}>
                    No new arrivals yet.
                  </div>
                ) : (
                  <ProductGridSkeleton count={4} />
                )}
              </div>
            </section>
          </Reveal>
        )}

        {/* ── Guest CTA ── */}
        {!user && (
          <Reveal>
            <section className="tk-section" style={{ background: "linear-gradient(135deg,#1A472A,#0E2011)", textAlign: "center" }}>
              <div className="tk-container">
                <h2 className="tk-h2" style={{ color: "#fff", margin: "0 0 14px" }}>
                  Ready to go <span style={{ color: "#A8FF3E" }}>green?</span>
                </h2>
                <p style={{ color: "rgba(255,255,255,0.60)", fontSize: "clamp(14px,2.5vw,16px)", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.75 }}>
                  Create a free account and start shopping our sustainable coconut coir collection.
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/register" className="tk-btn-cta tk-ripple"          style={{ textDecoration: "none" }}>Get Started — Free</Link>
                  <Link href="/products" className="tk-btn-outline-white" style={{ textDecoration: "none" }}>Browse First</Link>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* ── Testimonials ── */}
        {sf.showTestimonials !== false && (
          <Reveal>
            <section className="tk-section" style={{ background: "#F0FFD9" }}>
              <div className="tk-container">
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                  <div style={{ display: "inline-block", background: "#D0F5A0", borderRadius: 999, padding: "5px 18px", fontSize: 11, fontWeight: 800, color: "#1A7A2E", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>
                    💬 What Customers Say
                  </div>
                  <h2 className="tk-h2" style={{ color: "#0E2011", margin: 0 }}>Loved by Filipinos</h2>
                </div>
                <style>{`.testimonial-grid{display:grid;grid-template-columns:1fr;gap:16px}@media(min-width:640px){.testimonial-grid{grid-template-columns:1fr 1fr}}@media(min-width:900px){.testimonial-grid{grid-template-columns:1fr 1fr 1fr;gap:20px}}`}</style>
                <div className="testimonial-grid">
                  {[
                    ["★★★★★", "The coir door mat is incredibly durable!", "Maria Santos", "Quezon City"],
                    ["★★★★★", "Perfect for my garden. Erosion net worked great.", "Jose Dela Cruz", "Davao City"],
                    ["★★★★★", "Love these locally-made sustainable products.", "Ana Reyes", "Cebu City"],
                  ].map(([stars, text, author, loc]) => (
                    <div key={author}
                      style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(14,32,17,0.06)", border: "1.5px solid #E8FFD0", transition: "transform 0.3s var(--ease-bounce), box-shadow 0.3s ease", display: "flex", flexDirection: "column" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(14,32,17,0.12)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,32,17,0.06)"; }}>
                      <div style={{ color: "#F4A01A", fontSize: 15, marginBottom: 10, letterSpacing: 2 }}>{stars}</div>
                      <p style={{ fontSize: 14, lineHeight: 1.75, color: "#444", marginBottom: 16, flex: 1 }}>&ldquo;{text}&rdquo;</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#A8FF3E,#1A472A)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "var(--font-display)", flexShrink: 0 }}>
                          {author[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011" }}>{author}</div>
                          <div style={{ fontSize: 11, color: "#999" }}>{loc}, PH</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>
        )}

      </main>
      <Footer />
    </>
  );
}