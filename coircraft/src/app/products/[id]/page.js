"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { createPortal } from "react-dom";

/* ── Star picker ── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map((n) => (
        <span key={n} className="tk-star"
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          style={{ color: n <= (hovered || value) ? "#F4A01A" : "#DDD" }}>★</span>
      ))}
    </div>
  );
}

/* ── Sticky mobile bottom bar ── */
function MobileBar({ product, qty, setQty, onAdd, added, wishlisted, onWishlist, user }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || product.stock === 0) return null;

  return createPortal(
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#fff",
      borderTop: "1px solid #E5EDE5",
      padding: "12px 16px 20px",
      zIndex: 80,
      display: "flex",
      alignItems: "center",
      gap: 10,
      boxShadow: "0 -4px 20px rgba(14,32,17,0.10)",
    }}>
      {/* Qty stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F9F0", borderRadius: 999, padding: "6px 12px", border: "2px solid #E5EDE5", flexShrink: 0 }}>
        <button onClick={() => setQty(Math.max(1, qty - 1))}
          style={{ width: 28, height: 28, background: "#0E2011", borderRadius: "50%", border: "none", color: "#A8FF3E", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>−</button>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, minWidth: 20, textAlign: "center" }}>{qty}</span>
        <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
          style={{ width: 28, height: 28, background: "#0E2011", borderRadius: "50%", border: "none", color: "#A8FF3E", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
      </div>

      {/* Add to cart */}
      <button onClick={onAdd}
        style={{ flex: 1, background: added ? "#E8FFD0" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: added ? "#1A7A2E" : "#0E2011", border: "none", borderRadius: 999, padding: "13px 0", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, cursor: "pointer", transition: "all 0.2s", boxShadow: added ? "none" : "0 4px 16px rgba(168,255,62,0.40)" }}>
        {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
      </button>

      {/* Wishlist */}
      <button onClick={onWishlist}
        style={{ width: 48, height: 48, background: wishlisted ? "#FFF0F0" : "#F5F5F0", border: `2px solid ${wishlisted ? "#FFCDD2" : "#E5EDE5"}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 20, transition: "all 0.2s" }}>
        {wishlisted ? "❤️" : "🤍"}
      </button>
    </div>,
    document.body
  );
}

const TAG_BG = { "Best Seller": "#FF6B35", "Trending": "#E74C3C", "New": "#1A7A2E", "Featured": "#0E2011" };
const IMG_BG = ["linear-gradient(135deg,#E8FFD0,#C5F0A0)", "linear-gradient(135deg,#FFF3D9,#FFE5A0)", "linear-gradient(135deg,#E3F2FD,#BBDEFB)", "linear-gradient(135deg,#F3E5F5,#E1BEE7)"];

export default function ProductDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const product   = products.find((p) => p.id === Number(id));
  const { user, addToCart, isWishlisted, toggleWishlist, getProductReviews, addReview, canReview } = useApp();

  const [qty,       setQty]       = useState(1);
  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [added,     setAdded]     = useState(false);

  if (!product) return (
    <>
      <Navbar />
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24 }}>
        <div style={{ fontSize: 56 }}>🔍</div>
        <h2 style={{ fontFamily: "var(--font-display)", color: "#0E2011", textAlign: "center" }}>Product not found</h2>
        <Link href="/products" className="tk-btn-cta" style={{ textDecoration: "none" }}>Back to Products</Link>
      </div>
      <Footer />
    </>
  );

  const reviews       = getProductReviews(product.id);
  const avgRating     = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const userCanReview = canReview(product.id);
  const related       = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!user) { router.push("/login"); return; }
    for (let i = 0; i < qty; i++) addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    if (!user) { router.push("/login"); return; }
    toggleWishlist(product.id);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!rating) return;
    addReview({ productId: product.id, rating, comment, author: user.name, date: new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) });
    setSubmitted(true);
    setRating(0);
    setComment("");
  };

  const liked  = isWishlisted(product.id);
  const imgBg  = IMG_BG[product.id % IMG_BG.length];
  const inp    = { width: "100%", border: "2px solid #E5EDE5", borderRadius: 14, padding: "12px 16px", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" };

  return (
    <>
      <Navbar />

      {/* CSS-only responsive styles injected here */}
      <style>{`
        .pd-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .pd-grid { grid-template-columns: 1fr 1fr; gap: 48px; }
        }

        /* Hide desktop qty+cart on mobile (use sticky bar instead) */
        .pd-desktop-cta { display: none; }
        @media (min-width: 768px) { .pd-desktop-cta { display: block; } }

        /* Hide mobile sticky bar on desktop */
        .pd-mobile-bar-spacer { height: 80px; }
        @media (min-width: 768px) { .pd-mobile-bar-spacer { display: none; } }

        .pd-related-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px)  { .pd-related-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .pd-related-grid { grid-template-columns: repeat(4, 1fr); } }

        .pd-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        @media (min-width: 480px) { .pd-specs-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <main style={{ background: "var(--tk-bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 48px" }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 20, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/"         style={{ color: "#888", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#ddd" }}>/</span>
            <Link href="/products" style={{ color: "#888", textDecoration: "none" }}>Products</Link>
            <span style={{ color: "#ddd" }}>/</span>
            <span style={{ color: "#0E2011", fontWeight: 600 }}>{product.name}</span>
          </div>

          {/* ── PRODUCT SECTION ── */}
          <div className="pd-grid" style={{ marginBottom: 40 }}>

            {/* ── IMAGE ── */}
            <div style={{ position: "relative" }}>
              <div style={{ background: imgBg, borderRadius: 22, overflow: "hidden", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <img src={product.image} alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }} />
                <div style={{ fontSize: 80, position: "absolute", opacity: 0.3 }}>🌿</div>
              </div>

              {/* Tag badge */}
              {product.tag && (
                <div style={{ position: "absolute", top: 14, left: 14, background: TAG_BG[product.tag] || "#0E2011", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: "5px 13px", borderRadius: 999, textTransform: "uppercase", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
                  {product.tag}
                </div>
              )}

              {/* Wishlist button — top right of image */}
              <button className="tk-heart" onClick={handleWishlist}
                style={{ position: "absolute", top: 12, right: 12, width: 42, height: 42, background: liked ? "#FFE4E6" : "rgba(255,255,255,0.92)", border: liked ? "2px solid #FFCDD2" : "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", cursor: "pointer" }}>
                <span style={{ fontSize: 20 }}>{liked ? "❤️" : "🤍"}</span>
              </button>
            </div>

            {/* ── PRODUCT INFO ── */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#1A7A2E", marginBottom: 8 }}>{product.category}</div>

              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,5vw,38px)", fontWeight: 800, color: "#0E2011", margin: "0 0 10px", lineHeight: 1.15 }}>
                {product.name}
              </h1>

              {/* Avg rating */}
              {avgRating && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ color: "#F4A01A", fontSize: 16 }}>{"★".repeat(Math.round(avgRating))}</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{avgRating}</span>
                  <span style={{ color: "#aaa", fontSize: 12 }}>({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                </div>
              )}

              <p style={{ color: "#666", fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.8, marginBottom: 20 }}>{product.description}</p>

              {/* Price */}
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px,5vw,42px)", fontWeight: 800, color: "#0E2011", marginBottom: 16 }}>
                ₱{product.price.toLocaleString()}
              </div>

              {/* Stock */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: product.stock > 0 ? "#1A7A2E" : "#E74C3C", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: product.stock > 0 ? "#1A7A2E" : "#E74C3C", fontWeight: 700 }}>
                  {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
                </span>
              </div>

              {/* Specs */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="pd-specs-grid" style={{ marginBottom: 22 }}>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} style={{ background: "#F5F9F0", borderRadius: 10, padding: "10px 12px", border: "1px solid #E8FFD0" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0E2011" }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Feature tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {["🌿 100% Natural", "♻️ Biodegradable", "🇵🇭 PH Made"].map((f) => (
                  <span key={f} style={{ background: "#E8FFD0", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#1A7A2E" }}>{f}</span>
                ))}
              </div>

              {/* ── DESKTOP ONLY: Qty + Add to Cart ── */}
              <div className="pd-desktop-cta">
                {product.stock > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>Quantity</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F5F9F0", borderRadius: 999, padding: "6px 14px", border: "2px solid #E5EDE5" }}>
                      <button onClick={() => setQty(Math.max(1, qty - 1))}
                        style={{ width: 28, height: 28, background: "#0E2011", borderRadius: "50%", border: "none", color: "#A8FF3E", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>−</button>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, minWidth: 24, textAlign: "center" }}>{qty}</span>
                      <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                        style={{ width: 28, height: 28, background: "#0E2011", borderRadius: "50%", border: "none", color: "#A8FF3E", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>+</button>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={handleAddToCart} disabled={product.stock === 0}
                    className="tk-btn-cta"
                    style={{ flex: 1, textAlign: "center", opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? "not-allowed" : "pointer" }}>
                    {added ? "✓ Added!" : "🛒 Add to Cart"}
                  </button>
                  <button className="tk-heart" onClick={handleWishlist}
                    style={{ width: 52, height: 52, background: "#fff", border: `2px solid ${liked ? "#FFCDD2" : "#E5EDE5"}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, fontSize: 22 }}>
                    {liked ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── REVIEWS ── */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "clamp(20px,5vw,36px)", marginBottom: 40, boxShadow: "0 4px 20px rgba(14,32,17,0.06)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "#0E2011", margin: "0 0 24px", display: "flex", alignItems: "center", gap: 10 }}>
              ⭐ Customer Reviews
              {avgRating && <span style={{ fontSize: 15, fontWeight: 600, color: "#888" }}>({avgRating} avg)</span>}
            </h2>

            {/* Write a review */}
            {userCanReview ? (
              submitted ? (
                <div className="animate-bounceIn" style={{ background: "#E8FFD0", borderRadius: 14, padding: "14px 18px", marginBottom: 24, color: "#1A7A2E", fontWeight: 700, fontSize: 14 }}>
                  ✅ Thank you for your review!
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} style={{ background: "#F5F9F0", borderRadius: 16, padding: "clamp(16px,4vw,24px)", marginBottom: 28, border: "2px solid #E8FFD0" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0E2011", marginBottom: 14 }}>Write a Review</div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 8 }}>Your Rating</div>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 8 }}>Your Review</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
                      placeholder="Share your experience with this product..."
                      style={{ ...inp, resize: "vertical" }} />
                  </div>
                  <button type="submit" disabled={!rating} className="tk-btn-cta"
                    style={{ opacity: !rating ? 0.5 : 1, cursor: !rating ? "not-allowed" : "pointer", fontSize: 13, padding: "11px 24px" }}>
                    Submit Review
                  </button>
                </form>
              )
            ) : user ? (
              <div style={{ background: "#FFF9C4", border: "1.5px solid #FFE082", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#856404" }}>
                💡 You can review this product after receiving your order. Go to{" "}
                <Link href="/history" style={{ color: "#1A7A2E", fontWeight: 700 }}>My Orders</Link> and mark it as received.
              </div>
            ) : (
              <div style={{ background: "#F5F9F0", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#555" }}>
                <Link href="/login" style={{ color: "#1A7A2E", fontWeight: 700 }}>Sign in</Link> and purchase this product to leave a review.
              </div>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 0", color: "#aaa" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
                <p style={{ fontSize: 14 }}>No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {reviews.map((r, i) => (
                  <div key={i} style={{ background: "#F9FDF5", borderRadius: 14, padding: "16px 18px", border: "1px solid #E8F0E0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011" }}>{r.author}</div>
                        <div style={{ color: "#F4A01A", fontSize: 15 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#bbb" }}>{r.date}</div>
                    </div>
                    {r.comment && <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: 0 }}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RELATED PRODUCTS ── */}
          {related.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "#0E2011", margin: "0 0 20px" }}>
                Related Products
              </h2>
              <div className="pd-related-grid">
                {related.map((p, i) => {
                  const PC = require("@/components/ProductCard").default;
                  return <PC key={p.id} product={p} index={i} />;
                })}
              </div>
            </div>
          )}

          {/* Spacer for mobile sticky bar */}
          <div className="pd-mobile-bar-spacer" />
        </div>
      </main>

      {/* ── MOBILE STICKY CTA ── */}
      <MobileBar
        product={product} qty={qty} setQty={setQty}
        onAdd={handleAddToCart} added={added}
        wishlisted={liked} onWishlist={handleWishlist}
        user={user}
      />

      <Footer />
    </>
  );
}