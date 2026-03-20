"use client";
import { useState } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { useApp } from "@/context/AppContext";
import { Star, Filter, TrendingUp, MessageSquare, Award } from "lucide-react";

const STAR_COLORS = ["", "#E74C3C", "#FF8C00", "#F4A01A", "#2ECC71", "#1A7A2E"];

function StarRow({ rating, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= rating ? "#F4A01A" : "none"}
          color={n <= rating ? "#F4A01A" : "#ddd"}
        />
      ))}
    </span>
  );
}

export default function ReviewsClient() {
  const { reviews, inventory, sellerLoggedIn } = useApp();

  const [filterRating,  setFilterRating]  = useState(0);   // 0 = all
  const [filterProduct, setFilterProduct] = useState("all");
  const [sortBy,        setSortBy]        = useState("newest");

  if (!sellerLoggedIn) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  const allReviews = Array.isArray(reviews) ? reviews : [];
  const products   = Array.isArray(inventory) ? inventory : [];

  /* ── Stats ── */
  const totalReviews  = allReviews.length;
  const avgRating     = totalReviews
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : 0;
  const ratingCounts  = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: allReviews.filter((r) => r.rating === n).length,
  }));

  /* ── Unique products that have reviews ── */
  const reviewedProductIds = [...new Set(allReviews.map((r) => r.productId))];
  const productOptions     = reviewedProductIds.map((id) => {
    const p = products.find((p) => p.id === id);
    return { id, name: p?.name ?? `Product #${id}` };
  });

  /* ── Per-product average ── */
  const productStats = productOptions.map(({ id, name }) => {
    const pRevs = allReviews.filter((r) => r.productId === id);
    const avg   = pRevs.length
      ? (pRevs.reduce((s, r) => s + r.rating, 0) / pRevs.length).toFixed(1)
      : "—";
    return { id, name, avg, count: pRevs.length };
  }).sort((a, b) => b.count - a.count);

  /* ── Filter + sort ── */
  let filtered = [...allReviews];
  if (filterRating > 0)    filtered = filtered.filter((r) => r.rating === filterRating);
  if (filterProduct !== "all") filtered = filtered.filter((r) => String(r.productId) === filterProduct);
  if (sortBy === "newest")     filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sortBy === "oldest")     filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sortBy === "highest")    filtered.sort((a, b) => b.rating - a.rating);
  if (sortBy === "lowest")     filtered.sort((a, b) => a.rating - b.rating);

  const getProductName = (id) => {
    const p = products.find((p) => p.id === id);
    return p?.name ?? `Product #${id}`;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />

      <main
        className="seller-page-main"
        style={{ flex: 1, background: "#F8F9FA", padding: 28, overflowY: "auto" }}
      >
        <style>{`
          @media (max-width: 1023px) {
            .seller-page-main { padding-top: 76px !important; padding-bottom: 88px !important; }
            .reviews-top-grid { grid-template-columns: 1fr !important; }
            .reviews-stats-cards { grid-template-columns: 1fr 1fr !important; }
            .reviews-filters { flex-direction: column !important; align-items: flex-start !important; }
          }
          @media (max-width: 600px) {
            .reviews-stats-cards { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>
            ⭐ Customer Reviews
          </h1>
          <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
            All reviews left by buyers after receiving their orders.
          </p>
        </div>

        {/* ── Overview cards ── */}
        <div className="reviews-stats-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { icon: MessageSquare, label: "Total Reviews", value: totalReviews, color: "#1A7A2E", bg: "#E8FFD0" },
            { icon: TrendingUp,    label: "Average Rating", value: avgRating > 0 ? `${avgRating} / 5` : "—", color: "#856404", bg: "#FFF9C4" },
            { icon: Award,         label: "Products Reviewed", value: reviewedProductIds.length, color: "#1E40AF", bg: "#DBEAFE" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "18px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
              <div style={{ width: 40, height: 40, background: bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "#0E2011", marginBottom: 3 }}>{value}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Two-column layout: rating breakdown + product breakdown ── */}
        <div className="reviews-top-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Rating breakdown */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0E2011", margin: "0 0 16px" }}>
              Rating Breakdown
            </h3>
            {ratingCounts.map(({ n, count }) => {
              const pct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <button
                    onClick={() => setFilterRating(filterRating === n ? 0 : n)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      background: filterRating === n ? "#FFF9C4" : "none",
                      border: filterRating === n ? "1.5px solid #FCD34D" : "none",
                      borderRadius: 8, padding: "2px 8px", cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700,
                      color: "#0E2011", flexShrink: 0,
                    }}
                  >
                    {n} <Star size={12} fill="#F4A01A" color="#F4A01A" />
                  </button>
                  <div style={{ flex: 1, height: 8, background: "#F0F0EC", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`,
                      background: STAR_COLORS[n] || "#A8FF3E",
                      borderRadius: 99, transition: "width 0.5s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#888", flexShrink: 0, width: 32, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>

          {/* Top reviewed products */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0E2011", margin: "0 0 16px" }}>
              By Product
            </h3>
            {productStats.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: 13 }}>No reviews yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {productStats.slice(0, 5).map(({ id, name, avg, count }) => (
                  <div
                    key={id}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}
                  >
                    <button
                      onClick={() => setFilterProduct(filterProduct === String(id) ? "all" : String(id))}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        textAlign: "left", fontFamily: "var(--font-body)",
                        fontWeight: 700, fontSize: 12, color: filterProduct === String(id) ? "#1A7A2E" : "#0E2011",
                        padding: 0, flex: 1, minWidth: 0,
                        textDecoration: filterProduct === String(id) ? "underline" : "none",
                      }}
                    >
                      {name}
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <StarRow rating={Math.round(parseFloat(avg))} size={12} />
                      <span style={{ fontSize: 11, color: "#888" }}>({count})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Filters + Sort ── */}
        <div className="reviews-filters" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={14} color="#888" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>Filter:</span>
          </div>

          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            style={{ border: "2px solid #E8EDE8", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontFamily: "var(--font-body)", outline: "none", background: "#fff", cursor: "pointer" }}
          >
            <option value="all">All Products</option>
            {productOptions.map(({ id, name }) => (
              <option key={id} value={String(id)}>{name}</option>
            ))}
          </select>

          <select
            value={String(filterRating)}
            onChange={(e) => setFilterRating(Number(e.target.value))}
            style={{ border: "2px solid #E8EDE8", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontFamily: "var(--font-body)", outline: "none", background: "#fff", cursor: "pointer" }}
          >
            <option value="0">All Ratings</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ border: "2px solid #E8EDE8", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontFamily: "var(--font-body)", outline: "none", background: "#fff", cursor: "pointer" }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>

          {(filterRating > 0 || filterProduct !== "all") && (
            <button
              onClick={() => { setFilterRating(0); setFilterProduct("all"); }}
              style={{ background: "#FFF0F0", border: "1.5px solid #FFCDD2", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#C62828", cursor: "pointer", fontFamily: "var(--font-body)" }}
            >
              Clear filters ✕
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: 12, color: "#888" }}>
            {filtered.length} review{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Reviews list ── */}
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: "60px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>⭐</div>
            <h3 style={{ fontFamily: "var(--font-display)", color: "#0E2011", fontSize: 18, margin: "0 0 8px" }}>
              No reviews yet
            </h3>
            <p style={{ color: "#aaa", fontSize: 13 }}>
              Reviews appear here after buyers mark their orders as received and submit a review.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((review, i) => (
              <div
                key={i}
                style={{
                  background: "#fff", borderRadius: 16,
                  padding: "18px 20px",
                  boxShadow: "0 2px 12px rgba(14,32,17,0.06)",
                  border: review.rating >= 4
                    ? "1px solid #E8FFD0"
                    : review.rating <= 2
                    ? "1px solid #FFE4E6"
                    : "1px solid #F0F0EC",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg,#A8FF3E,#1A472A)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#0E2011", fontWeight: 800, fontSize: 14,
                        fontFamily: "var(--font-display)", flexShrink: 0,
                      }}>
                        {(review.author || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011" }}>{review.author}</div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>{review.date}</div>
                      </div>
                    </div>
                    <StarRow rating={review.rating} size={15} />
                  </div>

                  {/* Product badge */}
                  <div style={{
                    background: "#F5F9F0", border: "1px solid #E8FFD0",
                    borderRadius: 10, padding: "6px 12px",
                    fontSize: 11, fontWeight: 700, color: "#1A7A2E",
                    maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    🌿 {getProductName(review.productId)}
                  </div>
                </div>

                {review.comment ? (
                  <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, margin: 0 }}>
                    &ldquo;{review.comment}&rdquo;
                  </p>
                ) : (
                  <p style={{ fontSize: 12, color: "#ccc", fontStyle: "italic", margin: 0 }}>
                    No written comment.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="seller-mobile-bottom-spacer" />
      </main>
    </div>
  );
}