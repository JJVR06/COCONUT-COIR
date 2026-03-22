"use client";
import Link from "next/link";

export default function Footer() {
  const SHOP    = [{ href:"/store",label:"Store" },{ href:"/products",label:"All Products" },{ href:"/products?tag=New",label:"New Arrivals" },{ href:"/products?tag=Best Seller",label:"Best Sellers" }];
  const ACCOUNT = [{ href:"/login",label:"Sign In" },{ href:"/register",label:"Register" },{ href:"/cart",label:"My Cart" },{ href:"/history",label:"My Orders" },{ href:"/profile",label:"My Profile" }];
  const ABOUT   = [{ href:"/about",label:"About Us" },{ href:"/",label:"Sustainability" },{ href:"/",label:"Contact" },{ href:"/",label:"FAQ" }];

  return (
    <>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px 32px;
          margin-bottom: 44px;
          padding-bottom: 44px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-align: center;
        }
        @media (min-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            text-align: left;
          }
          .footer-brand { grid-column: 1 / -1; text-align: center; }
          .footer-brand > p { margin: 0 auto; }
          .footer-brand .footer-socials { justify-content: center; }
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
            text-align: left;
          }
          .footer-brand { grid-column: auto; text-align: left; }
          .footer-brand > p { margin: 0; }
          .footer-brand .footer-socials { justify-content: flex-start; }
        }
        .footer-col-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        @media (min-width: 480px) {
          .footer-col-links { align-items: flex-start; }
        }
        .footer-col-title {
          color: #A8FF3E;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: block;
        }
        .footer-link {
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
          display: inline-block;
        }
        .footer-link:hover { color: #A8FF3E; }
        .footer-socials {
          display: flex;
          gap: 8px;
          margin-top: 0;
        }
        .footer-social-icon {
          width: 34px; height: 34px;
          background: rgba(255,255,255,0.06);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; cursor: pointer;
          border: 1px solid rgba(168,255,62,0.1);
          transition: all 0.2s;
        }
        .footer-social-icon:hover {
          background: rgba(168,255,62,0.12);
          border-color: rgba(168,255,62,0.3);
          transform: translateY(-2px);
        }
        .footer-bottom {
          text-align: center;
        }
        .footer-bottom p {
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          margin-bottom: 6px;
        }
        .footer-bottom p:last-child {
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          font-style: italic;
          margin-bottom: 0;
        }
        /* Mobile bottom nav spacer */
        .footer-mobile-nav-spacer {
          height: 72px;
          display: block;
        }
        @media (min-width: 768px) {
          .footer-mobile-nav-spacer { display: none; }
        }
      `}</style>

      <footer style={{ background: "#0E2011", color: "#fff", fontFamily: "var(--font-body)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 40px" }}>

          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, justifyContent: "inherit" }}>
                <div style={{ background: "linear-gradient(135deg,#A8FF3E,#1A472A)", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, transition: "transform 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(-8deg) scale(1.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
                  🥥
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "#fff" }}>
                  Coir<span style={{ color: "#A8FF3E" }}>Craft</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 400, marginLeft: 4 }}>PH</span>
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.8, marginBottom: 18, maxWidth: 240 }}>
                Premium eco-friendly coconut coir products made with love by Filipino artisans. For your home, garden, and planet.
              </p>
              <div className="footer-socials">
                {["📘","📸","🐦"].map((icon, i) => (
                  <div key={i} className="footer-social-icon">{icon}</div>
                ))}
              </div>
            </div>

            <FooterCol title="Shop"    links={SHOP}    />
            <FooterCol title="Account" links={ACCOUNT} />
            <FooterCol title="About"   links={ABOUT}   />
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p>© 2026 CoirCraft PH &nbsp;·&nbsp;
              <strong style={{ color: "rgba(255,255,255,0.5)" }}>InnoBytes</strong>
            </p>
            <p>For educational purposes only, and no copyright infringement is intended.</p>
          </div>
        </div>

        {/* Spacer so content isn't hidden behind mobile bottom nav */}
        <div className="footer-mobile-nav-spacer" />
      </footer>
    </>
  );
}

function FooterCol({ title, links }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "inherit" }}>
      <span className="footer-col-title">{title}</span>
      <div className="footer-col-links">
        {links.map(({ href, label }) => (
          <Link key={label} href={href} className="footer-link">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}