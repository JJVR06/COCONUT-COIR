"use client";
import Link from "next/link";
import { ShoppingCart, Heart, User, LogOut, Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, setUser, cart, wishlist } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const logout = () => { setUser(null); router.push("/"); };

  const navLinks = [
    { href: "/",         label: "Home"     },
    { href: "/store",    label: "Store"    },
    { href: "/products", label: "Products" },
  ];
  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(250,255,245,0.95)" : "#FAFFF5",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: `1px solid ${scrolled ? "#E5EDE5" : "transparent"}`,
        transition: "all 0.3s ease",
        fontFamily: "var(--font-body)",
      }}>
        {/*
          Key fix: NO maxWidth constraint on the outer row.
          padding: "0 16px" ensures content reaches edges on mobile.
          The 3-column grid keeps logo|links|actions perfectly balanced.
        */}
        <div style={{
          width: "100%",
          padding: "0 16px",
          height: 66,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          boxSizing: "border-box",
        }}>

          {/* ── COL 1: Logo ── */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", justifySelf: "start", minWidth: 0 }}>
            <div
              style={{ background: "linear-gradient(135deg,#A8FF3E,#1A472A)", borderRadius: 13, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 14px rgba(168,255,62,0.35)", flexShrink: 0, transition: "transform 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(-6deg) scale(1.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
              🥥
            </div>
            <div style={{ lineHeight: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, color: "#0E2011", letterSpacing: "-0.4px", whiteSpace: "nowrap" }}>
                Coir<span style={{ color: "#1A7A2E" }}>Craft</span>
              </div>
              <div style={{ fontSize: 9, letterSpacing: "2.5px", color: "#1A7A2E", fontWeight: 700, textTransform: "uppercase", marginTop: 1 }}>Philippines</div>
            </div>
          </Link>

          {/* ── COL 2: Nav links (desktop only, truly centered) ── */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={`tk-nav-link ${isActive(href) ? "active" : ""}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── COL 3: Actions ── */}
          {/* Desktop */}
          <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 8, justifySelf: "end" }}>
            {user ? (
              <>
                <Link href="/wishlist" title="Wishlist"
                  style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", background: wishlist.length ? "#FFF0F0" : "#F5F5F0", border: `2px solid ${wishlist.length ? "#FFCDD2" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.18s", flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                  <Heart size={16} color={wishlist.length ? "#E74C3C" : "#aaa"} fill={wishlist.length ? "#E74C3C" : "none"} />
                  {wishlist.length > 0 && (
                    <span style={{ position: "absolute", top: -3, right: -3, background: "#E74C3C", color: "#fff", borderRadius: "50%", width: 15, height: 15, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, border: "1.5px solid #FAFFF5" }}>
                      {wishlist.length > 9 ? "9+" : wishlist.length}
                    </span>
                  )}
                </Link>

                <Link href="/cart"
                  style={{ background: "#0E2011", borderRadius: 999, padding: "8px 16px", display: "flex", alignItems: "center", gap: 7, textDecoration: "none", transition: "all 0.18s", flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1A472A"; e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#0E2011"; e.currentTarget.style.transform = "scale(1)"; }}>
                  <ShoppingCart size={16} color="#A8FF3E" />
                  <span style={{ color: "#A8FF3E", fontWeight: 800, fontSize: 14 }}>{cartCount}</span>
                </Link>

                <Link href="/profile"
                  style={{ background: "#E8FFD0", border: "2px solid #C5F0A0", borderRadius: 999, padding: "7px 14px", display: "flex", alignItems: "center", gap: 7, textDecoration: "none", transition: "all 0.18s", flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A8FF3E"; e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#C5F0A0"; e.currentTarget.style.transform = "scale(1)"; }}>
                  {user.avatar
                    ? <img src={user.avatar} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} />
                    : <User size={15} color="#0E2011" />}
                  <span style={{ color: "#0E2011", fontWeight: 700, fontSize: 13 }}>{user.name.split(" ")[0]}</span>
                </Link>

                <button onClick={logout} title="Sign out"
                  style={{ width: 38, height: 38, borderRadius: "50%", background: "transparent", border: "2px solid transparent", cursor: "pointer", color: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s", flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF0F0"; e.currentTarget.style.color = "#E74C3C"; e.currentTarget.style.borderColor = "#FFCDD2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "transparent"; }}>
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  style={{ padding: "8px 20px", borderRadius: 999, border: "2px solid #E5EDE5", color: "#666", fontWeight: 700, fontSize: 13, textDecoration: "none", transition: "all 0.18s", background: "#fff", flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0E2011"; e.currentTarget.style.color = "#0E2011"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5EDE5"; e.currentTarget.style.color = "#666"; }}>
                  Sign In
                </Link>
                <Link href="/register" className="tk-btn-dark" style={{ textDecoration: "none", fontSize: 13, padding: "9px 20px", flexShrink: 0 }}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: cart badge + hamburger pushed to far right */}
          <div className="mobile-only"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifySelf: "end",    /* sticks to right edge of col 3 */
              paddingRight: 0,       /* no extra padding — col already at edge */
            }}>
            {user && (
              <Link href="/cart"
                style={{ position: "relative", background: "#0E2011", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0, WebkitTapHighlightColor: "transparent" }}>
                <ShoppingCart size={17} color="#A8FF3E" />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -3, right: -3, background: "#E74C3C", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, border: "2px solid #FAFFF5" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger — large touch target, always at far right */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
              style={{
                background: "#0E2011",
                border: "none",
                borderRadius: 12,
                width: 46,
                height: 46,
                cursor: "pointer",
                color: "#A8FF3E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",   /* prevents 300ms delay on iOS */
              }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── MOBILE BACKDROP ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 148, background: "rgba(14,32,17,0.48)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div style={{
        position: "fixed",
        top: 0, right: 0,
        height: "100dvh",           /* dvh = dynamic viewport height, handles iOS chrome bar */
        width: "min(300px, 85vw)",
        background: "#0E2011",
        zIndex: 149,
        transform: menuOpen ? "translateX(0)" : "translateX(110%)",
        transition: "transform 0.32s cubic-bezier(0.16,1,0.3,1)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        fontFamily: "var(--font-body)",
        willChange: "transform",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(168,255,62,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 800, fontSize: 18 }}>
            Coir<span style={{ color: "#A8FF3E" }}>Craft</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, width: 38, height: 38, cursor: "pointer", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <div style={{ padding: "14px 16px", flex: 1 }}>
          {navLinks.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href}
                style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderRadius: 12, marginBottom: 4, textDecoration: "none", background: active ? "rgba(168,255,62,0.13)" : "transparent", color: active ? "#A8FF3E" : "rgba(255,255,255,0.75)", fontWeight: 700, fontSize: 16, border: `1px solid ${active ? "rgba(168,255,62,0.2)" : "transparent"}`, WebkitTapHighlightColor: "transparent" }}>
                {label}
              </Link>
            );
          })}

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "10px 0" }} />

          {user ? (
            <>
              {[
                { href: "/profile",  label: "My Profile", icon: "👤" },
                { href: "/wishlist", label: `Wishlist${wishlist.length ? ` (${wishlist.length})` : ""}`, icon: "❤️" },
                { href: "/history",  label: "My Orders",  icon: "📋" },
                { href: "/cart",     label: `Cart${cartCount ? ` (${cartCount})` : ""}`, icon: "🛒" },
              ].map(({ href, label, icon }) => (
                <Link key={href} href={href}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 12, marginBottom: 3, textDecoration: "none", color: "rgba(255,255,255,0.65)", fontWeight: 700, fontSize: 15, WebkitTapHighlightColor: "transparent" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span> {label}
                </Link>
              ))}
            </>
          ) : (
            <>
              <Link href="/login"
                style={{ display: "flex", alignItems: "center", padding: "13px 16px", borderRadius: 12, marginBottom: 3, textDecoration: "none", color: "rgba(255,255,255,0.65)", fontWeight: 700, fontSize: 15 }}>
                Sign In
              </Link>
              <Link href="/register"
                style={{ display: "flex", alignItems: "center", padding: "13px 16px", borderRadius: 12, marginBottom: 3, textDecoration: "none", color: "#A8FF3E", fontWeight: 700, fontSize: 15 }}>
                Register — Free
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        {user && (
          <div style={{ padding: "14px 16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>
              Signed in as {user.name}
            </div>
            <button onClick={() => { logout(); setMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 10, padding: "12px 16px", color: "#ff7070", fontWeight: 700, fontSize: 14, cursor: "pointer", width: "100%", fontFamily: "var(--font-body)", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}