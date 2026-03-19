"use client";
import Link from "next/link";

export default function Footer() {
  const SHOP    = [{ href:"/store",label:"Store" },{ href:"/products",label:"All Products" },{ href:"/products?tag=New",label:"New Arrivals" },{ href:"/products?tag=Best Seller",label:"Best Sellers" }];
  const ACCOUNT = [{ href:"/login",label:"Sign In" },{ href:"/register",label:"Register" },{ href:"/cart",label:"My Cart" },{ href:"/history",label:"My Orders" },{ href:"/profile",label:"My Profile" }];
  const ABOUT   = [{ href:"/",label:"About Us" },{ href:"/",label:"Sustainability" },{ href:"/",label:"Contact" },{ href:"/",label:"FAQ" }];

  return (
    <footer style={{ background: "#0E2011", color: "#fff", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 40px" }}>

        {/* Top grid - auto-fit so it collapses gracefully on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "40px 32px",
          marginBottom: 44,
          paddingBottom: 44,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ background: "linear-gradient(135deg,#A8FF3E,#1A472A)", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🥥</div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#fff" }}>
                Coir<span style={{ color: "#A8FF3E" }}>Craft</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400, marginLeft: 4 }}>PH</span>
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.8, marginBottom: 18, maxWidth: 240 }}>
              Premium eco-friendly coconut coir products made with love by Filipino artisans. For your home, garden, and planet.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["📘","📸","🐦"].map((icon, i) => (
                <div key={i}
                  style={{ width: 34, height: 34, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, cursor: "pointer", border: "1px solid rgba(168,255,62,0.1)", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,255,62,0.12)"; e.currentTarget.style.borderColor = "rgba(168,255,62,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(168,255,62,0.1)"; }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <FooterCol title="Shop"    links={SHOP}    />
          <FooterCol title="Account" links={ACCOUNT} />
          <FooterCol title="About"   links={ABOUT}   />
        </div>

        {/* Bottom bar */}
        <div style={{ textAlign: "center" }}>
          {/* ▼ REPLACE "InnoBytes" WITH YOUR GROUP NAME ▼ */}
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", marginBottom: 6 }}>
            © 2025 CoirCraft PH &nbsp;·&nbsp;
            <strong style={{ color: "rgba(255,255,255,0.5)" }}>InnoBytes</strong>
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>
            For educational purposes only, and no copyright infringement is intended.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ color: "#A8FF3E", fontWeight: 800, fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map(({ href, label }) => (
          <Link key={label} href={href}
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#A8FF3E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}