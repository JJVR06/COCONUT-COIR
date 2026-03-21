"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const CATEGORY_ICONS = {
  "Image Platform": "🖼️",
  "Image":          "📷",
  "Framework":      "⚙️",
  "Library":        "📦",
  "Font":           "🔤",
  "Database":       "🗄️",
  "Hosting":        "🌐",
  "Other":          "📎",
};

const CATEGORY_COLORS = {
  "Image Platform": { bg: "#E3F2FD", color: "#1565C0", border: "#BBDEFB" },
  "Image":          { bg: "#F3E5F5", color: "#6A1B9A", border: "#E1BEE7" },
  "Framework":      { bg: "#E8FFD0", color: "#1A7A2E", border: "#C5F0A0" },
  "Library":        { bg: "#FFF3E0", color: "#E65100", border: "#FFE0B2" },
  "Font":           { bg: "#FCE4EC", color: "#880E4F", border: "#F8BBD0" },
  "Database":       { bg: "#E0F2F1", color: "#004D40", border: "#B2DFDB" },
  "Hosting":        { bg: "#F1F8E9", color: "#33691E", border: "#DCEDC8" },
  "Other":          { bg: "#F5F5F5", color: "#424242", border: "#E0E0E0" },
};

export default function AboutPage() {
  const [sources,  setSources]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/sources")
      .then((r) => r.json())
      .then((d) => { setSources(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Group by category
  const grouped = sources.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--tk-bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>

        {/* ── HERO ── */}
        <section style={{ background: "linear-gradient(135deg,#1A472A 0%,#0E2011 60%,#1A472A 100%)", padding: "clamp(48px,8vw,80px) 16px clamp(56px,10vw,100px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle,rgba(168,255,62,0.10) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(168,255,62,0.12)", border: "1.5px solid rgba(168,255,62,0.28)", borderRadius: 999, padding: "7px 18px", marginBottom: 20 }}>
              <span style={{ width: 7, height: 7, background: "#A8FF3E", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ color: "#A8FF3E", fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>About This Project</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "clamp(28px,6vw,52px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.1 }}>
              CoirCraft <span style={{ color: "#A8FF3E" }}>Philippines</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(14px,2.5vw,16px)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
              A full-stack e-commerce platform for premium Philippine coconut coir products. Built as an academic project using modern web technologies.
            </p>
          </div>
        </section>

        <div className="tk-wave" />

        <div className="tk-container" style={{ paddingTop: 48, paddingBottom: 80 }}>

          {/* ── PROJECT INFO ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16, marginBottom: 56 }}>
            {[
              { icon: "🎓", label: "Course",    value: "E-Commerce"              },
              { icon: "🛠️", label: "Framework",  value: "Next.js + React"        },
              { icon: "🗄️", label: "Database",   value: "Neon PostgreSQL"        },
              { icon: "🌐", label: "Hosting",    value: "Vercel"                 },
              { icon: "📅", label: "Year",       value: "2025–2026"              },
              { icon: "🌿", label: "Theme",      value: "Eco-Friendly / Coir"    },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)", display: "flex", alignItems: "center", gap: 14, border: "1.5px solid #F0F0EC" }}>
                <div style={{ width: 44, height: 44, background: "#E8FFD0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#0E2011" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── DISCLAIMER ── */}
          <div style={{ background: "linear-gradient(135deg,#0E2011,#1A472A)", borderRadius: 20, padding: "28px 32px", marginBottom: 56, display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 48, height: 48, background: "rgba(168,255,62,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>⚠️</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", color: "#A8FF3E", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Disclaimer</div>
              <p style={{ color: "rgba(255,255,255,0.70)", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                For educational purposes only, and no copyright infringement is intended. All images, fonts, and third-party resources used in this project are credited in the Sources section below. This website was created as a requirement for an academic course.
              </p>
            </div>
          </div>

          {/* ── SOURCES ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "inline-block", background: "#E8FFD0", borderRadius: 999, padding: "5px 18px", fontSize: 11, fontWeight: 800, color: "#1A7A2E", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12 }}>
              📚 Sources & Credits
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: "#0E2011", margin: 0 }}>
              Resources Used
            </h2>
            <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>
              All external resources, images, and tools used in building this website.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 36, height: 36, border: "4px solid #E8EDE8", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: "#aaa" }}>Loading sources...</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p>No sources added yet. The seller can add them from the dashboard.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {categories.map((cat) => {
                const style  = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Other"];
                const icon   = CATEGORY_ICONS[cat]  || "📎";
                const items  = grouped[cat];

                return (
                  <div key={cat}>
                    {/* Category header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 38, height: 38, background: style.bg, border: `2px solid ${style.border}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {icon}
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: 0 }}>{cat}</h3>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{items.length} source{items.length !== 1 ? "s" : ""}</div>
                      </div>
                    </div>

                    {/* Source cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12 }}>
                      {items.map((s) => (
                        <div key={s.id}
                          style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 12px rgba(14,32,17,0.05)", border: `1.5px solid ${style.border}`, transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,32,17,0.10)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(14,32,17,0.05)"; }}>

                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: s.description ? 10 : 0 }}>
                            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#0E2011", flex: 1 }}>
                              {s.title}
                            </div>
                            <span style={{ background: style.bg, color: style.color, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: 1, flexShrink: 0 }}>
                              {cat}
                            </span>
                          </div>

                          {s.description && (
                            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: "0 0 12px" }}>
                              {s.description}
                            </p>
                          )}

                          {s.url && (
                            <a href={s.url} target="_blank" rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: 5, color: style.color, fontSize: 12, fontWeight: 700, textDecoration: "none", background: style.bg, padding: "5px 12px", borderRadius: 999, transition: "opacity 0.2s" }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.75"}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
                              🔗 Visit Source
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── BACK BUTTON ── */}
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link href="/" className="tk-btn-cta" style={{ textDecoration: "none" }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}