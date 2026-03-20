"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useEffect, useRef } from "react";

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.65s ${delay}ms ease, transform 0.65s ${delay}ms ease`;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}

const CATS = [
  { label: "Garden",       icon: "🌱" },
  { label: "Home",         icon: "🏠" },
  { label: "Construction", icon: "🏗️" },
  { label: "Crafts",       icon: "🎨" },
];

export default function Home() {
  const { user, inventory, storefront } = useApp();

  const products = Array.isArray(inventory) ? inventory : [];
  const sf       = storefront || {};

  const featured = products.filter((p) => ["Best Seller", "Trending"].includes(p.tag)).slice(0, 4);
  const newArr   = products.filter((p) => p.tag === "New").slice(0, 4);

  // Parse hero title (supports \n from seller storefront editor)
  const heroLines = (sf.heroTitle || "Sustainable Living\nStarts with Coconut Coir.").split("\\n");

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--tk-bg)", fontFamily: "var(--font-body)", overflowX: "hidden" }}>

        {/* ── Announcement banner ── */}
        {sf.announcement && (
          <div style={{ background: "linear-gradient(90deg,#0E2011,#1A472A)", color: "#A8FF3E", textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 700 }}>
            📢 {sf.announcement}
          </div>
        )}

        {/* ── HERO ── */}
        <section className="tk-hero" style={{ background: "linear-gradient(140deg,#0E2011 0%,#1A472A 50%,#0E2011 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
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
                    ? <>
                        {line.includes("Coconut Coir") ? (
                          <>
                            {line.replace("Coconut Coir.", "")}{" "}
                            <span style={{ background: "linear-gradient(90deg,#A8FF3E,#6BCC1C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block" }}>
                              Coconut Coir.
                            </span>
                          </>
                        ) : line}
                      </>
                    : line}
                </span>
              ))}
            </h1>

            <p className="anim-fadeUp delay-2" style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(14px,2.5vw,17px)", lineHeight: 1.75, marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>
              {sf.heroSubtitle || "Premium eco-friendly products handcrafted from Philippine coconut husks. Join thousands of happy customers."}
            </p>

            {user ? (
              <div className="anim-fadeUp delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/store"    className="tk-btn-cta"          style={{ textDecoration: "none" }}>Browse Store</Link>
                <Link href="/products" className="tk-btn-outline-white" style={{ textDecoration: "none" }}>All Products</Link>
              </div>
            ) : (
              <div className="anim-fadeUp delay-3" style={{ background: "rgba(168,255,62,0.09)", border: "1.5px solid rgba(168,255,62,0.25)", borderRadius: 20, padding: "clamp(18px,4vw,28px) clamp(16px,4vw,32px)", marginBottom: 36, display: "inline-block", maxWidth: "100%" }}>
                <p style={{ color: "#A8FF3E", fontWeight: 700, fontSize: 13, margin: "0 0 14px" }}>🎉 Create a free account to start shopping</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/register" className="tk-btn-cta"          style={{ textDecoration: "none" }}>Create Account — Free</Link>
                  <Link href="/login"    className="tk-btn-outline-white" style={{ textDecoration: "none" }}>Sign In</Link>
                </div>
              </div>
            )}

            <style>{`
              .hero-badges {
                display: flex;
                gap: 14px;
                justify-content: flex-end;
                flex-wrap: nowrap;      /* single row — no staircase */
                margin-top: 28px;
                width: 100%;
              }
              @media (min-width: 600px) {
                .hero-badges {
                  justify-content: center;
                  gap: clamp(16px,4vw,44px);
                }
              }
              /* Shrink icon box on tiny screens so 3 fit in one row */
              .hero-badge-icon {
                width: 36px;
                height: 36px;
                font-size: 16px;
              }
              .hero-badge-title { font-size: 12px; }
              .hero-badge-sub   { font-size: 10px; }
              @media (min-width: 400px) {
                .hero-badge-icon  { width: 42px; height: 42px; font-size: 18px; }
                .hero-badge-title { font-size: 13px; }
                .hero-badge-sub   { font-size: 11px; }
              }
            `}</style>
            <div className="anim-fadeUp delay-4 hero-badges" style={{ marginTop: user ? "28px" : "0" }}>
              {[["🌿", "Natural", "Zero synthetic"], ["🇵🇭", "Local", "Made in PH"], ["♻️", "Zero Waste", "Biodegradable"]].map(([icon, title, sub]) => (
                <div key={title} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div className="hero-badge-icon" style={{ background: "rgba(168,255,62,0.12)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div className="hero-badge-title" style={{ color: "#fff", fontWeight: 700 }}>{title}</div>
                    <div className="hero-badge-sub" style={{ color: "rgba(255,255,255,0.45)" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="tk-wave" />

        {/* ── Category shortcuts ── */}
        <Reveal>
          <section className="tk-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
            <div className="tk-container">
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                {CATS.map(({ label, icon }) => (
                  <Link
                    key={label} href={`/products?cat=${label}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "2px solid #E5EDE5", borderRadius: 999, padding: "10px 20px", textDecoration: "none", fontWeight: 700, fontSize: 13, color: "#0E2011", whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A8FF3E"; e.currentTarget.style.background = "#E8FFD0"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5EDE5"; e.currentTarget.style.background = "#fff"; }}
                  >
                    {icon} {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── Featured Products (controlled by storefront.showFeatured) ── */}
        {(sf.showFeatured !== false) && featured.length > 0 && (
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
                  <Link href="/products" style={{ color: "#1A7A2E", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, border: "2px solid #E5EDE5", borderRadius: 999, padding: "8px 18px", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0E2011"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5EDE5"; }}>
                    View All →
                  </Link>
                </div>
                <div className="tk-grid-products">
                  {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
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
                  <Link href="/store" className="tk-btn-cta" style={{ textDecoration: "none" }}>Shop Collection</Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, position: "relative", zIndex: 1 }}>
                  {[["🌍", "Biodegradable", "Breaks down naturally"], ["💪", "Ultra Durable", "3× longer lasting"], ["🌊", "Water Wise", "Natural moisture control"], ["🌱", "Eco-Certified", "PH verified sustainable"]].map(([icon, title, desc]) => (
                    <div key={title} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 16px", border: "1px solid rgba(168,255,62,0.12)", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,255,62,0.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}>
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

        {/* ── New Arrivals (controlled by storefront.showNewArrivals) ── */}
        {(sf.showNewArrivals !== false) && newArr.length > 0 && (
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
                  <Link href="/products?tag=New" style={{ color: "#1A7A2E", fontWeight: 700, fontSize: 14, textDecoration: "none", border: "2px solid #E5EDE5", borderRadius: 999, padding: "8px 18px", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0E2011"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5EDE5"; }}>
                    See All →
                  </Link>
                </div>
                <div className="tk-grid-products">
                  {newArr.map((p, i) => <ProductCard key={p.id} product={p} index={i + 4} />)}
                </div>
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
                  <Link href="/register" className="tk-btn-cta"          style={{ textDecoration: "none" }}>Get Started — Free</Link>
                  <Link href="/products" className="tk-btn-outline-white" style={{ textDecoration: "none" }}>Browse First</Link>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* ── Testimonials (controlled by storefront.showTestimonials) ── */}
        {(sf.showTestimonials !== false) && (
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
                      style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "0 4px 20px rgba(14,32,17,0.06)", border: "1.5px solid #E8FFD0", transition: "transform 0.3s ease, box-shadow 0.3s ease", display: "flex", flexDirection: "column" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(14,32,17,0.12)"; }}
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