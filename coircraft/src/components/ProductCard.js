"use client";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

const TAG_STYLES = {
  "Best Seller": { bg: "#FF6B35", color: "#fff" },
  "Trending":    { bg: "#E74C3C", color: "#fff" },
  "New":         { bg: "#1A7A2E", color: "#fff" },
  "Featured":    { bg: "#0E2011", color: "#A8FF3E" },
};

const IMG_BKGS = [
  "linear-gradient(135deg,#E8FFD0 0%,#B8F07A 100%)",
  "linear-gradient(135deg,#FFF3D9 0%,#FFD970 100%)",
  "linear-gradient(135deg,#E3F2FD 0%,#90CAF9 100%)",
  "linear-gradient(135deg,#F3E5F5 0%,#CE93D8 100%)",
  "linear-gradient(135deg,#E8F5E9 0%,#81C784 100%)",
];

/* ─────────────────────────────────────────────────────
   Portal wrapper — renders children into document.body
   so modals are ALWAYS on top, ALWAYS viewport-fixed,
   completely immune to parent scroll or z-index stacking.
───────────────────────────────────────────────────── */
function Modal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ── Guest modal ── */
function GuestModal({ action, onClose }) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <Modal>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "rgba(14,32,17,0.58)",
          backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
          animation: "fadeIn 0.2s ease both",
        }}>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes popUp{from{opacity:0;transform:scale(0.90) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff", borderRadius: 28,
            padding: "40px 32px 32px",
            width: "100%", maxWidth: 380,
            boxShadow: "0 32px 80px rgba(14,32,17,0.22)",
            textAlign: "center",
            animation: "popUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
          <div style={{ width: 76, height: 76, background: "linear-gradient(135deg,#E8FFD0,#A8FF3E)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(168,255,62,0.32)" }}>
            🔐
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, color: "#0E2011", margin: "0 0 10px" }}>
            Account Required
          </h3>
          <p style={{ color: "#888", fontSize: 14, lineHeight: 1.65, marginBottom: 26 }}>
            Sign in or create a free account to{" "}
            {action === "cart" ? "add items to your cart" : "save products to your wishlist"}.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/register"
              style={{ flex: 1, background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", padding: "13px", borderRadius: 999, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, textDecoration: "none", textAlign: "center", display: "block", boxShadow: "0 4px 16px rgba(168,255,62,0.38)" }}>
              Register Free
            </Link>
            <Link href="/login"
              style={{ flex: 1, background: "#fff", color: "#0E2011", border: "2.5px solid #0E2011", padding: "12px", borderRadius: 999, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, textDecoration: "none", textAlign: "center", display: "block" }}>
              Sign In
            </Link>
          </div>
          <button onClick={onClose}
            style={{ marginTop: 14, background: "none", border: "none", color: "#bbb", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Maybe later
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Added to cart popup ── */
function CartPopup({ product, onClose, onViewCart }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <Modal>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "rgba(14,32,17,0.52)",
          backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
          animation: "fadeIn 0.2s ease both",
        }}>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes popUp{from{opacity:0;transform:scale(0.90) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff", borderRadius: 28,
            padding: "30px 28px",
            width: "100%", maxWidth: 360,
            boxShadow: "0 32px 80px rgba(14,32,17,0.22)",
            animation: "popUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 58, height: 58, background: "#E8FFD0", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: "2px solid #A8FF3E" }}>
              ✅
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: "#0E2011", marginBottom: 3 }}>Added to Cart!</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>{product.name}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onViewCart}
              style={{ flex: 1, background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", padding: "13px", borderRadius: 999, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(168,255,62,0.38)" }}>
              View Cart 🛒
            </button>
            <button onClick={onClose}
              style={{ flex: 1, background: "#fff", color: "#555", border: "2px solid #E5EDE5", padding: "12px", borderRadius: 999, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Keep Shopping
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ── Product card ── */
export default function ProductCard({ product, index = 0 }) {
  const { addToCart, user, isWishlisted, toggleWishlist } = useApp();
  const router = useRouter();
  const [guestModal, setGuestModal] = useState(null);
  const [cartPopup,  setCartPopup]  = useState(false);
  const [addAnim,    setAddAnim]    = useState(false);

  const tagStyle = TAG_STYLES[product.tag] || { bg: "#0E2011", color: "#A8FF3E" };
  const imgBg    = IMG_BKGS[index % IMG_BKGS.length];
  const liked    = isWishlisted(product.id);

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { setGuestModal("cart"); return; }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    setAddAnim(true);
    setTimeout(() => { setAddAnim(false); setCartPopup(true); }, 180);
  };

  const handleLike = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { setGuestModal("wishlist"); return; }
    toggleWishlist(product.id);
  };

  return (
    <>
      {guestModal && <GuestModal action={guestModal} onClose={() => setGuestModal(null)} />}
      {cartPopup  && (
        <CartPopup
          product={product}
          onClose={() => setCartPopup(false)}
          onViewCart={() => { setCartPopup(false); router.push("/cart"); }}
        />
      )}

      <Link href={`/products/${product.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        <div className="tk-card" style={{ fontFamily: "var(--font-body)", height: "100%", display: "flex", flexDirection: "column" }}>

          {/* Image */}
          <div style={{ position: "relative", background: imgBg, overflow: "hidden", aspectRatio: "4/3" }}>
            <img src={product.image} alt={product.name}
              className="tk-card-img"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"; }}
            />
            <div style={{ display: "none", fontSize: "clamp(40px,8vw,64px)", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", background: imgBg }}>
              🌿
            </div>

            {product.tag && (
              <div style={{ position: "absolute", top: 10, left: 10, background: tagStyle.bg, color: tagStyle.color, fontSize: 9, fontWeight: 800, letterSpacing: 1.5, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
                {product.tag}
              </div>
            )}

            <button className="tk-heart" onClick={handleLike}
              style={{ position: "absolute", top: 8, right: 8, background: liked ? "#FFE4E6" : "rgba(255,255,255,0.92)", border: liked ? "2px solid #FFCDD2" : "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.12)", transition: "all 0.18s" }}>
              <span style={{ fontSize: 15 }}>{liked ? "❤️" : "🤍"}</span>
            </button>

            {product.stock === 0 && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(250,255,245,0.80)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}>
                <span style={{ fontWeight: 800, color: "#888", fontSize: 11, background: "#fff", padding: "5px 14px", borderRadius: 999, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>Out of Stock</span>
              </div>
            )}

            {product.stock > 0 && product.stock <= 10 && (
              <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(231,76,60,0.9)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 9px", borderRadius: 999 }}>
                Only {product.stock} left
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: "12px 14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#1A7A2E", marginBottom: 4 }}>
              {product.category}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(13px,2vw,15px)", color: "#0E2011", marginBottom: 4, lineHeight: 1.3, flex: 1 }}>
              {product.name}
            </div>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 10, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {product.description}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(17px,3vw,20px)", fontWeight: 800, color: "#0E2011" }}>
                ₱{product.price.toLocaleString()}
              </span>
              <button onClick={handleAdd} disabled={product.stock === 0}
                style={{
                  background: addAnim ? "#E8FFD0" : product.stock === 0 ? "#E8EDE8" : "linear-gradient(135deg,#0E2011,#1A472A)",
                  color: addAnim ? "#1A7A2E" : product.stock === 0 ? "#aaa" : "#A8FF3E",
                  border: "none", borderRadius: 9, padding: "8px 14px",
                  fontSize: 12, fontWeight: 800, fontFamily: "var(--font-body)",
                  cursor: product.stock === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.18s", whiteSpace: "nowrap", flexShrink: 0,
                }}
                onMouseEnter={(e) => { if (product.stock > 0 && !addAnim) e.currentTarget.style.transform = "scale(1.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                {addAnim ? "✓ Added" : "+ Add"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}